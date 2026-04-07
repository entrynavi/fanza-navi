"use client";

import { FaStar } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import type { Review } from "@/data/reviews";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

export function ReviewCardInner({
  review,
  compact = false,
}: {
  review: Review;
  compact?: boolean;
}) {
  return (
    <article className="glass-card h-full overflow-hidden border border-[var(--color-border)]">
      <div
        role="img"
        aria-label={review.heroImageAlt}
        className={`relative flex items-end overflow-hidden bg-[linear-gradient(135deg,rgba(163,55,88,0.2),rgba(211,175,111,0.08))] ${compact ? "aspect-[16/7] p-4" : "aspect-[16/10] p-5"}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />
        <span className="relative inline-flex rounded-full bg-black/35 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white">
          {review.productTitle}
        </span>
      </div>

      <div className={`space-y-4 ${compact ? "p-4" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] px-2 py-1 font-semibold text-[var(--color-accent)]">
            比較メモ
          </span>
          <span className="flex items-center gap-1 text-[var(--color-accent)]">
            <FaStar size={11} />
            {review.rating.toFixed(1)}
          </span>
          <span>{review.reviewCount}件</span>
        </div>

        <div>
          <h3
            className={`${compact ? "mb-1 text-lg" : "mb-2 text-xl"} font-semibold leading-tight text-[var(--color-text-primary)]`}
          >
            <a href={getReviewRoute(review.slug)} className="hover:text-white">
              {review.title}
            </a>
          </h3>
          <p
            className={`text-sm text-[var(--color-text-secondary)] ${compact ? "line-clamp-3 leading-6" : "line-clamp-4 leading-7"}`}
          >
            {review.excerpt}
          </p>
        </div>

        <div
          className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${compact ? "p-3.5" : "p-4"}`}
        >
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
            メモ
          </p>
          <p
            className={`mt-2 text-sm text-[var(--color-text-secondary)] ${compact ? "line-clamp-3 leading-6" : "leading-7"}`}
          >
            {review.verdict}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <a
            href={getGenreRoute(review.genreSlug)}
            className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white"
          >
            同ジャンルを見る
          </a>
          <PrimaryCta
            href={getReviewRoute(review.slug)}
            aria-label={`${review.title}の比較メモを読む`}
            variant="outline"
            size="sm"
          >
            比較メモを見る
          </PrimaryCta>
        </div>
      </div>
    </article>
  );
}

export default function ReviewCard({
  review,
  compact = false,
}: {
  review: Review;
  compact?: boolean;
}) {
  return <ReviewCardInner review={review} compact={compact} />;
}
