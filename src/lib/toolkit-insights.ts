import type { Product } from "@/data/products";
import {
  getDiscountPercent as getProductDiscountPercent,
  getPresentedCurrentPrice,
} from "@/lib/product-presenter";

export interface TimingBreakdown {
  sale: number;
  discount: number;
  rating: number;
  seasonal: number;
  newRelease: number;
  total: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDiscountScore(product: Product) {
  return getProductDiscountPercent(product) ?? 0;
}

function getReviewSignal(product: Product) {
  return Math.min(product.reviewCount, 1600) / 80;
}

function getSafetyScore(product: Product) {
  const pricePenalty = Math.min(getPresentedCurrentPrice(product), 20000) / 1100;
  return (
    product.rating * 24 +
    Math.min(product.reviewCount, 1400) / 11 +
    getDiscountScore(product) * 0.9 +
    (product.isSale ? 6 : 0) +
    (product.isNew ? 2 : 0) -
    pricePenalty
  );
}

function getBudgetScore(product: Product) {
  const pricePenalty = Math.min(getPresentedCurrentPrice(product), 20000) / 720;
  return (
    product.rating * 18 +
    Math.min(product.reviewCount, 1200) / 15 +
    getDiscountScore(product) * 1.8 +
    (product.isSale ? 10 : 0) -
    pricePenalty
  );
}

function getFreshScore(product: Product) {
  return (
    (product.isNew ? 32 : 0) +
    product.rating * 12 +
    Math.min(product.reviewCount, 1200) / 18 +
    (product.isSale ? 4 : 0)
  );
}

function getSurpriseScore(product: Product) {
  return (
    getRecommendationWeight(product) * 3 +
    Math.min(product.tags.length, 4) * 2.5 +
    (product.isNew ? 9 : 0) +
    (product.isSale ? 8 : 0)
  );
}

function getSeasonalBonus(date: Date) {
  const month = date.getMonth();
  if ([0, 2, 6, 10].includes(month)) {
    return 10;
  }
  if ([3, 11].includes(month)) {
    return 5;
  }
  return 0;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) & 0x7fffffff;
    return value / 0x7fffffff;
  };
}

export function getRecommendationWeight(product: Product): number {
  return Math.max(
    1,
    product.rating * 4 +
      Math.min(product.reviewCount, 500) / 80 +
      (product.isSale ? 3 : 0) +
      (product.isNew ? 1.5 : 0)
  );
}

export function getDailyPickForDate(
  dateStr: string,
  products: Product[]
): Product | undefined {
  if (products.length === 0) {
    return undefined;
  }

  const rankedProducts = [...products].sort((left, right) => {
    return getRecommendationWeight(right) - getRecommendationWeight(left);
  });
  const shortlist = rankedProducts.slice(
    0,
    Math.max(
      12,
      Math.min(
        rankedProducts.length,
        Math.ceil(rankedProducts.length * 0.35)
      )
    )
  );

  const index = hashCode(dateStr) % shortlist.length;
  return shortlist[index];
}

export function calcBuyTimingScore(
  product: Product,
  date: Date = new Date()
): TimingBreakdown {
  let sale = 0;
  let discount = 0;
  let rating = 0;
  const seasonal = getSeasonalBonus(date);
  let newRelease = 0;

  if (product.isSale || product.salePrice) {
    sale = 40;
  }

  const discountPercent = getDiscountScore(product);
  if (discountPercent > 30) {
    discount = 20;
  } else if (discountPercent > 15) {
    discount = 10;
  }

  if (product.rating > 4.0) {
    rating = 15;
  } else if (product.rating > 3.5) {
    rating = 8;
  }

  if (product.isNew) {
    newRelease = 15;
  }

  const total = clamp(sale + discount + rating + seasonal + newRelease, 0, 100);
  return { sale, discount, rating, seasonal, newRelease, total };
}

function collectSeedMap(
  seeds: Product[],
  accessor: (product: Product) => string[]
) {
  return seeds.reduce<Record<string, number>>((acc, seed) => {
    accessor(seed)
      .filter(Boolean)
      .forEach((value) => {
        acc[value] = (acc[value] || 0) + 1;
      });
    return acc;
  }, {});
}

export function getWatchlistAffinityScore(product: Product, seeds: Product[]) {
  if (seeds.length === 0) {
    return 0;
  }

  const genreMap = collectSeedMap(seeds, (seed) => [seed.genre]);
  const makerMap = collectSeedMap(seeds, (seed) => (seed.maker ? [seed.maker] : []));
  const seriesMap = collectSeedMap(seeds, (seed) => (seed.series ? [seed.series] : []));
  const actressMap = collectSeedMap(seeds, (seed) => seed.actresses ?? []);
  const tagMap = collectSeedMap(seeds, (seed) => seed.tags ?? []);

  let score = 0;
  score += (genreMap[product.genre] || 0) * 14;
  score += (product.maker ? makerMap[product.maker] || 0 : 0) * 10;
  score += (product.series ? seriesMap[product.series] || 0 : 0) * 12;
  score +=
    (product.actresses ?? []).reduce((sum, actress) => sum + (actressMap[actress] || 0), 0) *
    7;
  score +=
    Math.min(
      3,
      (product.tags ?? []).reduce((sum, tag) => sum + (tagMap[tag] || 0), 0)
    ) * 3;
  score += product.rating * 2;
  score += product.isSale ? 4 : 0;

  return score;
}

export function buildSafePicks(products: Product[], limit = 6): Product[] {
  return [...products]
    .sort((left, right) => getSafetyScore(right) - getSafetyScore(left))
    .slice(0, limit);
}

export function buildBudgetPicks(
  products: Product[],
  budget: number,
  limit = 6
): Product[] {
  return [...products]
    .filter((product) => budget <= 0 || getPresentedCurrentPrice(product) <= budget)
    .sort((left, right) => getBudgetScore(right) - getBudgetScore(left))
    .slice(0, limit);
}

export function buildWatchlistMatches(
  products: Product[],
  seeds: Product[],
  options: { excludeIds?: Set<string>; limit?: number } = {}
): Product[] {
  const excludeIds = options.excludeIds ?? new Set<string>();
  const limit = options.limit ?? 6;

  return [...products]
    .filter((product) => !excludeIds.has(product.id))
    .map((product) => ({
      product,
      score: getWatchlistAffinityScore(product, seeds),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      return (
        right.score - left.score ||
        getRecommendationWeight(right.product) - getRecommendationWeight(left.product)
      );
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}

export type DiagnosisIntent =
  | "safe"
  | "budget"
  | "sale"
  | "new"
  | "watchlist"
  | "surprise";

export function buildDiagnosisPicks(
  products: Product[],
  options: {
    intent: DiagnosisIntent;
    budget: number;
    watchlistSeeds?: Product[];
    limit?: number;
  }
): Product[] {
  const {
    intent,
    budget,
    watchlistSeeds = [],
    limit = 3,
  } = options;

  const budgetFiltered =
    budget > 0
      ? products.filter((product) => getPresentedCurrentPrice(product) <= budget)
      : products;
  const basePool = budgetFiltered.length > 0 ? budgetFiltered : products;

  let scored = basePool.map((product) => {
    let score = 0;

    switch (intent) {
      case "safe":
        score = getSafetyScore(product);
        break;
      case "budget":
        score = getBudgetScore(product);
        break;
      case "sale":
        score = getBudgetScore(product) + getDiscountScore(product) * 2 + (product.isSale ? 12 : 0);
        break;
      case "new":
        score = getFreshScore(product);
        break;
      case "watchlist":
        score = getWatchlistAffinityScore(product, watchlistSeeds) + getRecommendationWeight(product);
        break;
      case "surprise":
        score = getSurpriseScore(product);
        break;
    }

    return { product, score };
  });

  if (intent === "sale") {
    scored = scored.filter(
      ({ product }) => product.isSale || getDiscountScore(product) > 0
    );
  }

  if (intent === "new") {
    scored = scored.filter(({ product }) => product.isNew);
  }

  if (intent === "watchlist" && watchlistSeeds.length === 0) {
    scored = basePool.map((product) => ({
      product,
      score: getSafetyScore(product),
    }));
  }

  return scored
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

export function buildBundleUnderBudget(
  products: Product[],
  budget: number,
  maxItems = 3
): Product[] {
  if (budget <= 0) {
    return [];
  }

  const candidates = buildBudgetPicks(products, budget, 18);
  let bestProducts: Product[] = [];
  let bestScore = -Infinity;

  const visit = (
    startIndex: number,
    picked: Product[],
    spent: number,
    score: number
  ) => {
    if (picked.length > 0) {
      const completionBonus = spent / budget;
      const candidateScore = score + completionBonus * 6 + picked.length * 4;
      if (candidateScore > bestScore) {
        bestScore = candidateScore;
        bestProducts = [...picked];
      }
    }

    if (picked.length >= maxItems) {
      return;
    }

    for (let index = startIndex; index < candidates.length; index += 1) {
      const product = candidates[index];
      const price = getPresentedCurrentPrice(product);
      if (spent + price > budget) {
        continue;
      }

      visit(
        index + 1,
        [...picked, product],
        spent + price,
        score + getBudgetScore(product)
      );
    }
  };

  visit(0, [], 0, 0);
  return bestProducts;
}

export function generatePriceHistory(
  productId: string,
  basePrice: number,
  days = 90
): PricePoint[] {
  const seed = hashCode(productId);
  const rand = seededRandom(seed);
  const points: PricePoint[] = [];
  const today = new Date();

  const salePeriod1Start = 15 + Math.floor(rand() * 20);
  const salePeriod1End = salePeriod1Start + 3 + Math.floor(rand() * 5);
  const salePeriod2Start = 50 + Math.floor(rand() * 20);
  const salePeriod2End = salePeriod2Start + 3 + Math.floor(rand() * 4);

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    const dayIndex = days - 1 - i;

    const noise = (rand() - 0.5) * basePrice * 0.05;
    let price = basePrice;

    if (dayIndex >= salePeriod1Start && dayIndex <= salePeriod1End) {
      price = Math.round(basePrice * (0.5 + rand() * 0.15));
    } else if (dayIndex >= salePeriod2Start && dayIndex <= salePeriod2End) {
      price = Math.round(basePrice * (0.55 + rand() * 0.15));
    } else {
      price = Math.round(basePrice + noise);
    }

    points.push({ date: dateStr, price: Math.max(100, price) });
  }

  return points;
}

export function computePriceHistoryStats(data: PricePoint[]) {
  const prices = data.map((entry) => entry.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
  const minIndex = prices.indexOf(min);

  return {
    min,
    max,
    avg,
    minIndex,
    minDate: data[minIndex]?.date ?? "",
  };
}

export function getNearHistoricalLowRate(currentPrice: number, minPrice: number) {
  if (minPrice <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return ((currentPrice - minPrice) / minPrice) * 100;
}
