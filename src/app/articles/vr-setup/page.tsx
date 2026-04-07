import type { Metadata } from "next";
import VRSetupPage from "./VRSetupPage";
import { buildArticleMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildArticleMetadata({
  title:
    "FANZA VR動画の視聴方法｜スマホ・PC・Meta Questデバイス別セットアップ完全ガイド",
  description:
    "FANZA VR動画をスマホ・Meta Quest 2/3・PC・PSVR2で視聴する方法をデバイス別に完全解説。必要な機材、セットアップ手順、画質設定、トラブル対処法まで網羅。",
  path: ROUTES.articleVrSetup,
});

export default function Page() {
  return <VRSetupPage />;
}
