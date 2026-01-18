"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Users,
  Receipt,
  Calculator,
  Share2,
  Plane,
  UtensilsCrossed,
  PartyPopper,
  Tent,
  Home,
  Sparkles,
  Music,
  Dumbbell,
} from "lucide-react";

const useCases = [
  { icon: Plane, label: "旅行", description: "宿泊費、交通費、食事代" },
  {
    icon: UtensilsCrossed,
    label: "飲み会・食事会",
    description: "居酒屋、レストラン",
  },
  {
    icon: PartyPopper,
    label: "ホームパーティ",
    description: "食材費、飲み物代",
  },
  { icon: Tent, label: "BBQ/キャンプ", description: "食材、機材、施設利用料" },
  { icon: Home, label: "ハウスシェア", description: "光熱費、日用品" },
  { icon: Dumbbell, label: "サウナ", description: "施設利用料、飲食代" },
  {
    icon: Sparkles,
    label: "ディズニーランド",
    description: "チケット、食事、お土産",
  },
  { icon: Music, label: "夏フェス", description: "チケット、交通費、宿泊費" },
];

const features = [
  {
    icon: Users,
    title: "グループ作成",
    description: "メンバーを追加してすぐに利用開始",
  },
  {
    icon: Receipt,
    title: "立て替え記録",
    description: "誰が何を払ったか簡単に記録",
  },
  {
    icon: Calculator,
    title: "自動計算",
    description: "最適な清算方法を自動で算出",
  },
  {
    icon: Share2,
    title: "かんたん共有",
    description: "URLをシェアするだけでメンバーと共有",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-16 px-4 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4">
            和利缶
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--color-primary)] font-medium mb-6">
            かんたん割り勘計算
          </p>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-8 leading-relaxed">
            旅行やグループイベントの割り勘計算をシンプルに解決。
            <br />
            会員登録不要・無料ですぐに使えます。
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-4">
              グループを作成する
            </Button>
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-8">
            主な機能
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-5 border border-[var(--color-border)] shadow-sm"
              >
                <feature.icon className="w-8 h-8 text-[var(--color-primary)] mb-3" />
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 利用シーンセクション */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-8">
            こんなシーンで活躍
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="bg-white rounded-lg p-4 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)]/50 transition-colors"
              >
                <useCase.icon className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="font-medium text-sm text-[var(--color-text)]">
                  {useCase.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-8">
            使い方
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[var(--color-border)]">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  グループを作成
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  グループ名とメンバー名を入力してグループを作成します
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[var(--color-border)]">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  立て替えを記録
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  誰が、誰の分を、いくら払ったかを入力していきます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-[var(--color-border)]">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  清算方法を確認
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  誰が誰にいくら払えばいいか、自動で計算されます
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            さっそく使ってみる
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            会員登録不要・完全無料でご利用いただけます
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-4">
              グループを作成する
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 border-t border-[var(--color-border)] bg-white/50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            和利缶（ワリカン） - 無料の割り勘計算サービス
          </p>
        </div>
      </footer>
    </main>
  );
}
