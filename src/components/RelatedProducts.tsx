import ProductGridSection from "@/components/ProductGridSection";
import { loadRelatedProducts } from "@/lib/catalog";

export default async function RelatedProducts({
  currentId,
  genre,
}: {
  currentId?: string;
  genre?: string;
}) {
  const related = await loadRelatedProducts({
    currentId,
    genre,
    limit: 4,
  });

  return (
    <ProductGridSection
      title="👀 こちらもおすすめ"
      products={related}
      emptyMessage="関連作品を準備中です"
    />
  );
}
