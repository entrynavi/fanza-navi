import { getSiteConfig } from "@/lib/env";

const DMM_AFFILIATE_TRACKING_URL = "https://al.dmm.co.jp/";
const DMM_DEFAULT_OUTBOUND_URL = "https://www.dmm.co.jp/digital/videoa/";
const ALLOWED_OUTBOUND_HOSTS = [
  "dmm.co.jp",
  "fanza.com",
];

function getAffiliateId(): string {
  return getSiteConfig().dmmAffiliateId;
}

function isAllowedOutboundHost(hostname: string): boolean {
  return ALLOWED_OUTBOUND_HOSTS.some(
    (allowedHost) =>
      hostname === allowedHost || hostname.endsWith(`.${allowedHost}`)
  );
}

function normalizeOutboundTarget(target: string = ""): string {
  const trimmedTarget = target.trim();

  if (!trimmedTarget) {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedTarget);
  } catch {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  if (!isAllowedOutboundHost(parsedUrl.hostname)) {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  return parsedUrl.toString();
}

export function buildAffiliateUrl(
  destinationUrl: string,
  affiliateId = getAffiliateId()
): string {
  const normalizedDestination = normalizeOutboundTarget(destinationUrl);
  const trackingUrl = getSiteConfig().dmmAffiliateLink || DMM_AFFILIATE_TRACKING_URL;

  if (!affiliateId) {
    return normalizedDestination;
  }

  const searchParams = new URLSearchParams({
    lurl: normalizedDestination,
    af_id: affiliateId,
  });

  return `${trackingUrl}?${searchParams.toString()}`;
}

export function buildFallbackOutboundUrl(target: string = ""): string {
  return normalizeOutboundTarget(target);
}
