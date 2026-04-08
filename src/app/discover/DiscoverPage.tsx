"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGridSection from "@/components/ProductGridSection";
import PrimaryCta from "@/components/PrimaryCta";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

interface Situation {
  id: string;
  emoji: string;
  label: string;
  description: string;
  filter: (products: Product[]) => Product[];
}

const situations: Situation[] = [
  {
    id: "first-time",
    emoji: "🌟",
    label: "初めてのFANZA",
    description: "高評価・レビュー多めの安心ピック",
    filter: (products) =>
      [...products]
        .filter((p) => p.reviewCount >= 5 && p.rating >= 3.5)
        .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        .slice(0, 30),
  },
  {
    id: "quick",
    emoji: "⚡",
    label: "サクッと短時間",
    description: "お手頃価格でサクッと楽しめる",
    filter: (products) =>
      [...products]
        .filter((p) => p.price > 0 && p.price < 1500)
        .sort((a, b) => a.price - b.price)
        .slice(0, 30),
  },
  {
    id: "sweet",
    emoji: "💕",
    label: "甘い雰囲気",
    description: "恋愛系・ドラマティックな作品",
    filter: (products) =>
      products
        .filter(
          (p) =>
            p.title.includes("恋愛") ||
            p.title.includes("恋") ||
            p.tags.some((t) => t.includes("恋愛") || t.includes("ドラマ") || t.includes("ラブ"))
        )
        .slice(0, 30),
  },
  {
    id: "intense",
    emoji: "🔥",
    label: "刺激的な作品",
    description: "ハード系・高評価の刺激的な作品",
    filter: (products) =>
      [...products]
        .filter(
          (p) =>
            p.title.includes("ハード") ||
            p.tags.some((t) => t.includes("ハード")) ||
            p.rating >= 4.0
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 30),
  },
  {
    id: "cospa",
    emoji: "💎",
    label: "コスパ重視",
    description: "安くて高評価のお得な作品",
    filter: (products) =>
      [...products]
        .filter((p) => p.price > 0 && p.rating >= 3.5)
        .sort((a, b) => a.price - b.price || b.rating - a.rating)
        .slice(0, 30),
  },
  {
    id: "trending",
    emoji: "🆕",
    label: "最新トレンド",
    description: "新着＆レビューが伸びている作品",
    filter: (products) =>
      [...products]
        .filter((p) => p.isNew)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 30),
  },
  {
    id: "classic",
    emoji: "👑",
    label: "殿堂入り名作",
    description: "レビュー30件超・評価4.0以上の名作",
    filter: (products) =>
      [...products]
        .filter((p) => p.reviewCount > 30 && p.rating >= 4.0)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 30),
  },
  {
    id: "vr",
    emoji: "🎮",
    label: "VR体験",
    description: "VR対応の没入感ある作品",
    filter: (products) =>
      products
        .filter(
          (p) =>
            p.title.includes("VR") ||
            p.tags.some((t) => t.includes("VR")) ||
            p.genre === "vr"
        )
        .slice(0, 30),
  },
  {
    id: "sale",
    emoji: "🏷️",
    label: "セール品から選ぶ",
    description: "いまお得に買えるセール中の作品",
    filter: (products) =>
      [...products]
        .filter((p) => p.isSale)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 30),
  },
];

export default function DiscoverPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const [activeSituation, setActiveSituation] = useState<string | null>(null);

  const active = situations.find((s) => s.id === activeSituation);
  const filteredProducts = active ? active.filter(allProducts) : [];

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[{ label: "シチュエーション検索" }]}
      />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <div className="max-w-3xl">
          <p className="section-eyebrow">シチュエーション検索</p>
          <h1 className="section-title gradient-text text-3xl md:text-4xl">
            気分で作品を探す
          </h1>
          <p className="section-description mt-3">
            ジャンルや女優名じゃなく、今の気分やシチュエーションから最適な作品を見つけよう
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {situations.map((situation) => (
            <motion.button
              key={situation.id}
              onClick={() =>
                setActiveSituation(
                  activeSituation === situation.id ? null : situation.id
                )
              }
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`glass-card relative cursor-pointer p-5 text-left transition-all duration-300 ${
                activeSituation === situation.id
                  ? "border-[var(--color-primary)] shadow-[0_0_24px_rgba(158,68,90,0.25)]"
                  : "hover:shadow-[0_0_20px_rgba(158,68,90,0.12)]"
              }`}
            >
              <span className="text-3xl">{situation.emoji}</span>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
                {situation.label}
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                {situation.description}
              </p>
              {activeSituation === situation.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                />
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {active && (
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProductGridSection
            eyebrow={`${active.emoji} ${active.label}`}
            title={`${active.label}の作品`}
            description={active.description}
            products={filteredProducts}
            emptyMessage="条件に合う作品が見つかりませんでした。別のシチュエーションを試してみてください。"
            action={
              <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
                ランキングで探す
              </PrimaryCta>
            }
          />
        </motion.div>
      )}

      {!active && (
        <section className="editorial-surface p-6 md:p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <FaStar className="inline mr-1 text-[var(--color-accent)]" size={14} />
            上のカードをタップして、気分に合った作品を見つけよう
          </p>
        </section>
      )}

    </main>
  );
}
