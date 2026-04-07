"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import { getGenreBySlug } from "@/data/genres";
import { getReviewByProductId } from "@/data/reviews";
import type { Product } from "@/data/products";
import { getPrimaryFanzaCtaLabel, getProductSupportLine } from "@/lib/product-presenter";
import { getReviewRoute, getGenreRoute } from "@/lib/site";

const rankColors: Record<number, string> = {
  1: "#d3af6f",
  2: "#bdb7af",
  3: "#b17852",
};

const genreMeta: Record<string, { from: string; to: string; icon: string; label: string }> = {
  popular: { from: "#a33758", to: "#d3af6f", icon: "人気", label: "人気作品" },
  "new-release": { from: "#5b7ca2", to: "#7ba3d2", icon: "新作", label: "新作" },
  sale: { from: "#b17852", to: "#d3af6f", icon: "SALE", label: "セール" },
  "high-rated": { from: "#4f8a7c", to: "#8dc7b6", icon: "評価", label: "高評価" },
  amateur: { from: "#8d627f", to: "#bb8fb0", icon: "素人", label: "素人" },
  vr: { from: "#5d63a3", to: "#8e91cb", icon: "VR", label: "VR" },
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
  const genreColor = genreMeta[product.genre] ?? genreMeta.popular;
  const hasAffiliateUrl = product.affiliateUrl.trim().length > 0;
  const review = getReviewByProductId(product.id);
  const genre = getGenreBySlug(product.genre);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card group relative flex h-full flex-col overflow-hidden"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${genreColor.from}30, ${genreColor.to}18)`,
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl font-semibold opacity-55 transition-opacity group-hover:opacity-75"
              style={{ color: genreColor.from }}
            >
              {genreColor.icon}
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.08em]"
                style={{ background: `${genreColor.from}28`, color: "#fff4e4" }}
              >
                {genreColor.label}
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-white/85">
                {product.rank ? (
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 font-semibold"
                    style={{
                      backgroundColor:
                        product.rank <= 3 ? `${rankColors[product.rank]}33` : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {product.rank}位
                  </span>
                ) : null}
                {product.isNew ? (
                  <span className="inline-flex rounded-full bg-[rgba(123,163,210,0.22)] px-2.5 py-1 font-semibold">
                    NEW
                  </span>
                ) : null}
                {product.isSale ? (
                  <span className="inline-flex rounded-full bg-[rgba(177,120,82,0.25)] px-2.5 py-1 font-semibold">
                    {discountPercent}%OFF
                  </span>
                ) : null}
              </div>
            </div>
            <div className="rounded-full bg-black/35 px-2.5 py-1 text-xs text-white/85">
              {product.reviewCount}件
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1">
              <FaStar size={12} className="text-[var(--color-accent)]" />
              <span className="font-semibold text-[var(--color-text-primary)]">
                {product.rating.toFixed(1)}
              </span>
            </span>
            <span>レビュー {product.reviewCount}件</span>
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <a
              href={getGenreRoute(product.genre)}
              className="chip chip-accent transition-colors hover:border-[var(--color-border-strong)]"
            >
              {genre?.name ?? genreMeta[product.genre]?.label ?? "作品"}
            </a>
            {review ? (
              <span className="chip">レビューあり</span>
            ) : null}
          </div>
          <h3 className="line-clamp-3 text-lg font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-white">
            {review ? (
              <a href={getReviewRoute(review.slug)} className="editorial-link">
                {product.title}
              </a>
            ) : (
              product.title
            )}
          </h3>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            {getProductSupportLine(product)}
          </p>
        </div>

        <p className="text-sm leading-7 text-[var(--color-text-secondary)] line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Price
            </p>
            {product.salePrice ? (
              <div className="mt-1">
                <p className="text-xs text-[var(--color-text-muted)] line-through">
                  ¥{product.price.toLocaleString()}
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                  ¥{product.salePrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="mt-1 text-2xl font-semibold text-[var(--color-text-primary)]">
                ¥{product.price.toLocaleString()}
              </p>
            )}
          </div>

          {review && hasAffiliateUrl ? (
            <div className="grid gap-2 text-right">
              <PrimaryCta href={product.affiliateUrl} external size="sm">
                {getPrimaryFanzaCtaLabel(product)}
              </PrimaryCta>
              <a
                href={getReviewRoute(review.slug)}
                className="text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-white"
              >
                比較メモを見る
              </a>
            </div>
          ) : review ? (
            <PrimaryCta href={getReviewRoute(review.slug)} size="sm" variant="outline">
              比較メモを見る
            </PrimaryCta>
          ) : hasAffiliateUrl ? (
            <PrimaryCta href={product.affiliateUrl} external size="sm">
              {getPrimaryFanzaCtaLabel(product)}
            </PrimaryCta>
          ) : (
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-muted)]">
              リンク準備中
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
