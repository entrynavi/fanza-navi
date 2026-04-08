import type { Metadata } from "next";
import SnsCardsPage from "./SnsCardsPage";
import { loadFeatureProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "SNS共有カード生成｜作品をシェア｜FANZAトクナビ",
  description:
    "FANZA作品のSNS共有カードを簡単作成。おすすめ・セール・新作・レビューの4テンプレートで、XやSNSに映えるカードをワンクリックで生成できます。",
  path: "/sns-cards",
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 180 });
  return <SnsCardsPage products={products} />;
}
