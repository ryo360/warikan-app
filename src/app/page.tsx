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
      <section className="py-20 px-4 sm:py-28 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-base)] to-[var(--color-base-dark)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-secondary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* ロゴエリア */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg mb-6">
            <Calculator className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">
            和利缶
          </h1>
          <p className="text-xl sm:text-2xl font-semibold mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            かんたん割り勘計算
          </p>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] mb-10 leading-relaxed max-w-md mx-auto">
            旅行やグループイベントの割り勘計算をシンプルに解決。
            <br />
            会員登録不要・無料ですぐに使えます。
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="text-lg px-10 py-5 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
            >
              グループを作成する
            </Button>
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-3">
              Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
              主な機能
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--color-text)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 利用シーンセクション */}
      <section className="py-16 px-4 bg-gradient-to-br from-[var(--color-base)] to-[var(--color-base-dark)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm font-medium mb-3">
              Use Cases
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
              こんなシーンで活躍
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {useCases.map((useCase) => (
              <div
                key={useCase.label}
                className="group bg-white rounded-xl p-5 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                  <useCase.icon className="w-5 h-5 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="font-semibold text-sm text-[var(--color-text)]">
                  {useCase.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium mb-3">
              How to Use
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
              使い方
            </h2>
          </div>
          <div className="space-y-5 relative">
            {/* 縦線 */}
            <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)] hidden sm:block" />

            <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                1
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-[var(--color-text)] mb-2">
                  グループを作成
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  グループ名とメンバー名を入力してグループを作成します
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                2
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-[var(--color-text)] mb-2">
                  立て替えを記録
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  誰が、誰の分を、いくら払ったかを入力していきます
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                3
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-[var(--color-text)] mb-2">
                  清算方法を確認
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  誰が誰にいくら払えばいいか、自動で計算されます
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-secondary)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            さっそく使ってみる
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            会員登録不要・完全無料でご利用いただけます
          </p>
          <Link href="/create">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-5 bg-white text-[var(--color-primary)] hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
            >
              グループを作成する
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-10 px-4 bg-[var(--color-secondary)]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">和利缶</span>
          </div>
          <p className="text-white/60 text-sm">
            無料の割り勘計算サービス
          </p>
        </div>
      </footer>
    </main>
  );
}
