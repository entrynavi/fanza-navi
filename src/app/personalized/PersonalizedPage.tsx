"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaThumbsUp,
  FaCompass,
  FaMagic,
  FaStar,
  FaFire,
  FaBolt,
  FaCheck,
  FaRedo,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { useFavorites } from "@/hooks/useFavorites";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

/* ------------------------------------------------------------------ */
/*  Genre definitions                                                  */
/* ------------------------------------------------------------------ */

const ALL_GENRES: { id: string; label: string }[] = [
  { id: "romance", label: "恋愛" },
  { id: "drama", label: "ドラマ" },
  { id: "comedy", label: "コメディ" },
  { id: "mature", label: "熟女" },
  { id: "idol", label: "アイドル" },
  { id: "cosplay", label: "コスプレ" },
  { id: "school", label: "学園もの" },
  { id: "office", label: "OL" },
  { id: "amateur", label: "素人" },
  { id: "massage", label: "マッサージ" },
  { id: "vr", label: "VR" },
  { id: "anime", label: "アニメ" },
  { id: "uniform", label: "制服" },
  { id: "swimsuit", label: "水着" },
  { id: "nurse", label: "ナース" },
  { id: "highres", label: "ハイビジョン" },
];

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY_GENRES = "personalized_genres";
const STORAGE_KEY_HISTORY = "personalized_history";

interface BrowsingHistory {
  genreCounts: Record<string, number>;
  priceRange: { min: number; max: number };
  actressCounts: Record<string, number>;
  viewedIds: string[];
}

interface PreferenceProfile {
  genreCounts: Record<string, number>;
  actressCounts: Record<string, number>;
  makerCounts: Record<string, number>;
  seriesCounts: Record<string, number>;
}

function loadSelectedGenres(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GENRES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSelectedGenres(genres: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(genres));
  } catch {}
}

function loadHistory(): BrowsingHistory {
  if (typeof window === "undefined")
    return { genreCounts: {}, priceRange: { min: 0, max: 10000 }, actressCounts: {}, viewedIds: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return { genreCounts: {}, priceRange: { min: 0, max: 10000 }, actressCounts: {}, viewedIds: [] };
    return JSON.parse(raw);
  } catch {
    return { genreCounts: {}, priceRange: { min: 0, max: 10000 }, actressCounts: {}, viewedIds: [] };
  }
}

function saveHistory(history: BrowsingHistory) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch {}
}

function buildPreferenceProfile(products: Product[]): PreferenceProfile {
  return products.reduce<PreferenceProfile>(
    (profile, product) => {
      if (product.genre) {
        profile.genreCounts[product.genre] = (profile.genreCounts[product.genre] || 0) + 1;
      }
      if (product.maker) {
        profile.makerCounts[product.maker] = (profile.makerCounts[product.maker] || 0) + 1;
      }
      if (product.series) {
        profile.seriesCounts[product.series] = (profile.seriesCounts[product.series] || 0) + 1;
      }
      product.actresses?.forEach((actress) => {
        profile.actressCounts[actress] = (profile.actressCounts[actress] || 0) + 1;
      });
      return profile;
    },
    {
      genreCounts: {},
      actressCounts: {},
      makerCounts: {},
      seriesCounts: {},
    }
  );
}

function recordProductView(product: Product) {
  const history = loadHistory();
  if (product.genre) {
    history.genreCounts[product.genre] = (history.genreCounts[product.genre] || 0) + 1;
  }
  const price = product.salePrice ?? product.price;
  if (price > 0) {
    if (history.priceRange.min === 0 || price < history.priceRange.min) history.priceRange.min = price;
    if (price > history.priceRange.max) history.priceRange.max = price;
  }
  if (product.actresses) {
    for (const a of product.actresses) {
      history.actressCounts[a] = (history.actressCounts[a] || 0) + 1;
    }
  }
  if (!history.viewedIds.includes(product.id)) {
    history.viewedIds.push(product.id);
    if (history.viewedIds.length > 200) history.viewedIds = history.viewedIds.slice(-200);
  }
  saveHistory(history);
}

/* ------------------------------------------------------------------ */
/*  Recommendation algorithm                                           */
/* ------------------------------------------------------------------ */

function scoreProduct(
  product: Product,
  history: BrowsingHistory,
  selectedGenres: string[],
  profile: PreferenceProfile
): number {
  let score = 0;

  const genreWeight = history.genreCounts[product.genre] || 0;
  score += genreWeight * 10;
  score += (profile.genreCounts[product.genre] || 0) * 8;

  if (selectedGenres.includes(product.genre)) score += 15;

  const price = product.salePrice ?? product.price;
  if (price >= history.priceRange.min && price <= history.priceRange.max) score += 5;

  if (product.maker) {
    score += (profile.makerCounts[product.maker] || 0) * 10;
  }
  if (product.series) {
    score += (profile.seriesCounts[product.series] || 0) * 12;
  }

  if (product.actresses) {
    for (const a of product.actresses) {
      score += (history.actressCounts[a] || 0) * 8;
      score += (profile.actressCounts[a] || 0) * 10;
    }
  }

  score += product.rating * 2;
  if (product.isSale) score += 3;

  if (history.viewedIds.includes(product.id)) score -= 50;

  return score;
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
  onView,
  badge,
}: {
  product: Product;
  onView: (p: Product) => void;
  badge?: React.ReactNode;
}) {
  const displayPrice = product.salePrice ?? product.price;

  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onView(product)}
      className="glass-card block overflow-hidden transition-transform hover:scale-[1.02]"
    >
      <div className="relative">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.title} className="aspect-[3/4] w-full object-cover" loading="lazy" />
        )}
        {badge && <div className="absolute left-2 top-2">{badge}</div>}
        {product.isSale && (
          <div className="absolute right-2 top-2 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
            セール
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-xs font-bold text-[var(--color-text-primary)] leading-snug">
          {product.title}
        </h3>
        {product.rating > 0 && (
          <div className="mb-1 flex items-center gap-1">
            <FaStar size={10} className="text-[var(--color-accent)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">{product.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="text-sm font-bold text-[var(--color-accent)]">¥{displayPrice.toLocaleString()}~</div>
        {product.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="chip text-[10px]">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-extrabold text-[var(--color-text-primary)]">
        {icon}
        {title}
      </h2>
      <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Onboarding Component                                               */
/* ------------------------------------------------------------------ */

function GenreOnboarding({
  onComplete,
}: {
  onComplete: (genres: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleGenre = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card mx-auto max-w-2xl p-8">
      <div className="mb-6 text-center">
        <FaMagic className="mx-auto mb-3 text-4xl text-[var(--color-accent)]" />
        <h2 className="mb-2 text-2xl font-extrabold text-[var(--color-text-primary)]">
          好みのジャンルを教えてください
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          3つ以上選択すると、あなたにぴったりの作品をおすすめします
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {ALL_GENRES.map((genre) => {
          const isSelected = selected.has(genre.id);
          return (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={`relative flex items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-white"
              }`}
            >
              {isSelected && (
                <FaCheck size={10} className="absolute right-1.5 top-1.5 text-[var(--color-primary-light)]" />
              )}
              {genre.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          const genres = Array.from(selected);
          saveSelectedGenres(genres);
          onComplete(genres);
        }}
        disabled={selected.size < 3}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-40"
      >
        <FaMagic size={14} />
        おすすめを見る ({selected.size}/3+)
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  allProducts: Product[];
}

export default function PersonalizedPage({ allProducts }: Props) {
  const { ids } = useFavorites();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [history, setHistory] = useState<BrowsingHistory | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const genres = loadSelectedGenres();
    const hist = loadHistory();
    setSelectedGenres(genres);
    setHistory(hist);
    setInitialized(true);
  }, []);

  const handleView = useCallback((product: Product) => {
    recordProductView(product);
    setHistory(loadHistory());
  }, []);

  const handleOnboardingComplete = useCallback((genres: string[]) => {
    setSelectedGenres(genres);
  }, []);

  const handleReset = useCallback(() => {
    saveSelectedGenres([]);
    saveHistory({ genreCounts: {}, priceRange: { min: 0, max: 10000 }, actressCounts: {}, viewedIds: [] });
    setSelectedGenres([]);
    setHistory({ genreCounts: {}, priceRange: { min: 0, max: 10000 }, actressCounts: {}, viewedIds: [] });
  }, []);

  const favoriteProducts = useMemo(
    () => allProducts.filter((product) => ids.includes(product.id)),
    [allProducts, ids]
  );
  const preferenceProfile = useMemo(
    () => buildPreferenceProfile(favoriteProducts),
    [favoriteProducts]
  );

  // Recommendation sections
  const { recommended, genreNew, salePicks, explorePicks, watchlistMatches } = useMemo(() => {
    if (!history || (selectedGenres.length === 0 && favoriteProducts.length === 0)) {
      return { recommended: [], genreNew: [], salePicks: [], explorePicks: [], watchlistMatches: [] };
    }

    // Score all products
    const scored = allProducts.map((p) => ({
      product: p,
      score: scoreProduct(p, history, selectedGenres, preferenceProfile),
    }));

    // Top matches
    const recommended = [...scored]
      .filter((item) => !ids.includes(item.product.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((s) => s.product);

    // New releases in preferred genres
    const genreNew = allProducts
      .filter((p) => selectedGenres.includes(p.genre) && p.isNew)
      .slice(0, 12);

    // Sale items matching preferences
    const saleScored = scored
      .filter((s) => s.product.isSale)
      .sort((a, b) => b.score - a.score);
    const salePicks = saleScored.slice(0, 12).map((s) => s.product);

    // Unexplored genres
    const exploredGenres = new Set([
      ...selectedGenres,
      ...Object.keys(history.genreCounts),
    ]);
    const explorePicks = allProducts
      .filter((p) => !exploredGenres.has(p.genre) && p.rating >= 3)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12);

    const favoriteMakers = new Set(
      favoriteProducts.map((product) => product.maker).filter(Boolean)
    );
    const favoriteSeries = new Set(
      favoriteProducts.map((product) => product.series).filter(Boolean)
    );
    const favoriteActresses = new Set(
      favoriteProducts.flatMap((product) => product.actresses ?? [])
    );

    const watchlistMatches = [...scored]
      .filter(({ product }) => {
        if (ids.includes(product.id)) {
          return false;
        }

        return (
          (product.maker ? favoriteMakers.has(product.maker) : false) ||
          (product.series ? favoriteSeries.has(product.series) : false) ||
          (product.actresses?.some((actress) => favoriteActresses.has(actress)) ?? false)
        );
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((item) => item.product);

    return { recommended, genreNew, salePicks, explorePicks, watchlistMatches };
  }, [allProducts, favoriteProducts, history, ids, preferenceProfile, selectedGenres]);

  if (!initialized) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="glass-card p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
        </div>
      </main>
    );
  }

  const hasPreferences = selectedGenres.length >= 3 || favoriteProducts.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "パーソナライズドフィード" }]} />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-extrabold md:text-4xl">
          <FaUser className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">パーソナライズドフィード</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-[var(--color-text-secondary)]">
          あなたの好みに合わせて、最適な作品をレコメンドします
        </p>
      </motion.div>

      {!hasPreferences ? (
        <GenreOnboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {/* Preference summary bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">
              {selectedGenres.length > 0 ? "選択中のジャンル:" : "ウォッチリスト起点のおすすめ:"}
            </span>
            {selectedGenres.map((gId) => {
              const genre = ALL_GENRES.find((g) => g.id === gId);
              return (
                <span key={gId} className="chip-accent chip">
                  {genre?.label ?? gId}
                </span>
              );
            })}
            {favoriteProducts.length > 0 ? (
              <span className="chip border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                ウォッチリスト {favoriteProducts.length}件
              </span>
            ) : null}
            <button
              onClick={handleReset}
              className="ml-auto flex items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] transition-colors hover:text-white"
            >
              <FaRedo size={8} />
              リセット
            </button>
          </motion.div>

          {/* Section 0: Watchlist similarity */}
          {watchlistMatches.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-10">
              <SectionHeader
                icon={<FaMagic className="text-[var(--color-accent)]" />}
                title="ウォッチリストに近いおすすめ"
                description="保存済み作品の女優・シリーズ・メーカーに近い候補を先回りで提案"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {watchlistMatches.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <ProductCard
                      product={product}
                      onView={handleView}
                      badge={
                        i < 3 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold text-[#20150f]">
                            <FaMagic size={8} />
                            近い候補
                          </span>
                        ) : undefined
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 1: Recommendations */}
          {recommended.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10">
              <SectionHeader
                icon={<FaThumbsUp className="text-[var(--color-primary-light)]" />}
                title="あなたへのおすすめ"
                description="閲覧履歴とジャンル設定に基づくトップマッチ"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {recommended.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <ProductCard
                      product={product}
                      onView={handleView}
                      badge={
                        i < 3 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                            <FaFire size={8} />
                            TOP{i + 1}
                          </span>
                        ) : undefined
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 2: Genre new releases */}
          {genreNew.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
              <SectionHeader
                icon={<FaBolt className="text-[var(--color-accent)]" />}
                title="好きなジャンルの新着"
                description="お気に入りジャンルの最新リリース"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {genreNew.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <ProductCard product={product} onView={handleView} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 3: Sale picks */}
          {salePicks.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-10">
              <SectionHeader
                icon={<FaStar className="text-[var(--color-accent)]" />}
                title="お得な注目作品"
                description="好みに合うセール中の作品をピックアップ"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {salePicks.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <ProductCard product={product} onView={handleView} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 4: Explore new genres */}
          {explorePicks.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
              <SectionHeader
                icon={<FaCompass className="text-[var(--color-primary-light)]" />}
                title="新しいジャンルを開拓"
                description="まだ見たことのないジャンルから高評価作品を厳選"
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {explorePicks.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  >
                    <ProductCard product={product} onView={handleView} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty state if all sections empty */}
          {recommended.length === 0 && genreNew.length === 0 && salePicks.length === 0 && explorePicks.length === 0 && (
            <div className="glass-card p-12 text-center">
              <FaCompass className="mx-auto mb-4 text-4xl text-[var(--color-text-muted)]" />
              <p className="mb-2 text-[var(--color-text-secondary)]">まだおすすめを生成できません</p>
              <p className="text-xs text-[var(--color-text-muted)]">作品を閲覧するほど精度が上がります</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
