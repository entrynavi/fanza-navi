import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

export default function ProductGridSection({
  title,
  products,
  emptyMessage = "表示できる作品がありません",
}: {
  title: string;
  products: Product[];
  emptyMessage?: string;
}) {
  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-center">{title}</h3>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--color-text-secondary)]">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
