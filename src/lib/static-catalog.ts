"use client";

/**
 * static-catalog.ts — 静的 JSON シャードから商品を読み込むクライアントライブラリ。
 * Workers リクエストを消費せずに検索・ガチャ・ジャンルブラウズを実現する。
 */

import type { Product } from "@/data/products";
import { buildAffiliateUrl } from "@/lib/affiliate";

// ── Types ─────────────────────────────────────────────────────────

interface CatalogManifest {
  version: number;
  totalProducts: number;
  shardSize: number;
  allShardCount: number;
  genres: string[];
  genreStats: Record<string, { shardCount: number; totalProducts: number }>;
  keywordEntries: number;
}

interface RawProduct {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  genre: string;
  tags: string[];
  maker: string;
  actresses: string[];
  isNew: boolean;
  isSale: boolean;
  releaseDate: string;
}

export interface StaticSearchParams {
  keyword?: string;
  genre?: string | null;
  sort?: "popular" | "price-asc" | "price-desc" | "rating" | "new";
  page?: number;
  pageSize?: number;
  saleOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minReviewCount?: number;
}

export interface StaticSearchResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  scannedCount: number;
  source: "static-catalog";
}

// ── Cache ─────────────────────────────────────────────────────────

const VIDEO_CONTENT_BASE = "https://video.dmm.co.jp/av/content/";

let manifestCache: CatalogManifest | null = null;
let keywordIndexCache: Record<string, number[]> | null = null;
const shardCache = new Map<string, RawProduct[]>();

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Manifest / Index ──────────────────────────────────────────────

export async function getManifest(): Promise<CatalogManifest> {
  if (manifestCache) return manifestCache;
  manifestCache = await fetchJson<CatalogManifest>("/catalog/manifest.json");
  return manifestCache;
}

async function getKeywordIndex(): Promise<Record<string, number[]>> {
  if (keywordIndexCache) return keywordIndexCache;
  keywordIndexCache = await fetchJson<Record<string, number[]>>("/catalog/keyword-index.json");
  return keywordIndexCache;
}

export async function isCatalogAvailable(): Promise<boolean> {
  try {
    const m = await getManifest();
    return m.totalProducts > 0;
  } catch {
    return false;
  }
}

// ── Shard Loading ─────────────────────────────────────────────────

async function loadShard(path: string): Promise<RawProduct[]> {
  const cached = shardCache.get(path);
  if (cached) return cached;
  const products = await fetchJson<RawProduct[]>(path);
  shardCache.set(path, products);
  return products;
}

function allShardPath(index: number): string {
  return `/catalog/all/${String(index).padStart(4, "0")}.json`;
}

function genreShardPath(genre: string, index: number): string {
  return `/catalog/genre/${genre}/${String(index).padStart(4, "0")}.json`;
}

// ── Product Mapping ───────────────────────────────────────────────

function toProduct(raw: RawProduct, rank?: number): Product {
  const contentUrl = `${VIDEO_CONTENT_BASE}?id=${encodeURIComponent(raw.id)}`;
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    imageUrl: raw.imageUrl,
    affiliateUrl: buildAffiliateUrl(contentUrl),
    price: raw.price,
    salePrice: raw.salePrice,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    genre: raw.genre,
    tags: raw.tags,
    maker: raw.maker,
    label: "",
    series: "",
    actresses: raw.actresses,
    rank,
    isNew: raw.isNew,
    isSale: raw.isSale,
    releaseDate: raw.releaseDate,
  };
}

// ── Filtering / Sorting ───────────────────────────────────────────

function matchesKeyword(raw: RawProduct, keyword: string): boolean {
  const kw = keyword.toLowerCase();
  return (
    raw.title.toLowerCase().includes(kw) ||
    raw.description.toLowerCase().includes(kw) ||
    raw.tags.some((t) => t.toLowerCase().includes(kw)) ||
    raw.actresses.some((a) => a.toLowerCase().includes(kw)) ||
    (raw.maker || "").toLowerCase().includes(kw)
  );
}

function matchesFilters(
  raw: RawProduct,
  params: StaticSearchParams
): boolean {
  if (params.genre && raw.genre !== params.genre) return false;
  if (params.saleOnly && !raw.isSale) return false;
  const effectivePrice = raw.salePrice ?? raw.price;
  if (params.minPrice && effectivePrice < params.minPrice) return false;
  if (params.maxPrice && effectivePrice > params.maxPrice) return false;
  if (params.minRating && raw.rating < params.minRating) return false;
  if (params.minReviewCount && raw.reviewCount < params.minReviewCount) return false;
  return true;
}

function sortRawProducts(
  products: RawProduct[],
  sort: string
): RawProduct[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    case "new":
      return sorted.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
      );
    case "popular":
    default:
      return sorted; // already in popularity order
  }
}

// ── Search ────────────────────────────────────────────────────────

export async function searchStaticCatalog(
  params: StaticSearchParams
): Promise<StaticSearchResult> {
  const manifest = await getManifest();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 24;
  const keyword = params.keyword?.trim() || "";
  const sort = params.sort || "popular";
  const genre = params.genre?.trim() || "";

  // Determine which shards to scan
  let shardPaths: string[] = [];

  if (genre && manifest.genreStats[genre]) {
    // Use pre-built genre shards
    const count = manifest.genreStats[genre].shardCount;
    for (let i = 0; i < count; i++) {
      shardPaths.push(genreShardPath(genre, i));
    }
  } else if (keyword && !genre) {
    // Use keyword index to find relevant shards first
    try {
      const kwIndex = await getKeywordIndex();
      const relevantShards = new Set<number>();

      // Check exact match and substring matches in index
      for (const [name, shards] of Object.entries(kwIndex)) {
        if (
          name.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(name.toLowerCase())
        ) {
          for (const s of shards) relevantShards.add(s);
        }
      }

      if (relevantShards.size > 0) {
        // Load keyword-matched shards first, then remainder
        const sorted = [...relevantShards].sort((a, b) => a - b);
        for (const s of sorted) shardPaths.push(allShardPath(s));
        // Add remaining shards
        for (let i = 0; i < manifest.allShardCount; i++) {
          if (!relevantShards.has(i)) shardPaths.push(allShardPath(i));
        }
      } else {
        // No index hits — scan all shards
        for (let i = 0; i < manifest.allShardCount; i++) {
          shardPaths.push(allShardPath(i));
        }
      }
    } catch {
      for (let i = 0; i < manifest.allShardCount; i++) {
        shardPaths.push(allShardPath(i));
      }
    }
  } else {
    // Scan all shards
    for (let i = 0; i < manifest.allShardCount; i++) {
      shardPaths.push(allShardPath(i));
    }
  }

  // Progressive shard loading: collect enough results for the requested page
  const neededResults = page * pageSize + pageSize; // overshoot slightly for sorting
  const matched: RawProduct[] = [];
  let scannedCount = 0;

  // Load shards in parallel batches of 4
  const PARALLEL = 4;
  for (let batch = 0; batch < shardPaths.length; batch += PARALLEL) {
    const paths = shardPaths.slice(batch, batch + PARALLEL);
    const shards = await Promise.all(paths.map((p) => loadShard(p).catch(() => [] as RawProduct[])));

    for (const shard of shards) {
      for (const raw of shard) {
        scannedCount++;
        if (keyword && !matchesKeyword(raw, keyword)) continue;
        if (!matchesFilters(raw, params)) continue;
        matched.push(raw);
      }
    }

    // For non-sort-dependent queries or popularity sort, we can stop early
    if (
      (sort === "popular" || (!keyword && genre)) &&
      matched.length >= neededResults
    ) {
      break;
    }
  }

  // Sort matched results
  const sorted = sortRawProducts(matched, sort);
  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  return {
    items: pageItems.map((raw, i) => toProduct(raw, start + i + 1)),
    total: matched.length,
    page,
    pageSize,
    hasMore: start + pageSize < matched.length,
    scannedCount,
    source: "static-catalog",
  };
}

// ── Random Pick (Gacha) ───────────────────────────────────────────

export async function getRandomProducts(
  count: number,
  options?: {
    genre?: string;
    maxPrice?: number;
    minRating?: number;
  }
): Promise<Product[]> {
  const manifest = await getManifest();
  const genre = options?.genre;
  const useGenreShards = genre && manifest.genreStats[genre];

  const totalShards = useGenreShards
    ? manifest.genreStats[genre!].shardCount
    : manifest.allShardCount;

  // Pick random shards to load (sample a few for variety)
  const shardsToLoad = Math.min(totalShards, Math.max(3, Math.ceil(count / 50)));
  const shardIndices = new Set<number>();
  while (shardIndices.size < shardsToLoad) {
    shardIndices.add(Math.floor(Math.random() * totalShards));
  }

  const paths = [...shardIndices].map((i) =>
    useGenreShards ? genreShardPath(genre!, i) : allShardPath(i)
  );

  const shards = await Promise.all(
    paths.map((p) => loadShard(p).catch(() => [] as RawProduct[]))
  );

  let pool: RawProduct[] = [];
  for (const shard of shards) {
    for (const raw of shard) {
      if (options?.maxPrice && (raw.salePrice ?? raw.price) > options.maxPrice) continue;
      if (options?.minRating && raw.rating < options.minRating) continue;
      pool.push(raw);
    }
  }

  // Shuffle and pick
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).map((raw, i) => toProduct(raw, i + 1));
}

// ── Genre Browse ──────────────────────────────────────────────────

export async function browseGenre(
  genre: string,
  page: number = 1,
  pageSize: number = 24
): Promise<StaticSearchResult> {
  return searchStaticCatalog({ genre, page, pageSize });
}

// ── Stats ─────────────────────────────────────────────────────────

export async function getCatalogStats(): Promise<{
  totalProducts: number;
  genres: string[];
  genreStats: Record<string, { shardCount: number; totalProducts: number }>;
  generatedAt?: string;
}> {
  const m = await getManifest();
  return {
    totalProducts: m.totalProducts,
    genres: m.genres,
    genreStats: m.genreStats,
    generatedAt: (m as unknown as Record<string, unknown>).generatedAt as string | undefined,
  };
}
