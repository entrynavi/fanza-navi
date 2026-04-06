import { buildAffiliateUrl } from "@/lib/affiliate";
import { sampleProducts, type Product } from "@/data/products";
import {
  fetchByGenre,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
  toProduct,
} from "@/lib/dmm-api";
import type { DmmProduct } from "@/lib/dmm-api";

export interface CatalogLoadOptions {
  limit?: number;
  hits?: number;
  offset?: number;
}

export interface RelatedCatalogLoadOptions extends CatalogLoadOptions {
  currentId?: string;
  genre?: string;
}

function normalizeLimit(options: CatalogLoadOptions = {}): number {
  const limit = options.limit ?? options.hits ?? 20;
  return limit > 0 ? limit : 0;
}

function ensureAffiliateReady(product: Product): Product {
  if (product.affiliateUrl.trim()) {
    return product;
  }

  return {
    ...product,
    affiliateUrl: buildAffiliateUrl(""),
  };
}

function mergeProducts(
  primary: Product[],
  fallback: Product[],
  limit: number,
  excludedIds: Set<string> = new Set()
): Product[] {
  const merged: Product[] = [];
  const seen = new Set<string>();

  const push = (product: Product) => {
    if (merged.length >= limit) {
      return;
    }
    if (excludedIds.has(product.id) || seen.has(product.id)) {
      return;
    }
    seen.add(product.id);
    merged.push(ensureAffiliateReady(product));
  };

  primary.forEach(push);
  fallback.forEach(push);

  return merged;
}

function sortByRank(products: Product[]): Product[] {
  return [...products].sort((left, right) => {
    const leftRank = left.rank ?? Number.POSITIVE_INFINITY;
    const rightRank = right.rank ?? Number.POSITIVE_INFINITY;
    return leftRank - rightRank;
  });
}

function getCuratedRanking(limit: number): Product[] {
  return sortByRank(sampleProducts).slice(0, limit);
}

function getCuratedSale(limit: number): Product[] {
  return sortByRank(sampleProducts.filter((product) => product.isSale)).slice(
    0,
    limit
  );
}

function getCuratedNew(limit: number): Product[] {
  return sortByRank(sampleProducts.filter((product) => product.isNew)).slice(
    0,
    limit
  );
}

function getCuratedGenre(genre: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter((product) => product.genre === genre)
  ).slice(0, limit);
}

function getCuratedRelated(
  genre: string | undefined,
  currentId: string | undefined,
  limit: number
): Product[] {
  const related = sampleProducts.filter((product) => {
    if (currentId && product.id === currentId) {
      return false;
    }
    if (!genre) {
      return true;
    }
    return product.genre === genre;
  });

  return sortByRank(related).slice(0, limit);
}

function mapApiProducts(items: DmmProduct[]): Product[] {
  return items.map((item, index) => ensureAffiliateReady(toProduct(item, index + 1)));
}

async function loadCatalogProducts(
  fetcher: () => Promise<DmmProduct[]>,
  fallback: Product[],
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const apiItems = await fetcher();
  const apiProducts = mapApiProducts(apiItems);

  return mergeProducts(apiProducts, fallback, limit);
}

export async function loadRankingProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchRanking(hits, options.offset ?? 1),
    getCuratedRanking(limit),
    { limit }
  );
}

export async function loadSaleProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchSaleProducts(hits),
    getCuratedSale(limit),
    { limit }
  );
}

export async function loadNewProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchNewReleases(hits, options.offset ?? 1),
    getCuratedNew(limit),
    { limit }
  );
}

export async function loadGenreProducts(
  genreId: string,
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchByGenre(genreId, hits, options.offset ?? 1),
    getCuratedGenre(genreId, limit),
    { limit }
  );
}

export async function loadRelatedProducts(
  options: RelatedCatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;
  const fallback = getCuratedRelated(options.genre, options.currentId, limit);
  const excludedIds = new Set(options.currentId ? [options.currentId] : []);

  const fetcher = options.genre
    ? () => fetchByGenre(options.genre!, hits, options.offset ?? 1)
    : () => fetchRanking(hits, options.offset ?? 1);

  const apiProducts = mapApiProducts(await fetcher()).filter(
    (product) => !excludedIds.has(product.id)
  );

  return mergeProducts(apiProducts, fallback, limit, excludedIds);
}
