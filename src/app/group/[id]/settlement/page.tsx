"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, Calculator } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ProgressBar,
} from "@/components/ui";
import { SettlementCard } from "@/components/SettlementCard";
import { useGroupStore } from "@/stores/groupStore";
import { useHydration } from "@/stores/useHydration";
import { copyToClipboard, downloadCSV, generateCSV, cn } from "@/lib/utils";
import { formatSettlementsAsText, calculateMemberBalances } from "@/lib/settlement";

export default function SettlementPage() {
  const params = useParams();
  const groupId = params.id as string;

  const hydrated = useHydration();
  const [copied, setCopied] = useState(false);

  // 直接stateから取得してuseMemoでメモ化
  const groups = useGroupStore((state) => state.groups);
  const allMembers = useGroupStore((state) => state.members);
  const allExpenses = useGroupStore((state) => state.expenses);
  const allSettlements = useGroupStore((state) => state.settlements);

  const group = useMemo(() => groups.find((g) => g.id === groupId), [groups, groupId]);
  const members = useMemo(() => allMembers.filter((m) => m.groupId === groupId), [allMembers, groupId]);
  const expenses = useMemo(() =>
    allExpenses
      .filter((e) => e.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [allExpenses, groupId]
  );
  const settlements = useMemo(() => allSettlements.filter((s) => s.groupId === groupId), [allSettlements, groupId]);

  const updateSettlementStatus = useGroupStore(
    (state) => state.updateSettlementStatus
  );
  const recalculateSettlements = useGroupStore(
    (state) => state.recalculateSettlements
  );

  useEffect(() => {
    // 清算を再計算
    if (hydrated && groupId) {
      recalculateSettlements(groupId);
    }
  }, [hydrated, groupId, recalculateSettlements]);

  if (!hydrated) {
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
          <Link href="/">
            <Button>トップに戻る</Button>
          </Link>
        </div>
      </main>
    );
  }

  const getMember = (id: string) => members.find((m) => m.id === id);

  const unpaidSettlements = settlements.filter((s) => !s.isPaid);
  const paidSettlements = settlements.filter((s) => s.isPaid);
  const paidCount = paidSettlements.length;
  const totalCount = settlements.length;
  const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

  const handleTogglePaid = (id: string, isPaid: boolean) => {
    updateSettlementStatus(id, isPaid);
  };

  const handleCopySettlements = async () => {
    const text = formatSettlementsAsText(settlements, members);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCSV = () => {
    const memberBalances = calculateMemberBalances(expenses, members);

    // 清算データのCSV
    const headers = ["送金者", "受取者", "金額", "支払い方法", "送付先", "状態"];
    const rows = settlements.map((s) => {
      const from = getMember(s.fromMemberId);
      const to = getMember(s.toMemberId);
      return [
        from?.name || "不明",
        to?.name || "不明",
        s.amount,
        to?.paymentMethod === "cash"
          ? "現金"
          : to?.paymentMethod === "paypay"
            ? "PayPay"
            : "口座振り込み",
        to?.paymentInfo || "",
        s.isPaid ? "支払い済み" : "未払い",
      ];
    });

    const csvContent = generateCSV(headers, rows);
    downloadCSV(`${group.name}_清算.csv`, csvContent);

    // 収支サマリーのCSV
    const summaryHeaders = ["メンバー", "支払額", "負担額", "収支"];
    const summaryRows = memberBalances.map((b) => [
      b.memberName,
      b.totalPaid,
      b.totalOwed,
      b.balance,
    ]);

    const summaryCSV = generateCSV(summaryHeaders, summaryRows);
    downloadCSV(`${group.name}_収支サマリー.csv`, summaryCSV);
  };

  // 収支サマリー
  const memberBalances = calculateMemberBalances(expenses, members);

  return (
    <main className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 pb-8">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={`/group/${groupId}`}
            className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-3 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">グループに戻る</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
            清算結果
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">{group.name}</p>
        </div>

        {/* 進捗 */}
        {totalCount > 0 && (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--color-text-muted)]">清算進捗</span>
                <span className="font-medium text-[var(--color-text)]">
                  {paidCount}/{totalCount} 完了
                </span>
              </div>
              <ProgressBar value={progress} />
              {paidCount === totalCount && totalCount > 0 && (
                <p className="mt-3 text-center text-green-600 font-medium text-sm">
                  🎉 すべての清算が完了しました！
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopySettlements}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                コピー済み
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                テキストをコピー
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadCSV}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            CSV出力
          </Button>
        </div>

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
          <div className="space-y-4 mb-6">
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
                      <SettlementCard
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
                      <SettlementCard
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
          </div>
        )}

        {/* 収支サマリー */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">収支サマリー</CardTitle>
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
      </div>
    </main>
  );
}
