import type { Metadata } from "next";
import SalePage from "./SalePage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "セール作品",
  description:
    "割引中の作品をレビュー導線付きで比較できるセール一覧ページ。価格差と評価の両方を見ながら選べます。",
  path: ROUTES.sale,
});

export default function Page() {
  return <SalePage />;
}
