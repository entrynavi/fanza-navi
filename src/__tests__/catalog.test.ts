import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleProducts } from "@/data/products";
import type { DmmProduct } from "@/lib/dmm-api";

vi.mock("@/lib/dmm-api", () => ({
  fetchRanking: vi.fn(),
  fetchNewReleases: vi.fn(),
  fetchSaleProducts: vi.fn(),
  fetchByGenre: vi.fn(),
  toProduct: vi.fn((item: DmmProduct, rank?: number) => ({
    id: item.content_id,
    title: item.title,
    description: "API product",
    imageUrl: item.imageURL?.large || item.imageURL?.small || "",
    affiliateUrl: item.affiliateURL || item.URL,
    price: 1000,
    rating: item.review?.average ?? 0,
    reviewCount: item.review?.count ?? 0,
    genre: item.iteminfo?.genre?.[0]?.name || "popular",
    tags: item.iteminfo?.genre?.map((genre) => genre.name) || [],
    rank,
    releaseDate: item.date || "",
  })),
}));

import {
  fetchByGenre,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
} from "@/lib/dmm-api";
import {
  loadGenreProducts,
  loadNewProducts,
  loadRankingProducts,
  loadRelatedProducts,
  loadSaleProducts,
} from "@/lib/catalog";

const makeApiProduct = (overrides: Partial<DmmProduct> = {}): DmmProduct => ({
  content_id: "api-1",
  title: "API title",
  URL: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=api-1/",
  affiliateURL: "https://al.dmm.co.jp/?lurl=https%3A%2F%2Fwww.dmm.co.jp%2Fdigital%2Fvideoa%2F-%2Fdetail%2F%3D%2Fcid%3Dapi-1%2F",
  imageURL: {
    large: "https://pics.dmm.co.jp/api-large.jpg",
  },
  prices: {
    price: "¥1,000",
  },
  review: {
    count: 12,
    average: 4.2,
  },
  iteminfo: {
    genre: [{ id: 1, name: "popular" }],
  },
  date: "2026-04-01T00:00:00.000Z",
  ...overrides,
});

describe("catalog loaders", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it("falls back to curated ranking products when API returns no items", async () => {
    vi.mocked(fetchRanking).mockResolvedValueOnce([]);

    const products = await loadRankingProducts({ limit: 3 });

    expect(products.map((product) => product.id)).toEqual(["1", "2", "3"]);
    expect(products.every((product) => product.affiliateUrl)).toBe(true);
  });

  it("uses API sale products before fallback products", async () => {
    vi.mocked(fetchSaleProducts).mockResolvedValueOnce([makeApiProduct()]);

    const products = await loadSaleProducts({ limit: 2 });

    expect(products[0].id).toBe("api-1");
    expect(products[0].title).toBe("API title");
  });

  it.each([
    ["loadNewProducts", "new-release", fetchNewReleases, loadNewProducts, ["9", "10"]],
    ["loadGenreProducts", "vr", fetchByGenre, loadGenreProducts, ["41", "42"]],
  ] as const)(
    "falls back to curated products for %s when API returns empty",
    async (_label, genre, fetchFn, loader, expectedIds) => {
      vi.mocked(fetchFn).mockResolvedValueOnce([]);

      const products =
        _label === "loadGenreProducts"
          ? await loader(genre, { limit: expectedIds.length })
          : await loader({ limit: expectedIds.length });

      expect(products.map((product) => product.id)).toEqual(expectedIds);
      expect(products.every((product) => product.affiliateUrl)).toBe(true);
    }
  );

  it("falls back to same-genre related products without the current product", async () => {
    vi.mocked(fetchByGenre).mockResolvedValueOnce([]);

    const products = await loadRelatedProducts({
      currentId: "1",
      genre: "popular",
      limit: 4,
    });

    expect(products.every((product) => product.id !== "1")).toBe(true);
    expect(products.every((product) => product.genre === "popular")).toBe(true);
    expect(products.every((product) => product.affiliateUrl)).toBe(true);
  });
});
