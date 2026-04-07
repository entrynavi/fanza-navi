import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import { getGenreBySlug } from "@/data/genres";
import type { ActressRankingEntry } from "@/lib/actress-ranking";
import {
  formatPriceYen,
  getPresentedCurrentPrice,
  getPresentedOriginalPrice,
  getDiscountPercent,
  getProductSupportLine,
} from "@/lib/product-presenter";
import { getActressRoute } from "@/lib/site";

export default function ActressRankingSection({
  entries,
  compact = false,
}: {
  entries: ActressRankingEntry[];
  compact?: boolean;
}) {
  if (!entries.length) {
    return null;
  }

  return (
    <section className={compact ? "editorial-surface p-4 md:p-5" : ""}>
      <SectionIntro
        eyebrow="Actress Focus"
        title="人気女優ランキング"
        description="いま上位に出ている作品から、よく名前を見る出演者を短く整理しています。"
      />

      <div className={compact ? "grid gap-2" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
        {entries.map((entry, index) => {
          const genre = getGenreBySlug(entry.topProduct.genre);
          const hasAffiliateUrl = entry.topProduct.affiliateUrl.trim().length > 0;
          const originalPrice = getPresentedOriginalPrice(entry.topProduct);
          const currentPrice = getPresentedCurrentPrice(entry.topProduct);
          const discountPercent = getDiscountPercent(entry.topProduct);

          return (
            <article
              key={entry.name}
              className="overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="flex gap-3 p-2.5">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[16px] bg-[var(--color-surface-highlight)]">
                  {entry.topProduct.imageUrl ? (
                    <img
                      src={entry.topProduct.imageUrl}
                      alt={entry.topProduct.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-[var(--color-text-secondary)]">
                      #{index + 1}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="section-eyebrow">Rank #{index + 1}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-[var(--color-text-primary)] md:text-base">
                        <a href={getActressRoute(entry.name)} className="editorial-link">
                          {entry.name}
                        </a>
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-text-secondary)]">
                      {entry.appearanceCount}作品
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[var(--color-text-secondary)]">
                    代表作: {entry.topProductTitle}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)]">
                    {getProductSupportLine(entry.topProduct)}
                  </p>

                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {entry.supportingGenres.slice(0, 2).map((genreSlug) => (
                      <span
                        key={`${entry.name}-${genreSlug}`}
                        className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] px-2 py-1 text-[10px] text-[var(--color-text-muted)]"
                      >
                        {getGenreBySlug(genreSlug)?.name ?? genre?.name ?? "作品"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] px-2.5 py-2">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-text-secondary)]">
                  <span>平均 {entry.averageRating.toFixed(1)}</span>
                  <span>レビュー {entry.totalReviewCount}件</span>
                  <span>
                    {originalPrice ? (
                      <>
                        現価格 {formatPriceYen(currentPrice)} / 元価格 {formatPriceYen(originalPrice)} / 値引率 {discountPercent}%
                      </>
                    ) : (
                      `現価格 ${formatPriceYen(currentPrice)}`
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={getActressRoute(entry.name)}
                    className="text-[11px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-white"
                  >
                    女優ページへ
                  </a>
                  {hasAffiliateUrl ? (
                    <PrimaryCta href={entry.topProduct.affiliateUrl} external size="sm">
                      代表作を見る
                    </PrimaryCta>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
