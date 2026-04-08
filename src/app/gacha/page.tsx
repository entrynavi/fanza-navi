import type { Metadata } from "next";
import GachaPage from "./GachaPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "ガチャ風レコメンド",
  description:
    "ガチャを回して運命の作品に出会おう！ジャンルや価格でフィルターして、ランダムにおすすめ作品をピック。",
  path: ROUTES.gacha,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <GachaPage allProducts={allProducts} />;
}
