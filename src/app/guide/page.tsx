import type { Metadata } from "next";
import GuidePage from "./GuidePage";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "FANZA完全ガイド｜初心者向け使い方・登録方法・お得な買い方",
  description:
    "FANZAの登録方法から使い方、お得に買うコツまで初心者向けに完全解説。セール情報の見つけ方やVR作品の楽しみ方も紹介。",
  path: ROUTES.guide,
});

export default function Page() {
  return <GuidePage />;
}
