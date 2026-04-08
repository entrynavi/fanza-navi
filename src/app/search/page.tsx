import type { Metadata } from "next";
import SearchPage from "./SearchPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";
import { loadSearchProducts } from "@/lib/catalog";
import { genrePages } from "@/data/genres";

export const metadata: Metadata = buildPageMetadata({
  title: "作品検索｜FANZA全体から絞り込み検索｜FANZAトクナビ",
  description:
    "FANZA全体をキーワード・ジャンル・価格帯・評価・レビュー件数で絞り込み検索。重くなりすぎないページング設計で、お目当ての作品が探しやすくなっています。",
  path: ROUTES.search,
});

export default async function Page() {
  const allProducts = await loadSearchProducts({ limit: 300 });
  return <SearchPage allProducts={allProducts} genres={genrePages} />;
}
