"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Receipt, History } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { useGroupStore } from "@/stores/groupStore";
import { useHydration } from "@/stores/useHydration";
import { formatDateTime, downloadCSV, generateCSV } from "@/lib/utils";

export default function HistoryPage() {
  const params = useParams();
  const groupId = params.id as string;

  const hydrated = useHydration();

  // 直接stateから取得してuseMemoでメモ化
  const groups = useGroupStore((state) => state.groups);
  const allMembers = useGroupStore((state) => state.members);
  const allExpenses = useGroupStore((state) => state.expenses);

  const group = useMemo(() => groups.find((g) => g.id === groupId), [groups, groupId]);
  const members = useMemo(() => allMembers.filter((m) => m.groupId === groupId), [allMembers, groupId]);
  const expenses = useMemo(() =>
    allExpenses
      .filter((e) => e.groupId === groupId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [allExpenses, groupId]
  );

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

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "不明";

  const getParticipantNames = (ids: string[]) => {
    if (ids.length === members.length) return "全員";
    return ids.map(getMemberName).join("、");
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDownloadCSV = () => {
    const headers = ["日時", "項目", "支払者", "対象者", "金額"];
    const rows = expenses.map((e) => [
      formatDateTime(e.createdAt),
      e.title,
      getMemberName(e.payerId),
      getParticipantNames(e.participantIds),
      e.amount,
    ]);

    const csvContent = generateCSV(headers, rows);
    downloadCSV(`${group.name}_立て替え履歴.csv`, csvContent);
  };

  // 日付ごとにグループ化
  const expensesByDate = expenses.reduce(
    (acc, expense) => {
      const dateKey = expense.createdAt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(expense);
      return acc;
    },
    {} as Record<string, typeof expenses>
  );

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
            立て替え履歴
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1 text-sm">{group.name}</p>
        </div>

        {/* サマリー */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <Receipt className="w-4 h-4" />
                <span className="text-sm">合計 {expenses.length}件</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-[var(--color-text)] tabular-nums">
                ¥{totalExpenses.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSVダウンロード */}
        {expenses.length > 0 && (
          <Button
            variant="secondary"
            className="w-full mb-4 sm:mb-6 touch-manipulation"
            onClick={handleDownloadCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            CSVダウンロード
          </Button>
        )}

        {/* 履歴一覧 */}
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center text-[var(--color-text-muted)]">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">まだ立て替えが登録されていません</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(expensesByDate).map(([date, dateExpenses]) => (
              <div key={date}>
                <h2 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
                  {date}
                </h2>
                <Card>
                  <CardContent className="p-0 divide-y divide-[var(--color-border)]">
                    {dateExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="p-3 sm:p-4 flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-[var(--color-text)] truncate">
                            {expense.title}
                          </div>
                          <div className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                            <span className="text-[var(--color-primary)] font-medium">
                              {getMemberName(expense.payerId)}
                            </span>
                            が
                            <span className="font-medium">
                              {getParticipantNames(expense.participantIds)}
                            </span>
                            の分を支払い
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)] mt-1">
                            {expense.createdAt.toLocaleTimeString("ja-JP", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="font-bold text-base sm:text-lg text-[var(--color-text)] tabular-nums shrink-0">
                          ¥{expense.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
