import type { PaymentMethod } from "@/types";

/**
 * 数値を日本円形式でフォーマット
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * 日付を日本語形式でフォーマット
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * 日付を短い形式でフォーマット (MM/DD)
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

/**
 * 日時を日本語形式でフォーマット
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * 支払い方法のラベルを取得
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "現金",
    paypay: "PayPay",
    bank: "口座振り込み",
  };
  return labels[method];
}

/**
 * 支払い方法のアイコン絵文字を取得
 */
export function getPaymentMethodEmoji(method: PaymentMethod): string {
  const emojis: Record<PaymentMethod, string> = {
    cash: "",
    paypay: "",
    bank: "",
  };
  return emojis[method];
}

/**
 * クリップボードにテキストをコピー
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * URLをクリップボードにコピー
 */
export async function copyCurrentUrl(): Promise<boolean> {
  return copyToClipboard(window.location.href);
}

/**
 * LINEで共有するURLを生成
 */
export function getLINEShareUrl(text: string, url: string): string {
  const encodedText = encodeURIComponent(`${text}\n${url}`);
  return `https://social-plugins.line.me/lineit/share?text=${encodedText}`;
}

/**
 * CSV形式のデータを生成
 */
export function generateCSV(
  headers: string[],
  rows: (string | number)[][]
): string {
  const escape = (value: string | number): string => {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escape).join(",");
  const dataLines = rows.map((row) => row.map(escape).join(","));

  return [headerLine, ...dataLines].join("\n");
}

/**
 * CSVファイルをダウンロード
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * classNames ユーティリティ
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
