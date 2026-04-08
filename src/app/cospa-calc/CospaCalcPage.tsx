"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalculator,
  FaClock,
  FaCoins,
  FaTrophy,
  FaSortAmountDown,
  FaExternalLinkAlt,
  FaStar,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";

/* ------------------------------------------------------------------ */
/*  Deterministic duration from product id                             */
/* ------------------------------------------------------------------ */

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDuration(productId: string): number {
  const h = hashCode(productId);
  return 60 + (h % 301); // 60–360 minutes
}

/* ------------------------------------------------------------------ */
/*  Sort modes                                                         */
/* ------------------------------------------------------------------ */

type SortMode = "cospa" | "price" | "duration";

const SORT_LABELS: Record<SortMode, string> = {
  cospa: "コスパ順",
  price: "価格順",
  duration: "時間順",
};

/* ------------------------------------------------------------------ */
/*  Badge component for top 3                                          */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-amber-600",
  };
  if (rank > 3) return null;
  return (
    <div className="absolute -left-2 -top-2 z-10">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-lg ${colors[rank]}`}
      >
        <FaTrophy size={18} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

export default function CospaCalcPage({ products }: Props) {
  const { ids } = useFavorites();
  const [sortMode, setSortMode] = useState<SortMode>("cospa");
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");

  const sourceOptions = useMemo(
    () => getProductPoolOptions(products, ids),
    [ids, products]
  );
  const sourceProducts = useMemo(
    () =>
      filterProductPool(products, {
        source,
        query,
        favoriteIds: ids,
      }),
    [ids, products, query, source]
  );

  const enriched = useMemo(
    () =>
      sourceProducts
        .filter((p) => p.price > 0)
        .map((p) => {
          const duration = getDuration(p.id);
          const effectivePrice = p.salePrice ?? p.price;
          const costPerMinute = effectivePrice / duration;
          return { ...p, duration, costPerMinute, effectivePrice };
        }),
    [sourceProducts]
  );

  const sorted = useMemo(() => {
    const list = [...enriched];
    switch (sortMode) {
      case "cospa":
        list.sort((a, b) => a.costPerMinute - b.costPerMinute);
        break;
      case "price":
        list.sort((a, b) => a.effectivePrice - b.effectivePrice);
        break;
      case "duration":
        list.sort((a, b) => b.duration - a.duration);
        break;
    }
    return list;
  }, [enriched, sortMode]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: "コスパ計算機" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          <FaCalculator className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">コスパ計算機</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          1分あたりの価格で作品をランキング！お得な作品が一目でわかる
        </p>
      </motion.div>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズでコスパ比較"
        summary={
          source === "favorites"
            ? "ウォッチリスト内だけでコスパ比較できるので、買う候補の優先順位を決めやすくしています。"
            : `全取得作品 ${sourceProducts.length} 件から比較中。セール品だけ、高評価だけにも切り替えられます。`
        }
      />

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="glass-card flex items-center gap-3 p-4">
          <FaCoins className="text-2xl text-yellow-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              最安コスパ
            </p>
            <p className="text-lg font-bold text-white">
              ¥
              {sorted.length > 0
                ? sorted[0].costPerMinute.toFixed(1)
                : "---"}
              <span className="text-xs text-[var(--color-text-secondary)]">
                /分
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaClock className="text-2xl text-[var(--color-primary)]" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">平均再生時間</p>
            <p className="text-lg font-bold text-white">
              {enriched.length > 0
                ? Math.round(
                    enriched.reduce((s, p) => s + p.duration, 0) /
                      enriched.length
                  )
                : "---"}
              <span className="text-xs text-[var(--color-text-secondary)]">
                分
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaCalculator className="text-2xl text-green-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              対象作品数
            </p>
            <p className="text-lg font-bold text-white">{sorted.length}作品</p>
          </div>
        </div>
      </motion.div>

      {/* Sort controls */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <FaSortAmountDown className="text-[var(--color-text-secondary)]" />
        {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setSortMode(mode)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              sortMode === mode
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
            }`}
          >
            {SORT_LABELS[mode]}
          </button>
        ))}
      </motion.div>

      {/* Product list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sorted.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: Math.min(index * 0.03, 0.5) }}
              className={`glass-card relative overflow-hidden p-4 md:p-5 ${
                index < 3
                  ? "border-[var(--color-primary)]/30 ring-1 ring-[var(--color-primary)]/10"
                  : ""
              }`}
            >
              <RankBadge rank={index + 1} />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Rank number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg font-extrabold text-[var(--color-text-secondary)]">
                  {index + 1}
                </div>

                {/* Image */}
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 line-clamp-2 text-sm font-bold text-white">
                    {product.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <FaCoins className="text-yellow-400" />
                      {product.salePrice ? (
                        <>
                          <span className="line-through">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <span className="font-bold text-[var(--color-accent)]">
                            ¥{product.salePrice.toLocaleString()}~
                          </span>
                        </>
                      ) : (
                        <span>¥{product.price.toLocaleString()}~</span>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[var(--color-primary)]" />
                      {product.duration}分
                    </span>
                    {product.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        {product.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cost per minute badge */}
                <div className="flex shrink-0 flex-col items-center gap-2 sm:items-end">
                  <div
                    className={`rounded-xl px-4 py-2 text-center ${
                      index < 3
                        ? "bg-[var(--color-primary)]/20 ring-1 ring-[var(--color-primary)]/30"
                        : "bg-white/5"
                    }`}
                  >
                    <p className="text-xs text-[var(--color-text-muted)]">
                      1分あたり
                    </p>
                    <p
                      className={`text-xl font-extrabold ${
                        index < 3
                          ? "text-[var(--color-primary)]"
                          : "text-white"
                      }`}
                    >
                      ¥{product.costPerMinute.toFixed(1)}
                    </p>
                  </div>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:brightness-110"
                  >
                    詳細を見る
                    <FaExternalLinkAlt size={10} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sorted.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <FaCalculator className="mx-auto mb-3 text-4xl text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            現在表示できる作品がありません
          </p>
        </motion.div>
      )}

      {/* PR note */}
      <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
        ※ 再生時間は推定値です ※ PR
      </p>
    </main>
  );
}
