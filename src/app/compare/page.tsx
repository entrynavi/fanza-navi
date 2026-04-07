import type { Metadata } from "next";
import ComparePage from "./ComparePage";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "徹底比較｜VR vs 通常作品・サブスク vs 単品購入",
  description:
    "FANZAのVR作品と通常作品の違い、月額見放題と単品購入どっちがお得？徹底比較で最適な楽しみ方を見つけよう。",
  path: ROUTES.compare,
});

export default function Page() {
  return <ComparePage />;
}
