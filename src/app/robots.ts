import type { MetadataRoute } from "next";
import { HAS_CANONICAL_SITE_URL, SITE_URL, toAbsoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!HAS_CANONICAL_SITE_URL) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: SITE_URL,
    sitemap: toAbsoluteUrl("/sitemap.xml"),
  };
}
