import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import DisclosureBar from "@/components/DisclosureBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FANZAオトナビ — セール速報＆おすすめ作品ガイド",
    template: "%s | FANZAオトナビ",
  },
  description:
    "FANZAのセール速報・人気ランキング・新作情報を毎日更新。支払い方法からVRの始め方まで、初心者でも迷わないガイドも公開中。",
  keywords: ["FANZA", "DMM", "セール", "ランキング", "おすすめ", "VR", "支払い方法", "お得", "新作"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "FANZAオトナビ — セール速報＆おすすめ作品ガイド",
    description: "ランキング・セール・新作情報を厳選してお届け。初心者ガイドから支払い方法まで完全解説。",
    type: "website",
    siteName: "FANZAオトナビ",
    images: [
      {
        url: `${SITE_URL}/images/ogp.svg`,
        width: 1200,
        height: 630,
        alt: "FANZAオトナビ — セール速報＆おすすめ作品ガイド",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAオトナビ — セール速報＆おすすめ作品ガイド",
    description: "ランキング・セール・新作情報を厳選してお届け。初心者ガイドから支払い方法まで完全解説。",
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
  const bootstrapAgeGateScript = `(() => {
    const STORAGE_KEY = "fanza-age-gate-accepted";

    const hideGate = () => {
      const ageGate = document.querySelector("[data-age-gate]");
      if (!(ageGate instanceof HTMLElement)) return;
      ageGate.setAttribute("aria-hidden", "true");
      ageGate.style.display = "none";
      ageGate.style.pointerEvents = "none";
      ageGate.style.opacity = "0";
    };

    const unlock = () => {
      document.documentElement.dataset.ageGateAccepted = "1";
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {}

      document.body.style.overflow = "";
      const appShell = document.getElementById("app-shell");
      if (appShell) {
        appShell.removeAttribute("inert");
        appShell.removeAttribute("aria-hidden");
      }

      hideGate();
    };

    const isAccepted = () => {
      try {
        return (
          document.documentElement.dataset.ageGateAccepted === "1" ||
          window.localStorage.getItem(STORAGE_KEY) === "1"
        );
      } catch {
        return document.documentElement.dataset.ageGateAccepted === "1";
      }
    };

    if (isAccepted()) {
      unlock();
    }

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (!target.closest("[data-age-gate-accept]")) return;
        event.preventDefault();
        unlock();
      },
      { capture: true }
    );
  })();`;

  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">
        <Analytics />
        <ErrorTracker />
        <JsonLd />
        <DisclosureBar />
        <div id="app-shell" inert aria-hidden="true">
          <Header />
          {children}
          <Footer />
        </div>
        <AgeGate />
        <script dangerouslySetInnerHTML={{ __html: bootstrapAgeGateScript }} />
      </body>
    </html>
  );
}
