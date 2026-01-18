"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { isSupabaseEnabled } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calculator,
  History,
  Receipt,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  Banknote,
  Smartphone,
  Building2,
} from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, ProgressBar, Checkbox } from "@/components/ui";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ShareButtons } from "@/components/ShareButtons";
import { useGroupStore } from "@/stores/groupStore";
import { useHydration } from "@/stores/useHydration";
import { formatCurrency, cn } from "@/lib/utils";
import { calculateMemberBalances } from "@/lib/settlement";
import type { Settlement, Member } from "@/types";

// 清算カードコンポーネント（インライン統合版）
function SettlementItem({
  settlement,
  fromMember,
  toMember,
  onTogglePaid,
  compact = false,
}: {
  settlement: Settlement;
  fromMember: Member;
  toMember: Member;
  onTogglePaid: (id: string, isPaid: boolean) => void;
  compact?: boolean;
}) {
  const { isPaid } = settlement;

  const paymentMethodConfig = {
    cash: {
      icon: Banknote,
      label: "現金",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    paypay: {
      icon: Smartphone,
      label: "PayPay",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    bank: {
      icon: Building2,
      label: "振込",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  };

  const methodConfig = paymentMethodConfig[toMember.paymentMethod];
  const MethodIcon = methodConfig.icon;

  return (
    <div
      className={cn(
        "p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation",
        isPaid
          ? "bg-green-50/50 border-green-200"
          : "bg-white border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isPaid}
          onChange={() => onTogglePaid(settlement.id, !isPaid)}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* メイン情報: 誰が誰にいくら */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "font-bold text-base sm:text-lg",
                  isPaid ? "text-gray-400 line-through" : "text-[var(--color-text)]"
                )}
              >
                {fromMember.name}
              </span>
              <ArrowRight
                className={cn(
                  "w-4 h-4 shrink-0",
                  isPaid ? "text-gray-300" : "text-[var(--color-primary)]"
                )}
              />
              <span
                className={cn(
                  "font-bold text-base sm:text-lg",
                  isPaid ? "text-gray-400 line-through" : "text-[var(--color-primary)]"
                )}
              >
                {toMember.name}
              </span>
            </div>
          </div>

          {/* 金額と支払い方法 */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                  methodConfig.bgColor,
                  methodConfig.color
                )}
              >
                <MethodIcon className="w-3 h-3" />
                {methodConfig.label}
              </span>
              {toMember.paymentInfo && (
                <span className="text-xs text-[var(--color-text-muted)] truncate max-w-[120px] sm:max-w-none">
                  {toMember.paymentInfo}
                </span>
              )}
            </div>
            <span
              className={cn(
                "font-bold text-xl sm:text-2xl tabular-nums",
                isPaid ? "text-gray-400 line-through" : "text-[var(--color-text)]"
              )}
            >
              ¥{settlement.amount.toLocaleString()}
            </span>
          </div>

          {/* 支払い済みマーク */}
          {isPaid && (
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">支払い済み</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;

  const hydrated = useHydration();
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [activeTab, setActiveTab] = useState<"settlement" | "expenses">("settlement");
  const [isDbLoading, setIsDbLoading] = useState(false);

  // 直接stateから取得してuseMemoでメモ化
  const groups = useGroupStore((state) => state.groups);
  const allMembers = useGroupStore((state) => state.members);
  const allExpenses = useGroupStore((state) => state.expenses);
  const allSettlements = useGroupStore((state) => state.settlements);
  const loadGroupFromDb = useGroupStore((state) => state.loadGroupFromDb);

  const group = useMemo(() => groups.find((g) => g.id === groupId), [groups, groupId]);
  const members = useMemo(() => allMembers.filter((m) => m.groupId === groupId), [allMembers, groupId]);
  const expenses = useMemo(() =>
    allExpenses
      .filter((e) => e.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [allExpenses, groupId]
  );
  const settlements = useMemo(() => allSettlements.filter((s) => s.groupId === groupId), [allSettlements, groupId]);

  const addExpense = useGroupStore((state) => state.addExpense);
  const updateExpense = useGroupStore((state) => state.updateExpense);
  const deleteExpense = useGroupStore((state) => state.deleteExpense);
  const updateSettlementStatus = useGroupStore((state) => state.updateSettlementStatus);

  // Supabaseが有効な場合、グループをDBから読み込む
  useEffect(() => {
    const loadFromDb = async () => {
      if (hydrated && isSupabaseEnabled() && !group) {
        setIsDbLoading(true);
        await loadGroupFromDb(groupId);
        setIsDbLoading(false);
      }
    };
    loadFromDb();
  }, [hydrated, groupId, group, loadGroupFromDb]);

  // メンバー収支計算
  const memberBalances = useMemo(() => {
    if (members.length === 0 || expenses.length === 0) return [];
    return calculateMemberBalances(expenses, members);
  }, [expenses, members]);

  if (!hydrated || isDbLoading) {
    return (
      <main className="min-h-screen py-6 px-4">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen py-6 px-4">
        <div className="max-w-lg mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            グループが見つかりません
          </h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            URLが正しいかご確認ください
          </p>
          <Link href="/">
            <Button>トップに戻る</Button>
          </Link>
        </div>
      </main>
    );
  }

  const getMember = (id: string) => members.find((m) => m.id === id);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const unpaidSettlements = settlements.filter((s) => !s.isPaid);
  const paidSettlements = settlements.filter((s) => s.isPaid);
  const totalUnpaid = unpaidSettlements.reduce((sum, s) => sum + s.amount, 0);
  const progress = settlements.length > 0 ? (paidSettlements.length / settlements.length) * 100 : 0;

  const handleAddExpense = async (data: {
    payerId: string;
    title: string;
    amount: number;
    participantIds: string[];
  }) => {
    await addExpense(
      groupId,
      data.payerId,
      data.title,
      data.amount,
      data.participantIds
    );
  };

  const handleUpdateExpense = async (
    id: string,
    data: {
      payerId?: string;
      title?: string;
      amount?: number;
      participantIds?: string[];
    }
  ) => {
    await updateExpense(id, data);
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm("この立て替えを削除しますか？")) {
      await deleteExpense(id);
    }
  };

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    await updateSettlementStatus(id, isPaid);
  };

  // 表示する立て替え（最新3件 or 全件）
  const displayedExpenses = showAllExpenses ? expenses : expenses.slice(0, 3);

  return (
    <main className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 pb-8">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-3 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">トップに戻る</span>
          </Link>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] truncate">
                {group.name}
              </h1>
              <div className="flex items-center gap-1 mt-1 text-[var(--color-text-muted)]">
                <Users className="w-4 h-4 shrink-0" />
                <span className="text-sm">{members.length}名</span>
              </div>
            </div>
          </div>
        </div>

        {/* サマリーカード - スマホ最適化 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] mb-1">
              <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">支出合計</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[var(--color-text)] tabular-nums">
              ¥{totalExpenses.toLocaleString()}
            </p>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] mb-1">
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">未清算</span>
            </div>
            <p className={cn(
              "text-lg sm:text-xl font-bold tabular-nums",
              totalUnpaid > 0 ? "text-[var(--color-primary)]" : "text-green-600"
            )}>
              ¥{totalUnpaid.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* ナビゲーションボタン - 横スクロール対応 */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
          <Link href={`/group/${groupId}/members`} className="shrink-0">
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              <Users className="w-4 h-4 mr-1" />
              メンバー
            </Button>
          </Link>
          <Link href={`/group/${groupId}/settlement`} className="shrink-0">
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              <Calculator className="w-4 h-4 mr-1" />
              詳細清算
            </Button>
          </Link>
          <Link href={`/group/${groupId}/history`} className="shrink-0">
            <Button variant="secondary" size="sm" className="whitespace-nowrap">
              <History className="w-4 h-4 mr-1" />
              履歴
            </Button>
          </Link>
        </div>

        {/* 共有ボタン */}
        <div className="mb-4 sm:mb-6">
          <ShareButtons groupName={group.name} />
        </div>

        {/* 清算進捗バー */}
        {settlements.length > 0 && (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--color-text-muted)]">清算進捗</span>
                <span className="font-medium text-[var(--color-text)]">
                  {paidSettlements.length}/{settlements.length} 完了
                </span>
              </div>
              <ProgressBar value={progress} />
              {progress === 100 && (
                <p className="mt-3 text-center text-green-600 font-medium text-sm">
                  🎉 すべての清算が完了しました！
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* タブ切り替え */}
        <div className="flex border-b border-[var(--color-border)] mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("settlement")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors touch-manipulation",
              activeTab === "settlement"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]"
            )}
          >
            清算結果
            {unpaidSettlements.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-[var(--color-primary)] text-white rounded-full">
                {unpaidSettlements.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors touch-manipulation",
              activeTab === "expenses"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]"
            )}
          >
            立て替え一覧
            <span className="ml-1.5 text-xs text-[var(--color-text-muted)]">
              ({expenses.length})
            </span>
          </button>
        </div>

        {/* 清算結果タブ */}
        {activeTab === "settlement" && (
          <div className="space-y-4">
            {/* 清算一覧 */}
            {settlements.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12 text-center text-[var(--color-text-muted)]">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">清算は不要です</p>
                  <p className="text-sm mt-1">
                    まだ立て替えが登録されていないか、
                    <br />
                    全員の収支がゼロです
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* 未清算 */}
                {unpaidSettlements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                      未清算 ({unpaidSettlements.length}件)
                    </h3>
                    <div className="space-y-2">
                      {unpaidSettlements.map((settlement) => {
                        const fromMember = getMember(settlement.fromMemberId);
                        const toMember = getMember(settlement.toMemberId);
                        if (!fromMember || !toMember) return null;

                        return (
                          <SettlementItem
                            key={settlement.id}
                            settlement={settlement}
                            fromMember={fromMember}
                            toMember={toMember}
                            onTogglePaid={handleTogglePaid}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 清算済み */}
                {paidSettlements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      清算済み ({paidSettlements.length}件)
                    </h3>
                    <div className="space-y-2">
                      {paidSettlements.map((settlement) => {
                        const fromMember = getMember(settlement.fromMemberId);
                        const toMember = getMember(settlement.toMemberId);
                        if (!fromMember || !toMember) return null;

                        return (
                          <SettlementItem
                            key={settlement.id}
                            settlement={settlement}
                            fromMember={fromMember}
                            toMember={toMember}
                            onTogglePaid={handleTogglePaid}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 収支サマリー */}
            {memberBalances.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">メンバー収支</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {memberBalances.map((balance) => (
                      <div
                        key={balance.memberId}
                        className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                      >
                        <span className="font-medium text-[var(--color-text)] text-sm">
                          {balance.memberName}
                        </span>
                        <div className="text-right">
                          <div className="text-xs text-[var(--color-text-muted)]">
                            支払: ¥{balance.totalPaid.toLocaleString()} / 負担: ¥{balance.totalOwed.toLocaleString()}
                          </div>
                          <div
                            className={cn(
                              "font-bold text-sm tabular-nums",
                              balance.balance > 0
                                ? "text-[var(--color-primary)]"
                                : balance.balance < 0
                                  ? "text-[var(--color-error)]"
                                  : "text-[var(--color-text-muted)]"
                            )}
                          >
                            {balance.balance > 0 ? "+" : ""}
                            ¥{balance.balance.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 立て替え一覧タブ */}
        {activeTab === "expenses" && (
          <div className="space-y-4">
            {/* 立て替え入力フォーム */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">立て替えを追加</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ExpenseForm members={members} onSubmit={handleAddExpense} />
              </CardContent>
            </Card>

            {/* 立て替え一覧 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">記録一覧</CardTitle>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {expenses.length}件
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ExpenseList
                  expenses={displayedExpenses}
                  members={members}
                  onUpdate={handleUpdateExpense}
                  onDelete={handleDeleteExpense}
                />
                {expenses.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllExpenses(!showAllExpenses)}
                    className="w-full mt-3 py-2 text-sm text-[var(--color-primary)] font-medium flex items-center justify-center gap-1 touch-manipulation"
                  >
                    {showAllExpenses ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        折りたたむ
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        すべて表示 ({expenses.length}件)
                      </>
                    )}
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
