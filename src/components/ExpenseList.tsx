"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Button, Input, Select, Checkbox } from "@/components/ui";
import type { Expense, Member } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  onUpdate: (
    id: string,
    data: {
      payerId?: string;
      title?: string;
      amount?: number;
      participantIds?: string[];
    }
  ) => void;
  onDelete: (id: string) => void;
}

export function ExpenseList({
  expenses,
  members,
  onUpdate,
  onDelete,
}: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    payerId: string;
    title: string;
    amount: string;
    participantIds: string[];
  } | null>(null);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || "不明";

  const getParticipantNames = (ids: string[]) => {
    if (ids.length === members.length) return "全員";
    if (ids.length <= 3) {
      return ids.map(getMemberName).join("、");
    }
    return `${ids.slice(0, 2).map(getMemberName).join("、")}他${ids.length - 2}名`;
  };

  const memberOptions = members.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditData({
      payerId: expense.payerId,
      title: expense.title,
      amount: expense.amount.toString(),
      participantIds: expense.participantIds,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (!editingId || !editData) return;

    const amount = parseInt(editData.amount, 10);
    if (
      !editData.title.trim() ||
      isNaN(amount) ||
      amount <= 0 ||
      editData.participantIds.length === 0
    ) {
      return;
    }

    onUpdate(editingId, {
      payerId: editData.payerId,
      title: editData.title.trim(),
      amount,
      participantIds: editData.participantIds,
    });

    cancelEdit();
  };

  const toggleEditParticipant = (memberId: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      participantIds: editData.participantIds.includes(memberId)
        ? editData.participantIds.filter((id) => id !== memberId)
        : [...editData.participantIds, memberId],
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        <p>まだ立て替えが登録されていません</p>
        <p className="text-sm mt-1">上のフォームから追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="p-4 bg-white rounded-lg border border-[var(--color-border)]"
        >
          {editingId === expense.id && editData ? (
            // 編集モード
            <div className="space-y-3">
              <div className="flex gap-2">
                <Select
                  options={memberOptions}
                  value={editData.payerId}
                  onChange={(e) =>
                    setEditData({ ...editData, payerId: e.target.value })
                  }
                  className="w-auto"
                />
                <Input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={editData.amount}
                  onChange={(e) =>
                    setEditData({ ...editData, amount: e.target.value })
                  }
                  className="w-[120px]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <Checkbox
                    key={member.id}
                    label={member.name}
                    checked={editData.participantIds.includes(member.id)}
                    onChange={() => toggleEditParticipant(member.id)}
                    className="text-sm"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button type="button" size="sm" onClick={saveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            // 表示モード
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[var(--color-text)]">
                    {expense.title}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {formatDateShort(expense.createdAt)}
                  </span>
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-primary)] font-medium">
                    {getMemberName(expense.payerId)}
                  </span>
                  が
                  <span className="font-medium">
                    {getParticipantNames(expense.participantIds)}
                  </span>
                  の分を支払い
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[var(--color-text)]">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(expense)}
                    className="p-1.5 rounded hover:bg-gray-100 text-[var(--color-text-muted)] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-[var(--color-error)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
