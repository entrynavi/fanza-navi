import type { Metadata } from "next";
import TrendRadarPage from "./TrendRadarPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import { buildTrendRadar } from "@/lib/trend-radar";

export const metadata: Metadata = buildPageMetadata({
  title: "急上昇レーダー｜今伸びている作品を先回りでチェック｜FANZAトクナビ",
  description:
    "売れ筋の勢い・今夜決めやすいか・セールの伸び方で作品を見分ける急上昇レーダー。再訪ユーザー向けの新しい発見導線です。",
  path: ROUTES.trendRadar,
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 240 });
  const radar = buildTrendRadar(products, 8);

  return (
    <TrendRadarPage
      trendingNow={radar.trendingNow}
      tonightReady={radar.tonightReady}
      saleMomentum={radar.saleMomentum}
    />
  );
}
