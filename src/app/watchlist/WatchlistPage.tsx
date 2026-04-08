"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaTrash, FaStar, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
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
  formatPriceYen,
  getPresentedCurrentPrice,
  getPrimaryFanzaCtaLabel,
} from "@/lib/product-presenter";
import {
  buildWatchlistMatches,
  calcBuyTimingScore,
} from "@/lib/toolkit-insights";

export default function WatchlistPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const { ids, toggle, count } = useFavorites();
  const [showConfirm, setShowConfirm] = useState(false);
  const [source, setSource] = useState<ProductPoolSource>("favorites");
  const [query, setQuery] = useState("");

  const productMap = useMemo(
    () => new Map(allProducts.map((product) => [product.id, product])),
    [allProducts]
  );
  const sourceOptions = useMemo(() => getProductPoolOptions(allProducts, ids), [allProducts, ids]);
  const visibleProducts = useMemo(
    () =>
      filterProductPool(allProducts, {
        source,
        query,
        favoriteIds: ids,
      }),
    [allProducts, ids, query, source]
  );
  const favoriteProducts = useMemo(
    () => ids.map((id) => productMap.get(id)).filter((p): p is Product => p !== undefined),
    [ids, productMap]
  );
  const saleFavorites = useMemo(
    () =>
      [...favoriteProducts]
        .filter((product) => product.isSale)
        .sort((left, right) => {
          const leftDiscount = left.salePrice ? left.price - left.salePrice : 0;
          const rightDiscount = right.salePrice ? right.price - right.salePrice : 0;
          return rightDiscount - leftDiscount || right.rating - left.rating;
        })
        .slice(0, 6),
    [favoriteProducts]
  );
  const buyPriorityFavorites = useMemo(
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
  const similarProducts = useMemo(
    () =>
      buildWatchlistMatches(allProducts, favoriteProducts, {
        excludeIds: new Set(ids),
        limit: 6,
      }),
    [allProducts, favoriteProducts, ids]
  );

  const handleClearAll = () => {
    ids.forEach((id) => toggle(id));
    setShowConfirm(false);
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "ウォッチリスト" }]} />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
              <FaBookmark size={24} className="text-white" />
            </div>
            <div>
              <p className="section-eyebrow">マイリスト</p>
              <h1 className="section-title gradient-text text-3xl md:text-4xl">
                ウォッチリスト
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              <FaBookmark size={12} className="text-[var(--color-primary)]" />
              {count}件
            </span>
          </div>
        </div>
        <p className="section-description mt-3">
          気になる作品をお気に入りに追加すると、ここにまとめて表示されます。
        </p>
      </section>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・メーカー・シリーズで絞り込む"
        summary={
          source === "favorites"
            ? `保存済み ${favoriteProducts.length} 件を検索できます。全取得作品やセール作品に切り替えて、そのままお気に入り追加もできます。`
            : `現在 ${visibleProducts.length} 件を表示中。気になった作品はハートでそのままウォッチリストに追加できます。`
        }
      />

      {favoriteProducts.length > 0 && (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="glass-card p-4">
              <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                保存中
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {favoriteProducts.length}
                <span className="ml-1 text-sm text-[var(--color-text-muted)]">件</span>
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                迷った作品をここに寄せておくと、他ツールの起点にも使えます。
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                値下げ中
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--color-accent)]">
                {saleFavorites.length}
                <span className="ml-1 text-sm text-[var(--color-text-muted)]">件</span>
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                今すぐ見直すべき候補だけを先に拾えます。
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                深掘り候補
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {similarProducts.length}
                <span className="ml-1 text-sm text-[var(--color-text-muted)]">件</span>
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                保存中の女優・シリーズ・メーカー傾向から近い作品を探します。
              </p>
            </div>
          </div>

          {saleFavorites.length > 0 && (
            <ProductGridSection
              eyebrow="値下げ監視"
              title="セール中の保存作品"
              description="保存中の中でも、値下げ幅が大きいものから見直せます。"
              products={saleFavorites}
              action={
                <PrimaryCta href={ROUTES.buyTiming} size="sm" variant="outline">
                  買い時チェックへ
                </PrimaryCta>
              }
            />
          )}

          {buyPriorityFavorites.length > 0 && (
            <ProductGridSection
              eyebrow="優先順位"
              title="今チェック優先の保存作品"
              description="買い時スコアを使って、後回しにしない方がいい候補から並べています。"
              products={buyPriorityFavorites}
              action={
                <PrimaryCta href={ROUTES.buyTiming} size="sm" variant="outline">
                  買う順番を見る
                </PrimaryCta>
              }
            />
          )}

          {similarProducts.length > 0 && (
            <ProductGridSection
              eyebrow="深掘り"
              title="保存中に近い次候補"
              description="ウォッチリストの傾向から、次に刺さりやすい作品を追加で拾えます。"
              products={similarProducts}
              action={
                <PrimaryCta href={ROUTES.personalized} size="sm" variant="outline">
                  自分向けフィードへ
                </PrimaryCta>
              }
            />
          )}
        </>
      )}

      {source === "favorites" && count > 0 && (
        <div className="mb-6 flex justify-end">
          {showConfirm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2"
            >
              <span className="text-sm text-red-300">
                本当にすべて削除しますか？
              </span>
              <button
                onClick={handleClearAll}
                className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                削除する
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-white"
              >
                キャンセル
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <FaTrash size={12} />
              全て削除
            </button>
          )}
        </div>
      )}

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="glass-card group relative flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/5">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FaBookmark
                        size={48}
                        className="text-[var(--color-primary)] opacity-30"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton
                      productId={product.id}
                      className="h-9 w-9 bg-black/30 backdrop-blur-sm hover:bg-black/50"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-3 p-5">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <FaStar
                        size={12}
                        className="text-[var(--color-accent)]"
                      />
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {product.rating.toFixed(1)}
                      </span>
                    </span>
                    <span>レビュー {product.reviewCount}件</span>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {product.title}
                  </h3>

                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                    <div>
                      <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                        価格
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[var(--color-text-primary)]">
                        {formatPriceYen(getPresentedCurrentPrice(product))}~
                      </p>
                    </div>
                    {product.affiliateUrl.trim() && (
                      <PrimaryCta
                        href={product.affiliateUrl}
                        external
                        size="sm"
                      >
                        {getPrimaryFanzaCtaLabel(product)}
                      </PrimaryCta>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface)]">
            <FaBookmark
              size={32}
              className="text-[var(--color-text-muted)]"
            />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {source === "favorites"
              ? "まだお気に入りに追加された作品はありません"
              : "条件に合う作品が見つかりませんでした"}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {source === "favorites"
              ? "作品ページのハートボタンからお気に入りに追加できます"
              : "検索条件や切替ソースを変えると、別の作品を探せます"}
          </p>
          <div className="mt-6">
            <PrimaryCta href={source === "favorites" ? ROUTES.ranking : ROUTES.search} size="md">
              <span className="inline-flex items-center gap-2">
                {source === "favorites" ? "人気作品を探す" : "作品検索へ"}
                <FaArrowRight size={12} />
              </span>
            </PrimaryCta>
          </div>
        </motion.div>
      )}
    </main>
  );
}
