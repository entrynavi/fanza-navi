import type { Metadata } from "next";
import DailyPickPage from "./DailyPickPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "今日のおすすめ（デイリーピック）",
  description:
    "毎日変わるおすすめ作品を厳選ピック。過去7日間のおすすめも振り返れます。",
  path: ROUTES.dailyPick,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <DailyPickPage allProducts={allProducts} />;
}
