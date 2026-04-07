import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";
import AgeGate from "@/components/AgeGate";
import DisclosureBar from "@/components/DisclosureBar";
import { getSiteConfig } from "@/lib/env";
import { HAS_CANONICAL_SITE_URL, ROUTES, SITE_URL } from "@/lib/site";

const AGE_GATE_STORAGE_KEY = "fanza-age-gate-accepted";
const AGE_GATE_MARKER = "ageGateAccepted";
const SITE_CONFIG = getSiteConfig();
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
        const appShell = document.getElementById("app-shell");
        appShell?.removeAttribute("inert");
        appShell?.removeAttribute("aria-hidden");
      }
    } catch (error) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FANZAナビ | 落ち着いて比較できるランキングとレビュー",
    template: "%s | FANZAナビ",
  },
  description:
    "FANZA作品をランキング、セール、ジャンル、レビューから落ち着いて比較できるガイドサイト。価格差と向いている人を整理して、納得して選びやすくしています。",
  keywords: ["FANZA", "DMM", "ランキング", "レビュー", "セール", "ジャンル", "VR", "支払い方法"],
  alternates: {
    canonical: ROUTES.home,
  },
  openGraph: {
    title: "FANZAナビ",
    description:
      "FANZA作品をランキング、セール、レビューから落ち着いて比較できるガイドサイト。",
    type: "website",
    siteName: "FANZAナビ",
    url: ROUTES.home,
    images: [
      {
        url: "/images/ogp.svg",
        width: 1200,
        height: 630,
        alt: "FANZAナビ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAナビ",
    description:
      "FANZA作品をランキング、セール、レビューから落ち着いて比較できるガイドサイト。",
    images: ["/images/ogp.svg"],
  },
  robots: {
    index: HAS_CANONICAL_SITE_URL,
    follow: HAS_CANONICAL_SITE_URL,
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
        <Analytics
          measurementId={SITE_CONFIG.analyticsId}
          gtmId={SITE_CONFIG.gtmId}
        />
        <ErrorTracker />
        <JsonLd />
        <AgeGate />
        <div id="app-shell" inert={true} aria-hidden="true">
          <div className="sticky top-0 z-50">
            <DisclosureBar />
            <Header />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
