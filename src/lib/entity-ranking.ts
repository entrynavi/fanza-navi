import type { Product } from "@/data/products";

export interface EntityCandidate {
  name: string;
  slug: string;
  productCount: number;
  totalReviewCount: number;
  averageRating: number;
}

interface EntityBucket {
  name: string;
  productCount: number;
  totalReviewCount: number;
  totalRating: number;
}

const ENTITY_LIMIT = 8;

export function normalizeEntityName(name: string | undefined): string | null {
  const normalized = (name ?? "").replace(/\u3000/g, " ").replace(/\s+/g, " ").trim();

  return normalized.length > 0 ? normalized : null;
}

export function dedupeEntityNames(names: Array<string | undefined>): string[] {
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const name of names) {
    const normalized = normalizeEntityName(name);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(normalized);
  }

  return deduped;
}

export function getEntitySlug(name: string): string {
  const normalized = normalizeEntityName(name) ?? "";
  const bytes = new TextEncoder().encode(normalized);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function decodeEntitySlug(slug: string): string {
  const normalized = slug.trim();

  if (!normalized) {
    return "";
  }

  if (/^[0-9a-f]+$/i.test(normalized) && normalized.length % 2 === 0) {
    const bytes = new Uint8Array(
      normalized.match(/.{1,2}/g)?.map((pair) => Number.parseInt(pair, 16)) ?? []
    );

    return new TextDecoder().decode(bytes).trim();
  }

  return decodeURIComponent(normalized).trim();
}

function compareBuckets(left: EntityBucket, right: EntityBucket): number {
  if (right.productCount !== left.productCount) {
    return right.productCount - left.productCount;
  }

  if (right.totalReviewCount !== left.totalReviewCount) {
    return right.totalReviewCount - left.totalReviewCount;
  }

  if (right.totalRating !== left.totalRating) {
    return right.totalRating - left.totalRating;
  }

  return left.name.localeCompare(right.name, "ja");
}

function buildEntityCandidates(
  products: Product[],
  getNames: (product: Product) => Array<string | undefined>,
  limit: number = ENTITY_LIMIT
): EntityCandidate[] {
  if (limit <= 0) {
    return [];
  }

  const buckets = new Map<string, EntityBucket>();

  for (const product of products) {
    const names = dedupeEntityNames(getNames(product));

    for (const name of names) {
      const existing = buckets.get(name);

      if (existing) {
        existing.productCount += 1;
        existing.totalReviewCount += product.reviewCount;
        existing.totalRating += product.rating;
        continue;
      }

      buckets.set(name, {
        name,
        productCount: 1,
        totalReviewCount: product.reviewCount,
        totalRating: product.rating,
      });
    }
  }

  return Array.from(buckets.values())
    .sort(compareBuckets)
    .slice(0, limit)
    .map((bucket) => ({
      name: bucket.name,
      slug: getEntitySlug(bucket.name),
      productCount: bucket.productCount,
      totalReviewCount: bucket.totalReviewCount,
      averageRating: Number((bucket.totalRating / bucket.productCount).toFixed(1)),
    }));
}

export function buildActressCandidates(
  products: Product[],
  limit: number = ENTITY_LIMIT
): EntityCandidate[] {
  return buildEntityCandidates(products, (product) => product.actresses ?? [], limit);
}

export function buildMakerCandidates(
  products: Product[],
  limit: number = ENTITY_LIMIT
): EntityCandidate[] {
  return buildEntityCandidates(products, (product) => [product.maker], limit);
}

export function buildSeriesCandidates(
  products: Product[],
  limit: number = ENTITY_LIMIT
): EntityCandidate[] {
  return buildEntityCandidates(products, (product) => [product.series ?? product.label], limit);
}
