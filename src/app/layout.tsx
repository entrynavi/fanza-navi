import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";

const SITE_URL = "https://entrynavi.github.io/fanza-navi";

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
    images: [
      {
        url: `${SITE_URL}/images/ogp.svg`,
        width: 1200,
        height: 630,
        alt: "FANZAおすすめ作品ナビ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAおすすめ作品ナビ",
    description: "FANZAの人気作品をジャンル別にランキング形式で紹介",
    images: [`${SITE_URL}/images/ogp.svg`],
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
        <ErrorTracker />
        <JsonLd />
        {/* ステマ規制対応 PR表記 (2023年10月施行 景品表示法) */}
        <div className="bg-[#1a1a2e] border-b border-[var(--color-border)] py-1.5 text-center text-[11px] text-[var(--color-text-secondary)]">
          当サイトはアフィリエイト広告（PR）を利用しています
        </div>
        <Header />
        {children}
      </body>
    </html>
  );
}
