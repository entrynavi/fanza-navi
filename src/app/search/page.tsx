import type { Metadata } from "next";
import SearchPage from "./SearchPage";
import { ROUTES, toAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "作品検索の入口",
  description:
    "人気、新着、セール、レビューへ進める作品探索の入口ページ。静的サイトでも回遊しやすく、比較から購入導線までつなげます。",
  alternates: {
    canonical: toAbsoluteUrl(ROUTES.search),
  },
};

export default function Page() {
  return <SearchPage />;
}
