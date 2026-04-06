const DMM_AFFILIATE_TRACKING_URL = "https://al.dmm.co.jp/";
const DMM_DEFAULT_OUTBOUND_URL = "https://www.dmm.co.jp/digital/videoa/";
const ALLOWED_OUTBOUND_HOSTS = [
  "dmm.co.jp",
  "fanza.com",
];

function getAffiliateId(): string {
  return process.env.DMM_AFFILIATE_ID?.trim() ?? "";
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

  if (!affiliateId) {
    return normalizedDestination;
  }

  const searchParams = new URLSearchParams({
    lurl: normalizedDestination,
    af_id: affiliateId,
  });

  return `${DMM_AFFILIATE_TRACKING_URL}?${searchParams.toString()}`;
}

export function buildFallbackOutboundUrl(target: string = ""): string {
  return normalizeOutboundTarget(target);
}
