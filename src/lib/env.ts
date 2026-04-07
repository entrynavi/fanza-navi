const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_DMM_AFFILIATE_LINK = "https://al.dmm.co.jp/";
const DEFAULT_FANZA_FLOOR = "videoa";
const DEFAULT_FANZA_DEFAULT_GENRE = "popular";
let hasWarnedAboutSiteUrl = false;

export interface SiteConfig {
  siteUrl: string;
  hasCanonicalHost: boolean;
  dmmAffiliateLink: string;
  dmmApiId: string;
  dmmAffiliateId: string;
  fanzaFloor: string;
  fanzaDefaultGenre: string;
  analyticsId: string;
  gtmId: string;
}

function readStringEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function normalizeBaseUrl(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  try {
    const url = new URL(trimmedValue);
    const pathname = url.pathname.replace(/\/$/, "");

    return `${url.origin}${pathname}`;
  } catch {
    return "";
  }
}

function getConfiguredSiteUrl() {
  return normalizeBaseUrl(readStringEnv("SITE_URL"));
}

function warnIfSiteUrlIsMissing() {
  if (hasWarnedAboutSiteUrl || process.env.NODE_ENV === "test") {
    return;
  }

  hasWarnedAboutSiteUrl = true;
  console.warn(
    "[site-config] SITE_URL is not configured. Falling back to http://localhost:3000 and disabling indexing in robots metadata."
  );
}

export function getSiteConfig(): SiteConfig {
  const configuredSiteUrl = getConfiguredSiteUrl();
  const hasCanonicalHost = Boolean(configuredSiteUrl);

  if (!hasCanonicalHost) {
    warnIfSiteUrlIsMissing();
  }

  return {
    siteUrl: configuredSiteUrl || DEFAULT_SITE_URL,
    hasCanonicalHost,
    dmmAffiliateLink:
      normalizeBaseUrl(readStringEnv("DMM_AFFILIATE_LINK")) || DEFAULT_DMM_AFFILIATE_LINK,
    dmmApiId: readStringEnv("DMM_API_ID"),
    dmmAffiliateId: readStringEnv("DMM_AFFILIATE_ID"),
    fanzaFloor: readStringEnv("FANZA_FLOOR") || DEFAULT_FANZA_FLOOR,
    fanzaDefaultGenre:
      readStringEnv("FANZA_DEFAULT_GENRE") || DEFAULT_FANZA_DEFAULT_GENRE,
    analyticsId: readStringEnv("ANALYTICS_ID") || readStringEnv("NEXT_PUBLIC_GA_ID"),
    gtmId: readStringEnv("GTM_ID") || readStringEnv("NEXT_PUBLIC_GTM_ID"),
  };
}
