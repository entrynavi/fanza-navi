"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCoins,
  FaThermometerHalf,
  FaChartLine,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaCalendarAlt,
  FaFire,
  FaFilter,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";
import {
  formatPriceYen,
  getDiscountPercent,
  getPresentedCurrentPrice,
} from "@/lib/product-presenter";
import {
  MONTH_NAMES,
  getUpcomingSales,
} from "@/lib/sale-calendar";
import { ROUTES } from "@/lib/site";
import {
  buildBundleUnderBudget,
  calcBuyTimingScore,
  computePriceHistoryStats,
  generatePriceHistory,
  getNearHistoricalLowRate,
  type TimingBreakdown,
} from "@/lib/toolkit-insights";

type Verdict = "buy" | "wait" | "skip";

function getVerdict(score: number): Verdict {
  if (score > 70) return "buy";
  if (score >= 40) return "wait";
  return "skip";
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  buy: {
    label: "今が買い時！",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  wait: {
    label: "もう少し待とう",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  skip: {
    label: "セールを待とう",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

/* ------------------------------------------------------------------ */
/*  Breakdown bar                                                      */
/* ------------------------------------------------------------------ */

function BreakdownItem({
  label,
  points,
  maxPoints,
  icon,
}: {
  label: string;
  points: number;
  maxPoints: number;
  icon: React.ReactNode;
}) {
  const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex w-20 items-center gap-1 text-[var(--color-text-muted)]">
        {icon}
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-[var(--color-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="w-10 text-right font-bold text-[var(--color-text-secondary)]">
        +{points}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verdict badge                                                      */
/* ------------------------------------------------------------------ */

function VerdictBadge({ score }: { score: number }) {
  const verdict = getVerdict(score);
  const cfg = VERDICT_CONFIG[verdict];
  const Icon =
    verdict === "buy"
      ? FaCheckCircle
      : verdict === "wait"
        ? FaClock
        : FaTimesCircle;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${cfg.borderColor} ${cfg.bgColor} ${cfg.color}`}
    >
      <Icon />
      {cfg.label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

export default function BuyTimingPage({ products }: Props) {
  const { ids } = useFavorites();
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(5000);

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

  const scoredProducts = useMemo(
    () =>
      sourceProducts.map((p) => ({
        ...p,
        breakdown: calcBuyTimingScore(p),
      })),
    [sourceProducts]
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    scoredProducts.forEach((p) => {
      if (p.genre) set.add(p.genre);
    });
    return Array.from(set);
  }, [scoredProducts]);

  useEffect(() => {
    if (selectedGenre !== "all" && !genres.includes(selectedGenre)) {
      setSelectedGenre("all");
    }
  }, [genres, selectedGenre]);

  const filtered = useMemo(() => {
    const list =
      selectedGenre === "all"
        ? scoredProducts
        : scoredProducts.filter((p) => p.genre === selectedGenre);
    return [...list].sort(
      (a, b) => b.breakdown.total - a.breakdown.total
    );
  }, [scoredProducts, selectedGenre]);

  const buyCount = filtered.filter(
    (p) => p.breakdown.total > 70
  ).length;
  const waitCount = filtered.filter(
    (p) => p.breakdown.total >= 40 && p.breakdown.total <= 70
  ).length;
  const skipCount = filtered.filter(
    (p) => p.breakdown.total < 40
  ).length;
  const favoriteProducts = useMemo(
    () => products.filter((product) => ids.includes(product.id)),
    [ids, products]
  );
  const favoritePriority = useMemo(
    () =>
      [...favoriteProducts]
        .map((product) => ({
          product,
          score: calcBuyTimingScore(product).total,
        }))
        .sort((left, right) => right.score - left.score)
        .slice(0, 6)
        .map((entry) => entry.product),
    [favoriteProducts]
  );
  const budgetBundle = useMemo(
    () => buildBundleUnderBudget(sourceProducts, budget, 3),
    [budget, sourceProducts]
  );
  const bundleTotal = useMemo(
    () =>
      budgetBundle.reduce(
        (sum, product) => sum + getPresentedCurrentPrice(product),
        0
      ),
    [budgetBundle]
  );
  const priceOpportunityProducts = useMemo(
    () =>
      sourceProducts
        .map((product) => {
          const basePrice = getPresentedCurrentPrice(product);
          const history = generatePriceHistory(product.id, basePrice > 0 ? basePrice : 1980);
          const stats = computePriceHistoryStats(history);
          const nearMinRate = getNearHistoricalLowRate(basePrice, stats.min);
          return { product, nearMinRate };
        })
        .sort((left, right) => left.nearMinRate - right.nearMinRate)
        .slice(0, 6)
        .map((entry) => entry.product),
    [sourceProducts]
  );
  const upcomingSaleWindows = useMemo(() => {
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const seen = new Set<string>();

    return [
      { label: MONTH_NAMES[now.getMonth()], items: getUpcomingSales(now.getFullYear(), now.getMonth(), now) },
      {
        label: MONTH_NAMES[nextMonthDate.getMonth()],
        items: getUpcomingSales(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth(),
          nextMonthDate
        ),
      },
    ]
      .flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          monthLabel: group.label,
        }))
      )
      .filter((item) => {
        if (seen.has(item.name)) {
          return false;
        }
        seen.add(item.name);
        return true;
      })
      .slice(0, 4);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: "買い時判定ツール" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          <FaThermometerHalf className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">買い時判定ツール</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          セール状況、予算内まとめ買い、次のセール波を見て、今買うか待つかを判定します
        </p>
      </motion.div>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズで買い時を絞り込む"
        summary={
          source === "favorites"
            ? "ウォッチリストだけに絞って、今買うべき作品を先に判断できます。"
            : `全取得作品 ${sourceProducts.length} 件から診断中。セール・新作・高評価へ切り替えて精度よく比較できます。`
        }
      />

      <section className="mb-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
              <FaCoins size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                予算内まとめ買い
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                使える金額を決めると、その中で満足しやすい組み合わせを先に作ります。
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  今回の予算
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  ¥{budget.toLocaleString()} まで
                </p>
              </div>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                残り ¥{Math.max(budget - bundleTotal, 0).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={15000}
              step={500}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              className="mt-4 w-full accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>¥2,000</span>
              <span>¥15,000</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {budgetBundle.length > 0 ? (
              budgetBundle.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/12 text-xs font-bold text-[var(--color-primary)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]">
                      {product.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {formatPriceYen(getPresentedCurrentPrice(product))}
                    </p>
                  </div>
                  <PrimaryCta href={product.affiliateUrl} external size="sm">
                    確認
                  </PrimaryCta>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-sm text-[var(--color-text-secondary)]">
                予算内に収まる候補がありません。価格上限やソースを広げると組みやすくなります。
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
              <FaCalendarAlt size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                次のセール波
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                予測カレンダーの見どころをここに要約。待つか今買うかの判断材料を先に揃えます。
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingSaleWindows.map((sale) => (
              <div
                key={`${sale.monthLabel}-${sale.name}`}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--color-accent)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-accent)]">
                    {sale.monthLabel}
                  </span>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {sale.name}
                  </p>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {sale.discount}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  {sale.strategy}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <PrimaryCta href={ROUTES.salePredict} size="sm" variant="outline">
              セール予測カレンダーを開く
            </PrimaryCta>
          </div>
        </div>
      </section>

      {favoritePriority.length > 0 && (
        <ProductGridSection
          eyebrow="ウォッチリスト優先順位"
          title="保存作品の中で先に見ておきたい候補"
          description="ウォッチリストから、買い時スコアの高い順に先頭だけ抜き出しています。"
          products={favoritePriority}
          action={
            <PrimaryCta href={ROUTES.watchlist} size="sm" variant="outline">
              ウォッチリストへ
            </PrimaryCta>
          }
        />
      )}

      {priceOpportunityProducts.length > 0 && (
        <ProductGridSection
          eyebrow="価格履歴の近さ"
          title="過去最安値に近い候補"
          description="価格履歴の擬似チャートから、今の価格が底値に近い作品を先に並べています。"
          products={priceOpportunityProducts}
          action={
            <PrimaryCta href={ROUTES.priceHistory} size="sm" variant="outline">
              価格履歴チャートへ
            </PrimaryCta>
          }
        />
      )}

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="glass-card flex items-center gap-3 p-4">
          <FaCheckCircle className="text-2xl text-green-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">今が買い時</p>
            <p className="text-lg font-bold text-green-400">
              {buyCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaClock className="text-2xl text-yellow-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              もう少し待とう
            </p>
            <p className="text-lg font-bold text-yellow-400">
              {waitCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaTimesCircle className="text-2xl text-red-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              セールを待とう
            </p>
            <p className="text-lg font-bold text-red-400">
              {skipCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Genre filter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <FaFilter className="text-[var(--color-text-secondary)]" />
        <button
          onClick={() => setSelectedGenre("all")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            selectedGenre === "all"
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
          }`}
        >
          すべて
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              selectedGenre === genre
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
            }`}
          >
            {genre}
          </button>
        ))}
      </motion.div>

      {/* Product list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => {
            const { breakdown } = product;
            const verdict = getVerdict(breakdown.total);
            const cfg = VERDICT_CONFIG[verdict];

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                className={`glass-card overflow-hidden border ${cfg.borderColor}`}
              >
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:p-5">
                  {/* Image */}
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-white/5">
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
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <VerdictBadge score={breakdown.total} />
                      <span className="text-sm font-extrabold text-white">
                        {breakdown.total}点
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-sm font-bold text-white">
                      {product.title}
                    </h3>

                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      {product.salePrice ? (
                        <span className="flex items-center gap-1">
                          <FaTag className="text-[var(--color-accent)]" />
                          <span className="line-through">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <span className="font-bold text-[var(--color-accent)]">
                            ¥{product.salePrice.toLocaleString()}~
                          </span>
                          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-400">
                            -{getDiscountPercent(product)}%
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaTag />¥{product.price.toLocaleString()}~
                        </span>
                      )}
                      {product.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5">
                      <BreakdownItem
                        label="セール"
                        points={breakdown.sale}
                        maxPoints={40}
                        icon={
                          <FaShoppingCart
                            size={10}
                            className="text-green-400"
                          />
                        }
                      />
                      <BreakdownItem
                        label="割引率"
                        points={breakdown.discount}
                        maxPoints={20}
                        icon={
                          <FaTag size={10} className="text-[var(--color-accent)]" />
                        }
                      />
                      <BreakdownItem
                        label="評価"
                        points={breakdown.rating}
                        maxPoints={15}
                        icon={
                          <FaStar size={10} className="text-yellow-400" />
                        }
                      />
                      <BreakdownItem
                        label="季節"
                        points={breakdown.seasonal}
                        maxPoints={10}
                        icon={
                          <FaCalendarAlt
                            size={10}
                            className="text-blue-400"
                          />
                        }
                      />
                      <BreakdownItem
                        label="新作"
                        points={breakdown.newRelease}
                        maxPoints={15}
                        icon={
                          <FaFire size={10} className="text-orange-400" />
                        }
                      />
                    </div>
                  </div>

                  {/* Score gauge + CTA */}
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    {/* Circular score */}
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <svg
                        viewBox="0 0 80 80"
                        className="h-full w-full -rotate-90"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke={
                            verdict === "buy"
                              ? "#4ade80"
                              : verdict === "wait"
                                ? "#facc15"
                                : "#f87171"
                          }
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          initial={{
                            strokeDashoffset: 2 * Math.PI * 35,
                          }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 35 * (1 - breakdown.total / 100),
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </svg>
                      <span
                        className={`absolute text-xl font-extrabold ${cfg.color}`}
                      >
                        {breakdown.total}
                      </span>
                    </div>

                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:brightness-110"
                    >
                      <FaShoppingCart size={12} />
                      チェックする
                      <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <FaChartLine className="mx-auto mb-3 text-4xl text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            現在表示できる作品がありません
          </p>
        </motion.div>
      )}

      {/* PR note */}
      <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
        ※ 買い時スコアと予算内セットは独自算出の目安です ※ PR
      </p>
    </main>
  );
}
