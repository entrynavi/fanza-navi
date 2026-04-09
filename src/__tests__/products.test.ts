import { describe, it, expect, vi, beforeEach } from "vitest";
import { sampleProducts, genres } from "@/data/products";

describe("Product Data Integrity", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("should have at least 40 products", () => {
    expect(sampleProducts.length).toBeGreaterThanOrEqual(40);
  });

  it("every product has required fields", () => {
    for (const p of sampleProducts) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.description).toBeTruthy();
      expect(p.description.length).toBeGreaterThan(10);
      expect(p.price).toBeGreaterThan(0);
      expect(p.genre).toBeTruthy();
      expect(p.tags).toBeInstanceOf(Array);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.rating).toBeGreaterThanOrEqual(0);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(p.reviewCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("no product has broken placeholder image URLs", () => {
    for (const p of sampleProducts) {
      expect(p.imageUrl).not.toContain("placeholder");
      expect(p.imageUrl).not.toContain(".jpg");
    }
  });

  it("no product has '#' as affiliate URL", () => {
    for (const p of sampleProducts) {
      expect(p.affiliateUrl).not.toBe("#");
    }
  });

  it("every product has a valid outbound affiliate URL", () => {
    for (const p of sampleProducts) {
      expect(p.affiliateUrl).toMatch(/^https:\/\/(www\.)?(dmm\.co\.jp|fanza\.com)\//);
    }
  });

  it("wraps fallback product links when affiliate env changes", async () => {
    const defaultUrl = sampleProducts[0].affiliateUrl;
    expect(defaultUrl).toContain("searchstr=");

    vi.stubEnv("DMM_AFFILIATE_ID", "product-affiliate");
    vi.resetModules();

    const { sampleProducts: envProducts } = await import("@/data/products");

    expect(envProducts[0].affiliateUrl).not.toBe(defaultUrl);
    expect(envProducts[0].affiliateUrl).toContain("al.dmm.co.jp");
    expect(decodeURIComponent(envProducts[0].affiliateUrl)).toContain("searchstr=");
  });

  it("sale products have valid sale price less than regular price", () => {
    const saleProducts = sampleProducts.filter((p) => p.isSale && p.salePrice);
    expect(saleProducts.length).toBeGreaterThan(0);
    for (const p of saleProducts) {
      expect(p.salePrice!).toBeLessThan(p.price);
      expect(p.salePrice!).toBeGreaterThan(0);
    }
  });

  it("ranked products have sequential ranks", () => {
    const ranked = sampleProducts
      .filter((p) => p.rank !== undefined)
      .sort((a, b) => a.rank! - b.rank!);
    if (ranked.length > 0) {
      expect(ranked[0].rank).toBe(1);
    }
  });

  it("products cover multiple genres", () => {
    const genreSet = new Set(sampleProducts.map((p) => p.genre));
    expect(genreSet.size).toBeGreaterThanOrEqual(4);
  });

  it("product IDs are unique", () => {
    const ids = sampleProducts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Genre Data", () => {
  it("should have at least 5 genres", () => {
    expect(genres.length).toBeGreaterThanOrEqual(5);
  });

  it("every genre has required fields", () => {
    for (const g of genres) {
      expect(g.id).toBeTruthy();
      expect(g.name).toBeTruthy();
      expect(g.icon).toBeTruthy();
      expect(g.description).toBeTruthy();
      expect(g.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("genre IDs are unique", () => {
    const ids = genres.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
