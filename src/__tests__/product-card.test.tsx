import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

const baseProduct: Product = {
  id: "test-1",
  title: "テスト作品タイトル",
  description: "テスト作品の説明文です",
  imageUrl: "",
  affiliateUrl: "",
  price: 1980,
  rating: 4.5,
  reviewCount: 100,
  genre: "popular",
  tags: ["タグ1", "タグ2"],
  releaseDate: "2026-01-01",
};

describe("ProductCard Component", () => {
  it("renders product title and description", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    expect(screen.getByText("テスト作品タイトル")).toBeInTheDocument();
    expect(screen.getByText("テスト作品の説明文です")).toBeInTheDocument();
  });

  it("renders price correctly", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    const prices = screen.getAllByText("¥1,980");
    expect(prices.length).toBeGreaterThanOrEqual(1);
  });

  it("renders sale price when available", () => {
    const saleProduct = { ...baseProduct, salePrice: 980, isSale: true };
    render(<ProductCard product={saleProduct} index={0} />);
    expect(screen.getByText("¥980")).toBeInTheDocument();
    const origPrices = screen.getAllByText("¥1,980");
    expect(origPrices.length).toBeGreaterThanOrEqual(1);
  });

  it("renders discount percentage badge for sale items", () => {
    const saleProduct = { ...baseProduct, salePrice: 990, isSale: true };
    render(<ProductCard product={saleProduct} index={0} />);
    const badges = screen.getAllByText("50%OFF");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders tags", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    const tag1 = screen.getAllByText("タグ1");
    expect(tag1.length).toBeGreaterThanOrEqual(1);
  });

  it("renders rating", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    const ratings = screen.getAllByText("4.5");
    expect(ratings.length).toBeGreaterThanOrEqual(1);
    const reviewCounts = screen.getAllByText(/100件/);
    expect(reviewCounts.length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'リンク準備中' when affiliateUrl is empty", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    const items = screen.getAllByText("リンク準備中");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("shows FANZA CTA label when affiliateUrl is set", () => {
    const withUrl = { ...baseProduct, affiliateUrl: "https://example.com" };
    render(<ProductCard product={withUrl} index={0} />);
    expect(screen.getByText("FANZAのレビューを見る")).toBeInTheDocument();
  });

  it("renders rank badge for top 3", () => {
    const ranked = { ...baseProduct, rank: 1 };
    render(<ProductCard product={ranked} index={0} />);
    expect(screen.getByText("1位")).toBeInTheDocument();
  });

  it("renders NEW badge for new products", () => {
    const newProduct = { ...baseProduct, isNew: true };
    render(<ProductCard product={newProduct} index={0} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("renders genre label", () => {
    render(<ProductCard product={baseProduct} index={0} />);
    const genreLabels = screen.getAllByText("人気作品");
    expect(genreLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders high rating badge for high-rated genre", () => {
    const highRated = { ...baseProduct, genre: "high-rated", rating: 4.8 };
    render(<ProductCard product={highRated} index={0} />);
    const labels = screen.getAllByText("高評価");
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });
});
