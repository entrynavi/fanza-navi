"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaTimes, FaSlidersH, FaStar, FaFire, FaTags, FaBolt } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import GenreRail from "@/components/GenreRail";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import type { GenreLandingPage } from "@/data/genres";

const sortOptions = [
  { value: "popular", label: "人気順", icon: <FaFire size={11} /> },
  { value: "price-asc", label: "価格が安い順", icon: <FaTags size={11} /> },
  { value: "price-desc", label: "価格が高い順", icon: <FaTags size={11} /> },
  { value: "rating", label: "評価が高い順", icon: <FaStar size={11} /> },
  { value: "new", label: "新着順", icon: <FaBolt size={11} /> },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

const priceRanges = [
  { label: "すべて", min: 0, max: Infinity },
  { label: "〜¥1,000", min: 0, max: 1000 },
  { label: "¥1,000〜¥3,000", min: 1000, max: 3000 },
  { label: "¥3,000〜¥5,000", min: 3000, max: 5000 },
  { label: "¥5,000〜", min: 5000, max: Infinity },
] as const;

function getEffectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => (b.rank ?? 999) - (a.rank ?? 999) || b.reviewCount - a.reviewCount);
    case "price-asc":
      return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "new":
      return sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("popular");
  const [priceRange, setPriceRange] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [saleOnly, setSaleOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const genreList = useMemo(() => {
    const counts = new Map<string, number>();
    allProducts.forEach((p) => counts.set(p.genre, (counts.get(p.genre) || 0) + 1));
    return genres.filter((g) => counts.has(g.slug));
  }, [allProducts, genres]);

  const results = useMemo(() => {
    let filtered = allProducts;

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.actresses?.some((a) => a.toLowerCase().includes(q)) ||
          p.maker?.toLowerCase().includes(q) ||
          p.series?.toLowerCase().includes(q)
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter((p) => p.genre === selectedGenre);
    }

    if (saleOnly) {
      filtered = filtered.filter((p) => p.isSale);
    }

    const range = priceRanges[priceRange];
    if (range.min > 0 || range.max < Infinity) {
      filtered = filtered.filter((p) => {
        const price = getEffectivePrice(p);
        return price >= range.min && price < range.max;
      });
    }

    return sortProducts(filtered, sort);
  }, [allProducts, query, sort, priceRange, selectedGenre, saleOnly]);

  const activeFilterCount =
    (selectedGenre ? 1 : 0) + (saleOnly ? 1 : 0) + (priceRange > 0 ? 1 : 0);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <section className="mb-8">
        <SectionIntro
          eyebrow="作品検索"
          title="気になる作品を見つけよう"
          description="キーワード・ジャンル・価格帯で絞り込めます。"
        />

        {/* Search bar */}
        <div className="relative mb-4">
          <FaSearch
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="作品名・女優名・メーカー・タグで検索…"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-11 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>

        {/* Filter toggle + sort */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-[var(--color-primary-light)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            }`}
          >
            <FaSlidersH size={12} />
            フィルター
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSaleOnly(!saleOnly)}
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
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)] focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">ジャンル</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre(null)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    !selectedGenre
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  すべて
                </button>
                {genreList.map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => setSelectedGenre(selectedGenre === g.slug ? null : g.slug)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedGenre === g.slug
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">価格帯</p>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      priceRange === i
                        ? "bg-[var(--color-accent)] text-[#1a1520]"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setPriceRange(0);
                  setSaleOnly(false);
                }}
                className="text-xs text-[var(--color-primary-light)] hover:underline"
              >
                フィルターをリセット
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text-primary)]">{results.length}</span>
          <span>件の作品</span>
          {query && (
            <span>
              「<span className="text-[var(--color-accent)]">{query}</span>」の検索結果
            </span>
          )}
        </div>

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              該当する作品が見つかりませんでした
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              検索条件を変更するか、フィルターをリセットしてみてください。
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedGenre(null);
                setPriceRange(0);
                setSaleOnly(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 px-4 py-2 text-sm font-medium text-[var(--color-primary-light)] transition-colors hover:bg-[var(--color-primary)]/15"
            >
              条件をリセット
            </button>
          </div>
        )}
      </section>

      {/* Genre discovery */}
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
