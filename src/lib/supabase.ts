import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type {
  Group,
  Member,
  Expense,
  Settlement,
  PaymentMethod,
  DbGroup,
  DbMember,
  DbExpense,
  DbExpenseParticipant,
  DbSettlement,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseクライアントを作成（環境変数が設定されている場合のみ）
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Supabaseが利用可能かどうかをチェック
export const isSupabaseEnabled = (): boolean => {
  return supabase !== null;
};

// 変換ヘルパー関数
const toGroup = (db: DbGroup): Group => ({
  id: db.id,
  name: db.name,
  createdAt: new Date(db.created_at),
  updatedAt: new Date(db.updated_at),
});

const toMember = (db: DbMember): Member => ({
  id: db.id,
  groupId: db.group_id,
  name: db.name,
  paymentMethod: db.payment_method,
  paymentInfo: db.payment_info || undefined,
  createdAt: new Date(db.created_at),
});

const toExpense = (db: DbExpense, participantIds: string[]): Expense => ({
  id: db.id,
  groupId: db.group_id,
  payerId: db.payer_id,
  title: db.title,
  amount: db.amount,
  participantIds,
  createdAt: new Date(db.created_at),
});

const toSettlement = (db: DbSettlement): Settlement => ({
  id: db.id,
  groupId: db.group_id,
  fromMemberId: db.from_member_id,
  toMemberId: db.to_member_id,
  amount: db.amount,
  isPaid: db.is_paid,
  paidAt: db.paid_at ? new Date(db.paid_at) : undefined,
});

// ========== グループAPI ==========
export async function createGroupInDb(
  name: string,
  memberNames: string[]
): Promise<{ groupId: string; memberIds: string[] } | null> {
  if (!supabase) return null;

  // グループを作成
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert({ name })
    .select()
    .single();

  if (groupError || !groupData) {
    console.error("Error creating group:", groupError);
    return null;
  }

  // メンバーを作成
  const membersToInsert = memberNames.map((memberName) => ({
    group_id: groupData.id,
    name: memberName,
    payment_method: "cash" as PaymentMethod,
  }));

  const { data: membersData, error: membersError } = await supabase
    .from("members")
    .insert(membersToInsert)
    .select();

  if (membersError || !membersData) {
    console.error("Error creating members:", membersError);
    // グループも削除
    await supabase.from("groups").delete().eq("id", groupData.id);
    return null;
  }

  return {
    groupId: groupData.id,
    memberIds: membersData.map((m: DbMember) => m.id),
  };
}

export async function getGroupFromDb(groupId: string): Promise<Group | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("groups")
    .select()
    .eq("id", groupId)
    .single();

  if (error || !data) return null;
  return toGroup(data);
}

export async function updateGroupInDb(
  groupId: string,
  name: string
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from("groups")
    .update({ name })
    .eq("id", groupId);

  return !error;
}

export async function deleteGroupFromDb(groupId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  return !error;
}

// ========== メンバーAPI ==========
export async function getMembersFromDb(groupId: string): Promise<Member[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("members")
    .select()
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map(toMember);
}

export async function addMemberToDb(
  groupId: string,
  name: string
): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("members")
    .insert({ group_id: groupId, name, payment_method: "cash" })
    .select()
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function updateMemberInDb(
  memberId: string,
  updates: { name?: string; paymentMethod?: PaymentMethod; paymentInfo?: string }
): Promise<boolean> {
  if (!supabase) return false;

  const dbUpdates: Partial<DbMember> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.paymentMethod !== undefined)
    dbUpdates.payment_method = updates.paymentMethod;
  if (updates.paymentInfo !== undefined)
    dbUpdates.payment_info = updates.paymentInfo;

  const { error } = await supabase
    .from("members")
    .update(dbUpdates)
    .eq("id", memberId);

  return !error;
}

export async function deleteMemberFromDb(memberId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("members").delete().eq("id", memberId);
  return !error;
}

// ========== 立替API ==========
export async function getExpensesFromDb(groupId: string): Promise<Expense[]> {
  if (!supabase) return [];

  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select()
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (expensesError || !expensesData) return [];

  // 参加者を取得
  const expenseIds = expensesData.map((e: DbExpense) => e.id);
  const { data: participantsData, error: participantsError } = await supabase
    .from("expense_participants")
    .select()
    .in("expense_id", expenseIds);

  if (participantsError) return [];

  // 参加者をexpenseIdでグループ化
  const participantsByExpense = new Map<string, string[]>();
  (participantsData || []).forEach((p: DbExpenseParticipant) => {
    const existing = participantsByExpense.get(p.expense_id) || [];
    participantsByExpense.set(p.expense_id, [...existing, p.member_id]);
  });

  return expensesData.map((e: DbExpense) =>
    toExpense(e, participantsByExpense.get(e.id) || [])
  );
}

export async function addExpenseToDb(
  groupId: string,
  payerId: string,
  title: string,
  amount: number,
  participantIds: string[]
): Promise<string | null> {
  if (!supabase) return null;

  // 立替を作成
  const { data: expenseData, error: expenseError } = await supabase
    .from("expenses")
    .insert({ group_id: groupId, payer_id: payerId, title, amount })
    .select()
    .single();

  if (expenseError || !expenseData) return null;

  // 参加者を作成
  if (participantIds.length > 0) {
    const participantsToInsert = participantIds.map((memberId) => ({
      expense_id: expenseData.id,
      member_id: memberId,
    }));

    const { error: participantsError } = await supabase
      .from("expense_participants")
      .insert(participantsToInsert);

    if (participantsError) {
      // 立替も削除
      await supabase.from("expenses").delete().eq("id", expenseData.id);
      return null;
    }
  }

  return expenseData.id;
}

export async function updateExpenseInDb(
  expenseId: string,
  updates: {
    payerId?: string;
    title?: string;
    amount?: number;
    participantIds?: string[];
  }
): Promise<boolean> {
  if (!supabase) return false;

  // 立替本体の更新
  const dbUpdates: Partial<DbExpense> = {};
  if (updates.payerId !== undefined) dbUpdates.payer_id = updates.payerId;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;

  if (Object.keys(dbUpdates).length > 0) {
    const { error } = await supabase
      .from("expenses")
      .update(dbUpdates)
      .eq("id", expenseId);

    if (error) return false;
  }

  // 参加者の更新
  if (updates.participantIds !== undefined) {
    // 既存の参加者を削除
    await supabase
      .from("expense_participants")
      .delete()
      .eq("expense_id", expenseId);

    // 新しい参加者を追加
    if (updates.participantIds.length > 0) {
      const participantsToInsert = updates.participantIds.map((memberId) => ({
        expense_id: expenseId,
        member_id: memberId,
      }));

      const { error } = await supabase
        .from("expense_participants")
        .insert(participantsToInsert);

      if (error) return false;
    }
  }

  return true;
}

export async function deleteExpenseFromDb(expenseId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
  return !error;
}

// ========== 清算API ==========
export async function getSettlementsFromDb(
  groupId: string
): Promise<Settlement[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("settlements")
    .select()
    .eq("group_id", groupId);

  if (error || !data) return [];
  return data.map(toSettlement);
}

export async function saveSettlementsToDb(
  groupId: string,
  settlements: Settlement[]
): Promise<boolean> {
  if (!supabase) return false;

  // 既存の清算を削除
  await supabase.from("settlements").delete().eq("group_id", groupId);

  // 新しい清算を挿入
  if (settlements.length > 0) {
    const settlementsToInsert = settlements.map((s) => ({
      id: s.id,
      group_id: groupId,
      from_member_id: s.fromMemberId,
      to_member_id: s.toMemberId,
      amount: s.amount,
      is_paid: s.isPaid,
      paid_at: s.paidAt?.toISOString() || null,
    }));

    const { error } = await supabase
      .from("settlements")
      .insert(settlementsToInsert);

    if (error) return false;
  }

  return true;
}

export async function updateSettlementStatusInDb(
  settlementId: string,
  isPaid: boolean
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from("settlements")
    .update({
      is_paid: isPaid,
      paid_at: isPaid ? new Date().toISOString() : null,
    })
    .eq("id", settlementId);

  return !error;
}

// ========== 全データ取得API ==========
export async function getGroupDataFromDb(groupId: string): Promise<{
  group: Group;
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
} | null> {
  if (!supabase) return null;

  const [group, members, expenses, settlements] = await Promise.all([
    getGroupFromDb(groupId),
    getMembersFromDb(groupId),
    getExpensesFromDb(groupId),
    getSettlementsFromDb(groupId),
  ]);

  if (!group) return null;

  return { group, members, expenses, settlements };
}
