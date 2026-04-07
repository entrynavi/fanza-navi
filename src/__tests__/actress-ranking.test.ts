import { describe, expect, it } from "vitest";
import { buildActressRanking, decodeActressSlug, getActressSlug } from "@/lib/actress-ranking";
import type { Product } from "@/data/products";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: overrides.id ?? "product-1",
    title: overrides.title ?? "テスト作品",
    description: overrides.description ?? "説明文",
    imageUrl: overrides.imageUrl ?? "https://pics.dmm.co.jp/test.jpg",
    affiliateUrl: overrides.affiliateUrl ?? "https://www.dmm.co.jp/digital/videoa/",
    price: overrides.price ?? 1980,
    rating: overrides.rating ?? 4.2,
    reviewCount: overrides.reviewCount ?? 12,
    genre: overrides.genre ?? "popular",
    tags: overrides.tags ?? ["人気"],
    releaseDate: overrides.releaseDate ?? "2026-04-01",
    actresses: overrides.actresses ?? [],
    maker: overrides.maker,
    label: overrides.label,
    rank: overrides.rank,
    isNew: overrides.isNew,
    isSale: overrides.isSale,
    salePrice: overrides.salePrice,
  };
}

describe("buildActressRanking", () => {
  it("aggregates actress appearances and keeps the strongest representative product", () => {
    const products = [
      createProduct({
        id: "a",
        title: "作品A",
        actresses: ["瀬戸環奈", "天使もえ"],
        reviewCount: 80,
        rating: 4.8,
        rank: 1,
      }),
      createProduct({
        id: "b",
        title: "作品B",
        actresses: ["瀬戸環奈"],
        reviewCount: 44,
        rating: 4.4,
        rank: 2,
      }),
      createProduct({
        id: "c",
        title: "作品C",
        actresses: ["三上悠亜"],
        reviewCount: 120,
        rating: 4.9,
        rank: 3,
      }),
    ];

    const ranking = buildActressRanking(products, 3);

    expect(ranking[0]).toMatchObject({
      name: "瀬戸環奈",
      appearanceCount: 2,
      topProductTitle: "作品A",
    });
    expect(ranking[1]).toMatchObject({
      name: "三上悠亜",
      appearanceCount: 1,
      topProductTitle: "作品C",
    });
  });

  it("filters empty actress names and limits the result", () => {
    const products = [
      createProduct({ id: "a", actresses: ["", "瀬戸環奈"] }),
      createProduct({ id: "b", actresses: [" 天使もえ "] }),
      createProduct({ id: "c", actresses: ["河北彩花"] }),
    ];

    const ranking = buildActressRanking(products, 2);

    expect(ranking).toHaveLength(2);
    expect(ranking.map((entry) => entry.name)).toEqual(["瀬戸環奈", "天使もえ"]);
  });

  it("creates stable actress slugs and decodes them", () => {
    const slug = getActressSlug("瀬戸環奈");

    expect(slug).not.toBe("瀬戸環奈");
    expect(decodeActressSlug(slug)).toBe("瀬戸環奈");
  });
});
