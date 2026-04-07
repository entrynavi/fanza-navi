"use client";

import Script from "next/script";

interface AnalyticsProps {
  measurementId?: string;
  gtmId?: string;
}

export default function Analytics({ measurementId, gtmId }: AnalyticsProps) {
  const gaId = measurementId?.trim();
  const tagManagerId = gtmId?.trim();

  if (!gaId && !tagManagerId) {
    return null;
  }

  return (
    <>
      {tagManagerId ? (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${tagManagerId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${tagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}
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
