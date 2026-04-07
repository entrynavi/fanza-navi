import type { Product } from "@/data/products";

export interface ActressRankingEntry {
  name: string;
  appearanceCount: number;
  topProduct: Product;
  topProductTitle: string;
  averageRating: number;
  totalReviewCount: number;
  supportingGenres: string[];
}

export function getActressSlug(name: string): string {
  const normalized = name.trim();
  const bytes = new TextEncoder().encode(normalized);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function decodeActressSlug(slug: string): string {
  if (!slug.trim()) {
    return "";
  }

  if (/^[0-9a-f]+$/i.test(slug) && slug.length % 2 === 0) {
    const bytes = new Uint8Array(
      slug.match(/.{1,2}/g)?.map((pair) => parseInt(pair, 16)) ?? []
    );

    return new TextDecoder().decode(bytes).trim();
  }

  return decodeURIComponent(slug).trim();
}

interface ActressBucket {
  name: string;
  appearanceCount: number;
  topProduct: Product;
  totalRating: number;
  totalReviewCount: number;
  supportingGenres: Set<string>;
}

function normalizeActressName(name: string | undefined): string | null {
  const normalized = name?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function scoreProduct(product: Product): number {
  const rankScore = product.rank ? Math.max(0, 20 - product.rank) : 0;
  return rankScore * 10000 + product.reviewCount * 10 + Math.round(product.rating * 10);
}

function pickTopProduct(current: Product, incoming: Product): Product {
  return scoreProduct(incoming) > scoreProduct(current) ? incoming : current;
}

export function buildActressRanking(products: Product[], limit: number = 6): ActressRankingEntry[] {
  if (limit <= 0) {
    return [];
  }

  const buckets = new Map<string, ActressBucket>();

  for (const product of products) {
    const actresses = product.actresses ?? [];

    for (const actressName of actresses) {
      const normalizedName = normalizeActressName(actressName);

      if (!normalizedName) {
        continue;
      }

      const existing = buckets.get(normalizedName);

      if (!existing) {
        buckets.set(normalizedName, {
          name: normalizedName,
          appearanceCount: 1,
          topProduct: product,
          totalRating: product.rating,
          totalReviewCount: product.reviewCount,
          supportingGenres: new Set([product.genre]),
        });
        continue;
      }

      existing.appearanceCount += 1;
      existing.topProduct = pickTopProduct(existing.topProduct, product);
      existing.totalRating += product.rating;
      existing.totalReviewCount += product.reviewCount;
      existing.supportingGenres.add(product.genre);
    }
  }

  return Array.from(buckets.values())
    .sort((left, right) => {
      if (right.appearanceCount !== left.appearanceCount) {
        return right.appearanceCount - left.appearanceCount;
      }

      if (right.totalReviewCount !== left.totalReviewCount) {
        return right.totalReviewCount - left.totalReviewCount;
      }

      return right.totalRating - left.totalRating;
    })
    .slice(0, limit)
    .map((entry) => ({
      name: entry.name,
      appearanceCount: entry.appearanceCount,
      topProduct: entry.topProduct,
      topProductTitle: entry.topProduct.title,
      averageRating: Number((entry.totalRating / entry.appearanceCount).toFixed(1)),
      totalReviewCount: entry.totalReviewCount,
      supportingGenres: Array.from(entry.supportingGenres),
    }));
}
