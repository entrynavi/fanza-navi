import { sampleProducts, type Product } from "@/data/products";
import { getGenreBySlug } from "@/data/genres";
import { normalizeEntityName } from "@/lib/entity-ranking";
import {
  fetchByGenre,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
  mapGenreLabelToKey,
  searchProducts,
  toProduct,
} from "@/lib/dmm-api";
import type { DmmProduct } from "@/lib/dmm-api";

export interface CatalogLoadOptions {
  limit?: number;
  hits?: number;
  offset?: number;
  articleId?: string;
}

export interface RelatedCatalogLoadOptions extends CatalogLoadOptions {
  currentId?: string;
  genre?: string;
}

export interface ActressCatalogLoadOptions extends CatalogLoadOptions {
  seedProducts?: Product[];
}

function normalizeLimit(options: CatalogLoadOptions = {}): number {
  const limit = options.limit ?? options.hits ?? 20;
  return limit > 0 ? limit : 0;
}

function canonicalizeGenreKey(label?: string): string {
  return mapGenreLabelToKey(label);
}

function stripRank(product: Product): Product {
  const { rank, ...rest } = product;
  return rest;
}

function mergeProducts(
  primary: Product[],
  fallback: Product[],
  limit: number,
  excludedIds: Set<string> = new Set(),
  preserveRank = false
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
    const next = preserveRank ? product : stripRank(product);
    if (!next.affiliateUrl.trim()) {
      return;
    }
    merged.push(next);
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
  return sortByRank(sampleProducts.filter((product) => product.isSale)).slice(0, limit);
}

function getCuratedNew(limit: number): Product[] {
  return sortByRank(sampleProducts.filter((product) => product.isNew)).slice(0, limit);
}

function getCuratedGenre(genreKey: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter((product) => canonicalizeGenreKey(product.genre) === genreKey)
  ).slice(0, limit);
}

function getCuratedRelated(
  genreKey: string | undefined,
  currentId: string | undefined,
  limit: number
): Product[] {
  const related = sampleProducts.filter((product) => {
    if (currentId && product.id === currentId) {
      return false;
    }
    if (!genreKey) {
      return true;
    }
    return canonicalizeGenreKey(product.genre) === genreKey;
  });

  return sortByRank(related).slice(0, limit);
}

function getCuratedActress(name: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter((product) =>
      product.actresses?.some((actress) => actress.trim() === name.trim())
    )
  ).slice(0, limit);
}

function getSeedActressProducts(products: Product[], name: string, limit: number): Product[] {
  return sortByRank(
    products.filter((product) =>
      product.actresses?.some((actress) => actress.trim() === name.trim())
    )
  ).slice(0, limit);
}

function mapApiProducts(items: DmmProduct[] | undefined, preserveRank = false): Product[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const product = toProduct(item, preserveRank ? index + 1 : undefined);
    return preserveRank ? product : stripRank(product);
  });
}

async function loadCatalogProducts(
  fetcher: () => Promise<DmmProduct[]>,
  fallback: Product[],
  options: CatalogLoadOptions = {},
  preserveRank = false
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const apiItems = await fetcher();
  const apiProducts = mapApiProducts(apiItems, preserveRank);

  return mergeProducts(apiProducts, fallback, limit, new Set(), preserveRank);
}

export async function loadRankingProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchRanking(hits, options.offset ?? 1),
    getCuratedRanking(limit),
    { limit },
    true
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
  const genreKey = canonicalizeGenreKey(genreId);
  const articleId = options.articleId;

  if (!articleId) {
    return getCuratedGenre(genreKey, limit).map(stripRank);
  }

  return loadCatalogProducts(
    () => fetchByGenre(articleId, hits, options.offset ?? 1),
    getCuratedGenre(genreKey, limit),
    { limit }
  );
}

export async function loadRelatedProducts(
  options: RelatedCatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;
  const genreKey = options.genre ? canonicalizeGenreKey(options.genre) : undefined;
  const articleId = options.articleId;
  const fallback = getCuratedRelated(genreKey, options.currentId, limit);
  const excludedIds = new Set(options.currentId ? [options.currentId] : []);

  if (!articleId) {
    return fallback
      .filter((product) => !excludedIds.has(product.id))
      .map(stripRank)
      .slice(0, limit);
  }

  const apiProducts = mapApiProducts(
    await fetchByGenre(articleId, hits, options.offset ?? 1),
    false
  ).filter(
    (product) => !excludedIds.has(product.id)
  );

  return mergeProducts(apiProducts, fallback, limit, excludedIds);
}

export async function loadActressProducts(
  actressName: string,
  options: ActressCatalogLoadOptions = {}
): Promise<Product[]> {
  const normalizedName = actressName.trim();

  if (!normalizedName) {
    return [];
  }

  const limit = normalizeLimit(options);
  const hits = options.hits ?? Math.max(limit, 12);
  const fallback = mergeProducts(
    getSeedActressProducts(options.seedProducts ?? [], normalizedName, limit),
    getCuratedActress(normalizedName, limit),
    limit
  );
  const apiProducts = mapApiProducts(
    await searchProducts(normalizedName, hits, options.offset ?? 1),
    false
  );
  const exactMatches = apiProducts.filter((product) =>
    product.actresses?.some((actress) => actress.trim() === normalizedName)
  );
  const primary = exactMatches.length > 0 ? exactMatches : apiProducts;

  return mergeProducts(primary, fallback, limit);
}

export async function loadSeriesProducts(
  seriesName: string,
  options: { limit?: number; excludedIds?: Set<string> } = {}
): Promise<Product[]> {
  const normalizedName = seriesName.trim();
  
  if (!normalizedName) {
    return [];
  }

  const limit = normalizeLimit(options);
  const excludedIds = options.excludedIds ?? new Set();
  
  // Get products from the sample set that match the series
  const fallback = sampleProducts
    .filter(
      (product) =>
        product.series &&
        normalizeEntityName(product.series) === normalizeEntityName(normalizedName) &&
        !excludedIds.has(product.id)
    )
    .slice(0, limit);

  return fallback;
}

export function buildMakerCandidates(
  products: Product[],
  limit: number = 3
): Array<{ name: string; count: number }> {
  const makerCounts = new Map<string, number>();

  products.forEach((product) => {
    if (product.maker) {
      const current = makerCounts.get(product.maker) ?? 0;
      makerCounts.set(product.maker, current + 1);
    }
  });

  return Array.from(makerCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function loadEntityDiscoveryCatalog(
  options: { limit?: number } = {}
): Promise<{
  sourceProducts: Product[];
  makers: Array<{ name: string; count: number }>;
  actresses: Array<{ name: string; count: number }>;
  series: Array<{ name: string; count: number }>;
  genres: Array<{ slug: string; name: string; count: number }>;
}> {
  const limit = normalizeLimit(options);
  const sourceProducts = await loadRankingProducts({ limit });
  
  const makerCounts = new Map<string, number>();
  const actressCounts = new Map<string, number>();
  const seriesCounts = new Map<string, number>();
  const genreCounts = new Map<string, number>();

  sourceProducts.forEach((product) => {
    if (product.maker) {
      makerCounts.set(product.maker, (makerCounts.get(product.maker) ?? 0) + 1);
    }
    product.actresses?.forEach((actress) => {
      actressCounts.set(actress, (actressCounts.get(actress) ?? 0) + 1);
    });
    if (product.series) {
      seriesCounts.set(product.series, (seriesCounts.get(product.series) ?? 0) + 1);
    }
    if (product.genre) {
      genreCounts.set(product.genre, (genreCounts.get(product.genre) ?? 0) + 1);
    }
  });

  return {
    sourceProducts,
    makers: Array.from(makerCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    actresses: Array.from(actressCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    series: Array.from(seriesCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    genres: Array.from(genreCounts.entries())
      .map(([slug, count]) => ({
        slug,
        name: getGenreBySlug(slug)?.name ?? slug,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4),
  };
}

export async function loadMakerProducts(
  makerName: string,
  options: { limit?: number; excludedIds?: Set<string> } = {}
): Promise<Product[]> {
  const normalizedName = makerName.trim();
  
  if (!normalizedName) {
    return [];
  }

  const limit = normalizeLimit(options);
  const excludedIds = options.excludedIds ?? new Set();
  
  // Get products from the sample set that match the maker
  const fallback = sampleProducts
    .filter(
      (product) =>
        product.maker &&
        normalizeEntityName(product.maker) === normalizeEntityName(normalizedName) &&
        !excludedIds.has(product.id)
    )
    .slice(0, limit);

  return fallback;
}
