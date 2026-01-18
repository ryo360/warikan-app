import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Group,
  Member,
  Expense,
  Settlement,
  PaymentMethod,
  StoredGroup,
  StoredMember,
  StoredExpense,
  StoredSettlement,
} from "@/types";
import {
  isSupabaseEnabled,
  createGroupInDb,
  getGroupDataFromDb,
  updateGroupInDb,
  deleteGroupFromDb,
  addMemberToDb,
  updateMemberInDb,
  deleteMemberFromDb,
  addExpenseToDb,
  updateExpenseInDb,
  deleteExpenseFromDb,
  saveSettlementsToDb,
  updateSettlementStatusInDb,
} from "@/lib/supabase";

interface GroupState {
  groups: Group[];
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  isLoading: boolean;

  // Group actions
  createGroup: (name: string, memberNames: string[]) => Promise<string>;
  getGroup: (id: string) => Group | undefined;
  loadGroupFromDb: (groupId: string) => Promise<boolean>;
  updateGroup: (id: string, name: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;

  // Member actions
  getGroupMembers: (groupId: string) => Member[];
  addMember: (groupId: string, name: string) => Promise<string>;
  updateMember: (
    id: string,
    data: { name?: string; paymentMethod?: PaymentMethod; paymentInfo?: string }
  ) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  // Expense actions
  getGroupExpenses: (groupId: string) => Expense[];
  addExpense: (
    groupId: string,
    payerId: string,
    title: string,
    amount: number,
    participantIds: string[]
  ) => Promise<string>;
  updateExpense: (
    id: string,
    data: {
      payerId?: string;
      title?: string;
      amount?: number;
      participantIds?: string[];
    }
  ) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Settlement actions
  getGroupSettlements: (groupId: string) => Settlement[];
  updateSettlementStatus: (id: string, isPaid: boolean) => Promise<void>;
  recalculateSettlements: (groupId: string) => Promise<void>;
}

// 日付の変換ヘルパー
const parseDate = (dateStr: string): Date => new Date(dateStr);

const serializeState = (state: GroupState) => ({
  groups: state.groups.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  })),
  members: state.members.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  })),
  expenses: state.expenses.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  })),
  settlements: state.settlements.map((s) => ({
    ...s,
    paidAt: s.paidAt?.toISOString(),
  })),
});

const deserializeState = (stored: {
  groups: StoredGroup[];
  members: StoredMember[];
  expenses: StoredExpense[];
  settlements: StoredSettlement[];
}) => ({
  groups: stored.groups.map((g) => ({
    ...g,
    createdAt: parseDate(g.createdAt),
    updatedAt: parseDate(g.updatedAt),
  })),
  members: stored.members.map((m) => ({
    ...m,
    createdAt: parseDate(m.createdAt),
  })),
  expenses: stored.expenses.map((e) => ({
    ...e,
    createdAt: parseDate(e.createdAt),
  })),
  settlements: stored.settlements.map((s) => ({
    ...s,
    paidAt: s.paidAt ? parseDate(s.paidAt) : undefined,
  })),
});

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: [],
      members: [],
      expenses: [],
      settlements: [],
      isLoading: false,

      // Group actions
      createGroup: async (name: string, memberNames: string[]) => {
        // Supabaseが有効な場合はDBに保存
        if (isSupabaseEnabled()) {
          const result = await createGroupInDb(name, memberNames);
          if (result) {
            // DBから全データを取得してstateに反映
            await get().loadGroupFromDb(result.groupId);
            return result.groupId;
          }
        }

        // ローカルストレージにフォールバック
        const groupId = uuidv4();
        const now = new Date();

        const newGroup: Group = {
          id: groupId,
          name,
          createdAt: now,
          updatedAt: now,
        };

        const newMembers: Member[] = memberNames.map((memberName) => ({
          id: uuidv4(),
          groupId,
          name: memberName,
          paymentMethod: "cash" as PaymentMethod,
          createdAt: now,
        }));

        set((state) => ({
          groups: [...state.groups, newGroup],
          members: [...state.members, ...newMembers],
        }));

        return groupId;
      },

      getGroup: (id: string) => {
        return get().groups.find((g) => g.id === id);
      },

      loadGroupFromDb: async (groupId: string) => {
        if (!isSupabaseEnabled()) return false;

        set({ isLoading: true });
        const data = await getGroupDataFromDb(groupId);
        set({ isLoading: false });

        if (!data) return false;

        set((state) => {
          // 既存のデータを除外して新しいデータを追加
          const otherGroups = state.groups.filter((g) => g.id !== groupId);
          const otherMembers = state.members.filter((m) => m.groupId !== groupId);
          const otherExpenses = state.expenses.filter((e) => e.groupId !== groupId);
          const otherSettlements = state.settlements.filter((s) => s.groupId !== groupId);

          return {
            groups: [...otherGroups, data.group],
            members: [...otherMembers, ...data.members],
            expenses: [...otherExpenses, ...data.expenses],
            settlements: [...otherSettlements, ...data.settlements],
          };
        });

        return true;
      },

      updateGroup: async (id: string, name: string) => {
        // Supabaseが有効な場合はDBを更新
        if (isSupabaseEnabled()) {
          await updateGroupInDb(id, name);
        }

        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === id ? { ...g, name, updatedAt: new Date() } : g
          ),
        }));
      },

      deleteGroup: async (id: string) => {
        // Supabaseが有効な場合はDBから削除
        if (isSupabaseEnabled()) {
          await deleteGroupFromDb(id);
        }

        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          members: state.members.filter((m) => m.groupId !== id),
          expenses: state.expenses.filter((e) => e.groupId !== id),
          settlements: state.settlements.filter((s) => s.groupId !== id),
        }));
      },

      // Member actions
      getGroupMembers: (groupId: string) => {
        return get().members.filter((m) => m.groupId === groupId);
      },

      addMember: async (groupId: string, name: string) => {
        let memberId: string;

        // Supabaseが有効な場合はDBに保存
        if (isSupabaseEnabled()) {
          const dbMemberId = await addMemberToDb(groupId, name);
          if (dbMemberId) {
            memberId = dbMemberId;
          } else {
            memberId = uuidv4();
          }
        } else {
          memberId = uuidv4();
        }

        const newMember: Member = {
          id: memberId,
          groupId,
          name,
          paymentMethod: "cash",
          createdAt: new Date(),
        };

        set((state) => ({
          members: [...state.members, newMember],
        }));

        return memberId;
      },

      updateMember: async (id: string, data) => {
        // Supabaseが有効な場合はDBを更新
        if (isSupabaseEnabled()) {
          await updateMemberInDb(id, data);
        }

        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        }));
      },

      deleteMember: async (id: string) => {
        // Supabaseが有効な場合はDBから削除
        if (isSupabaseEnabled()) {
          await deleteMemberFromDb(id);
        }

        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          expenses: state.expenses.map((e) => ({
            ...e,
            participantIds: e.participantIds.filter((pid) => pid !== id),
          })),
        }));
      },

      // Expense actions
      getGroupExpenses: (groupId: string) => {
        return get()
          .expenses.filter((e) => e.groupId === groupId)
          .sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
      },

      addExpense: async (
        groupId: string,
        payerId: string,
        title: string,
        amount: number,
        participantIds: string[]
      ) => {
        let expenseId: string;

        // Supabaseが有効な場合はDBに保存
        if (isSupabaseEnabled()) {
          const dbExpenseId = await addExpenseToDb(groupId, payerId, title, amount, participantIds);
          if (dbExpenseId) {
            expenseId = dbExpenseId;
          } else {
            expenseId = uuidv4();
          }
        } else {
          expenseId = uuidv4();
        }

        const newExpense: Expense = {
          id: expenseId,
          groupId,
          payerId,
          title,
          amount,
          participantIds,
          createdAt: new Date(),
        };

        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));

        // 清算を再計算
        await get().recalculateSettlements(groupId);

        return expenseId;
      },

      updateExpense: async (id: string, data) => {
        const expense = get().expenses.find((e) => e.id === id);
        if (!expense) return;

        // Supabaseが有効な場合はDBを更新
        if (isSupabaseEnabled()) {
          await updateExpenseInDb(id, data);
        }

        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));

        // 清算を再計算
        await get().recalculateSettlements(expense.groupId);
      },

      deleteExpense: async (id: string) => {
        const expense = get().expenses.find((e) => e.id === id);
        if (!expense) return;

        // Supabaseが有効な場合はDBから削除
        if (isSupabaseEnabled()) {
          await deleteExpenseFromDb(id);
        }

        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));

        // 清算を再計算
        await get().recalculateSettlements(expense.groupId);
      },

      // Settlement actions
      getGroupSettlements: (groupId: string) => {
        return get().settlements.filter((s) => s.groupId === groupId);
      },

      updateSettlementStatus: async (id: string, isPaid: boolean) => {
        // Supabaseが有効な場合はDBを更新
        if (isSupabaseEnabled()) {
          await updateSettlementStatusInDb(id, isPaid);
        }

        set((state) => ({
          settlements: state.settlements.map((s) =>
            s.id === id
              ? { ...s, isPaid, paidAt: isPaid ? new Date() : undefined }
              : s
          ),
        }));
      },

      recalculateSettlements: async (groupId: string) => {
        const expenses = get().getGroupExpenses(groupId);
        const members = get().getGroupMembers(groupId);

        // 各メンバーの収支を計算
        const balances: Map<string, number> = new Map();
        members.forEach((m) => balances.set(m.id, 0));

        expenses.forEach((expense) => {
          if (expense.participantIds.length === 0) return;

          const perPerson = Math.floor(
            expense.amount / expense.participantIds.length
          );

          // 支払者はプラス
          balances.set(
            expense.payerId,
            (balances.get(expense.payerId) || 0) + expense.amount
          );

          // 参加者はマイナス
          expense.participantIds.forEach((pid) => {
            balances.set(pid, (balances.get(pid) || 0) - perPerson);
          });
        });

        // 債権者と債務者に分類
        const creditors: { id: string; amount: number }[] = [];
        const debtors: { id: string; amount: number }[] = [];

        balances.forEach((amount, id) => {
          if (amount > 0) creditors.push({ id, amount });
          if (amount < 0) debtors.push({ id, amount: -amount });
        });

        // 最適な清算方法を計算（貪欲法）
        const newSettlements: Settlement[] = [];

        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        let i = 0,
          j = 0;
        while (i < creditors.length && j < debtors.length) {
          const amount = Math.min(creditors[i].amount, debtors[j].amount);

          if (amount > 0) {
            newSettlements.push({
              id: uuidv4(),
              groupId,
              fromMemberId: debtors[j].id,
              toMemberId: creditors[i].id,
              amount,
              isPaid: false,
            });
          }

          creditors[i].amount -= amount;
          debtors[j].amount -= amount;

          if (creditors[i].amount === 0) i++;
          if (debtors[j].amount === 0) j++;
        }

        // 既存の支払い状態を維持
        const existingSettlements = get().settlements.filter(
          (s) => s.groupId === groupId
        );
        const updatedSettlements = newSettlements.map((newS) => {
          const existing = existingSettlements.find(
            (es) =>
              es.fromMemberId === newS.fromMemberId &&
              es.toMemberId === newS.toMemberId &&
              es.amount === newS.amount
          );
          if (existing) {
            return { ...newS, isPaid: existing.isPaid, paidAt: existing.paidAt };
          }
          return newS;
        });

        // Supabaseが有効な場合はDBに保存
        if (isSupabaseEnabled()) {
          await saveSettlementsToDb(groupId, updatedSettlements);
        }

        set((state) => ({
          settlements: [
            ...state.settlements.filter((s) => s.groupId !== groupId),
            ...updatedSettlements,
          ],
        }));
      },
    }),
    {
      name: "warikan-storage",
      skipHydration: true,
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: deserializeState(parsed.state),
          };
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          const serialized = {
            ...value,
            state: serializeState(value.state as GroupState),
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
