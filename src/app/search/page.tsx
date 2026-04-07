import type { Metadata } from "next";
import SearchPage from "./SearchPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "作品検索の入口",
  description:
    "人気、新着、セール、レビューへ進める作品探索の入口ページ。静的サイトでも回遊しやすく、比較から購入導線までつなげます。",
  path: ROUTES.search,
});

export default function Page() {
  return <SearchPage />;
}
