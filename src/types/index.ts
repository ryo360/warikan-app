// types/index.ts

export type PaymentMethod = 'cash' | 'paypay' | 'bank';

export interface Group {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  groupId: string;
  name: string;
  paymentMethod: PaymentMethod;
  paymentInfo?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  groupId: string;
  payerId: string;
  title: string;
  amount: number;
  participantIds: string[];
  createdAt: Date;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  isPaid: boolean;
  paidAt?: Date;
}

// フォーム用の型
export interface CreateGroupInput {
  name: string;
  memberNames: string[];
}

export interface CreateExpenseInput {
  payerId: string;
  title: string;
  amount: number;
  participantIds: string[];
}

export interface UpdateMemberInput {
  paymentMethod: PaymentMethod;
  paymentInfo?: string;
}

// 計算結果用の型
export interface MemberBalance {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}

// ローカルストレージ用の型
export interface StoredGroup extends Omit<Group, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export interface StoredMember extends Omit<Member, 'createdAt'> {
  createdAt: string;
}

export interface StoredExpense extends Omit<Expense, 'createdAt'> {
  createdAt: string;
}

export interface StoredSettlement extends Omit<Settlement, 'paidAt'> {
  paidAt?: string;
}

// Supabase DB用の型
export interface DbGroup {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DbMember {
  id: string;
  group_id: string;
  name: string;
  payment_method: PaymentMethod;
  payment_info: string | null;
  created_at: string;
}

export interface DbExpense {
  id: string;
  group_id: string;
  payer_id: string;
  title: string;
  amount: number;
  created_at: string;
}

export interface DbExpenseParticipant {
  expense_id: string;
  member_id: string;
}

export interface DbSettlement {
  id: string;
  group_id: string;
  from_member_id: string;
  to_member_id: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
}
