"use client";

import { motion } from "framer-motion";
import { FaStar, FaFire, FaTag, FaBolt } from "react-icons/fa";
import type { Product } from "@/data/products";

const rankColors: Record<number, string> = {
  1: "from-yellow-400 to-amber-600",
  2: "from-gray-300 to-gray-500",
  3: "from-orange-400 to-orange-700",
};

const genreImageColors: Record<string, { from: string; to: string; icon: string }> = {
  動画: { from: "#e4007f", to: "#ff6b35", icon: "▶" },
  VR: { from: "#6366f1", to: "#8b5cf6", icon: "◉" },
  素人: { from: "#ec4899", to: "#f43f5e", icon: "♡" },
  アニメ: { from: "#06b6d4", to: "#3b82f6", icon: "★" },
  成人向け漫画: { from: "#f59e0b", to: "#ef4444", icon: "◆" },
  ゲーム: { from: "#10b981", to: "#14b8a6", icon: "⬡" },
};

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const discountPercent = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  const genreColor = genreImageColors[product.genre] ?? { from: "#e4007f", to: "#ff6b35", icon: "▶" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card group relative overflow-hidden"
    >
      {/* Rank badge */}
      {product.rank && product.rank <= 3 && (
        <div
          className={`absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br ${
            rankColors[product.rank]
          } flex items-center justify-center text-white font-bold text-lg shadow-lg`}
        >
          {product.rank}
        </div>
      )}
      {product.rank && product.rank > 3 && (
        <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] font-bold text-sm">
          {product.rank}
        </div>
      )}

      {/* Badges row */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {product.isNew && (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-500/90 text-white flex items-center gap-1">
            <FaBolt size={10} /> NEW
          </span>
        )}
        {product.isSale && (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/90 text-white flex items-center gap-1">
            <FaTag size={10} /> {discountPercent}%OFF
          </span>
        )}
      </div>

      {/* Image placeholder */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${genreColor.from}22, ${genreColor.to}22)`,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center text-7xl font-bold opacity-15 group-hover:opacity-25 transition-opacity select-none"
          style={{ color: genreColor.from }}
        >
          {genreColor.icon}
        </div>
        <div className="absolute bottom-2 left-3 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${genreColor.from}33`, color: genreColor.from }}>
          {product.genre}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-[var(--color-primary-light)] transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs bg-white/5 text-[var(--color-text-secondary)] border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar size={14} />
            <span className="text-sm font-bold">{product.rating}</span>
          </div>
          <span className="text-xs text-[var(--color-text-secondary)]">
            ({product.reviewCount}件)
          </span>
          {product.rating >= 4.7 && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <FaFire size={12} /> 高評価
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          {product.salePrice ? (
            <>
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                ¥{product.salePrice.toLocaleString()}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] line-through">
                ¥{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold">
              ¥{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)] transition-all duration-300 pulse-glow"
        >
          詳細を見る →
        </a>
      </div>
    </motion.div>
  );
}
