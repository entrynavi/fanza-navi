"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { Product } from "@/data/products";
import { sampleProducts } from "@/data/products";

export default function RelatedProducts({
  currentId,
  genre,
}: {
  currentId?: string;
  genre?: string;
}) {
  const related = sampleProducts
    .filter((p) => p.id !== currentId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold mb-6 text-center">
        👀 こちらもおすすめ
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-card-hover)] flex items-center justify-center text-3xl opacity-20 group-hover:opacity-30 transition-opacity">
              🎬
            </div>
            <div className="p-3">
              <p className="text-xs font-bold line-clamp-2 group-hover:text-[var(--color-primary-light)] transition-colors mb-1">
                {p.title}
              </p>
              <div className="flex items-center gap-1">
                <FaStar size={10} className="text-yellow-400" />
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {p.rating}
                </span>
                {p.salePrice && (
                  <span className="ml-auto text-xs font-bold text-[var(--color-primary)]">
                    ¥{p.salePrice.toLocaleString()}
                  </span>
                )}
                {!p.salePrice && (
                  <span className="ml-auto text-xs font-bold">
                    ¥{p.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
