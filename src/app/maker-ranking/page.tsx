import type { Metadata } from "next";
import MakerRankingPage from "./MakerRankingPage";
import type { MakerRankingData } from "./MakerRankingPage";
import { loadRankingProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "メーカー比較ガイド｜FANZAオトナビ",
  description:
    "ランキング上位作品からメーカーごとの作品数・平均価格・平均評価・レビュー数を集計。高評価・コスパ・レビュー人気のTOP3比較も。",
  path: ROUTES.makerRanking,
  imageAlt: "メーカー比較ガイドのOG画像",
});

interface MakerBucket {
  name: string;
  productCount: number;
  totalPrice: number;
  totalRating: number;
  totalReviewCount: number;
}

function buildMakerRanking(products: Product[]): MakerRankingData[] {
  const buckets = new Map<string, MakerBucket>();

  for (const product of products) {
    const makerName = product.maker?.trim();
    if (!makerName) continue;

    const bucket = buckets.get(makerName);
    if (bucket) {
      bucket.productCount += 1;
      bucket.totalPrice += product.price;
      bucket.totalRating += product.rating;
      bucket.totalReviewCount += product.reviewCount;
    } else {
      buckets.set(makerName, {
        name: makerName,
        productCount: 1,
        totalPrice: product.price,
        totalRating: product.rating,
        totalReviewCount: product.reviewCount,
      });
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => b.productCount - a.productCount || b.totalReviewCount - a.totalReviewCount)
    .slice(0, 15)
    .map((bucket) => ({
      name: bucket.name,
      productCount: bucket.productCount,
      averagePrice: Number((bucket.totalPrice / bucket.productCount).toFixed(0)),
      averageRating: Number((bucket.totalRating / bucket.productCount).toFixed(1)),
      averageReviewCount: Number(
        (bucket.totalReviewCount / bucket.productCount).toFixed(1)
      ),
    }));
}

export default async function Page() {
  const products = await loadRankingProducts({ limit: 100 });
  const makers = buildMakerRanking(products);

  return <MakerRankingPage makers={makers} />;
}
