import PrimaryCta from "@/components/PrimaryCta";
import type { Product } from "@/data/products";
import { getReviewByProductId } from "@/data/reviews";
import { getPrimaryFanzaCtaLabel, getProductSupportLine } from "@/lib/product-presenter";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

const PODIUM_ORDER = [
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
];

export default function RankingPodium({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.slice(0, 3).map((product, index) => {
        const review = getReviewByProductId(product.id);
        const hasAffiliateUrl = product.affiliateUrl.trim().length > 0;
        const isLeadCard = index === 0;

        return (
          <article
            key={product.id}
            className={`editorial-surface overflow-hidden ${PODIUM_ORDER[index] ?? ""}`}
          >
            <div className={isLeadCard ? "lg:grid lg:grid-cols-[0.84fr_1.16fr]" : ""}>
              <div
                className={`relative overflow-hidden ${isLeadCard ? "aspect-[16/11] lg:aspect-auto lg:min-h-full" : "aspect-[16/10]"}`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--color-surface-highlight)] text-lg font-semibold text-[var(--color-text-secondary)]">
                    Rank #{product.rank ?? index + 1}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,12,15,0.96)] via-[rgba(11,12,15,0.24)] to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[rgba(211,175,111,0.92)] px-3 py-1 text-xs font-bold text-[rgba(17,18,21,0.95)]">
                    Rank #{product.rank ?? index + 1}
                  </span>
                  {product.isSale ? (
                    <span className="rounded-full bg-[rgba(177,120,82,0.88)] px-3 py-1 text-xs font-bold text-white">
                      セール
                    </span>
                  ) : null}
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white/90">
                  評価 {product.rating.toFixed(1)}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="text-xs leading-6 text-white/80">{getProductSupportLine(product)}</p>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <h3
                  className={`${isLeadCard ? "line-clamp-3 text-[1.7rem]" : "line-clamp-3 text-[1.35rem]"} font-semibold leading-tight text-[var(--color-text-primary)]`}
                >
                  {product.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-[var(--color-text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  レビュー件数まで見ながら比べやすい作品です。気になったらそのまま公式の詳細とユーザーレビューへ進めます。
                </p>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Price</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xl font-semibold text-[var(--color-text-primary)]">
                        ¥{(product.salePrice ?? product.price).toLocaleString()}
                      </span>
                      {product.salePrice ? (
                        <span className="text-sm text-[var(--color-text-muted)] line-through">
                          ¥{product.price.toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={getGenreRoute(product.genre)}
                      className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/25 hover:text-white"
                    >
                      同ジャンルを見る
                    </a>
                    {review ? (
                      <a
                        href={getReviewRoute(review.slug)}
                        className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/25 hover:text-white"
                      >
                        比較メモ
                      </a>
                    ) : null}
                    <PrimaryCta href={product.affiliateUrl} external={hasAffiliateUrl} size="sm">
                      {getPrimaryFanzaCtaLabel(product)}
                    </PrimaryCta>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
