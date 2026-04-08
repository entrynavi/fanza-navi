import { buildAffiliateUrl } from "@/lib/affiliate";
import { getSiteConfig } from "@/lib/env";

const DMM_API_BASE = "https://api.dmm.com/affiliate/v3";
const CANONICAL_GENRE_ALIASES: Record<string, string> = {
  popular: "popular",
  "人気": "popular",
  "人気作品": "popular",
  "動画": "popular",
  "new-release": "new-release",
  newrelease: "new-release",
  "新作": "new-release",
  sale: "sale",
  "セール": "sale",
  "high-rated": "high-rated",
  highrated: "high-rated",
  "高評価": "high-rated",
  amateur: "amateur",
  "素人": "amateur",
  vr: "vr",
  "VR": "vr",
};

export function mapGenreLabelToKey(label?: string): string {
  const normalized = label?.trim() ?? "";

  if (!normalized) {
    return "popular";
  }

  return (
    CANONICAL_GENRE_ALIASES[normalized] ||
    CANONICAL_GENRE_ALIASES[normalized.toLowerCase()] ||
    normalized
  );
}

export interface DmmApiConfig {
  apiId: string;
  affiliateId: string;
}

export interface DmmProduct {
  content_id: string;
  title: string;
  URL: string;
  affiliateURL: string;
  imageURL?: {
    list?: string;
    small?: string;
    large?: string;
  };
  prices?: {
    price?: string;
    deliveries?: { type: string; price: string }[];
  };
  date?: string;
  review?: {
    count?: number | string;
    average?: number | string;
  };
  iteminfo?: {
    genre?: { id: number; name: string }[];
    maker?: { id: number; name: string }[];
    actress?: { id: number; name: string }[];
    label?: { id: number; name: string }[];
    series?: { id: number; name: string }[];
  };
}

export interface DmmApiResponse {
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    items: DmmProduct[];
  };
}

function getConfig(): DmmApiConfig {
  const { dmmApiId, dmmAffiliateId } = getSiteConfig();
  const apiId = dmmApiId || "";
  const affiliateId = dmmAffiliateId || "";
  return { apiId, affiliateId };
}

function buildBaseUrl(
  endpoint: string,
  params: Record<string, string> = {}
): string {
  const { apiId, affiliateId } = getConfig();
  const searchParams = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    output: "json",
    ...params,
  });
  return `${DMM_API_BASE}/${endpoint}?${searchParams.toString()}`;
}

function buildUrl(
  endpoint: string,
  params: Record<string, string>
): string {
  const { fanzaFloor } = getSiteConfig();
  return buildBaseUrl(endpoint, {
    site: "FANZA",
    service: "digital",
    floor: fanzaFloor,
    ...params,
  });
}

// ランキング取得（人気順）
export async function fetchRanking(
  hits: number = 20,
  offset: number = 1,
  genre?: string
): Promise<DmmProduct[]> {
  const params: Record<string, string> = {
    hits: String(hits),
    offset: String(offset),
    sort: "rank",
  };
  if (genre) params.article = "genre";
  if (genre) params.article_id = genre;

  const url = buildUrl("ItemList", params);
  return fetchProducts(url);
}

// 新作取得
export async function fetchNewReleases(
  hits: number = 20,
  offset: number = 1
): Promise<DmmProduct[]> {
  const url = buildUrl("ItemList", {
    hits: String(hits),
    offset: String(offset),
    sort: "date",
  });
  return fetchProducts(url);
}

// キーワード検索
export async function searchProducts(
  keyword: string,
  hits: number = 20,
  offset: number = 1
): Promise<DmmProduct[]> {
  const url = buildUrl("ItemList", {
    hits: String(hits),
    offset: String(offset),
    keyword: keyword,
    sort: "rank",
  });
  return fetchProducts(url);
}

// セール商品（キーワードでセール検索）
export async function fetchSaleProducts(
  hits: number = 20,
  offset: number = 1
): Promise<DmmProduct[]> {
  const url = buildUrl("ItemList", {
    hits: String(hits),
    offset: String(offset),
    sort: "rank",
    keyword: "セール",
  });
  return fetchProducts(url);
}

// ジャンル別取得
export async function fetchByGenre(
  genreId: string,
  hits: number = 20,
  offset: number = 1
): Promise<DmmProduct[]> {
  const url = buildUrl("ItemList", {
    hits: String(hits),
    offset: String(offset),
    article: "genre",
    article_id: genreId,
    sort: "rank",
  });
  return fetchProducts(url);
}

async function fetchProducts(url: string): Promise<DmmProduct[]> {
  const { apiId } = getConfig();

  if (!apiId) {
    return [];
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`DMM API error: ${res.status}`);
    }
    const data: DmmApiResponse = await res.json();
    if (!data?.result?.items || !Array.isArray(data.result.items)) {
      throw new Error("Invalid API response structure");
    }
    return data.result.items;
  } catch (e) {
    console.error("[DMM API] Fetch error:", e instanceof Error ? e.message : e);
    return [];
  }
}

// DmmProduct → 表示用Productへの変換
import type { Product } from "@/data/products";

function extractDiscountFromTitle(title: string): number | null {
  const match = title.match(/(\d+)\s*%\s*OFF/i);
  if (match) {
    const discount = parseInt(match[1]);
    if (discount > 0 && discount <= 95) return discount;
  }
  return null;
}

export function toProduct(item: DmmProduct, rank?: number, options?: { isSale?: boolean }): Product {
  const priceStr = item.prices?.price?.replace(/[^0-9]/g, "") || "0";
  const rawPrice = parseInt(priceStr) || 0;
  const genres = item.iteminfo?.genre?.map((g) => g.name) || [];
  const genreKey = mapGenreLabelToKey(genres[0]);
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const actresses = item.iteminfo?.actress?.map((person) => person.name) || [];
  const maker = item.iteminfo?.maker?.[0]?.name;
  const label = item.iteminfo?.label?.[0]?.name;
  const series = item.iteminfo?.series?.[0]?.name ?? label;

  const discountFromTitle = extractDiscountFromTitle(item.title);
  const isSale = options?.isSale || !!discountFromTitle;

  let price = rawPrice;
  let salePrice: number | undefined;

  if (discountFromTitle && rawPrice > 0) {
    salePrice = rawPrice;
    price = Math.round(rawPrice / (1 - discountFromTitle / 100));
  }

  return {
    id: item.content_id,
    title: item.title,
    description: genres.join(" / ") || "FANZA作品",
    imageUrl: item.imageURL?.large || item.imageURL?.small || "",
    affiliateUrl: item.affiliateURL || (item.URL ? buildAffiliateUrl(item.URL) : ""),
    price,
    salePrice,
    rating: rating,
    reviewCount: reviewCount,
    genre: genreKey,
    tags: genres.slice(0, 3),
    maker,
    label,
    series,
    actresses,
    rank: rank,
    isNew: isNewRelease(item.date),
    isSale,
    releaseDate: item.date || "",
  };
}

function isNewRelease(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff < 7 * 24 * 60 * 60 * 1000; // 7日以内
}

// ── 追加 API 型定義 ──

export interface DmmActress {
  id: string;
  name: string;
  ruby?: string;
  bust?: string;
  cup?: string;
  waist?: string;
  hip?: string;
  height?: string;
  birthday?: string;
  blood_type?: string;
  prefectures?: string;
  imageurl?: { small?: string; large?: string };
  listurl?: { digital?: string };
}

export interface DmmGenreInfo {
  genre_id: string;
  name: string;
  ruby?: string;
  list_url?: string;
}

export interface DmmMakerInfo {
  maker_id: string;
  name: string;
  ruby?: string;
  list_url?: string;
}

export interface DmmSeriesInfo {
  series_id: string;
  name: string;
  ruby?: string;
  list_url?: string;
}

export interface DmmFloorInfo {
  id: string;
  name: string;
  code: string;
}

// ── 追加 API 関数 ──

async function fetchBaseApi<T>(endpoint: string, params: Record<string, string>, resultKey: string): Promise<T[]> {
  const { apiId } = getConfig();
  if (!apiId) return [];
  const url = buildBaseUrl(endpoint, params);
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.result?.[resultKey] ?? [];
  } catch {
    return [];
  }
}

// 女優検索API
export async function fetchActresses(params: {
  keyword?: string;
  initial?: string;
  hits?: number;
  offset?: number;
  sort?: string;
} = {}): Promise<DmmActress[]> {
  const urlParams: Record<string, string> = {
    hits: String(params.hits ?? 30),
    offset: String(params.offset ?? 1),
  };
  if (params.keyword) urlParams.keyword = params.keyword;
  if (params.initial) urlParams.initial = params.initial;
  if (params.sort) urlParams.sort = params.sort;
  return fetchBaseApi<DmmActress>("ActressSearch", urlParams, "actress");
}

// ジャンル検索API
export async function fetchGenres(floorId: string | number = 43, params?: {
  initial?: string;
  hits?: number;
  offset?: number;
}): Promise<DmmGenreInfo[]> {
  const urlParams: Record<string, string> = {
    floor_id: String(floorId),
    hits: String(params?.hits ?? 100),
    offset: String(params?.offset ?? 1),
  };
  if (params?.initial) urlParams.initial = params.initial;
  return fetchBaseApi<DmmGenreInfo>("GenreSearch", urlParams, "genre");
}

// メーカー検索API
export async function fetchMakers(floorId: string | number = 43, params?: {
  initial?: string;
  hits?: number;
  offset?: number;
}): Promise<DmmMakerInfo[]> {
  const urlParams: Record<string, string> = {
    floor_id: String(floorId),
    hits: String(params?.hits ?? 100),
    offset: String(params?.offset ?? 1),
  };
  if (params?.initial) urlParams.initial = params.initial;
  return fetchBaseApi<DmmMakerInfo>("MakerSearch", urlParams, "maker");
}

// シリーズ検索API
export async function fetchSeriesList(floorId: string | number = 43, params?: {
  initial?: string;
  hits?: number;
  offset?: number;
}): Promise<DmmSeriesInfo[]> {
  const urlParams: Record<string, string> = {
    floor_id: String(floorId),
    hits: String(params?.hits ?? 100),
    offset: String(params?.offset ?? 1),
  };
  if (params?.initial) urlParams.initial = params.initial;
  return fetchBaseApi<DmmSeriesInfo>("SeriesSearch", urlParams, "series");
}

// フロアAPI
export async function fetchFloors(): Promise<DmmFloorInfo[]> {
  const { apiId } = getConfig();
  if (!apiId) return [];
  const url = buildBaseUrl("FloorList", {});
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const sites = data?.result?.site ?? [];
    const fanza = sites.find((s: { code: string }) => s.code === "FANZA");
    if (!fanza) return [];
    const digital = fanza.service?.find((s: { code: string }) => s.code === "digital");
    return digital?.floor ?? [];
  } catch {
    return [];
  }
}
