import type { Metadata } from "next";
import WatchlistPage from "./WatchlistPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "ウォッチリスト司令室｜保存作品の優先順位と深掘り候補｜FANZAトクナビ",
  description:
    "保存作品の一覧だけでなく、値下げ中の候補、今チェック優先の作品、似た作品の深掘りまでまとめて見られるウォッチリストページです。",
  path: ROUTES.watchlist,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <WatchlistPage allProducts={allProducts} />;
}
