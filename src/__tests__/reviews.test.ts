import { describe, it, expect, vi, beforeEach } from "vitest";
import { getReviewBySlug, reviews } from "@/data/reviews";
import { sampleProducts } from "@/data/products";
import { genreSlugs } from "@/data/genres";

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
      expect(review.lead).toBeTruthy();
      expect(review.verdict).toBeTruthy();
      expect(review.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(review.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(review.genreSlug).toBeTruthy();
      expect(review.heroImageUrl).toBeTruthy();
      expect(review.heroImageAlt).toBeTruthy();
      expect(review.ctaLabel).toBeTruthy();
      expect(review.body.length).toBeGreaterThanOrEqual(3);
      expect(review.relatedProductIds.length).toBeGreaterThanOrEqual(3);
      expect(review.productId).toBeTruthy();
      expect(review.bestFor.length).toBeGreaterThanOrEqual(2);
      expect(review.cautions.length).toBeGreaterThanOrEqual(2);
      expect(review.bodySections.length).toBeGreaterThanOrEqual(3);
      expect(new Set(review.bodySections.map((section) => section.heading)).size).toBe(
        review.bodySections.length
      );
      expect(
        review.bodySections.every(
          (section) =>
            section.heading.length > 0 &&
            section.paragraphs.length >= 1 &&
            section.paragraphs.every((paragraph) => paragraph.length > 0)
        )
      ).toBe(true);
      expect(
        [review.lead, review.verdict, ...review.body].join(" ").includes("自分")
      ).toBe(true);
      expect(review.ctaNote).toBeTruthy();
      expect(review.relatedGenreSlugs.length).toBeGreaterThanOrEqual(2);
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
      expect(review.relatedProductIds.every((productId) => productIds.has(productId))).toBe(
        true
      );
    }
  });

  it("maps every review to a static genre landing page", () => {
    const genreSet = new Set(genreSlugs);

    for (const review of reviews) {
      expect(genreSet.has(review.genreSlug)).toBe(true);
    }
  });

  it("keeps review copy specific instead of placeholder-like", () => {
    for (const review of reviews) {
      expect(review.title).not.toContain("テンプレート");
      expect(review.excerpt).not.toContain("サンプル");
      expect(review.lead).not.toContain("テンプレート");
      expect(review.verdict).not.toContain("テンプレート");
      expect(review.body.some((paragraph) => paragraph.includes("自分"))).toBe(true);
    }
  });

  it("does not change review destination urls when affiliate env changes", async () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "review-affiliate");
    vi.resetModules();

    const { reviews: envReviews } = await import("@/data/reviews");

    expect(envReviews[0].destinationUrl).toBe(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-series-28/"
    );
    expect(envReviews[0].destinationUrl).not.toContain("al.dmm.co.jp");
  });
});
