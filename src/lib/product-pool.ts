import type { Product } from "@/data/products";

export type ProductPoolSource = "all" | "favorites" | "sale" | "new" | "high-rated";

export interface ProductPoolOption {
  value: ProductPoolSource;
  label: string;
  count: number;
  disabled?: boolean;
}

export function dedupeProducts(
  products: Product[],
  limit: number = Number.POSITIVE_INFINITY
): Product[] {
  const seen = new Set<string>();
  const deduped: Product[] = [];

  for (const product of products) {
    if (!product.affiliateUrl.trim() || seen.has(product.id)) {
      continue;
    }

    seen.add(product.id);
    deduped.push(product);

    if (deduped.length >= limit) {
      break;
    }
  }

  return deduped;
}

function matchesQuery(product: Product, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    product.title,
    product.description,
    product.genre,
    product.maker,
    product.label,
    product.series,
    ...(product.tags ?? []),
    ...(product.actresses ?? []),
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(normalized));
}

export function filterProductsBySource(
  products: Product[],
  source: ProductPoolSource,
  favoriteIds: string[]
): Product[] {
  const favoriteSet = new Set(favoriteIds);

  switch (source) {
    case "favorites":
      return products.filter((product) => favoriteSet.has(product.id));
    case "sale":
      return products.filter((product) => product.isSale);
    case "new":
      return products.filter((product) => product.isNew);
    case "high-rated":
      return products.filter((product) => product.rating >= 4);
    case "all":
    default:
      return products;
  }
}

export function filterProductPool(
  products: Product[],
  options: {
    source: ProductPoolSource;
    query?: string;
    favoriteIds: string[];
  }
): Product[] {
  const bySource = filterProductsBySource(products, options.source, options.favoriteIds);
  const query = options.query?.trim() ?? "";

  if (!query) {
    return bySource;
  }

  return bySource.filter((product) => matchesQuery(product, query));
}

export function getProductPoolOptions(
  products: Product[],
  favoriteIds: string[]
): ProductPoolOption[] {
  const favoriteCount = filterProductsBySource(products, "favorites", favoriteIds).length;
  const saleCount = filterProductsBySource(products, "sale", favoriteIds).length;
  const newCount = filterProductsBySource(products, "new", favoriteIds).length;
  const highRatedCount = filterProductsBySource(products, "high-rated", favoriteIds).length;

  return [
    { value: "all", label: "全取得作品", count: products.length },
    { value: "favorites", label: "ウォッチリスト", count: favoriteCount, disabled: favoriteCount === 0 },
    { value: "sale", label: "セール中", count: saleCount, disabled: saleCount === 0 },
    { value: "new", label: "新作", count: newCount, disabled: newCount === 0 },
    { value: "high-rated", label: "高評価", count: highRatedCount, disabled: highRatedCount === 0 },
  ];
}
