import { buildAffiliateUrl } from "@/lib/affiliate";

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
    count?: number;
    average?: number;
  };
  iteminfo?: {
    genre?: { id: number; name: string }[];
    maker?: { id: number; name: string }[];
    actress?: { id: number; name: string }[];
    label?: { id: number; name: string }[];
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
  const apiId = process.env.DMM_API_ID || "";
  const affiliateId = process.env.DMM_AFFILIATE_ID || "";
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

  return {
    id: item.content_id,
    title: item.title,
    description: genres.join(" / ") || "FANZA作品",
    imageUrl: item.imageURL?.large || item.imageURL?.small || "",
    affiliateUrl: item.affiliateURL || (item.URL ? buildAffiliateUrl(item.URL) : ""),
    price: price,
    rating: item.review?.average || 0,
    reviewCount: item.review?.count || 0,
    genre: genreKey,
    tags: genres.slice(0, 3),
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
