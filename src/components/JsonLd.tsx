import { SITE_URL } from "@/lib/site";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FANZAオトナビ",
    url: SITE_URL,
    description:
      "ランキング・セール速報・おすすめ作品をじっくり比較できるFANZA作品ガイド。",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
