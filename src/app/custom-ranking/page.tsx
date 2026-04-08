import type { Metadata } from "next";
import CustomRankingPage from "./CustomRankingPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import type { Product } from "@/data/products";
import { getDiscountPercent } from "@/lib/product-presenter";

export const metadata: Metadata = buildPageMetadata({
  title: "独自ランキング｜コスパ・隠れた名作・新人注目作｜FANZAオトナビ",
  description:
    "FANZAオトナビ独自のランキング。コスパ最強・隠れた名作・大幅値下げ・新人注目作の4カテゴリで、公式ランキングでは見つからない作品を発見できます。",
  path: ROUTES.customRanking,
});

function buildCospaRanking(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.reviewCount > 0 && p.price > 0)
    .sort((a, b) => {
      const scoreA = a.rating / (a.salePrice ?? a.price);
      const scoreB = b.rating / (b.salePrice ?? b.price);
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

function buildHiddenGemRanking(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.rating >= 4.0 && p.reviewCount > 0 && p.reviewCount < 20)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 20);
}

function buildBigDiscountRanking(saleProducts: Product[]): Product[] {
  return [...saleProducts]
    .filter((p) => {
      const d = getDiscountPercent(p);
      return d !== null && d > 0;
    })
    .sort((a, b) => {
      const dA = getDiscountPercent(a) ?? 0;
      const dB = getDiscountPercent(b) ?? 0;
      return dB - dA;
    })
    .slice(0, 20);
}

function buildNewcomerRanking(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.isNew)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 20);
}

export default async function Page() {
  const [rankingProducts, saleProducts] = await Promise.all([
    loadRankingProducts({ limit: 100 }),
    loadSaleProducts({ limit: 100 }),
  ]);

  const allProducts = [...rankingProducts];
  const saleIds = new Set(allProducts.map((p) => p.id));
  saleProducts.forEach((p) => {
    if (!saleIds.has(p.id)) allProducts.push(p);
  });

  const cospaRanking = buildCospaRanking(allProducts);
  const hiddenGemRanking = buildHiddenGemRanking(allProducts);
  const bigDiscountRanking = buildBigDiscountRanking(saleProducts);
  const newcomerRanking = buildNewcomerRanking(allProducts);

  return (
    <CustomRankingPage
      cospaRanking={cospaRanking}
      hiddenGemRanking={hiddenGemRanking}
      bigDiscountRanking={bigDiscountRanking}
      newcomerRanking={newcomerRanking}
    />
  );
}
