import type { Metadata } from "next";
import ContactPage from "./ContactPage";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "お問い合わせ",
  description:
    "FANZAおすすめ作品ナビへのお問い合わせはこちら。記事内容の誤りの報告やサイトに関するご意見をお待ちしています。",
  path: ROUTES.contact,
});

export default function Page() {
  return <ContactPage />;
}
