import ArticlesPage from "./ArticlesPage";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "記事一覧",
  description:
    "FANZAの使い方・支払い方法・VRセットアップ・セール攻略法など、お役立ち記事をまとめてご紹介。初心者からベテランまで役立つ情報を網羅。",
  path: ROUTES.articles,
});

export default function Page() {
  return <ArticlesPage />;
}
