import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleProducts } from "@/data/products";
import type { DmmProduct } from "@/lib/dmm-api";

vi.mock("@/lib/dmm-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/dmm-api")>(
    "@/lib/dmm-api"
  );

  return {
    ...actual,
    fetchRanking: vi.fn(),
    fetchNewReleases: vi.fn(),
    fetchSaleProducts: vi.fn(),
    fetchByGenre: vi.fn(),
  };
});

import {
  fetchByGenre,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
  toProduct,
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
    expect(products[0].rank).toBe(1);
  });

  it("uses API sale products before fallback products", async () => {
    vi.mocked(fetchSaleProducts).mockResolvedValueOnce([makeApiProduct()]);

    const products = await loadSaleProducts({ limit: 2 });

    expect(products[0].id).toBe("api-1");
    expect(products[0].title).toBe("API title");
    expect(products[0].rank).toBeUndefined();
  });

  it("maps DMM genre labels to canonical local genre keys", () => {
    const product = toProduct(
      makeApiProduct({
        iteminfo: {
          genre: [{ id: 1, name: "VR" }],
        },
      })
    );

    expect(product.genre).toBe("vr");
  });

  it("keeps rank off non-ranking catalog surfaces", async () => {
    vi.mocked(fetchNewReleases).mockResolvedValue([]);
    vi.mocked(fetchByGenre).mockResolvedValue([]);
    vi.mocked(fetchRanking).mockResolvedValue([]);

    const [newProducts, genreProducts, relatedProducts] = await Promise.all([
      loadNewProducts({ limit: 2 }),
      loadGenreProducts("vr", { limit: 2 }),
      loadRelatedProducts({
        currentId: "41",
        genre: "vr",
        limit: 2,
      }),
    ]);

    expect(newProducts.every((product) => product.rank === undefined)).toBe(true);
    expect(newProducts.every((product) => product.genre === "new-release")).toBe(true);
    expect(genreProducts.every((product) => product.rank === undefined)).toBe(true);
    expect(genreProducts.every((product) => product.genre === "vr")).toBe(true);
    expect(relatedProducts.every((product) => product.rank === undefined)).toBe(true);
    expect(relatedProducts.every((product) => product.genre === "vr")).toBe(true);
  });

  it("does not call fetchByGenre for loadGenreProducts without an explicit articleId", async () => {
    vi.mocked(fetchByGenre).mockResolvedValue([]);

    await loadGenreProducts("vr", { limit: 2 });

    expect(fetchByGenre).not.toHaveBeenCalled();
  });

  it("does not call fetchByGenre for loadRelatedProducts without an explicit articleId", async () => {
    vi.mocked(fetchByGenre).mockResolvedValue([]);

    await loadRelatedProducts({ genre: "vr", limit: 2 });

    expect(fetchByGenre).not.toHaveBeenCalled();
  });

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
