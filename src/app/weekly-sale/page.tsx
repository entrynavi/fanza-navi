import type { Metadata } from "next";
import WeeklySalePage from "./WeeklySalePage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";
import { loadSaleProducts } from "@/lib/catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "今週のFANZAセール完全まとめ｜FANZAオトナビ",
  description:
    "今週開催中のFANZAセール・割引作品を完全網羅。割引率・価格・レビュー数で比較して、お得な作品を見つけましょう。",
  path: ROUTES.weeklySale,
});

export default async function Page() {
  const products = await loadSaleProducts({ limit: 100 });
  return <WeeklySalePage products={products} />;
}
