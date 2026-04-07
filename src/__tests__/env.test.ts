import { beforeEach, describe, expect, it, vi } from "vitest";

const DEFAULT_SITE_URL = "http://localhost:3000";

describe("getSiteConfig", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("reads SITE_URL from the environment", async () => {
    vi.stubEnv("SITE_URL", "https://example.com");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().siteUrl).toBe("https://example.com");
    expect(getSiteConfig().hasCanonicalHost).toBe(true);
  });

  it("falls back to a local safe default SITE_URL when unset or invalid", async () => {
    vi.stubEnv("SITE_URL", "not a url");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().siteUrl).toBe(DEFAULT_SITE_URL);
    expect(getSiteConfig().hasCanonicalHost).toBe(false);
  });

  it("does not treat CF_PAGES_URL previews as the canonical host", async () => {
    vi.stubEnv("CF_PAGES_URL", "https://preview-branch.project.pages.dev");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().siteUrl).toBe(DEFAULT_SITE_URL);
    expect(getSiteConfig().hasCanonicalHost).toBe(false);
  });

  it("accepts legacy analytics env names for runtime wiring", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-TEST123");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().analyticsId).toBe("G-TEST123");
    expect(getSiteConfig().gtmId).toBe("GTM-TEST123");
  });
});
