import type { Expense, Member, MemberBalance, Settlement } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * 各メンバーの収支バランスを計算
 */
export function calculateMemberBalances(
  expenses: Expense[],
  members: Member[]
): MemberBalance[] {
  const balances: Map<string, { totalPaid: number; totalOwed: number }> =
    new Map();

  // 初期化
  members.forEach((m) => {
    balances.set(m.id, { totalPaid: 0, totalOwed: 0 });
  });

  // 各支出を計算
  expenses.forEach((expense) => {
    if (expense.participantIds.length === 0) return;

    const perPerson = Math.floor(
      expense.amount / expense.participantIds.length
    );

    // 支払者の支払い額を加算
    const payerBalance = balances.get(expense.payerId);
    if (payerBalance) {
      payerBalance.totalPaid += expense.amount;
    }

    // 参加者の負担額を加算
    expense.participantIds.forEach((pid) => {
      const balance = balances.get(pid);
      if (balance) {
        balance.totalOwed += perPerson;
      }
    });
  });

  // 結果を整形
  return members.map((member) => {
    const balance = balances.get(member.id) || { totalPaid: 0, totalOwed: 0 };
    return {
      memberId: member.id,
      memberName: member.name,
      totalPaid: balance.totalPaid,
      totalOwed: balance.totalOwed,
      balance: balance.totalPaid - balance.totalOwed,
    };
  });
}

/**
 * 最適な清算方法を計算（貪欲法）
 */
export function calculateSettlements(
  expenses: Expense[],
  members: Member[],
  groupId: string
): Settlement[] {
  const memberBalances = calculateMemberBalances(expenses, members);

  // 債権者（お金をもらう人）と債務者（お金を払う人）に分類
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  memberBalances.forEach((balance) => {
    if (balance.balance > 0) {
      creditors.push({ id: balance.memberId, amount: balance.balance });
    } else if (balance.balance < 0) {
      debtors.push({ id: balance.memberId, amount: -balance.balance });
    }
  });

  // 金額の大きい順にソート
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // 清算を計算
  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const amount = Math.min(creditors[i].amount, debtors[j].amount);

    if (amount > 0) {
      settlements.push({
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

  return settlements;
}

/**
 * 清算結果をテキスト形式で出力
 */
export function formatSettlementsAsText(
  settlements: Settlement[],
  members: Member[]
): string {
  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "不明";

  if (settlements.length === 0) {
    return "清算は不要です。";
  }

  const lines = settlements.map((s) => {
    const from = getMemberName(s.fromMemberId);
    const to = getMemberName(s.toMemberId);
    const toMember = members.find((m) => m.id === s.toMemberId);

    let paymentInfo = "";
    if (toMember) {
      if (toMember.paymentMethod === "paypay" && toMember.paymentInfo) {
        paymentInfo = ` (PayPay: ${toMember.paymentInfo})`;
      } else if (toMember.paymentMethod === "bank" && toMember.paymentInfo) {
        paymentInfo = ` (振込先: ${toMember.paymentInfo})`;
      }
    }

    const status = s.isPaid ? " [支払い済み]" : "";
    return `${from} → ${to}: ¥${s.amount.toLocaleString()}${paymentInfo}${status}`;
  });

  return lines.join("\n");
}
