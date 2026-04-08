import type { Metadata } from "next";
import BuyTimingPage from "./BuyTimingPage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "買い時判定ツール｜買い時・予算内セット・セール予測｜FANZAトクナビ",
  description:
    "買い時判定、予算内まとめ買い、価格履歴の見どころ、次のセール波をチェック。今買うか待つかを判断しやすくする独自ツールです。",
  path: "/buy-timing",
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 180 });
  return <BuyTimingPage products={products} />;
}
