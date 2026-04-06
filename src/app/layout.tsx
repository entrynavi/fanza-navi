import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";
import AgeGate from "@/components/AgeGate";
import { SITE_URL } from "@/lib/site";

const AGE_GATE_STORAGE_KEY = "fanza-age-gate-accepted";
const AGE_GATE_MARKER = "ageGateAccepted";
const AGE_GATE_STYLE = `
  html[data-${AGE_GATE_MARKER}="1"] [data-age-gate] {
    display: none !important;
  }
`;

const AGE_GATE_BOOTSTRAP = `
  (() => {
    try {
      if (window.localStorage.getItem("${AGE_GATE_STORAGE_KEY}") === "1") {
        document.documentElement.dataset.${AGE_GATE_MARKER} = "1";
      }
    } catch (error) {}
  })();
`;

export const metadata: Metadata = {
  title: {
    default: "FANZAおすすめ作品ナビ | 使い方ガイド＆お得情報",
    template: "%s | FANZAナビ",
  },
  description:
    "FANZAの使い方・支払い方法・VR設定・セール攻略法まで徹底解説。初心者でもわかるガイド記事を公開中。",
  keywords: ["FANZA", "DMM", "使い方", "ガイド", "VR", "セール", "支払い方法", "お得"],
  openGraph: {
    title: "FANZAおすすめ作品ナビ",
    description: "FANZAの使い方・お得情報をわかりやすく解説するガイドメディア",
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
    description: "FANZAの使い方・お得情報をわかりやすく解説するガイドメディア",
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
    <html lang="ja" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: AGE_GATE_STYLE }} />
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_BOOTSTRAP }} />
      </head>
      <body className="antialiased min-h-screen">
        <Analytics />
        <ErrorTracker />
        <JsonLd />
        {/* ステマ規制対応 PR表記 (2023年10月施行 景品表示法) */}
        <div className="bg-[#1a1a2e] border-b border-[var(--color-border)] py-1.5 text-center text-[11px] text-[var(--color-text-secondary)]">
          当サイトはアフィリエイト広告（PR）を利用しています
        </div>
        <AgeGate />
        <div id="app-shell">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
