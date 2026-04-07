import type { Metadata } from "next";
import SaveMoneyPage from "./SaveMoneyPage";
import { buildArticleMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildArticleMetadata({
  title:
    "FANZAで損しない！セール・クーポン・ポイント活用術まとめ【2025年最新版】",
  description:
    "FANZAのセール時期・クーポン入手方法・DMMポイント活用術を徹底解説。週末セール、季節セール、ポイントまとめ買い割引など、年間で数万円節約できるテクニックを紹介。",
  path: ROUTES.articleSaveMoney,
});

export default function Page() {
  return <SaveMoneyPage />;
}
