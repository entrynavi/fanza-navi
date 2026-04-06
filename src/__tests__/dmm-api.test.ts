import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchRanking,
  fetchNewReleases,
  searchProducts,
  fetchSaleProducts,
  fetchByGenre,
  toProduct,
  type DmmProduct,
} from "@/lib/dmm-api";

describe("DMM API Client", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  describe("fetchProducts (no API key)", () => {
    it("returns empty array when API key is not set", async () => {
      vi.stubEnv("DMM_API_ID", "");
      const result = await fetchRanking();
      expect(result).toEqual([]);
    });

    it("fetchNewReleases returns empty without key", async () => {
      vi.stubEnv("DMM_API_ID", "");
      const result = await fetchNewReleases();
      expect(result).toEqual([]);
    });

    it("searchProducts returns empty without key", async () => {
      vi.stubEnv("DMM_API_ID", "");
      const result = await searchProducts("test");
      expect(result).toEqual([]);
    });

    it("fetchSaleProducts returns empty without key", async () => {
      vi.stubEnv("DMM_API_ID", "");
      const result = await fetchSaleProducts();
      expect(result).toEqual([]);
    });

    it("fetchByGenre returns empty without key", async () => {
      vi.stubEnv("DMM_API_ID", "");
      const result = await fetchByGenre("6004");
      expect(result).toEqual([]);
    });
  });

  describe("fetchProducts (with API key, network error)", () => {
    it("returns empty array on network failure", async () => {
      vi.stubEnv("DMM_API_ID", "test-id");
      vi.stubEnv("DMM_AFFILIATE_ID", "test-aff");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error"))
      );

      const result = await fetchRanking();
      expect(result).toEqual([]);
    });

    it("returns empty array on non-200 response", async () => {
      vi.stubEnv("DMM_API_ID", "test-id");
      vi.stubEnv("DMM_AFFILIATE_ID", "test-aff");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      const result = await fetchRanking();
      expect(result).toEqual([]);
    });
  });

  describe("toProduct converter", () => {
    const mockDmmProduct: DmmProduct = {
      content_id: "abc123",
      title: "テスト作品タイトル",
      URL: "https://www.dmm.co.jp/test",
      affiliateURL: "https://al.dmm.co.jp/test",
      imageURL: {
        large: "https://pics.dmm.co.jp/test-large.jpg",
        small: "https://pics.dmm.co.jp/test-small.jpg",
      },
      prices: {
        price: "¥1,980",
      },
      review: {
        count: 42,
        average: 4.3,
      },
      iteminfo: {
        genre: [
          { id: 1, name: "ドラマ" },
          { id: 2, name: "恋愛" },
        ],
      },
      date: new Date().toISOString(),
    };

    it("converts DmmProduct to Product format", () => {
      const product = toProduct(mockDmmProduct, 1);

      expect(product.id).toBe("abc123");
      expect(product.title).toBe("テスト作品タイトル");
      expect(product.affiliateUrl).toBe("https://al.dmm.co.jp/test");
      expect(product.imageUrl).toBe("https://pics.dmm.co.jp/test-large.jpg");
      expect(product.price).toBe(1980);
      expect(product.rating).toBe(4.3);
      expect(product.reviewCount).toBe(42);
      expect(product.genre).toBe("ドラマ");
      expect(product.tags).toEqual(["ドラマ", "恋愛"]);
      expect(product.rank).toBe(1);
    });

    it("uses small image when large is not available", () => {
      const p = { ...mockDmmProduct, imageURL: { small: "https://small.jpg" } };
      const result = toProduct(p);
      expect(result.imageUrl).toBe("https://small.jpg");
    });

    it("uses URL when affiliateURL is not available", () => {
      const p = { ...mockDmmProduct, affiliateURL: undefined as unknown as string };
      const result = toProduct(p);
      expect(result.affiliateUrl).toBe("https://www.dmm.co.jp/test");
    });

    it("handles missing price gracefully", () => {
      const p = { ...mockDmmProduct, prices: {} };
      const result = toProduct(p);
      expect(result.price).toBe(0);
    });

    it("handles missing review gracefully", () => {
      const p = { ...mockDmmProduct, review: undefined };
      const result = toProduct(p);
      expect(result.rating).toBe(0);
      expect(result.reviewCount).toBe(0);
    });

    it("handles missing genre gracefully", () => {
      const p = { ...mockDmmProduct, iteminfo: {} };
      const result = toProduct(p);
      expect(result.genre).toBe("popular");
      expect(result.tags).toEqual([]);
    });

    it("preserves unknown genre labels and canonicalizes known buckets", () => {
      const dramaProduct = {
        ...mockDmmProduct,
        iteminfo: {
          genre: [{ id: 1, name: "ドラマ" }],
        },
      };
      const vrProduct = {
        ...mockDmmProduct,
        iteminfo: {
          genre: [{ id: 1, name: "VR" }],
        },
      };

      expect(toProduct(dramaProduct).genre).toBe("ドラマ");
      expect(toProduct(vrProduct).genre).toBe("vr");
    });

    it("marks recent releases as new", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const p = { ...mockDmmProduct, date: yesterday.toISOString() };
      const result = toProduct(p);
      expect(result.isNew).toBe(true);
    });

    it("does not mark old releases as new", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);
      const p = { ...mockDmmProduct, date: oldDate.toISOString() };
      const result = toProduct(p);
      expect(result.isNew).toBe(false);
    });
  });
});
