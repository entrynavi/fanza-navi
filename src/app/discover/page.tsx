import type { Metadata } from "next";
import DiscoverPage from "./DiscoverPage";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "シチュエーション別作品ガイド｜気分で探すFANZA｜FANZAオトナビ",
  description:
    "ジャンルや女優名ではなく、今の気分やシチュエーションからFANZA作品を探せるガイドです。初めての方からVR体験まで9つの切り口で最適な作品が見つかります。",
  path: ROUTES.discover,
  imageAlt: "シチュエーション別作品ガイドのOG画像",
});

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export default async function Page() {
  const [ranking, sale] = await Promise.all([
    loadRankingProducts({ limit: 100 }),
    loadSaleProducts({ limit: 100 }),
  ]);

  const allProducts = dedupeProducts([...ranking, ...sale]);

  return <DiscoverPage allProducts={allProducts} />;
}
