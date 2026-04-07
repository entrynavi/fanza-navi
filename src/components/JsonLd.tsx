import { SITE_URL } from "@/lib/site";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FANZAナビ",
    url: SITE_URL,
    description:
      "ランキング、セール、レビューを落ち着いて比較できるFANZA作品ガイド。",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
