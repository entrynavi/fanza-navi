import type { Product } from "@/data/products";

function getAgeDays(releaseDate: string) {
  const timestamp = new Date(releaseDate).getTime();

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return 999;
  }

  return Math.max(0, Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000)));
}

function getDiscountPercent(product: Product) {
  if (!product.salePrice || product.price <= product.salePrice) {
    return 0;
  }

  return Math.round((1 - product.salePrice / product.price) * 100);
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (!product.affiliateUrl.trim() || seen.has(product.id)) {
      return false;
    }
    seen.add(product.id);
    return true;
  });
}

function sortByScore(
  products: Product[],
  score: (product: Product) => number,
  limit: number
) {
  return [...products]
    .map((product) => ({ product, score: score(product) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

function buildTrendingScore(product: Product) {
  const ageDays = getAgeDays(product.releaseDate);
  const recency = Math.max(0, 25 - ageDays) * 2.2;
  const rankScore = product.rank ? Math.max(0, 120 - product.rank) : 20;
  const reviewVelocity = Math.log10(product.reviewCount + 1) * 28;
  const ratingScore = product.rating * 14;
  const saleBonus = getDiscountPercent(product) * 1.25;
  const newBonus = product.isNew ? 16 : 0;

  return recency + rankScore + reviewVelocity + ratingScore + saleBonus + newBonus;
}

function buildNightReadyScore(product: Product) {
  const effectivePrice = product.salePrice ?? product.price;
  const priceComfort = effectivePrice <= 3000 ? 26 : Math.max(0, 34 - effectivePrice / 200);
  const reviewConfidence = Math.log10(product.reviewCount + 1) * 24;
  const ratingConfidence = product.rating * 16;
  const saleBoost = product.isSale ? 14 : 0;
  const titleBoost = product.title.length <= 42 ? 8 : 0;

  return priceComfort + reviewConfidence + ratingConfidence + saleBoost + titleBoost;
}

function buildSaleMomentumScore(product: Product) {
  const discount = getDiscountPercent(product);
  const effectivePrice = product.salePrice ?? product.price;
  const discountScore = discount * 2.2;
  const reviewScore = Math.log10(product.reviewCount + 1) * 22;
  const ratingScore = product.rating * 12;
  const affordability = effectivePrice <= 2500 ? 18 : Math.max(0, 28 - effectivePrice / 220);

  return discountScore + reviewScore + ratingScore + affordability;
}

export function buildTrendRadar(products: Product[], limit = 12) {
  const source = dedupeProducts(products);

  return {
    trendingNow: sortByScore(source, buildTrendingScore, limit),
    tonightReady: sortByScore(source, buildNightReadyScore, limit),
    saleMomentum: sortByScore(source.filter((product) => product.isSale), buildSaleMomentumScore, limit),
  };
}
