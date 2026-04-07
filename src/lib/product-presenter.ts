import type { Product } from "@/data/products";

export function getProductSupportLine(product: Product): string {
  const actressLine = product.actresses?.slice(0, 2).join(" / ");
  const sourceLine = [product.maker, product.label].filter(Boolean).join(" / ");
  const tagLine = product.tags.slice(0, 2).join(" / ");

  return actressLine || sourceLine || tagLine || product.description;
}

export function getPrimaryFanzaCtaLabel(product: Product): string {
  return product.reviewCount > 0 ? "FANZAのレビューを見る" : "FANZAで詳細を見る";
}
