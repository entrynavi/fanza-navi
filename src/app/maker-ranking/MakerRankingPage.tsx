"use client";

import { motion } from "framer-motion";
import { FaStar, FaCommentDots, FaYenSign, FaFilm, FaTrophy, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import { ROUTES, getMakerRoute } from "@/lib/site";

export interface MakerRankingData {
  name: string;
  productCount: number;
  averagePrice: number;
  averageRating: number;
  averageReviewCount: number;
}

function formatPrice(price: number): string {
  return `¥${Math.round(price).toLocaleString()}`;
}

function ComparisonCard({
  title,
  emoji,
  makers,
  metric,
  formatValue,
}: {
  title: string;
  emoji: string;
  makers: MakerRankingData[];
  metric: (m: MakerRankingData) => number;
  formatValue: (m: MakerRankingData) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="mb-4 text-base font-semibold text-[var(--color-text-primary)]">
        <span className="mr-2">{emoji}</span>
        {title}
      </h3>
      <div className="space-y-3">
        {makers.map((maker, i) => (
          <a
            key={maker.name}
            href={getMakerRoute(maker.name)}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-strong)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-xs font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {maker.name}
              </p>
            </div>
            <span className="text-sm font-semibold text-[var(--color-accent)]">
              {formatValue(maker)}
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

export default function MakerRankingPage({
  makers,
}: {
  makers: MakerRankingData[];
}) {
  const topByRating = [...makers]
    .filter((m) => m.productCount >= 2)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  const topByCospa = [...makers]
    .filter((m) => m.averageRating >= 3.0 && m.averagePrice > 0)
    .sort((a, b) => a.averagePrice - b.averagePrice)
    .slice(0, 3);

  const topByReview = [...makers]
    .sort((a, b) => b.averageReviewCount - a.averageReviewCount)
    .slice(0, 3);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ランキング", href: ROUTES.ranking },
          { label: "メーカー比較ガイド" },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <SectionIntro
          eyebrow="Maker Comparison"
          title="メーカー比較ガイド"
          description="ランキング上位作品からメーカーごとの特徴を集計。作品数・価格帯・評価・レビュー数で比較できます。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              作品ランキングへ
            </PrimaryCta>
          }
        />
      </section>

      <section className="mb-10">
        <SectionIntro
          eyebrow="Stats Table"
          title="メーカー別スタッツ"
          description="人気作品への登場回数が多い順に並べています。"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="pb-3 pr-4 font-semibold">ランク</th>
                <th className="pb-3 pr-4 font-semibold">メーカー名</th>
                <th className="pb-3 pr-4 font-semibold text-right">作品数</th>
                <th className="pb-3 pr-4 font-semibold text-right">平均価格</th>
                <th className="pb-3 pr-4 font-semibold text-right">平均評価</th>
                <th className="pb-3 font-semibold text-right">平均レビュー数</th>
              </tr>
            </thead>
            <tbody>
              {makers.map((maker, index) => (
                <motion.tr
                  key={maker.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-[var(--color-border)]/50 transition-colors hover:bg-[var(--color-surface)]"
                >
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        index < 3
                          ? "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={getMakerRoute(maker.name)}
                      className="font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {maker.name}
                    </a>
                  </td>
                  <td className="py-3 pr-4 text-right text-[var(--color-text-secondary)]">
                    <span className="flex items-center justify-end gap-1">
                      <FaFilm size={10} className="text-[var(--color-text-muted)]" />
                      {maker.productCount}本
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right text-[var(--color-text-secondary)]">
                    <span className="flex items-center justify-end gap-1">
                      <FaYenSign size={10} className="text-[var(--color-text-muted)]" />
                      {formatPrice(maker.averagePrice)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="flex items-center justify-end gap-1">
                      <FaStar size={10} className="text-[var(--color-accent)]" />
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {maker.averageRating.toFixed(1)}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 text-right text-[var(--color-text-secondary)]">
                    <span className="flex items-center justify-end gap-1">
                      <FaCommentDots size={10} className="text-[var(--color-text-muted)]" />
                      {maker.averageReviewCount.toFixed(1)}件
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <SectionIntro
          eyebrow="Comparison"
          title="カテゴリ別 TOP3"
          description="評価・価格・レビュー数の3軸でメーカーを比較できます。"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <ComparisonCard
            title="高評価メーカー TOP3"
            emoji="⭐"
            makers={topByRating}
            metric={(m) => m.averageRating}
            formatValue={(m) => `★${m.averageRating.toFixed(1)}`}
          />
          <ComparisonCard
            title="コスパ最強メーカー TOP3"
            emoji="💎"
            makers={topByCospa}
            metric={(m) => m.averagePrice}
            formatValue={(m) => formatPrice(m.averagePrice)}
          />
          <ComparisonCard
            title="レビュー人気メーカー TOP3"
            emoji="💬"
            makers={topByReview}
            metric={(m) => m.averageReviewCount}
            formatValue={(m) => `${m.averageReviewCount.toFixed(1)}件`}
          />
        </div>
      </section>

      <section className="editorial-surface p-6 md:p-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          メーカーの特徴が掴めたら、初心者ガイドで購入の流れもチェック
        </p>
        <PrimaryCta href={ROUTES.guide} size="md">
          初心者ガイドへ
        </PrimaryCta>
      </section>

      <Footer />
    </main>
  );
}
