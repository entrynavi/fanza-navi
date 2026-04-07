import type { ReactNode } from "react";
import ProductCard from "@/components/ProductCard";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";

export default function ProductGridSection({
  eyebrow,
  title,
  description,
  action,
  products,
  emptyMessage = "表示できる作品がありません",
  columns = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  products: Product[];
  emptyMessage?: string;
  columns?: string;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "mt-0" : "mt-10"}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
      />
      {products.length > 0 ? (
        <div className={`grid gap-3 ${columns}`}>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <p className="editorial-panel px-5 py-6 text-sm text-[var(--color-text-secondary)]">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
