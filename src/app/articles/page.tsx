import ArticlesPage from "./ArticlesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事一覧 | FANZAナビ",
  description:
    "FANZAの使い方・支払い方法・VRセットアップ・セール攻略法など、お役立ち記事をまとめてご紹介。初心者からベテランまで役立つ情報を網羅。",
};

export default function Page() {
  return <ArticlesPage />;
}
