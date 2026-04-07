import type { MetadataRoute } from "next";
import { genrePages } from "@/data/genres";
import { HAS_CANONICAL_SITE_URL, ROUTES, getGenreRoute, toAbsoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const staticEntries: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: ROUTES.home, changeFrequency: "daily", priority: 1 },
  { path: ROUTES.ranking, changeFrequency: "daily", priority: 0.95 },
  { path: ROUTES.sale, changeFrequency: "daily", priority: 0.9 },
  { path: ROUTES.newReleases, changeFrequency: "daily", priority: 0.85 },
  { path: ROUTES.search, changeFrequency: "weekly", priority: 0.72 },
  { path: ROUTES.guide, changeFrequency: "monthly", priority: 0.68 },
  { path: ROUTES.compare, changeFrequency: "monthly", priority: 0.62 },
  { path: ROUTES.articles, changeFrequency: "weekly", priority: 0.7 },
  { path: ROUTES.articleFanzaPayment, changeFrequency: "monthly", priority: 0.58 },
  { path: ROUTES.articleVrSetup, changeFrequency: "monthly", priority: 0.58 },
  { path: ROUTES.articleSaveMoney, changeFrequency: "monthly", priority: 0.58 },
  { path: ROUTES.about, changeFrequency: "monthly", priority: 0.42 },
  { path: ROUTES.contact, changeFrequency: "monthly", priority: 0.4 },
  { path: ROUTES.privacy, changeFrequency: "yearly", priority: 0.22 },
  { path: ROUTES.terms, changeFrequency: "yearly", priority: 0.22 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!HAS_CANONICAL_SITE_URL) {
    return [];
  }

  const now = new Date();

  return [
    ...staticEntries.map((entry) => ({
      url: toAbsoluteUrl(entry.path),
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...genrePages.map((genre) => ({
      url: toAbsoluteUrl(getGenreRoute(genre.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.76,
    })),
  ];
}
