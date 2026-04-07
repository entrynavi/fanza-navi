"use client";

import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

const vrComparison = [
  { feature: "没入感", vr: "◎ 圧倒的", normal: "△ 画面視聴" },
  { feature: "画質", vr: "◎ 8K対応", normal: "◎ 4K対応" },
  { feature: "対応デバイス", vr: "VRゴーグル必要", normal: "スマホ/PC" },
  { feature: "作品数", vr: "△ やや少なめ", normal: "◎ 非常に多い" },
  { feature: "価格帯", vr: "¥980〜¥3,980", normal: "¥500〜¥2,980" },
  { feature: "サンプル", vr: "◎ 無料VRサンプル", normal: "◎ 無料サンプル" },
  { feature: "おすすめ度", vr: "★★★★★", normal: "★★★★☆" },
];

const planComparison = [
  { feature: "月額料金", sub: "¥2,980〜", single: "作品ごと" },
  { feature: "視聴可能数", sub: "見放題対象全作品", single: "購入作品のみ" },
  { feature: "最新作", sub: "△ 遅れて追加", single: "◎ 発売日から" },
  { feature: "永久視聴", sub: "× 解約で不可", single: "◎ 永久保有" },
  { feature: "コスパ (月5本)", sub: "◎ 圧倒的", single: "△ 高くなる" },
  { feature: "コスパ (月1本)", sub: "△ 割高", single: "◎ お得" },
  { feature: "おすすめ", sub: "ヘビーユーザー向け", single: "ライトユーザー向け" },
];

export default function ComparePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "徹底比較" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          ⚖️ <span className="gradient-text">徹底比較</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          あなたに最適な楽しみ方を見つけよう
        </p>
      </motion.div>

      {/* Personal intro */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-10 border-purple-500/20"
      >
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <span className="text-purple-400 font-bold">💬 筆者より：</span>
          「VRと通常、どっちがいいの？」「月額と単品、どっちが得？」——FANZAを使い始めた頃、
          私もこの疑問でかなり悩みました。両方を1年以上使い込んだ実体験をもとに、
          それぞれのメリット・デメリットを正直にまとめました。結論から言うと、
          「まずは通常作品で試して、気に入ったらVRに挑戦」が最もリスクの少ないスタートです。
        </p>
      </motion.div>

      {/* VR vs Normal */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🥽 VR作品 vs 通常作品
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-3 gap-0 text-sm">
            <div className="p-4 font-bold bg-white/5 text-center border-b border-[var(--color-border)]">
              比較項目
            </div>
            <div className="p-4 font-bold bg-purple-500/10 text-center text-purple-400 border-b border-[var(--color-border)]">
              🥽 VR作品
            </div>
            <div className="p-4 font-bold bg-blue-500/10 text-center text-blue-400 border-b border-[var(--color-border)]">
              🎬 通常作品
            </div>
            {vrComparison.map((row, i) => (
              <>
                <div
                  key={`f-${i}`}
                  className="p-3 text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]/50 flex items-center justify-center text-center"
                >
                  {row.feature}
                </div>
                <div
                  key={`v-${i}`}
                  className="p-3 text-xs text-center border-b border-[var(--color-border)]/50 flex items-center justify-center"
                >
                  {row.vr}
                </div>
                <div
                  key={`n-${i}`}
                  className="p-3 text-xs text-center border-b border-[var(--color-border)]/50 flex items-center justify-center"
                >
                  {row.normal}
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <a
            href="/ranking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
          >
            VR作品ランキングを見る <FaArrowRight size={12} />
          </a>
        </div>
      </section>

      {/* Subscription vs Single */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          💳 月額見放題 vs 単品購入
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="grid grid-cols-3 gap-0 text-sm">
            <div className="p-4 font-bold bg-white/5 text-center border-b border-[var(--color-border)]">
              比較項目
            </div>
            <div className="p-4 font-bold bg-green-500/10 text-center text-green-400 border-b border-[var(--color-border)]">
              📺 月額見放題
            </div>
            <div className="p-4 font-bold bg-yellow-500/10 text-center text-yellow-400 border-b border-[var(--color-border)]">
              🛒 単品購入
            </div>
            {planComparison.map((row, i) => (
              <>
                <div
                  key={`f2-${i}`}
                  className="p-3 text-xs text-[var(--color-text-secondary)] border-b border-[var(--color-border)]/50 flex items-center justify-center text-center"
                >
                  {row.feature}
                </div>
                <div
                  key={`s-${i}`}
                  className="p-3 text-xs text-center border-b border-[var(--color-border)]/50 flex items-center justify-center"
                >
                  {row.sub}
                </div>
                <div
                  key={`p-${i}`}
                  className="p-3 text-xs text-center border-b border-[var(--color-border)]/50 flex items-center justify-center"
                >
                  {row.single}
                </div>
              </>
            ))}
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="glass-card p-8 text-center mb-12 border-[var(--color-primary)]/20">
        <h2 className="text-xl font-extrabold mb-4">📝 結論</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left text-sm">
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <p className="font-bold text-purple-400 mb-2">
              VR + 単品購入がおすすめ
            </p>
            <p className="text-[var(--color-text-secondary)]">
              初めての方はまずVRサンプルを試して、気に入った作品を単品購入するのがベスト。セール時に狙えばコスパ最強。
            </p>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <p className="font-bold text-green-400 mb-2">
              ヘビーユーザーは見放題
            </p>
            <p className="text-[var(--color-text-secondary)]">
              月に5本以上見るなら月額見放題がお得。ただし最新作は対象外が多いので、新作は別途購入を。
            </p>
          </div>
        </div>
        <a
          href="https://www.dmm.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity text-lg pulse-glow"
        >
          FANZAでお得に始める <FaArrowRight />
        </a>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">※ PR</p>
      </section>
    </main>
  );
}
