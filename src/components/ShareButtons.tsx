"use client";

import { useState, useEffect } from "react";
import { Link2, MessageCircle, QrCode, Check, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui";
import { copyToClipboard, getLINEShareUrl } from "@/lib/utils";

interface ShareButtonsProps {
  groupName: string;
  url?: string;
}

export function ShareButtons({ groupName, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Web Share APIが使えるかチェック
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ネイティブ共有（スマホ対応）
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `${groupName} - 割り勘グループ`,
        text: `${groupName}の割り勘グループに参加しよう!`,
        url: shareUrl,
      });
    } catch {
      // ユーザーがキャンセルした場合などは無視
    }
  };

  const handleShareLine = () => {
    const lineUrl = getLINEShareUrl(
      `${groupName}の割り勘グループに参加しよう!`,
      shareUrl
    );
    window.open(lineUrl, "_blank", "noopener,noreferrer");
  };

  const handleShowQR = () => {
    setShowQR(true);
  };

  // QRコードURL（Google Charts API使用）
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {/* スマホではネイティブ共有を優先表示 */}
        {canShare && (
          <Button variant="primary" size="sm" onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-1" />
            共有
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={handleCopyUrl}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              コピー済み
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-1" />
              URLをコピー
            </>
          )}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShareLine} className="bg-[#06C755] hover:bg-[#05b04d] text-white border-[#06C755]">
          <MessageCircle className="w-4 h-4 mr-1" />
          LINE
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShowQR}>
          <QrCode className="w-4 h-4 mr-1" />
          QR
        </Button>
      </div>

      {/* QRコードモーダル */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                QRコード
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QRコード"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <p className="text-sm text-[var(--color-text-muted)] text-center">
              このQRコードをスキャンして
              <br />
              グループに参加できます
            </p>
            <Button className="w-full mt-4" onClick={() => setShowQR(false)}>
              閉じる
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
