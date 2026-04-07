import type { Metadata } from "next";
import RankingPage from "./RankingPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "月間ランキング",
  description:
    "月間で動いている人気作品をレビュー導線付きで整理したランキングページ。売れ筋と高評価の両方から比較できます。",
  path: ROUTES.ranking,
});

export default function Page() {
  return <RankingPage />;
}
