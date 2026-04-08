import type { Metadata } from "next";
import DiscoverPage from "./DiscoverPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "探す/決めるラボ｜今夜の1本診断・安牌・サプライズ選出｜FANZAトクナビ",
  description:
    "シチュ検索・今夜の1本診断・給料日前ピック・ウォッチリスト深掘りをまとめた発見ハブ。迷ったときに最初に開くための独自ツール集です。",
  path: ROUTES.discover,
  imageAlt: "探す/決めるラボのOG画像",
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <DiscoverPage allProducts={allProducts} />;
}
