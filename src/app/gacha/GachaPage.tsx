"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRandom,
  FaDice,
  FaStar,
  FaRedo,
  FaFilter,
  FaHistory,
  FaArrowRight,
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
import { getRarity } from "@/lib/share-utils";
import { getRecommendationWeight } from "@/lib/toolkit-insights";

function pickWeightedProduct(products: Product[]): Product {
  const totalWeight = products.reduce(
    (sum, product) => sum + getRecommendationWeight(product),
    0
  );
  let target = Math.random() * totalWeight;

  for (const product of products) {
    target -= getRecommendationWeight(product);
    if (target <= 0) {
      return product;
    }
  }

  return products[0];
}

export default function GachaPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const { ids } = useFavorites();
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [minRating, setMinRating] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Product | null>(null);
  const [history, setHistory] = useState<Product[]>([]);
  const [spinKey, setSpinKey] = useState(0);
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");

  const sourceOptions = useMemo(
    () => getProductPoolOptions(allProducts, ids),
    [allProducts, ids]
  );
  const sourceProducts = useMemo(
    () =>
      filterProductPool(allProducts, {
        source,
        query,
        favoriteIds: ids,
      }),
    [allProducts, ids, query, source]
  );

  const genres = useMemo(() => {
    const genreSet = new Set(sourceProducts.map((p) => p.genre));
    return Array.from(genreSet).sort();
  }, [sourceProducts]);

  useEffect(() => {
    if (selectedGenre !== "all" && !genres.includes(selectedGenre)) {
      setSelectedGenre("all");
    }
  }, [genres, selectedGenre]);

  const filteredProducts = useMemo(() => {
    return sourceProducts.filter((p) => {
      if (selectedGenre !== "all" && p.genre !== selectedGenre) return false;
      if (getPresentedCurrentPrice(p) > maxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
  }, [maxPrice, minRating, selectedGenre, sourceProducts]);

  const handleGacha = useCallback(() => {
    if (filteredProducts.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    setTimeout(() => {
      const picked = pickWeightedProduct(filteredProducts);
      setResult(picked);
      setHistory((prev) => [picked, ...prev].slice(0, 20));
      setSpinKey((k) => k + 1);
      setIsSpinning(false);
    }, 1500);
  }, [filteredProducts, isSpinning]);

  /* -- rarity for current result -- */
  const resultRarity = result ? getRarity(result.rating) : null;

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "ガチャ" }]} />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
            <FaDice size={24} className="text-white" />
          </div>
          <div>
            <p className="section-eyebrow">ガチャ</p>
            <h1 className="section-title gradient-text text-3xl md:text-4xl">
              ガチャ風レコメンド
            </h1>
          </div>
        </div>
        <p className="section-description mt-3">
          条件を設定してガチャを回そう！運命の作品に出会えるかも。
        </p>
      </section>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズで候補を絞る"
        summary={
          source === "favorites"
            ? "ウォッチリストだけで回せるので、迷っている候補の中から今日の1本を決めやすくしています。"
            : `候補母数は ${sourceProducts.length} 件。高評価・レビュー数・セール状況を反映した重み付き抽選です。`
        }
      />

      {/* フィルター */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card mb-8 p-5"
      >
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
          <FaFilter size={14} className="text-[var(--color-primary)]" />
          フィルター設定
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs text-[var(--color-text-secondary)]">
              ジャンル
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
            >
              <option value="all">すべてのジャンル</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-[var(--color-text-secondary)]">
              上限価格: {formatPriceYen(maxPrice)}
            </label>
            <input
              type="range"
              min={100}
              max={30000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>¥100</span>
              <span>¥30,000</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-[var(--color-text-secondary)]">
              最低評価: {minRating.toFixed(1)}以上
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>指定なし</span>
              <span>5.0</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          対象作品数: {filteredProducts.length}件
        </p>
      </motion.section>

      {/* ガチャボタン */}
      <div className="mb-10 flex flex-col items-center">
        <motion.button
          onClick={handleGacha}
          disabled={isSpinning || filteredProducts.length === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] shadow-[0_0_40px_rgba(158,68,90,0.4)] transition-shadow hover:shadow-[0_0_60px_rgba(158,68,90,0.6)] disabled:opacity-50 disabled:cursor-not-allowed md:h-40 md:w-40"
        >
          <motion.div
            animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isSpinning
                ? { duration: 0.5, repeat: Infinity, ease: "linear" }
                : { duration: 0 }
            }
          >
            <FaRandom size={40} className="text-white" />
          </motion.div>
          <div className="absolute inset-0 rounded-full bg-white/0 transition-all group-hover:bg-white/10" />
        </motion.button>
        <p className="mt-4 text-lg font-bold text-white">
          {isSpinning
            ? "抽選中..."
            : filteredProducts.length === 0
              ? "条件に合う作品がありません"
              : "ガチャを回す！"}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          ボタンをタップしてランダムに作品をピック
        </p>
      </div>

      {/* 結果 */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.section
            key={spinKey}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="glass-card mb-8 overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[350px]">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10">
                    <FaDice
                      size={64}
                      className="text-[var(--color-primary)] opacity-30"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 md:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                <div className="absolute top-4 right-4 z-10">
                  <FavoriteButton
                    productId={result.id}
                    size={22}
                    className="h-10 w-10 bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  />
                </div>
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-4 py-1.5">
                    <FaDice size={14} className="text-white" />
                    <span className="text-sm font-bold text-white">当選！</span>
                  </span>
                  {resultRarity && (
                    <span
                      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-black tracking-wider text-white backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(135deg, ${resultRarity.color}, ${resultRarity.color}88)`,
                        boxShadow: `0 0 16px ${resultRarity.glow}`,
                      }}
                    >
                      {resultRarity.emoji} {resultRarity.short}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4 p-6 md:p-8">
                <div className="flex items-center gap-3 flex-wrap">
                  {resultRarity && (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-black"
                      style={{ color: resultRarity.color, background: `${resultRarity.color}18` }}
                    >
                      {resultRarity.emoji} {resultRarity.label}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-accent)]">
                    <FaStar size={12} />
                    {result.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    レビュー {result.reviewCount}件
                  </span>
                </div>

                <h2 className="text-2xl font-bold leading-tight text-white">
                  {result.title}
                </h2>

                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                  {result.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {result.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border-t border-[var(--color-border)] pt-4">
                  <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                    価格
                  </p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {formatPriceYen(getPresentedCurrentPrice(result))}
                    <span className="text-lg text-[var(--color-text-muted)]">
                      ~
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {result.affiliateUrl.trim() && (
                    <PrimaryCta
                      href={result.affiliateUrl}
                      external
                      size="lg"
                    >
                      <span className="inline-flex items-center gap-2">
                        {getPrimaryFanzaCtaLabel(result)}
                        <FaArrowRight size={12} />
                      </span>
                    </PrimaryCta>
                  )}
                  <button
                    onClick={handleGacha}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:text-white"
                  >
                    <FaRedo size={12} />
                    もう一回！
                  </button>
                  <ShareMenu
                    product={result}
                    context="gacha"
                    siteUrl={typeof window !== "undefined" ? window.location.origin + "/gacha" : ""}
                  />
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 履歴 */}
      {history.length > 0 && (
        <section className="mt-8">
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
                セッション履歴
              </p>
              <h2 className="text-xl font-bold text-white">
                ガチャ履歴（{history.length}件）
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {history.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="glass-card group relative flex overflow-hidden"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/5">
                      <FaDice
                        size={20}
                        className="text-[var(--color-primary)] opacity-30"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <FaStar
                      size={10}
                      className="text-[var(--color-accent)]"
                    />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]">
                    {product.title}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatPriceYen(getPresentedCurrentPrice(product))}~
                  </p>
                </div>
                {product.affiliateUrl.trim() && (
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    <FaArrowRight size={12} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
