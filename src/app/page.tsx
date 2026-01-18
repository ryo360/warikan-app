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
  Eye,
  Wine,
  Heart,
  ArrowRight,
  Check,
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

const coreValues = [
  {
    icon: Eye,
    title: "ガラス張りの会計",
    subtitle: "不信感ゼロへ",
    description:
      "会計担当者だけの「密室計算」を撤廃。ブラックボックスのない明朗会計プロセスで、全員が0.1秒で納得。",
  },
  {
    icon: Wine,
    title: "ほろ酔い専用UI",
    subtitle: "思考停止でOK",
    description:
      "飲み会の最後、脳のメモリは「楽しかった」という感情に使ってほしい。計算に脳を使わせません。",
  },
];

const steps = [
  {
    number: "1",
    title: "撮る（入力）",
    description: "金額を入力するだけ",
    gradient: "from-[var(--color-primary)] to-[var(--color-primary-dark)]",
  },
  {
    number: "2",
    title: "選ぶ（人数）",
    description: "メンバーを選択",
    gradient: "from-[var(--color-primary)] to-[var(--color-secondary)]",
  },
  {
    number: "3",
    title: "見せる（確定）",
    description: "結果をシェア",
    gradient: "from-[var(--color-secondary)] to-[var(--color-secondary-dark)]",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-16 px-4 sm:py-24 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-base)] to-[var(--color-base-dark)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-secondary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* ロゴエリア */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-2xl mb-8 relative">
            <Calculator className="w-12 h-12 text-white" />
            <div className="absolute inset-0 rounded-3xl bg-white/20 blur-sm" />
          </div>

          <h1
            className="text-5xl sm:text-6xl font-black text-[var(--color-text)] mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            割利缶
          </h1>

          {/* タグライン */}
          <p
            className="text-xl sm:text-2xl font-bold mb-6 text-[var(--color-secondary)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            勘定は割り切っても、縁は切らせない。
          </p>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-4 leading-relaxed max-w-md mx-auto">
            「楽しかった」の余韻だけを持ち帰る、
            <br />
            <span className="font-semibold text-[var(--color-primary)]">
              関係値保存ツール
            </span>
          </p>

          {/* キャッチコピー */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-[var(--color-border)] shadow-lg max-w-md mx-auto">
            <p
              className="text-lg sm:text-xl font-bold text-[var(--color-text)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              飲み会の価値は、
              <span className="text-[var(--color-primary)]">ラスト5分</span>
              で決まる。
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              3時間語り合った絆も、会計後の「モヤモヤ」で崩れてしまう。
              <br />
              割利缶は、その不安を排除します。
            </p>
          </div>

          <Link href="/create">
            <Button
              size="lg"
              className="text-lg px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] font-bold"
            >
              <span style={{ fontFamily: "var(--font-display)" }}>
                いますぐ使ってみる
              </span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="mt-4 text-xs text-[var(--color-text-light)]">
            会員登録不要・完全無料
          </p>
        </div>
      </section>

      {/* コアバリューセクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-3">
              Core Values
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              なぜ、割利缶なのか
            </h2>
          </div>

          <div className="space-y-6">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="group bg-gradient-to-br from-white to-[var(--color-base)] rounded-3xl p-8 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
                      {value.subtitle}
                    </p>
                    <h3
                      className="text-xl font-bold text-[var(--color-text)] mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3ステップフィニッシュセクション */}
      <section className="py-16 px-4 bg-gradient-to-br from-[var(--color-base)] to-[var(--color-base-dark)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm font-medium mb-3">
              3-Step Finish
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black text-[var(--color-text)] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              たった3タップで完了
            </h2>
            <p className="text-[var(--color-text-muted)]">
              酔っていても、誤操作しようがないユニバーサルデザイン
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex flex-col items-center justify-center text-white shadow-lg`}
                  >
                    <span className="text-2xl font-black">{step.number}</span>
                  </div>
                  <div className="mt-3 text-center">
                    <p
                      className="font-bold text-[var(--color-text)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-[var(--color-text-light)] hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UXストーリーセクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium mb-3">
              User Experience
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ある夜の物語
            </h2>
          </div>

          <div className="space-y-6">
            {/* シーン1 */}
            <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent rounded-2xl p-6 border-l-4 border-[var(--color-primary)]">
              <p className="text-sm font-semibold text-[var(--color-primary)] mb-2">
                🍻 宴もたけなわ
              </p>
              <p className="text-[var(--color-text)] leading-relaxed">
                そろそろお開き。「お会計！」の声とともに、幹事が割利缶を起動。
              </p>
            </div>

            {/* シーン2 */}
            <div className="bg-gradient-to-r from-[var(--color-secondary)]/5 to-transparent rounded-2xl p-6 border-l-4 border-[var(--color-secondary)]">
              <p className="text-sm font-semibold text-[var(--color-secondary)] mb-2">
                📱 会計の瞬間
              </p>
              <p className="text-[var(--color-text)] leading-relaxed">
                金額を入力し、全員に画面を見せる。
                <br />
                <span className="font-semibold">
                  「お、これなら分かりやすい！」
                </span>
                <br />
                誰もが計算プロセスを一目で理解し、即座に納得。
              </p>
            </div>

            {/* シーン3 */}
            <div className="bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent rounded-2xl p-6 border-l-4 border-[var(--color-accent)]">
              <p className="text-sm font-semibold text-[var(--color-accent)] mb-2">
                ✨ 解散・翌日
              </p>
              <p className="text-[var(--color-text)] leading-relaxed">
                「誰かが損をしたかも」というノイズは一切なし。
                <br />
                残るのは
                <span className="font-semibold text-[var(--color-primary)]">
                  「最高の夜だった」
                </span>
                という純粋な記憶だけ。
                <br />
                わだかまりがないから、グループLINEには
                <span className="font-semibold">「次はいつ集まる？」</span>
                の通知がすぐに届く。
              </p>
            </div>
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
            <h2
              className="text-2xl sm:text-3xl font-black text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
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
                <p
                  className="font-semibold text-sm text-[var(--color-text)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {useCase.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ネーミング解説セクション */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-3">
              Naming
            </span>
            <h2
              className="text-2xl sm:text-3xl font-black text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              「割利缶」に込めた想い
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[var(--color-base)] to-white rounded-2xl p-6 border border-[var(--color-border)] text-center">
              <div
                className="text-4xl font-black text-[var(--color-primary)] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                割
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                明快で公平な
                <br />
                <span className="font-semibold text-[var(--color-text)]">
                  「割り切り」
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--color-base)] to-white rounded-2xl p-6 border border-[var(--color-border)] text-center">
              <div
                className="text-4xl font-black text-[var(--color-secondary)] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                利
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                全員が納得という
                <br />
                <span className="font-semibold text-[var(--color-text)]">
                  「利益」を得る
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--color-base)] to-white rounded-2xl p-6 border border-[var(--color-border)] text-center">
              <div
                className="text-4xl font-black text-[var(--color-accent)] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                缶
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                わだかまりを缶に詰めて
                <br />
                <span className="font-semibold text-[var(--color-text)]">
                  ゴミ箱へ
                </span>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            同じ釜（缶）の飯を食った仲間の証
          </p>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-secondary)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>

          <h2
            className="text-2xl sm:text-3xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            「またコイツと飲みたい」
            <br />
            と思える円満な解散を。
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            会員登録不要・完全無料でご利用いただけます
          </p>
          <Link href="/create">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-12 py-6 bg-white text-[var(--color-primary)] hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
            >
              <span style={{ fontFamily: "var(--font-display)" }}>
                グループを作成する
              </span>
              <ArrowRight className="w-5 h-5 ml-2" />
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
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              割利缶
            </span>
          </div>
          <p
            className="text-white/60 text-sm"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            勘定は割り切っても、縁は切らせない。
          </p>
        </div>
      </footer>
    </main>
  );
}
