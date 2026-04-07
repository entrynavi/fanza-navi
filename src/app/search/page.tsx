import type { Metadata } from "next";
import SearchPage from "./SearchPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";
import { sampleProducts } from "@/data/products";
import { genrePages } from "@/data/genres";

export const metadata: Metadata = buildPageMetadata({
  title: "作品検索",
  description:
    "キーワード・ジャンル・価格帯で作品を検索。人気順・新着順・価格順で並び替え、お目当ての作品がすぐ見つかります。",
  path: ROUTES.search,
});

export default function Page() {
  return <SearchPage allProducts={sampleProducts} genres={genrePages} />;
}
