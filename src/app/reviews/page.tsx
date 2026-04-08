import type { Metadata } from "next";
import ReviewsPage from "./ReviewsPage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "みんなのおすすめ作品レビュー｜共有ユーザー投稿レビュー｜FANZAトクナビ",
  description:
    "FANZAトクナビユーザーによる共有レビュー。公式レビューだけでは分からないリアルな感想を、評価やレビュー件数で絞り込みながら参考にできます。",
  path: ROUTES.reviews,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 300 });
  return <ReviewsPage allProducts={allProducts} />;
}
