"use client";

import { ArrowRight, Check, Banknote, Smartphone, Building2 } from "lucide-react";
import { Checkbox } from "@/components/ui";
import type { Settlement, Member } from "@/types";
import { cn } from "@/lib/utils";

interface SettlementCardProps {
  settlement: Settlement;
  fromMember: Member;
  toMember: Member;
  onTogglePaid: (id: string, isPaid: boolean) => void;
}

export function SettlementCard({
  settlement,
  fromMember,
  toMember,
  onTogglePaid,
}: SettlementCardProps) {
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
          : "bg-white border-[var(--color-border)] hover:border-[var(--color-primary)]/30 active:scale-[0.99]"
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
          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                  methodConfig.bgColor,
                  methodConfig.color
                )}
              >
                <MethodIcon className="w-3 h-3" />
                {methodConfig.label}
              </span>
              {toMember.paymentInfo && (
                <span className="text-xs text-[var(--color-text-muted)] truncate">
                  {toMember.paymentInfo}
                </span>
              )}
            </div>
            <span
              className={cn(
                "font-bold text-xl sm:text-2xl tabular-nums shrink-0",
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
