import type { Metadata } from "next";
import RankingBattlePage from "./RankingBattlePage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "ランキングバトル｜トーナメント形式で推し作品を決定｜FANZAトクナビ",
  description:
    "人気FANZA作品をトーナメント形式で1対1比較。全取得作品・高評価・セール品・ウォッチリストから最大64作品で推しを決められます。",
  path: "/ranking-battle",
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 180 });
  return <RankingBattlePage products={products} />;
}
