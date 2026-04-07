import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "FANZAナビ — セール速報＆作品レビュー",
    template: "%s | FANZAナビ",
  },
  description:
    "FANZAのセール速報・人気ランキング・新作レビューを毎日更新。支払い方法からVRの始め方まで、初心者でも迷わないガイドも公開中。",
  keywords: ["FANZA", "DMM", "セール", "ランキング", "レビュー", "VR", "支払い方法", "お得", "新作"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "FANZAナビ — セール速報＆作品レビュー",
    description: "ランキング・セール・新作レビューを厳選してお届け。初心者ガイドから支払い方法まで完全解説。",
    type: "website",
    siteName: "FANZAナビ",
    images: [
      {
        url: `${SITE_URL}/images/ogp.svg`,
        width: 1200,
        height: 630,
        alt: "FANZAナビ — セール速報＆作品レビュー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAナビ — セール速報＆作品レビュー",
    description: "ランキング・セール・新作レビューを厳選してお届け。初心者ガイドから支払い方法まで完全解説。",
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
        <Footer />
      </body>
    </html>
  );
}
