import type { Metadata } from "next";
import PersonalizedPage from "./PersonalizedPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "パーソナライズドフィード｜あなたへのおすすめ｜FANZAトクナビ",
  description:
    "閲覧履歴やジャンル傾向から、あなたにぴったりのFANZA作品をレコメンド。好みのジャンル新着・お得なセール品・新ジャンル開拓までパーソナライズされたフィードをお届けします。",
  path: "/personalized",
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 180 });

  return <PersonalizedPage allProducts={allProducts} />;
}
