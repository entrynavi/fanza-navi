import { describe, it, expect, vi, beforeEach } from "vitest";
import { getReviewBySlug, reviews } from "@/data/reviews";
import { sampleProducts } from "@/data/products";

describe("review data", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("contains at least three reviews", () => {
    expect(reviews.length).toBeGreaterThanOrEqual(3);
  });

  it("provides stable slugs for static generation", () => {
    const slugs = reviews.map((review) => review.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => slug.length > 0)).toBe(true);
  });

  it("includes long-form content fields for each review", () => {
    for (const review of reviews) {
      expect(review.title).toBeTruthy();
      expect(review.excerpt).toBeTruthy();
      expect(review.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(review.body.length).toBeGreaterThan(0);
      expect(review.productId).toBeTruthy();
    }
  });

  it("finds a review by slug", () => {
    const firstReview = reviews[0];
    expect(getReviewBySlug(firstReview.slug)).toEqual(firstReview);
  });

  it("links each review to an existing product id", () => {
    const productIds = new Set(sampleProducts.map((product) => product.id));

    for (const review of reviews) {
      expect(productIds.has(review.productId)).toBe(true);
    }
  });

  it("does not change review links when affiliate env changes", async () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "review-affiliate");
    vi.resetModules();

    const { reviews: envReviews } = await import("@/data/reviews");

    expect(envReviews[0].affiliateUrl).toBe(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-series-28/"
    );
    expect(envReviews[0].affiliateUrl).not.toContain("al.dmm.co.jp");
  });
});
