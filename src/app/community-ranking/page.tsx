import type { Metadata } from "next";
import CommunityRankingPage from "./CommunityRankingPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "みんなの推し作品ランキング｜FANZAオトナビ",
  description:
    "ユーザー投票で決まるFANZA作品のコミュニティランキング。今週・今月の人気作品をチェックして、あなたの推し作品に投票しよう。",
  path: ROUTES.communityRanking,
});

export default function Page() {
  return <CommunityRankingPage />;
}
