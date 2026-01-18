"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, Checkbox } from "@/components/ui";
import type { Member } from "@/types";

interface ExpenseFormProps {
  members: Member[];
  onSubmit: (data: {
    payerId: string;
    title: string;
    amount: number;
    participantIds: string[];
  }) => void;
}

export function ExpenseForm({ members, onSubmit }: ExpenseFormProps) {
  const [payerId, setPayerId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    payerId?: string;
    title?: string;
    amount?: string;
    participants?: string;
  }>({});

  // 初期値を設定
  useEffect(() => {
    if (members.length > 0 && !payerId) {
      setPayerId(members[0].id);
    }
    if (participantIds.length === 0 && members.length > 0) {
      setParticipantIds(members.map((m) => m.id));
    }
  }, [members, payerId, participantIds.length]);

  const memberOptions = members.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const handleSelectAll = () => {
    setParticipantIds(members.map((m) => m.id));
  };

  const handleClearAll = () => {
    setParticipantIds([]);
  };

  const toggleParticipant = (memberId: string) => {
    setParticipantIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!payerId) {
      newErrors.payerId = "支払者を選択してください";
    }
    if (!title.trim()) {
      newErrors.title = "項目名を入力してください";
    }
    const amountNum = parseInt(amount, 10);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = "正しい金額を入力してください";
    }
    if (participantIds.length === 0) {
      newErrors.participants = "対象者を1人以上選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      payerId,
      title: title.trim(),
      amount: parseInt(amount, 10),
      participantIds,
    });

    // フォームをリセット（支払者と対象者は維持）
    setTitle("");
    setAmount("");
    setErrors({});
  };

  const isAllSelected = participantIds.length === members.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 自然言語風UI */}
      <div className="p-4 bg-[var(--color-base)] rounded-lg border border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2 text-[var(--color-text)]">
          <Select
            options={memberOptions}
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-auto min-w-[100px]"
          />
          <span>が</span>
          <button
            type="button"
            onClick={isAllSelected ? handleClearAll : handleSelectAll}
            className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border)] text-sm hover:bg-gray-50 transition-colors"
          >
            {isAllSelected ? "全員" : `${participantIds.length}名`}
          </button>
          <span>の</span>
          <Input
            placeholder="ランチ代"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-auto min-w-[120px] flex-1"
            error={errors.title}
          />
          <span>を払って、</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[var(--color-text)]">
          <span>¥</span>
          <Input
            type="number"
            placeholder="3,500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-auto min-w-[100px] max-w-[150px]"
            error={errors.amount}
          />
          <span>かかった。</span>
          <Button type="submit" className="ml-auto">
            追加する
          </Button>
        </div>
      </div>

      {/* 対象者選択 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text)]">
            対象者
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              全員選択
            </button>
            <span className="text-xs text-[var(--color-text-muted)]">|</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              全解除
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <Checkbox
              key={member.id}
              label={member.name}
              checked={participantIds.includes(member.id)}
              onChange={() => toggleParticipant(member.id)}
              className="px-3 py-2 rounded-lg bg-white border border-[var(--color-border)]"
            />
          ))}
        </div>
        {errors.participants && (
          <p className="text-sm text-[var(--color-error)]">
            {errors.participants}
          </p>
        )}
      </div>
    </form>
  );
}
