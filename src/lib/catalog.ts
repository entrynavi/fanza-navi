import { sampleProducts, type Product } from "@/data/products";
import {
  fetchActressSearch,
  fetchByGenre,
  fetchMakerSearch,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
  fetchSeriesSearch,
  mapGenreLabelToKey,
  searchProducts,
  toProduct,
} from "@/lib/dmm-api";
import {
  buildActressCandidates,
  buildMakerCandidates,
  buildSeriesCandidates,
  normalizeEntityName,
} from "@/lib/entity-ranking";
import type { DmmNamedEntity, DmmProduct } from "@/lib/dmm-api";
import type { EntityCandidate } from "@/lib/entity-ranking";

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

export interface EntityCatalogLoadOptions extends CatalogLoadOptions {
  seedProducts?: Product[];
}

export interface EntityDiscoveryCatalog {
  sourceProducts: Product[];
  actressCandidates: EntityCandidate[];
  makerCandidates: EntityCandidate[];
  seriesCandidates: EntityCandidate[];
  actressDirectory: DmmNamedEntity[];
  makerDirectory: DmmNamedEntity[];
  seriesDirectory: DmmNamedEntity[];
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
      product.actresses?.some((actress) => normalizeEntityName(actress) === normalizeEntityName(name))
    )
  ).slice(0, limit);
}

function getSeedActressProducts(products: Product[], name: string, limit: number): Product[] {
  return sortByRank(
    products.filter((product) =>
      product.actresses?.some((actress) => normalizeEntityName(actress) === normalizeEntityName(name))
    )
  ).slice(0, limit);
}

function getCuratedMaker(name: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter((product) => normalizeEntityName(product.maker) === normalizeEntityName(name))
  ).slice(0, limit);
}

function getSeedMakerProducts(products: Product[], name: string, limit: number): Product[] {
  return sortByRank(
    products.filter((product) => normalizeEntityName(product.maker) === normalizeEntityName(name))
  ).slice(0, limit);
}

function getCuratedSeries(name: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter(
      (product) =>
        normalizeEntityName(product.series ?? product.label) === normalizeEntityName(name)
    )
  ).slice(0, limit);
}

function getSeedSeriesProducts(products: Product[], name: string, limit: number): Product[] {
  return sortByRank(
    products.filter(
      (product) =>
        normalizeEntityName(product.series ?? product.label) === normalizeEntityName(name)
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
  const normalizedName = normalizeEntityName(actressName) ?? "";

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
    product.actresses?.some((actress) => normalizeEntityName(actress) === normalizedName)
  );
  const primary = exactMatches.length > 0 ? exactMatches : apiProducts;

  return mergeProducts(primary, fallback, limit);
}

export async function loadMakerProducts(
  makerName: string,
  options: EntityCatalogLoadOptions = {}
): Promise<Product[]> {
  const normalizedName = normalizeEntityName(makerName) ?? "";

  if (!normalizedName) {
    return [];
  }

  const limit = normalizeLimit(options);
  const hits = options.hits ?? Math.max(limit, 12);
  const fallback = mergeProducts(
    getSeedMakerProducts(options.seedProducts ?? [], normalizedName, limit),
    getCuratedMaker(normalizedName, limit),
    limit
  );
  const apiProducts = mapApiProducts(
    await searchProducts(normalizedName, hits, options.offset ?? 1),
    false
  );
  const exactMatches = apiProducts.filter(
    (product) => normalizeEntityName(product.maker) === normalizedName
  );

  return mergeProducts(exactMatches, fallback, limit);
}

export async function loadSeriesProducts(
  seriesName: string,
  options: EntityCatalogLoadOptions = {}
): Promise<Product[]> {
  const normalizedName = normalizeEntityName(seriesName) ?? "";

  if (!normalizedName) {
    return [];
  }

  const limit = normalizeLimit(options);
  const hits = options.hits ?? Math.max(limit, 12);
  const fallback = mergeProducts(
    getSeedSeriesProducts(options.seedProducts ?? [], normalizedName, limit),
    getCuratedSeries(normalizedName, limit),
    limit
  );
  const apiProducts = mapApiProducts(
    await searchProducts(normalizedName, hits, options.offset ?? 1),
    false
  );
  const exactMatches = apiProducts.filter(
    (product) => normalizeEntityName(product.series ?? product.label) === normalizedName
  );

  return mergeProducts(exactMatches, fallback, limit);
}

function mergeSeedCollections(collections: Product[][]): Product[] {
  const merged: Product[] = [];
  const seen = new Set<string>();

  for (const collection of collections) {
    for (const product of collection) {
      if (seen.has(product.id) || !product.affiliateUrl.trim()) {
        continue;
      }

      seen.add(product.id);
      merged.push(stripRank(product));
    }
  }

  return merged;
}

function normalizeEntityDirectory(items: DmmNamedEntity[]): DmmNamedEntity[] {
  const seen = new Set<string>();
  const normalizedItems = items.filter(
    (item): item is DmmNamedEntity => Boolean(item && typeof item.name === "string")
  );

  return normalizedItems
    .map((item) => ({
      ...item,
      name: item.name.trim(),
    }))
    .filter((item) => {
      if (!item.name || seen.has(item.name)) {
        return false;
      }

      seen.add(item.name);
      return true;
    });
}

async function enrichEntityDirectory(
  candidates: EntityCandidate[],
  fetcher: (keyword: string, hits?: number, offset?: number) => Promise<DmmNamedEntity[]>
): Promise<DmmNamedEntity[]> {
  if (!candidates.length) {
    return [];
  }

  const results = await Promise.all(
    candidates.map(async (candidate) => {
      try {
        const items = await fetcher(candidate.name, 10, 1);
        if (!Array.isArray(items)) {
          return [];
        }

        const normalizedCandidateName = normalizeEntityName(candidate.name);

        return items.filter((item) => {
          const normalizedItemName = normalizeEntityName(item?.name);
          return Boolean(
            normalizedCandidateName &&
              normalizedItemName &&
              normalizedItemName === normalizedCandidateName
          );
        });
      } catch {
        return [];
      }
    })
  );

  return normalizeEntityDirectory(results.flatMap((items) => items));
}

export async function loadEntityDiscoveryCatalog(
  options: CatalogLoadOptions = {}
): Promise<EntityDiscoveryCatalog> {
  const limit = normalizeLimit(options) || 8;
  const seedLimit = Math.max(limit, 8);
  const [rankingProducts, saleProducts, newProducts] = await Promise.all([
    loadRankingProducts({ limit: seedLimit }),
    loadSaleProducts({ limit: seedLimit }),
    loadNewProducts({ limit: seedLimit }),
  ]);

  const sourceProducts = mergeSeedCollections([rankingProducts, saleProducts, newProducts]);
  const actressCandidates = buildActressCandidates(sourceProducts, limit);
  const makerCandidates = buildMakerCandidates(sourceProducts, limit);
  const seriesCandidates = buildSeriesCandidates(sourceProducts, limit);

  const [actressDirectory, makerDirectory, seriesDirectory] = await Promise.all([
    enrichEntityDirectory(actressCandidates, fetchActressSearch),
    enrichEntityDirectory(makerCandidates, fetchMakerSearch),
    enrichEntityDirectory(seriesCandidates, fetchSeriesSearch),
  ]);

  return {
    sourceProducts,
    actressCandidates,
    makerCandidates,
    seriesCandidates,
    actressDirectory,
    makerDirectory,
    seriesDirectory,
  };
}

export async function loadTopMakerCandidates(
  options: CatalogLoadOptions = {}
): Promise<EntityCandidate[]> {
  const { makerCandidates } = await loadEntityDiscoveryCatalog(options);
  return makerCandidates;
}

export async function loadTopSeriesCandidates(
  options: CatalogLoadOptions = {}
): Promise<EntityCandidate[]> {
  const { seriesCandidates } = await loadEntityDiscoveryCatalog(options);
  return seriesCandidates;
}
