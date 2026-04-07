import type { Product } from "@/data/products";

function hasPresentedSalePrice(product: Product): product is Product & { salePrice: number } {
  return typeof product.salePrice === "number" && Number.isFinite(product.salePrice);
}

export function getPresentedOriginalPrice(product: Product): number | null {
  if (!hasPresentedSalePrice(product) || product.price <= product.salePrice) {
    return null;
  }

  return product.price;
}

export function getPresentedCurrentPrice(product: Product): number {
  return hasPresentedSalePrice(product) ? product.salePrice : product.price;
}

export function getDiscountPercent(product: Product): number | null {
  const originalPrice = getPresentedOriginalPrice(product);

  if (!originalPrice) {
    return null;
  }

  return Math.round((1 - getPresentedCurrentPrice(product) / originalPrice) * 100);
}

export function formatPriceYen(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function getProductSupportLine(product: Product): string {
  const actressLine = product.actresses?.slice(0, 2).join(" / ");
  const sourceLine = [product.maker, product.label].filter(Boolean).join(" / ");
  const tagLine = product.tags.slice(0, 2).join(" / ");

  return actressLine || sourceLine || tagLine || product.description;
}

export function getPrimaryFanzaCtaLabel(product: Product): string {
  return product.reviewCount > 0 ? "FANZAのレビューを見る" : "FANZAで詳細を見る";
}
