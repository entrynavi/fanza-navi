import { beforeEach, describe, expect, it, vi } from "vitest";

describe("SEO metadata routes", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("blocks indexing when SITE_URL is not configured", async () => {
    const { default: robots } = await import("@/app/robots");
    const { default: sitemap } = await import("@/app/sitemap");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    });
    expect(sitemap()).toEqual([]);
  });

  it("keeps preview deploy hosts out of robots and sitemap when SITE_URL is unset", async () => {
    vi.stubEnv("CF_PAGES_URL", "https://preview-branch.project.pages.dev");
    vi.resetModules();

    const { default: robots } = await import("@/app/robots");
    const { default: sitemap } = await import("@/app/sitemap");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    });
    expect(sitemap()).toEqual([]);
  });

  it("publishes robots and sitemap with the configured canonical host", async () => {
    vi.stubEnv("SITE_URL", "https://example.com");
    vi.resetModules();

    const { default: robots } = await import("@/app/robots");
    const { default: sitemap } = await import("@/app/sitemap");

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      host: "https://example.com",
      sitemap: "https://example.com/sitemap.xml",
    });

    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(10);
    expect(entries[0]?.url).toBe("https://example.com/");
    expect(entries.some((entry) => entry.url === "https://example.com/reviews")).toBe(true);
    expect(
      entries.some(
        (entry) =>
          entry.url === "https://example.com/reviews/popular-series-latest-review"
      )
    ).toBe(true);
  });
});
