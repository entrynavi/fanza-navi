import type { Metadata } from "next";
import CospaCalcPage from "./CospaCalcPage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";

export const metadata: Metadata = buildPageMetadata({
  title: "コスパ計算機｜1分あたりの価格でランキング｜FANZAトクナビ",
  description:
    "FANZA作品の「1分あたりの価格」を自動計算してランキング表示。コスパの良い作品を一目で比較できます。",
  path: "/cospa-calc",
});

export default async function Page() {
  const products = await loadFeatureProducts({ limit: 180 });
  return <CospaCalcPage products={products} />;
}
