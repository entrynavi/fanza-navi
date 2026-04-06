import type { Metadata } from "next";
import NewReleasesPage from "./NewReleasesPage";
import { ROUTES, toAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "新作リリース",
  description:
    "新着で入った作品を比較しやすく整理した新作ページ。新着導線からレビューや関連ジャンルへ広げられます。",
  alternates: {
    canonical: toAbsoluteUrl(ROUTES.newReleases),
  },
};

export default function Page() {
  return <NewReleasesPage />;
}
