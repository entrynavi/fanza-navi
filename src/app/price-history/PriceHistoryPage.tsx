"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaHistory, FaArrowDown, FaTimes, FaStar, FaSortAmountDown } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import { useFavorites } from "@/hooks/useFavorites";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";
import {
  computePriceHistoryStats,
  generatePriceHistory,
  getNearHistoricalLowRate,
  type PricePoint,
} from "@/lib/toolkit-insights";

/* ------------------------------------------------------------------ */
/*  SVG Line Chart                                                     */
/* ------------------------------------------------------------------ */

function PriceChart({
  data,
  width = 400,
  height = 160,
  showLabels = false,
}: {
  data: PricePoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}) {
  const padTop = 16;
  const padBottom = showLabels ? 28 : 12;
  const padLeft = showLabels ? 48 : 8;
  const padRight = 8;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const prices = data.map((d) => d.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const toX = (i: number) => padLeft + (i / (data.length - 1)) * chartW;
  const toY = (p: number) => padTop + chartH - ((p - minP) / range) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.price).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${toX(data.length - 1).toFixed(1)},${(padTop + chartH).toFixed(1)} L${toX(0).toFixed(1)},${(padTop + chartH).toFixed(1)} Z`;

  const minIdx = prices.indexOf(minP);

  const labelStep = Math.max(1, Math.floor(data.length / 6));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`grad-${data[0]?.date}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill={`url(#grad-${data[0]?.date})`} />
      <path d={linePath} fill="none" stroke="var(--color-primary-light)" strokeWidth="2" strokeLinejoin="round" />

      {/* Min point marker */}
      <circle cx={toX(minIdx)} cy={toY(minP)} r="4" fill="var(--color-accent)" stroke="var(--color-bg-dark)" strokeWidth="2" />

      {showLabels && (
        <>
          {/* Y-axis labels */}
          {[minP, minP + range / 2, maxP].map((v, i) => (
            <text key={i} x={padLeft - 6} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="var(--color-text-muted)">
              ¥{v.toLocaleString()}
            </text>
          ))}
          {/* X-axis labels */}
          {data.filter((_, i) => i % labelStep === 0).map((d, i, arr) => (
            <text key={i} x={toX(data.indexOf(d))} y={height - 4} textAnchor="middle" fontSize="8" fill="var(--color-text-muted)">
              {d.date}
            </text>
          ))}
          {/* Min label */}
          <text x={toX(minIdx)} y={toY(minP) - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-accent)">
            過去最安値 ¥{minP.toLocaleString()}
          </text>
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sort options                                                       */
/* ------------------------------------------------------------------ */

type SortKey = "discount" | "price" | "nearMin";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "discount", label: "値下がり率順" },
  { key: "price", label: "価格順" },
  { key: "nearMin", label: "過去最安値に近い順" },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

interface ProductWithHistory {
  product: Product;
  history: PricePoint[];
  stats: ReturnType<typeof computePriceHistoryStats>;
  discountRate: number;
  nearMinRate: number;
}

export default function PriceHistoryPage({ products }: Props) {
  const { ids, isFavorite, toggle } = useFavorites();
  const [sortKey, setSortKey] = useState<SortKey>("discount");
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const items: ProductWithHistory[] = useMemo(
    () =>
      sourceProducts.map((product) => {
        const basePrice = product.salePrice ?? product.price;
        const history = generatePriceHistory(product.id, basePrice > 0 ? basePrice : 1980);
        const stats = computePriceHistoryStats(history);
        const currentPrice = history[history.length - 1].price;
        const discountRate = stats.max > 0 ? ((stats.max - currentPrice) / stats.max) * 100 : 0;
        const nearMinRate = getNearHistoricalLowRate(currentPrice, stats.min);
        return { product, history, stats, discountRate, nearMinRate };
      }),
    [sourceProducts]
  );

  const sorted = useMemo(() => {
    const copy = [...items];
    switch (sortKey) {
      case "discount":
        return copy.sort((a, b) => b.discountRate - a.discountRate);
      case "price":
        return copy.sort((a, b) => a.history[a.history.length - 1].price - b.history[b.history.length - 1].price);
      case "nearMin":
        return copy.sort((a, b) => a.nearMinRate - b.nearMinRate);
    }
  }, [items, sortKey]);

  useEffect(() => {
    if (expandedId && !items.some((item) => item.product.id === expandedId)) {
      setExpandedId(null);
    }
  }, [expandedId, items]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "価格履歴チャート" }]} />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-extrabold md:text-4xl">
          <FaChartLine className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">価格履歴チャート</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-[var(--color-text-secondary)]">
          過去90日間の価格推移をチェック。最安値タイミングを逃さず、お得に購入できます。
        </p>
      </motion.div>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズで価格履歴を見る"
        summary={
          source === "favorites"
            ? "ウォッチリストだけで最安値チェックできます。買う順番を決める用途に向けた導線です。"
            : `全取得作品 ${sourceProducts.length} 件から履歴を比較中。セール中だけ・新作だけにも切り替えられます。`
        }
      />

      {/* Sort controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-wrap items-center gap-2">
        <FaSortAmountDown className="text-[var(--color-text-muted)]" size={14} />
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              sortKey === opt.key
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </motion.div>

      {/* Product grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item, idx) => {
          const current = item.history[item.history.length - 1].price;
          const isExpanded = expandedId === item.product.id;

          return (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              className="glass-card overflow-hidden"
            >
              {/* Mini chart header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.product.id)}
                className="w-full cursor-pointer p-4 text-left"
              >
                <div className="mb-3 flex items-start gap-3">
                  {item.product.imageUrl && (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-12 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-text-primary)]">
                      {item.product.title}
                    </h3>
                    {item.product.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.product.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="chip text-[10px]">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mini chart */}
                <div className="mb-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                  <PriceChart data={item.history} width={360} height={100} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">現在価格</div>
                    <div className="text-sm font-bold text-[var(--color-text-primary)]">¥{current.toLocaleString()}~</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                      <FaArrowDown size={8} className="text-[var(--color-accent)]" />
                      過去最安値
                    </div>
                    <div className="text-sm font-bold text-[var(--color-accent)]">¥{item.stats.min.toLocaleString()}~</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">平均価格</div>
                    <div className="text-sm font-bold text-[var(--color-text-secondary)]">¥{item.stats.avg.toLocaleString()}~</div>
                  </div>
                </div>

                {item.discountRate > 5 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-[var(--color-primary-light)]">
                    <FaArrowDown size={10} />
                    最高値から{Math.round(item.discountRate)}%値下がり中
                  </div>
                )}
              </button>

              {/* Expanded view */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[var(--color-border)] p-4">
                      {/* Full chart */}
                      <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                        <PriceChart data={item.history} width={500} height={220} showLabels />
                      </div>

                      {/* Detailed stats */}
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
                          <div className="text-[10px] text-[var(--color-text-muted)]">最高値</div>
                          <div className="text-sm font-bold text-[var(--color-text-primary)]">¥{item.stats.max.toLocaleString()}~</div>
                        </div>
                        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
                          <div className="text-[10px] text-[var(--color-text-muted)]">最安値の日</div>
                          <div className="text-sm font-bold text-[var(--color-accent)]">{item.stats.minDate}</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(item.product.id);
                          }}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-colors ${
                            isFavorite(item.product.id)
                              ? "border border-[var(--color-accent)] bg-[var(--color-surface-highlight)] text-[var(--color-accent)]"
                              : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
                          }`}
                        >
                          <FaHistory size={12} />
                          {isFavorite(item.product.id) ? "ウォッチリストに追加済み" : "この作品をウォッチリストに追加"}
                        </button>
                        <a
                          href={item.product.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
                        >
                          FANZAで見る
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="glass-card p-12 text-center">
          <FaChartLine className="mx-auto mb-4 text-4xl text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">価格履歴データがありません</p>
        </div>
      )}
    </main>
  );
}
