import HomePageView from "@/components/HomePageView";
import { genrePages } from "@/data/genres";
import { loadNewProducts, loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildActressRanking } from "@/lib/actress-ranking";
import type { Product } from "@/data/products";

function sortSalePreview(products: Awaited<ReturnType<typeof loadSaleProducts>>) {
  return [...products].sort((left, right) => {
    const leftDiscount = left.salePrice ? 1 - left.salePrice / left.price : 0;
    const rightDiscount = right.salePrice ? 1 - right.salePrice / right.price : 0;
    return rightDiscount - leftDiscount;
  });
}

function pickDistinctProduct(products: Product[], excludedIds: string[] = []) {
  const excluded = new Set(excludedIds);
  return products.find((product) => !excluded.has(product.id) && product.affiliateUrl.trim()) ?? null;
}

export default async function HomePage() {
  const [rankingPreview, saleProducts, newPreview] = await Promise.all([
    loadRankingProducts({ limit: 12 }),
    loadSaleProducts({ limit: 8 }),
    loadNewProducts({ limit: 8 }),
  ]);
  const salePreview = sortSalePreview(saleProducts);
  const leadProduct = rankingPreview[0];
  const saleSpotlight = pickDistinctProduct(salePreview, leadProduct ? [leadProduct.id] : []);
  const newSpotlight = pickDistinctProduct(newPreview, leadProduct ? [leadProduct.id] : []);
  const topActresses = buildActressRanking(
    [...rankingPreview, ...salePreview, ...newPreview],
    5
  );

  return (
    <HomePageView
      leadProduct={leadProduct}
      saleSpotlight={saleSpotlight}
      newSpotlight={newSpotlight}
      rankingPreview={rankingPreview}
      salePreview={salePreview}
      topActresses={topActresses}
      featuredGenres={genrePages}
    />
  );
}
