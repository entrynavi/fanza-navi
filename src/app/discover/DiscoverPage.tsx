"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBookmark,
  FaBolt,
  FaCalendarDay,
  FaCoins,
  FaCompass,
  FaDice,
  FaFire,
  FaRegStar,
  FaSearch,
  FaShieldAlt,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
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
  getPresentedCurrentPrice,
  getPrimaryFanzaCtaLabel,
} from "@/lib/product-presenter";
import { ROUTES } from "@/lib/site";
import {
  buildBudgetPicks,
  buildDiagnosisPicks,
  buildSafePicks,
  buildWatchlistMatches,
  getDailyPickForDate,
  type DiagnosisIntent,
} from "@/lib/toolkit-insights";

interface DiscoveryCollection {
  id: string;
  label: string;
  description: string;
  products: Product[];
  ctaHref: string;
  ctaLabel: string;
}

const INTENT_OPTIONS: {
  value: DiagnosisIntent;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "safe",
    label: "外したくない",
    description: "高評価とレビュー厚めを優先",
    icon: <FaShieldAlt size={14} />,
  },
  {
    value: "budget",
    label: "安く済ませたい",
    description: "低価格でも満足度が高い順",
    icon: <FaCoins size={14} />,
  },
  {
    value: "sale",
    label: "今の値下げから",
    description: "割引と反応が強い作品から選ぶ",
    icon: <FaTags size={14} />,
  },
  {
    value: "new",
    label: "新作を追う",
    description: "新着で評判が伸びそうな作品",
    icon: <FaFire size={14} />,
  },
  {
    value: "watchlist",
    label: "保存中に近い",
    description: "ウォッチリスト起点で寄せる",
    icon: <FaBookmark size={14} />,
  },
  {
    value: "surprise",
    label: "サプライズ",
    description: "ガチャ感覚で当たり候補を引く",
    icon: <FaDice size={14} />,
  },
];

const SITUATION_SHORTCUTS: {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  intent: DiagnosisIntent;
  source?: ProductPoolSource;
  budget?: number;
  requiresFavorites?: boolean;
}[] = [
  {
    id: "safe",
    label: "初めてでも外しにくい",
    description: "高評価・レビュー多めから無難に探します。",
    icon: <FaShieldAlt size={16} />,
    intent: "safe",
    source: "high-rated",
  },
  {
    id: "budget",
    label: "コスパ重視",
    description: "安く済ませたい夜向けの候補に寄せます。",
    icon: <FaCoins size={16} />,
    intent: "budget",
    source: "sale",
    budget: 2500,
  },
  {
    id: "sale",
    label: "セールから選ぶ",
    description: "いま値下げ中の作品から絞り込みます。",
    icon: <FaTags size={16} />,
    intent: "sale",
    source: "sale",
  },
  {
    id: "new",
    label: "新作を追う",
    description: "新着の中から評判が伸びそうな作品を優先します。",
    icon: <FaFire size={16} />,
    intent: "new",
    source: "new",
  },
  {
    id: "watchlist",
    label: "保存中に近い",
    description: "ウォッチリストの傾向に近い候補を探します。",
    icon: <FaBookmark size={16} />,
    intent: "watchlist",
    requiresFavorites: true,
  },
  {
    id: "surprise",
    label: "ガチャで当たり寄り",
    description: "完全ランダムではなく、当たり寄りで選びます。",
    icon: <FaDice size={16} />,
    intent: "surprise",
  },
];

function QuickPickCard({
  product,
  eyebrow,
}: {
  product: Product;
  eyebrow: string;
}) {
  return (
    <article className="glass-card group relative overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 text-[var(--color-text-muted)]">
            <FaSearch size={28} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white/85">
          {eyebrow}
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton
            productId={product.id}
            className="h-9 w-9 bg-black/35 backdrop-blur-sm hover:bg-black/50"
          />
        </div>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-6 text-[var(--color-text-primary)]">
          {product.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
          {product.rating > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-1">
              <FaRegStar size={10} className="text-[var(--color-accent)]" />
              {product.rating.toFixed(1)}
            </span>
          ) : null}
          <span>レビュー {product.reviewCount}件</span>
        </div>
        <div className="flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <div>
            <p className="text-[10px] tracking-[0.08em] text-[var(--color-text-muted)]">
              価格
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              {formatPriceYen(getPresentedCurrentPrice(product))}
            </p>
          </div>
          <PrimaryCta href={product.affiliateUrl} external size="sm">
            {getPrimaryFanzaCtaLabel(product)}
          </PrimaryCta>
        </div>
      </div>
    </article>
  );
}

export default function DiscoverPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const { ids } = useFavorites();
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(3000);
  const [intent, setIntent] = useState<DiagnosisIntent>("safe");
  const [activeCollection, setActiveCollection] = useState("safe");

  const favoriteProducts = useMemo(
    () => allProducts.filter((product) => ids.includes(product.id)),
    [allProducts, ids]
  );
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
  const diagnosisResults = useMemo(
    () =>
      buildDiagnosisPicks(sourceProducts, {
        intent,
        budget,
        watchlistSeeds: favoriteProducts,
        limit: 3,
      }),
    [budget, favoriteProducts, intent, sourceProducts]
  );
  const todayPick = useMemo(() => {
    const key = new Date().toISOString().split("T")[0];
    return getDailyPickForDate(key, sourceProducts);
  }, [sourceProducts]);

  const collections = useMemo<DiscoveryCollection[]>(() => {
    const favoriteSet = new Set(ids);

    return [
      {
        id: "safe",
        label: "外したくない",
        description: "高評価・レビュー厚めの安牌から先に見たいとき向けです。",
        products: buildSafePicks(sourceProducts, 12),
        ctaHref: ROUTES.customRanking,
        ctaLabel: "独自ランキングを見る",
      },
      {
        id: "budget",
        label: "給料日前",
        description: `¥${budget.toLocaleString()}以内で満足しやすい候補をまとめています。`,
        products: buildBudgetPicks(sourceProducts, budget, 12),
        ctaHref: ROUTES.buyTiming,
        ctaLabel: "買い時も確認する",
      },
      {
        id: "sale",
        label: "今の値下げから",
        description: "セール中で反応が強い候補を優先表示します。",
        products: buildDiagnosisPicks(sourceProducts, {
          intent: "sale",
          budget,
          watchlistSeeds: favoriteProducts,
          limit: 12,
        }),
        ctaHref: ROUTES.sale,
        ctaLabel: "セール会場へ",
      },
      {
        id: "new",
        label: "新作優先",
        description: "新着の中でも今追いやすい作品をまとめました。",
        products: buildDiagnosisPicks(sourceProducts, {
          intent: "new",
          budget: 0,
          watchlistSeeds: favoriteProducts,
          limit: 12,
        }),
        ctaHref: ROUTES.newReleases,
        ctaLabel: "新作一覧へ",
      },
      {
        id: "watchlist",
        label: "保存中に近い",
        description: "ウォッチリストの女優・シリーズ・メーカー傾向から寄せています。",
        products: buildWatchlistMatches(sourceProducts, favoriteProducts, {
          excludeIds: favoriteSet,
          limit: 12,
        }),
        ctaHref: ROUTES.watchlist,
        ctaLabel: "ウォッチリストを見る",
      },
      {
        id: "surprise",
        label: "サプライズ",
        description: "ガチャ的に出会えるけれど、完全ランダムではなく当たり寄りです。",
        products: buildDiagnosisPicks(sourceProducts, {
          intent: "surprise",
          budget,
          watchlistSeeds: favoriteProducts,
          limit: 12,
        }),
        ctaHref: ROUTES.gacha,
        ctaLabel: "ガチャで選ぶ",
      },
    ].filter((collection) => {
      if (collection.id === "watchlist") {
        return favoriteProducts.length > 0;
      }
      return true;
    });
  }, [budget, favoriteProducts, ids, sourceProducts]);

  useEffect(() => {
    if (!collections.some((collection) => collection.id === activeCollection)) {
      setActiveCollection(collections[0]?.id ?? "safe");
    }
  }, [activeCollection, collections]);

  useEffect(() => {
    if (intent === "watchlist" && favoriteProducts.length === 0) {
      setIntent("safe");
    }
  }, [favoriteProducts.length, intent]);

  const activeIntent = INTENT_OPTIONS.find((option) => option.value === intent);
  const activeCollectionData =
    collections.find((collection) => collection.id === activeCollection) ?? collections[0];
  const saleCount =
    sourceOptions.find((option) => option.value === "sale")?.count ?? 0;
  const newCount =
    sourceOptions.find((option) => option.value === "new")?.count ?? 0;

  const handleShortcutSelect = (
    shortcut: (typeof SITUATION_SHORTCUTS)[number]
  ) => {
    if (shortcut.requiresFavorites && favoriteProducts.length === 0) {
      return;
    }
    setIntent(shortcut.intent);
    if (shortcut.source) {
      setSource(shortcut.source);
    }
    if (shortcut.budget) {
      setBudget(shortcut.budget);
    }
    document.getElementById("night-diagnosis")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "シチュエーション検索" }]} />

      <section className="editorial-surface mb-8 p-6 md:p-8">
        <div className="max-w-4xl">
          <p className="section-eyebrow">シチュエーション検索</p>
          <h1 className="section-title gradient-text text-3xl md:text-4xl">
            気分で作品を探す
          </h1>
          <p className="section-description mt-3">
            シチュエーション検索を軸にしつつ、今夜の1本診断と今日のおすすめも一緒に使えます。
            まずは気分から候補を絞って、迷ったらそのまま診断へ進めます。
          </p>
        </div>
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
            ? "ウォッチリストだけに絞って、近い作品探しや今夜の1本診断にそのまま使えます。"
            : `全取得作品 ${sourceProducts.length} 件から、気分別の絞り込みと今夜の1本診断を続けて回せます。`
        }
      />

      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow">気分から選ぶ</p>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              まずは探し方を決める
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            候補 {sourceProducts.length} 件 / 値下げ中 {saleCount} 件 / 新作 {newCount} 件
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SITUATION_SHORTCUTS.map((shortcut) => {
            const disabled =
              shortcut.requiresFavorites && favoriteProducts.length === 0;
            const active = intent === shortcut.intent;

            return (
              <button
                key={shortcut.id}
                type="button"
                disabled={disabled}
                onClick={() => handleShortcutSelect(shortcut)}
                className={`rounded-[22px] border p-5 text-left transition-all ${
                  active
                    ? "border-[var(--color-primary)]/45 bg-[var(--color-primary)]/12 text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-white"
                } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]">
                  {shortcut.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--color-text-primary)]">
                  {shortcut.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {shortcut.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section
        id="night-diagnosis"
        className="mb-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
              <FaCompass size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                今夜の1本診断
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                気分と予算に合わせて、まず見るべき3本を先に絞ります。
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {INTENT_OPTIONS.map((option) => {
              const disabled =
                option.value === "watchlist" && favoriteProducts.length === 0;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setIntent(option.value)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    intent === option.value
                      ? "border-[var(--color-primary)]/45 bg-[var(--color-primary)]/12 text-white"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-white"
                  } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {option.icon}
                    {option.label}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  予算上限
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  ¥{budget.toLocaleString()} までに絞り込む
                </p>
              </div>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                {activeIntent?.label}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              className="mt-4 w-full accent-[var(--color-primary)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>¥1,000</span>
              <span>¥10,000</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {diagnosisResults.length > 0 ? (
              diagnosisResults.map((product, index) => (
                <QuickPickCard
                  key={product.id}
                  product={product}
                  eyebrow={`候補 ${index + 1}`}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-sm text-[var(--color-text-secondary)] lg:col-span-3">
                条件に合う候補が見つかりませんでした。予算やソースを広げると候補が増えます。
              </div>
            )}
          </div>
        </div>

        <div className="glass-card overflow-hidden p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
              <FaCalendarDay size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                今日の1本
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                デイリーピックのロジックもここに統合。毎日チェックしたい人向けの入口です。
              </p>
            </div>
          </div>

          {todayPick ? (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                {todayPick.imageUrl ? (
                  <img
                    src={todayPick.imageUrl}
                    alt={todayPick.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/10 text-[var(--color-text-muted)]">
                    <FaCalendarDay size={34} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white/85">
                  毎日更新
                </div>
                <div className="absolute right-4 top-4">
                  <FavoriteButton
                    productId={todayPick.id}
                    className="h-10 w-10 bg-black/35 backdrop-blur-sm hover:bg-black/50"
                  />
                </div>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="line-clamp-2 text-lg font-bold leading-7 text-white">
                  {todayPick.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {todayPick.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1">
                    価格 {formatPriceYen(getPresentedCurrentPrice(todayPick))}
                  </span>
                  {todayPick.isSale ? (
                    <span className="rounded-full bg-[var(--color-accent)]/15 px-2.5 py-1 text-[var(--color-accent)]">
                      値下げ中
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <PrimaryCta href={todayPick.affiliateUrl} external size="md">
                    {getPrimaryFanzaCtaLabel(todayPick)}
                  </PrimaryCta>
                  <PrimaryCta href={ROUTES.dailyPick} size="md" variant="outline">
                    デイリーピック詳細へ
                  </PrimaryCta>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-sm text-[var(--color-text-secondary)]">
              今日は表示できる候補がありません。検索条件を広げると日替わりピックも出せます。
            </div>
          )}
        </div>
      </section>

      {activeCollectionData ? (
        <>
          <section className="mb-5 flex flex-wrap gap-2">
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setActiveCollection(collection.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  activeCollection === collection.id
                    ? "border-[var(--color-primary)]/45 bg-[var(--color-primary)]/12 text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-white"
                }`}
              >
                {collection.label}
              </button>
            ))}
          </section>

          <ProductGridSection
            eyebrow="目的別ショートカット"
            title={activeCollectionData.label}
            description={activeCollectionData.description}
            products={activeCollectionData.products}
            compact
            emptyMessage="条件に合う作品が見つかりませんでした。予算かソースを切り替えてみてください。"
            action={
              <PrimaryCta href={activeCollectionData.ctaHref} size="sm" variant="outline">
                {activeCollectionData.ctaLabel}
              </PrimaryCta>
            }
          />
        </>
      ) : null}

      <section className="mt-10">
        <div className="mb-5">
          <p className="section-eyebrow">他の独自機能も使う</p>
          <h2 className="section-title">専用ツールに進む</h2>
          <p className="section-description">
            まずここで候補を絞ってから、買い時・比較・パーソナライズに進む流れがおすすめです。
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              href: ROUTES.buyTiming,
              title: "買い時判定ツール",
              description: "買い時・予算内まとめ買い・次のセール波を確認。",
              icon: <FaShoppingCart size={18} />,
            },
            {
              href: ROUTES.watchlist,
              title: "ウォッチリスト",
              description: "保存作品の優先順位と似た作品の深掘りへ。",
              icon: <FaBookmark size={18} />,
            },
            {
              href: ROUTES.personalized,
              title: "パーソナライズフィード",
              description: "履歴とウォッチリストからおすすめを濃くします。",
              icon: <FaBolt size={18} />,
            },
            {
              href: ROUTES.rankingBattle,
              title: "比較/対決モード",
              description: "迷った候補を2択・トーナメントで決める用途です。",
              icon: <FaArrowRight size={18} />,
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-border-strong)] hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]">
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary-light)]">
                開く <FaArrowRight size={10} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
