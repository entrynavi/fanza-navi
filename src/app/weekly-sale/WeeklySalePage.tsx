"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaFire, FaSortAmountDown, FaTag, FaCalendarAlt } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import {
  getDiscountPercent,
  getPresentedCurrentPrice,
} from "@/lib/product-presenter";
import { ROUTES } from "@/lib/site";

type SortOption = "discount" | "price-asc" | "price-desc" | "review" | "rating";

const sortLabels: Record<SortOption, string> = {
  discount: "割引率が高い順",
  "price-asc": "価格が安い順",
  "price-desc": "価格が高い順",
  review: "レビュー数が多い順",
  rating: "評価が高い順",
};

function getDiscountRate(p: Product): number {
  if (!p.salePrice || p.price <= 0) return 0;
  return ((p.price - p.salePrice) / p.price) * 100;
}

function getWeekRange(): { start: Date; end: Date; label: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return monday.getFullYear() === sunday.getFullYear() &&
      monday.getMonth() === sunday.getMonth()
      ? `${m}月${day}日`
      : `${y}年${m}月${day}日`;
  };

  const startYear = monday.getFullYear();
  const label = `${startYear}年${fmt(monday)}〜${fmt(sunday)}`;

  return { start: monday, end: sunday, label };
}

export default function WeeklySalePage({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("discount");
  const week = useMemo(() => getWeekRange(), []);

  const stats = useMemo(() => {
    const discounts = products
      .map((p) => getDiscountRate(p))
      .filter((d) => d > 0);
    const maxDiscount = discounts.length > 0 ? Math.round(Math.max(...discounts)) : 0;
    const avgDiscount =
      discounts.length > 0
        ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)
        : 0;
    return { total: products.length, maxDiscount, avgDiscount };
  }, [products]);

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case "discount":
        return copy.sort((a, b) => getDiscountRate(b) - getDiscountRate(a));
      case "price-asc":
        return copy.sort(
          (a, b) => getPresentedCurrentPrice(a) - getPresentedCurrentPrice(b)
        );
      case "price-desc":
        return copy.sort(
          (a, b) => getPresentedCurrentPrice(b) - getPresentedCurrentPrice(a)
        );
      case "review":
        return copy.sort((a, b) => b.reviewCount - a.reviewCount);
      case "rating":
        return copy.sort((a, b) => b.rating - a.rating);
      default:
        return copy;
    }
  }, [products, sort]);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "今週のセールまとめ" }]} />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-surface p-6 md:p-8"
      >
        <p className="section-eyebrow flex items-center gap-2">
          <FaCalendarAlt size={14} />
          週間セールまとめ
        </p>
        <h1 className="section-title gradient-text text-2xl md:text-3xl">
          🔥 今週のFANZAセール完全まとめ
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          対象期間：{week.label}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          今週開催中のFANZAセール・割引作品を完全網羅。割引率・価格・レビュー数で並べ替えて、あなたにぴったりのお得作品を見つけましょう。
        </p>
      </motion.section>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-4 grid grid-cols-3 gap-3"
      >
        {[
          {
            icon: <FaTag size={16} className="text-[var(--color-primary)]" />,
            value: `${stats.total}件`,
            label: "セール対象作品",
          },
          {
            icon: <FaFire size={16} className="text-[var(--color-accent)]" />,
            value: `最大${stats.maxDiscount}%`,
            label: "最大割引率",
          },
          {
            icon: (
              <FaSortAmountDown
                size={16}
                className="text-[var(--color-primary)]"
              />
            ),
            value: `平均${stats.avgDiscount}%`,
            label: "平均割引率",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card flex flex-col items-center gap-2 p-4 text-center"
          >
            {stat.icon}
            <p className="text-lg font-bold text-[var(--color-text-primary)]">
              {stat.value}
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Sort Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          セール作品一覧
          <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
            ({sorted.length}件)
          </span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(
            ([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  sort === key
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">
            セール作品を取得中です。しばらくお待ちください。
          </p>
        </div>
      )}

      {/* 先週のまとめ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 editorial-surface p-6 md:p-8"
      >
        <SectionIntro
          eyebrow="アーカイブ"
          title="📁 先週のまとめ"
          description="過去のセール情報アーカイブ機能は準備中です。今後のアップデートで、週ごとのセール履歴を振り返れるようになります。セールの傾向分析にもご活用いただけるようになる予定です。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">📊 過去データの分析</span>
          <span className="chip">📈 割引トレンド</span>
          <span className="chip">🔔 セール通知（予定）</span>
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
          🎁 まだFANZA未登録？
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          無料会員登録で初回限定クーポンがもらえます。セール割引と併用すれば、さらにお得に購入できます。
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
