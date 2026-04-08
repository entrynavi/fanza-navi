import type { Metadata } from "next";
import BuyTimingPage from "./BuyTimingPage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "買う前チェック｜買い時・予算内セット・セール予測｜FANZAトクナビ",
  description:
    "買い時判定、予算内まとめ買い、価格履歴の見どころ、次のセール波をひとまとめ。買うか待つかを決めやすくする購入判断ページです。",
  path: "/buy-timing",
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 180 });
  return <BuyTimingPage products={products} />;
}
