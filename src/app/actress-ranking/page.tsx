import type { Metadata } from "next";
import ActressRankingPage from "./ActressRankingPage";
import type { ActressRankingData } from "./ActressRankingPage";
import { loadRankingProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "人気女優ランキング｜FANZAオトナビ",
  description:
    "ランキング上位作品の出演回数・平均評価・レビュー数をもとに集計した人気女優ランキング。気になる女優の作品一覧へそのまま進めます。",
  path: ROUTES.actressRanking,
  imageAlt: "人気女優ランキングのOG画像",
});

interface ActressBucket {
  name: string;
  appearances: number;
  totalRating: number;
  totalReviewCount: number;
  genres: Map<string, number>;
}

function buildActressRanking(products: Product[]): ActressRankingData[] {
  const buckets = new Map<string, ActressBucket>();

  for (const product of products) {
    for (const name of product.actresses ?? []) {
      const trimmed = name.trim();
      if (!trimmed) continue;

      const bucket = buckets.get(trimmed);
      if (bucket) {
        bucket.appearances += 1;
        bucket.totalRating += product.rating;
        bucket.totalReviewCount += product.reviewCount;
        for (const tag of product.tags) {
          bucket.genres.set(tag, (bucket.genres.get(tag) ?? 0) + 1);
        }
      } else {
        const genres = new Map<string, number>();
        for (const tag of product.tags) {
          genres.set(tag, 1);
        }
        buckets.set(trimmed, {
          name: trimmed,
          appearances: 1,
          totalRating: product.rating,
          totalReviewCount: product.reviewCount,
          genres,
        });
      }
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => b.appearances - a.appearances || b.totalReviewCount - a.totalReviewCount)
    .slice(0, 20)
    .map((bucket) => ({
      name: bucket.name,
      appearances: bucket.appearances,
      averageRating: Number((bucket.totalRating / bucket.appearances).toFixed(1)),
      totalReviewCount: bucket.totalReviewCount,
      topGenres: Array.from(bucket.genres.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre]) => genre),
    }));
}

export default async function Page() {
  const products = await loadRankingProducts({ limit: 100 });
  const actresses = buildActressRanking(products);

  return <ActressRankingPage actresses={actresses} />;
}
