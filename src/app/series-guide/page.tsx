import type { Metadata } from "next";
import SeriesGuidePage from "./SeriesGuidePage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "シリーズ完走ガイド｜人気シリーズを制覇しよう｜FANZAトクナビ",
  description:
    "FANZAの人気シリーズを一覧で確認し、視聴進捗を管理できるガイド。シリーズごとの作品数・平均評価・次に見るべき作品がひと目でわかります。",
  path: "/series-guide",
});

function groupBySeries(products: Product[]): Record<string, Product[]> {
  const map: Record<string, Product[]> = {};
  for (const p of products) {
    const key = p.series || p.label || "";
    if (!key) continue;
    if (!map[key]) map[key] = [];
    map[key].push(p);
  }
  return map;
}

export default async function Page() {
  const products: Product[] = await loadFeatureProducts({ limit: 180 });
  const grouped = groupBySeries(products);

  const seriesData = Object.entries(grouped)
    .filter(([, items]) => items.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20)
    .map(([name, items]) => ({
      name,
      products: items.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      ),
      avgRating:
        items.reduce((s, p) => s + p.rating, 0) / items.length,
      totalReviews: items.reduce((s, p) => s + p.reviewCount, 0),
    }));

  return <SeriesGuidePage seriesData={seriesData} />;
}
