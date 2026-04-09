"use client";

import { useEffect, useMemo, useState } from "react";
import { FaBolt, FaFire, FaSearch, FaSlidersH, FaStar, FaTags, FaTimes } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import GenreRail from "@/components/GenreRail";
import ProductCard from "@/components/ProductCard";
import SectionIntro from "@/components/SectionIntro";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import { getWorkersCatalogReady, hasWorkersApi, searchWorkersCatalog } from "@/lib/workers-api";

const PAGE_SIZE = 24;

const sortOptions = [
  { value: "popular", label: "人気順", icon: <FaFire size={11} /> },
  { value: "price-asc", label: "価格が安い順", icon: <FaTags size={11} /> },
  { value: "price-desc", label: "価格が高い順", icon: <FaTags size={11} /> },
  { value: "rating", label: "評価が高い順", icon: <FaStar size={11} /> },
  { value: "new", label: "新着順", icon: <FaBolt size={11} /> },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];
type SearchScope = "remote" | "local";

const priceRanges = [
  { label: "すべて", min: 0, max: null as number | null },
  { label: "〜¥1,000", min: 0, max: 1000 },
  { label: "¥1,000〜¥3,000", min: 1000, max: 3000 },
  { label: "¥3,000〜¥5,000", min: 3000, max: 5000 },
  { label: "¥5,000〜", min: 5000, max: null as number | null },
] as const;

const ratingThresholds = [
  { label: "指定なし", value: 0 },
  { label: "★4.0以上", value: 4 },
  { label: "★4.5以上", value: 4.5 },
] as const;

const reviewCountThresholds = [
  { label: "指定なし", value: 0 },
  { label: "レビュー50件以上", value: 50 },
  { label: "レビュー200件以上", value: 200 },
  { label: "レビュー500件以上", value: 500 },
] as const;

function getEffectivePrice(product: Product) {
  return product.salePrice ?? product.price;
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "popular":
      return sorted.sort((left, right) => (left.rank ?? 99999) - (right.rank ?? 99999) || right.reviewCount - left.reviewCount);
    case "price-asc":
      return sorted.sort((left, right) => getEffectivePrice(left) - getEffectivePrice(right));
    case "price-desc":
      return sorted.sort((left, right) => getEffectivePrice(right) - getEffectivePrice(left));
    case "rating":
      return sorted.sort((left, right) => right.rating - left.rating || right.reviewCount - left.reviewCount);
    case "new":
      return sorted.sort(
        (left, right) => new Date(right.releaseDate).getTime() - new Date(left.releaseDate).getTime()
      );
    default:
      return sorted;
  }
}

export default function SearchPage({
  allProducts,
  genres,
}: {
  allProducts: Product[];
  genres: GenreLandingPage[];
}) {
  const workersAvailable = hasWorkersApi();
  const [scope, setScope] = useState<SearchScope>(workersAvailable ? "remote" : "local");
  const [catalogReady, setCatalogReady] = useState<boolean | null>(workersAvailable ? null : false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("popular");
  const [priceRange, setPriceRange] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [saleOnly, setSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviewCount, setMinReviewCount] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [remoteResults, setRemoteResults] = useState<Product[]>([]);
  const [remoteTotal, setRemoteTotal] = useState<number | null>(null);
  const [remoteHasMore, setRemoteHasMore] = useState(false);
  const [remoteScannedCount, setRemoteScannedCount] = useState(0);
  const [loadingRemote, setLoadingRemote] = useState(workersAvailable);
  const [remoteNotice, setRemoteNotice] = useState("");

  const genreList = useMemo(() => {
    const counts = new Map<string, number>();
    allProducts.forEach((product) => counts.set(product.genre, (counts.get(product.genre) || 0) + 1));
    return genres.filter((genre) => counts.has(genre.slug));
  }, [allProducts, genres]);

  const localResults = useMemo(() => {
    let filtered = allProducts;

    if (query.trim()) {
      const normalized = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(normalized) ||
          product.description.toLowerCase().includes(normalized) ||
          product.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
          product.actresses?.some((actress) => actress.toLowerCase().includes(normalized)) ||
          product.maker?.toLowerCase().includes(normalized) ||
          product.series?.toLowerCase().includes(normalized)
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((product) => product.genre === selectedGenre);
    }

    if (saleOnly) {
      filtered = filtered.filter((product) => product.isSale);
    }

    const range = priceRanges[priceRange];
    filtered = filtered.filter((product) => {
      const price = getEffectivePrice(product);
      const meetsMin = price >= range.min;
      const meetsMax = range.max === null ? true : price < range.max;
      return meetsMin && meetsMax;
    });

    if (minRating > 0) {
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    if (minReviewCount > 0) {
      filtered = filtered.filter((product) => product.reviewCount >= minReviewCount);
    }

    return sortProducts(filtered, sort);
  }, [allProducts, minRating, minReviewCount, priceRange, query, saleOnly, selectedGenre, sort]);

  useEffect(() => {
    if (!workersAvailable) {
      setCatalogReady(false);
      return;
    }

    const controller = new AbortController();

    getWorkersCatalogReady({ signal: controller.signal })
      .then((ready) => {
        if (controller.signal.aborted) {
          return;
        }

        setCatalogReady(ready);
        if (!ready) {
          setScope("local");
          setRemoteNotice(
            "FANZA全体検索は現在メンテナンス中のため、取得済みデータからの高速検索に切り替えています。"
          );
        }
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setCatalogReady(false);
        setScope("local");
        setRemoteNotice(
          "FANZA全体検索は現在メンテナンス中のため、取得済みデータからの高速検索に切り替えています。"
        );
      });

    return () => controller.abort();
  }, [workersAvailable]);

  useEffect(() => {
    if (scope !== "remote" || catalogReady !== true) {
      setLoadingRemote(false);
      return;
    }

    const controller = new AbortController();
    const range = priceRanges[priceRange];
    setLoadingRemote(true);
    setRemoteNotice("");

    searchWorkersCatalog({
      keyword: query,
      genre: selectedGenre,
      sort,
      page,
      pageSize: PAGE_SIZE,
      saleOnly,
      minPrice: range.min,
      maxPrice: range.max ?? undefined,
      minRating,
      minReviewCount,
      signal: controller.signal,
    })
      .then((response) => {
        setRemoteResults(response.items);
        setRemoteTotal(response.total);
        setRemoteHasMore(response.hasMore);
        setRemoteScannedCount(response.scannedCount);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error("[search] remote search failed", error);
        setScope("local");
        setRemoteNotice("FANZA全体検索に接続できなかったため、取得済みデータからの高速検索に切り替えました。");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingRemote(false);
        }
      });

    return () => controller.abort();
  }, [catalogReady, minRating, minReviewCount, page, priceRange, query, saleOnly, scope, selectedGenre, sort]);

  const activeFilterCount =
    (selectedGenre ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (priceRange > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minReviewCount > 0 ? 1 : 0);

  const results = scope === "remote" ? remoteResults : localResults.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalResults = scope === "remote" ? remoteTotal ?? remoteResults.length : localResults.length;
  const hasNextPage = scope === "remote" ? remoteHasMore : page * PAGE_SIZE < localResults.length;
  const hasPrevPage = page > 1;

  const handleResetFilters = () => {
    setSelectedGenre(null);
    setPriceRange(0);
    setSaleOnly(false);
    setMinRating(0);
    setMinReviewCount(0);
    setPage(1);
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <section className="mb-8">
        <SectionIntro
          eyebrow="作品検索"
          title="気になる作品を見つけよう"
          description="FANZA全体をページング検索しつつ、取得済み1,200件超の高速検索にも切り替えられます。価格帯・評価・レビュー件数まで絞って、重くしすぎず精度を上げています。"
        />

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setScope("remote");
              setPage(1);
            }}
            disabled={!workersAvailable || catalogReady !== true}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              scope === "remote"
                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            FANZA全体から検索
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
              {catalogReady === null ? "接続確認中" : catalogReady ? "推奨" : "調整中"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setScope("local");
              setPage(1);
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              scope === "local"
                ? "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
            }`}
          >
            高速モード
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">1,200件超</span>
          </button>
        </div>

        {remoteNotice ? (
          <p className="mb-4 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/6 px-4 py-3 text-xs leading-6 text-[var(--color-text-secondary)]">
            {remoteNotice}
          </p>
        ) : null}

        <div className="relative mb-4">
          <FaSearch
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="作品名・女優名・メーカー・シリーズで検索…"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-11 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <FaTimes size={14} />
            </button>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-[var(--color-primary-light)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            <FaSlidersH size={12} />
            フィルター
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => {
              setSaleOnly((current) => !current);
              setPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-all ${
              saleOnly
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            <FaTags size={11} />
            セール中のみ
          </button>

          <div className="ml-auto">
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortValue);
                setPage(1);
              }}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showFilters ? (
          <div className="mb-6 space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">ジャンル</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenre(null);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    !selectedGenre
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  すべて
                </button>
                {genreList.map((genre) => (
                  <button
                    key={genre.slug}
                    type="button"
                    onClick={() => {
                      setSelectedGenre(selectedGenre === genre.slug ? null : genre.slug);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedGenre === genre.slug
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">価格帯</p>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => {
                      setPriceRange(index);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      priceRange === index
                        ? "bg-[var(--color-accent)] text-[#1a1520]"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">評価</p>
              <div className="flex flex-wrap gap-2">
                {ratingThresholds.map((threshold) => (
                  <button
                    key={threshold.label}
                    type="button"
                    onClick={() => {
                      setMinRating(threshold.value);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      minRating === threshold.value
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {threshold.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-[var(--color-text-muted)]">レビュー件数</p>
              <div className="flex flex-wrap gap-2">
                {reviewCountThresholds.map((threshold) => (
                  <button
                    key={threshold.label}
                    type="button"
                    onClick={() => {
                      setMinReviewCount(threshold.value);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      minReviewCount === threshold.value
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {threshold.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[var(--color-primary-light)] hover:underline"
              >
                フィルターをリセット
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text-primary)]">{totalResults}</span>
          <span>{scope === "remote" ? "件以上の候補を取得" : "件の作品"}</span>
          {scope === "remote" ? (
            <span>
              FANZA全体を検索中
              {remoteScannedCount > 0 ? `（今回 ${remoteScannedCount} 件を走査）` : ""}
            </span>
          ) : (
            <span>取得済みデータから高速表示</span>
          )}
          {query ? (
            <span>
              「<span className="text-[var(--color-accent)]">{query}</span>」の検索結果
            </span>
          ) : null}
        </div>

        {loadingRemote && scope === "remote" ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">FANZA全体から検索中です…</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, index) => (
              <ProductCard key={`${scope}-${product.id}-${page}`} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
              該当する作品が見つかりませんでした
            </p>
            <p className="mb-4 text-sm text-[var(--color-text-muted)]">
              検索条件を変更するか、フィルターをリセットしてみてください。
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                handleResetFilters();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 px-4 py-2 text-sm font-medium text-[var(--color-primary-light)] transition-colors hover:bg-[var(--color-primary)]/15"
            >
              条件をリセット
            </button>
          </div>
        )}

        {totalResults > 0 ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={!hasPrevPage}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              前へ
            </button>
            <span className="text-xs text-[var(--color-text-muted)]">
              {page}
              {scope === "local" ? ` / ${Math.max(1, Math.ceil(localResults.length / PAGE_SIZE))}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!hasNextPage}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              次へ
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="ジャンル一覧"
          title="ジャンル別に探す"
          description="人気、セール、VRなど、目的別にすぐ探せます。"
        />
        <GenreRail genres={genres} dense />
      </section>
    </main>
  );
}
