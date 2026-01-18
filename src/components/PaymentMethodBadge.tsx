"use client";

import { Banknote, Smartphone, Building2 } from "lucide-react";
import type { Member } from "@/types";

interface PaymentMethodBadgeProps {
  member: Member;
  showInfo?: boolean;
}

export function PaymentMethodBadge({
  member,
  showInfo = true,
}: PaymentMethodBadgeProps) {
  const { paymentMethod, paymentInfo } = member;

  const config = {
    cash: {
      icon: Banknote,
      label: "現金",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-600",
    },
    paypay: {
      icon: Smartphone,
      label: "PayPay",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600",
    },
    bank: {
      icon: Building2,
      label: "口座振り込み",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
    },
  };

  const { icon: Icon, label, bgColor, textColor, iconColor } = config[paymentMethod];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      <span>{label}</span>
      {showInfo && paymentInfo && (
        <span className="ml-1 font-normal opacity-80">
          {paymentMethod === "paypay" && paymentInfo}
          {paymentMethod === "bank" && "(詳細あり)"}
        </span>
      )}
    </div>
  );
}
