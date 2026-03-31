import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: {
    default: "FANZAおすすめ作品ナビ | 人気ランキング＆レビュー",
    template: "%s | FANZAナビ",
  },
  description:
    "FANZAの人気作品をジャンル別にランキング形式で紹介。厳選レビューとお得なセール情報も毎日更新中。",
  keywords: ["FANZA", "DMM", "おすすめ", "ランキング", "レビュー", "セール"],
  openGraph: {
    title: "FANZAおすすめ作品ナビ",
    description: "FANZAの人気作品をジャンル別にランキング形式で紹介",
    type: "website",
    siteName: "FANZAナビ",
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAおすすめ作品ナビ",
    description: "FANZAの人気作品をジャンル別にランキング形式で紹介",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">
        <Analytics />
        <JsonLd />
        <Header />
        {children}
      </body>
    </html>
  );
}
