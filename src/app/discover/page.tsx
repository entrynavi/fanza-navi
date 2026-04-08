import type { Metadata } from "next";
import DiscoverPage from "./DiscoverPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "シチュエーション検索｜今夜の1本診断・気分別おすすめ｜FANZAトクナビ",
  description:
    "気分から作品を探せるシチュエーション検索ページ。今夜の1本診断、今日のおすすめ、ウォッチリストに近い候補まで個別に使えます。",
  path: ROUTES.discover,
  imageAlt: "シチュエーション検索のOG画像",
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <DiscoverPage allProducts={allProducts} />;
}
