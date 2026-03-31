"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

// アフィリエイトリンクのクリック計測
export function trackAffiliateClick(productId: string, productTitle: string) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag("event", "affiliate_click", {
      event_category: "affiliate",
      event_label: productTitle,
      product_id: productId,
    });
  }
}
