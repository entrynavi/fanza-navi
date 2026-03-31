import type { Metadata } from "next";
import ComparePage from "./ComparePage";

export const metadata: Metadata = {
  title: "徹底比較｜VR vs 通常作品・サブスク vs 単品購入",
  description:
    "FANZAのVR作品と通常作品の違い、月額見放題と単品購入どっちがお得？徹底比較で最適な楽しみ方を見つけよう。",
};

export default function Page() {
  return <ComparePage />;
}
