"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaCalendarDay,
  FaCrown,
  FaArrowRight,
  FaHistory,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import PrimaryCta from "@/components/PrimaryCta";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import ShareMenu from "@/components/ShareMenu";
import { useFavorites } from "@/hooks/useFavorites";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";
import {
  formatPriceYen,
  getPresentedCurrentPrice,
  getPrimaryFanzaCtaLabel,
} from "@/lib/product-presenter";
import { getDailyPickForDate } from "@/lib/toolkit-insights";

function formatDateJP(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${Number(m)}月${Number(d)}日`;
}

function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
}

export default function DailyPickPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const { ids } = useFavorites();
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");
  const today = getDateString(0);
  const sourceOptions = useMemo(
    () => getProductPoolOptions(allProducts, ids),
    [allProducts, ids]
  );
  const filteredProducts = useMemo(
    () =>
      filterProductPool(allProducts, {
        source,
        query,
        favoriteIds: ids,
      }),
    [allProducts, ids, query, source]
  );

  const todayPick = useMemo(
    () => getDailyPickForDate(today, filteredProducts),
    [today, filteredProducts]
  );

  const pastPicks = useMemo(() => {
    const picks: { date: string; product: Product }[] = [];
    for (let i = 1; i <= 7; i++) {
      const dateStr = getDateString(-i);
      const product = getDailyPickForDate(dateStr, filteredProducts);
      if (product) {
        picks.push({ date: dateStr, product });
      }
    }
    return picks;
  }, [filteredProducts]);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "今日のおすすめ" }]} />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
            <FaCalendarDay size={24} className="text-white" />
          </div>
          <div>
            <p className="section-eyebrow">デイリーピック</p>
            <h1 className="section-title gradient-text text-3xl md:text-4xl">
              今日のおすすめ
            </h1>
          </div>
        </div>
        <p className="section-description mt-3">
          毎日変わる厳選おすすめ作品。今日のピックをチェックして、新しいお気に入りを見つけよう。
        </p>
      </section>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズで今日の候補を絞る"
        summary={
          source === "favorites"
            ? "ウォッチリストだけで“今日の1本”を選べます。迷いを減らす使い方に寄せました。"
            : `全取得作品 ${filteredProducts.length} 件から、評価・レビュー数・セール状況を加味して日替わりで選出します。`
        }
      />

      {todayPick ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card relative overflow-hidden"
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-4 py-1.5">
            <FaCrown size={14} className="text-white" />
            <span className="text-sm font-bold text-white">
              {formatDateJP(today)} のピック
            </span>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[400px]">
              {todayPick.imageUrl ? (
                <img
                  src={todayPick.imageUrl}
                  alt={todayPick.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10">
                  <FaStar size={64} className="text-[var(--color-primary)] opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 md:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton
                  productId={todayPick.id}
                  size={24}
                  className="h-11 w-11 bg-black/30 backdrop-blur-sm hover:bg-black/50"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-5 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-accent)]">
                  <FaStar size={12} />
                  {todayPick.rating.toFixed(1)}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  レビュー {todayPick.reviewCount}件
                </span>
              </div>

              <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                {todayPick.title}
              </h2>

              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-4">
                {todayPick.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {todayPick.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="border-t border-[var(--color-border)] pt-5">
                <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                  本日の特選価格
                </p>
                <p className="mt-1 text-3xl font-bold text-white">
                  {formatPriceYen(getPresentedCurrentPrice(todayPick))}
                  <span className="text-lg text-[var(--color-text-muted)]">
                    ~
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {todayPick.affiliateUrl.trim() && (
                  <PrimaryCta href={todayPick.affiliateUrl} external size="lg">
                    <span className="inline-flex items-center gap-2">
                      {getPrimaryFanzaCtaLabel(todayPick)}
                      <FaArrowRight size={12} />
                    </span>
                  </PrimaryCta>
                )}
                <ShareMenu
                  product={todayPick}
                  context="daily"
                  siteUrl={typeof window !== "undefined" ? window.location.origin + "/daily-pick" : ""}
                />
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">
            本日のおすすめを取得できませんでした
          </p>
        </div>
      )}

      {pastPicks.length > 0 && (
        <section className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface)]">
              <FaHistory size={16} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                バックナンバー
              </p>
              <h2 className="text-xl font-bold text-white">過去のピック</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastPicks.map(({ date, product }, index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="glass-card group relative flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/5">
                      <FaStar size={32} className="text-[var(--color-primary)] opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {formatDateJP(date)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <FavoriteButton
                      productId={product.id}
                      className="h-8 w-8 bg-black/30 backdrop-blur-sm hover:bg-black/50"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <FaStar size={10} className="text-[var(--color-accent)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {product.rating.toFixed(1)}
                    </span>
                    <span>({product.reviewCount}件)</span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {product.title}
                  </h3>

                  <div className="mt-auto flex items-end justify-between gap-2 border-t border-[var(--color-border)] pt-2">
                    <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {formatPriceYen(getPresentedCurrentPrice(product))}~
                    </p>
                    {product.affiliateUrl.trim() && (
                      <PrimaryCta
                        href={product.affiliateUrl}
                        external
                        size="sm"
                      >
                        詳細
                      </PrimaryCta>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/20">
            <FaCalendarDay size={20} className="text-[var(--color-primary)]" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">
          明日のおすすめも見逃さないで！
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          毎日新しいおすすめ作品をピックアップ。ブックマークしていつでもチェック。
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {todayPick && (
            <ShareMenu
              product={todayPick}
              context="daily"
              siteUrl={typeof window !== "undefined" ? window.location.origin + "/daily-pick" : ""}
            />
          )}
          <PrimaryCta href={ROUTES.ranking} size="md" variant="outline">
            ランキングも見る
          </PrimaryCta>
        </div>
      </motion.section>
    </main>
  );
}
