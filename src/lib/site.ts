import { getSiteConfig } from "@/lib/env";
import { getActressSlug } from "@/lib/actress-ranking";

const SITE_CONFIG = getSiteConfig();

export const SITE_URL = SITE_CONFIG.siteUrl;
export const HAS_CANONICAL_SITE_URL = SITE_CONFIG.hasCanonicalHost;

export const ROUTES = {
  home: "/",
  ranking: "/ranking",
  newReleases: "/new",
  sale: "/sale",
  genres: "/genre",
  actresses: "/actress",
  makers: "/maker",
  series: "/series",
  reviews: "/reviews",
  search: "/search",
  guide: "/guide",
  compare: "/compare",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  about: "/about",
  articles: "/articles",
  articleFanzaPayment: "/articles/fanza-payment",
  articleVrSetup: "/articles/vr-setup",
  articleSaveMoney: "/articles/save-money",
} as const;

export function toAbsoluteUrl(path = "") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function getGenreRoute(slug: string) {
  return `${ROUTES.genres}/${slug}`;
}

export function getActressRoute(name: string) {
  return `${ROUTES.actresses}/${getActressSlug(name)}`;
}

export function getReviewRoute(slug: string) {
  return `${ROUTES.reviews}/${slug}`;
}

function toUrlSafeSlug(name: string): string {
  return Buffer.from(name, "utf-8").toString("hex");
}

export function getMakerRoute(name: string) {
  return `${ROUTES.makers}/${toUrlSafeSlug(name)}`;
}

export function getSeriesRoute(name: string) {
  return `${ROUTES.series}/${toUrlSafeSlug(name)}`;
}
