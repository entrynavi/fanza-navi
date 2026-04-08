"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";

type TabKey = "cospa" | "hidden-gem" | "big-discount" | "newcomer";

interface TabDef {
  key: TabKey;
  icon: string;
  label: string;
  description: string;
}

const tabs: TabDef[] = [
  {
    key: "cospa",
    icon: "💰",
    label: "コスパランキング",
    description:
      "レビュー付き作品のうち、価格あたりの評価スコアが高い順にランキング。安くて評価が良い作品が見つかります。",
  },
  {
    key: "hidden-gem",
    icon: "💎",
    label: "隠れた名作",
    description:
      "評価4.0以上かつレビュー数1〜19件の作品をピックアップ。まだ多くの人に知られていない高評価作品です。",
  },
  {
    key: "big-discount",
    icon: "🔥",
    label: "大幅値下げBEST",
    description:
      "現在セール中の作品から、割引率が高い順にランキング。最大限お得に購入できる作品をチェック。",
  },
  {
    key: "newcomer",
    icon: "⭐",
    label: "新人注目作",
    description:
      "直近1週間以内にリリースされた新作の中から、評価・レビュー数が高い順にランキング。注目の新人作品を発見。",
  },
];

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "from-[#d3af6f] to-[#b8943f]",
    2: "from-[#bdb7af] to-[#9a938b]",
    3: "from-[#b17852] to-[#8a5c3c]",
  };
  const bg =
    colors[rank] ??
    "from-[var(--color-surface-strong)] to-[var(--color-surface)]";

  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${bg} text-xs font-bold text-white shadow`}
    >
      {rank}位
    </span>
  );
}

export default function CustomRankingPage({
  cospaRanking,
  hiddenGemRanking,
  bigDiscountRanking,
  newcomerRanking,
}: {
  cospaRanking: Product[];
  hiddenGemRanking: Product[];
  bigDiscountRanking: Product[];
  newcomerRanking: Product[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("cospa");

  const dataMap: Record<TabKey, Product[]> = {
    cospa: cospaRanking,
    "hidden-gem": hiddenGemRanking,
    "big-discount": bigDiscountRanking,
    newcomer: newcomerRanking,
  };

  const currentTab = tabs.find((t) => t.key === activeTab)!;
  const currentProducts = dataMap[activeTab];

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "独自ランキング" }]} />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-surface p-6 md:p-8"
      >
        <SectionIntro
          eyebrow="FANZAオトナビ独自"
          title="🏅 独自ランキング"
          description="公式の売上ランキングとは異なる独自視点で、コスパ・隠れた名作・大幅値下げ・新人注目作の4カテゴリをお届けします。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">💰 コスパで選ぶ</span>
          <span className="chip">💎 埋もれた名作を発掘</span>
          <span className="chip">🔥 セールの目玉</span>
          <span className="chip">⭐ 新作チェック</span>
        </div>
      </motion.section>

      {/* Tab Controls */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <p className="text-sm font-bold text-[var(--color-text-primary)]">
            {currentTab.icon} {currentTab.label}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            {currentTab.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Product Grid with Rank Badges */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {currentProducts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentProducts.map((product, index) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-3 left-3 z-20">
                    <RankBadge rank={index + 1} />
                  </div>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <p className="text-[var(--color-text-secondary)]">
                該当する作品が見つかりませんでした。
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Info */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 editorial-surface p-6 md:p-8"
      >
        <SectionIntro
          eyebrow="自動更新"
          title="📊 このランキングは毎日自動更新されます"
          description="DMM APIから取得した最新データに基づき、毎日ランキングを再計算しています。ブックマークして定期的にチェックしてみてください。"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
            🏆 公式売上ランキング
          </PrimaryCta>
          <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
            🔥 セール一覧
          </PrimaryCta>
        </div>
      </motion.section>

      {/* Bottom CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 md:p-8 text-center"
      >
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          🎁 FANZA未登録なら初回クーポンでさらにお得！
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          無料会員登録で使えるクーポンと、セール割引を併用すれば最大80%OFF以上も。
        </p>
        <div className="mt-4">
          <PrimaryCta href={ROUTES.guide} size="lg">
            無料登録ガイドを見る
          </PrimaryCta>
        </div>
      </motion.section>
    </main>
  );
}
