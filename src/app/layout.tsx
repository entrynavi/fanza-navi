import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import DisclosureBar from "@/components/DisclosureBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import ErrorTracker from "@/components/ErrorTracker";
import { SITE_URL } from "@/lib/site";
import InstallBanner from "@/components/InstallBanner";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FANZAトクナビ — 探すラボ・買う前チェック・独自ランキング",
    template: "%s | FANZAトクナビ",
  },
  description:
    "公式FANZAにない切り口で作品を探せる。探すラボ・買う前チェック・独自ランキング・週間セール解析など、迷わず選ぶための無料ツール集。",
  keywords: ["FANZA", "DMM", "セール", "ランキング", "シチュエーション検索", "買い時", "ウォッチリスト", "独自ランキング", "週間セール"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "FANZAトクナビ — 探すラボ・買う前チェック・独自ランキング",
    description: "公式FANZAにない切り口で作品を探せる無料ツール集。探すラボ・買う前チェック・週間セール解析をまとめています。",
    type: "website",
    siteName: "FANZAトクナビ",
    images: [
      {
        url: `${SITE_URL}/images/ogp.svg`,
        width: 1200,
        height: 630,
        alt: "FANZAトクナビ — 探すラボ・買う前チェック・独自ランキング",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FANZAトクナビ — 探すラボ・買う前チェック・独自ランキング",
    description: "公式FANZAにない切り口で作品を探せる無料ツール集。探すラボ・買う前チェック・週間セール解析をまとめています。",
    images: [`${SITE_URL}/images/ogp.svg`],
  },
  manifest: "/manifest.json",
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
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "FANZAトクナビ",
          "url": "https://fanza-navi.pages.dev",
          "description": "FANZAのセール・ランキング・お得情報を毎日更新",
        }} />
        <DisclosureBar />
        <div id="app-shell" inert aria-hidden="true">
          <Header />
          {children}
          <Footer />
        </div>
        <AgeGate />
        <InstallBanner />
        <script dangerouslySetInnerHTML={{ __html: bootstrapAgeGateScript }} />
        <script dangerouslySetInnerHTML={{ __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}` }} />
      </body>
    </html>
  );
}
