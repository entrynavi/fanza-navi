import type { Metadata } from "next";
import NewReleasesPage from "./NewReleasesPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "新作リリース",
  description:
    "新着で入った作品を比較しやすく整理した新作ページ。新着導線からレビューや関連ジャンルへ広げられます。",
  path: ROUTES.newReleases,
});

export default function Page() {
  return <NewReleasesPage />;
}
