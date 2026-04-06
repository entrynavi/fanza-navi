import type { Metadata } from "next";
import SalePage from "./SalePage";
import { ROUTES, toAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "セール作品",
  description:
    "割引中の作品をレビュー導線付きで比較できるセール一覧ページ。価格差と評価の両方を見ながら選べます。",
  alternates: {
    canonical: toAbsoluteUrl(ROUTES.sale),
  },
};

export default function Page() {
  return <SalePage />;
}
