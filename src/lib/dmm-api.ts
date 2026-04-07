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

export interface DmmNamedEntity {
  id: number | string;
  name: string;
}

interface DmmNamedEntityResponse {
  result?: {
    items?: DmmNamedEntity[];
  };
}

function getConfig(): DmmApiConfig {
  const { dmmApiId, dmmAffiliateId } = getSiteConfig();
  const apiId = dmmApiId || "";
  const affiliateId = dmmAffiliateId || "";
  return { apiId, affiliateId };
}

function buildUrl(
  endpoint: string,
  params: Record<string, string>
): string {
  const { apiId, affiliateId } = getConfig();
  const searchParams = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    site: "FANZA",
    service: "digital",
    output: "json",
    ...params,
  });
  return `${DMM_API_BASE}/${endpoint}?${searchParams.toString()}`;
}

function buildEntitySearchUrl(
  endpoint: "ActressSearch" | "MakerSearch" | "SeriesSearch",
  keyword: string,
  hits: number,
  offset: number
): string {
  const { fanzaFloor } = getSiteConfig();
  const params: Record<string, string> = {
    floor: fanzaFloor,
    hits: String(hits),
    offset: String(offset),
  };

  if (keyword.trim()) {
    params.keyword = keyword.trim();
  }

  return buildUrl(endpoint, params);
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

async function fetchNamedEntities(url: string): Promise<DmmNamedEntity[]> {
  const { apiId } = getConfig();

  if (!apiId) {
    return [];
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`DMM API error: ${res.status}`);
    }

    const data: DmmNamedEntityResponse = await res.json();

    if (!Array.isArray(data?.result?.items)) {
      throw new Error("Invalid entity response structure");
    }

    return data.result.items
      .map((item) => ({
        id: item.id,
        name: item.name?.trim?.() ?? "",
      }))
      .filter((item) => item.name.length > 0);
  } catch (e) {
    console.error("[DMM API] Entity fetch error:", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function fetchActressSearch(
  keyword: string,
  hits: number = 20,
  offset: number = 1
): Promise<DmmNamedEntity[]> {
  return fetchNamedEntities(buildEntitySearchUrl("ActressSearch", keyword, hits, offset));
}

export async function fetchMakerSearch(
  keyword: string,
  hits: number = 20,
  offset: number = 1
): Promise<DmmNamedEntity[]> {
  return fetchNamedEntities(buildEntitySearchUrl("MakerSearch", keyword, hits, offset));
}

export async function fetchSeriesSearch(
  keyword: string,
  hits: number = 20,
  offset: number = 1
): Promise<DmmNamedEntity[]> {
  return fetchNamedEntities(buildEntitySearchUrl("SeriesSearch", keyword, hits, offset));
}

// セール商品（キーワードでセール検索）
export async function fetchSaleProducts(
  hits: number = 20
): Promise<DmmProduct[]> {
  const url = buildUrl("ItemList", {
    hits: String(hits),
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

export function toProduct(item: DmmProduct, rank?: number): Product {
  const priceStr = item.prices?.price?.replace(/[^0-9]/g, "") || "0";
  const price = parseInt(priceStr) || 0;
  const genres = item.iteminfo?.genre?.map((g) => g.name) || [];
  const genreKey = mapGenreLabelToKey(genres[0]);
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const actresses = item.iteminfo?.actress?.map((person) => person.name) || [];
  const maker = item.iteminfo?.maker?.[0]?.name;
  const label = item.iteminfo?.label?.[0]?.name;
  const series = item.iteminfo?.series?.[0]?.name;

  return {
    id: item.content_id,
    title: item.title,
    description: genres.join(" / ") || "FANZA作品",
    imageUrl: item.imageURL?.large || item.imageURL?.small || "",
    affiliateUrl: item.affiliateURL || (item.URL ? buildAffiliateUrl(item.URL) : ""),
    price: price,
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
