import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewBody from "@/components/ReviewBody";
import { sampleProducts } from "@/data/products";
import { genrePages, getGenreBySlug } from "@/data/genres";
import { getReviewBySlug, reviewSlugs } from "@/data/reviews";
import { buildAffiliateUrl } from "@/lib/affiliate";
import { loadRelatedProducts } from "@/lib/catalog";
import { buildArticleMetadata } from "@/lib/metadata";
import { ROUTES, getGenreRoute, getReviewRoute, toAbsoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return reviewSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) {
    return {};
  }

  const path = getReviewRoute(review.slug);

  return buildArticleMetadata({
    title: review.title,
    description: review.excerpt,
    path,
    image: review.heroImageUrl,
    imageAlt: review.heroImageAlt,
    publishedTime: review.publishedAt,
    modifiedTime: review.updatedAt,
  });
}

function sortRelatedProducts(preferredIds: string[], currentId: string, products: typeof sampleProducts) {
  const order = new Map(preferredIds.map((id, index) => [id, index]));

  return [...products]
    .filter((product) => product.id !== currentId)
    .sort((left, right) => {
      const leftIndex = order.get(left.id) ?? Number.POSITIVE_INFINITY;
      const rightIndex = order.get(right.id) ?? Number.POSITIVE_INFINITY;

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return right.rating - left.rating;
    });
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  const [product, genre, relatedProducts] = await Promise.all([
    Promise.resolve(sampleProducts.find((item) => item.id === review.productId)),
    Promise.resolve(getGenreBySlug(review.genreSlug)),
    loadRelatedProducts({
      currentId: review.productId,
      genre: review.genreSlug,
      articleId: getGenreBySlug(review.genreSlug)?.articleId,
      limit: 4,
    }),
  ]);

  if (!product) {
    notFound();
  }

  const reviewAffiliateUrl = buildAffiliateUrl(review.destinationUrl);
  const sortedRelatedProducts = sortRelatedProducts(
    review.relatedProductIds,
    review.productId,
    relatedProducts
  ).slice(0, 4);
  const relatedGenres = genrePages
    .filter((item) => review.relatedGenreSlugs.includes(item.slug))
    .map((item) => ({
      href: getGenreRoute(item.slug),
      title: item.name,
      description: item.headline,
      eyebrow: "ジャンル",
    }));
  const reviewStructuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: review.title,
    name: review.title,
    description: review.excerpt,
    mainEntityOfPage: toAbsoluteUrl(getReviewRoute(review.slug)),
    datePublished: review.publishedAt,
    dateModified: review.updatedAt,
    author: {
      "@type": "Organization",
      name: "FANZAナビ",
    },
    itemReviewed: {
      "@type": "Product",
      name: product.title,
      image: [toAbsoluteUrl(product.imageUrl || review.heroImageUrl)],
      offers: {
        "@type": "Offer",
        priceCurrency: "JPY",
        price: String(product.salePrice ?? product.price),
        url: reviewAffiliateUrl,
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating.toFixed(1),
      bestRating: "5",
    },
  };

  return (
    <main className="content-shell py-8">
      <Breadcrumb
        items={[
          { label: "レビュー一覧", href: ROUTES.reviews },
          genre ? { label: genre.name, href: getGenreRoute(genre.slug) } : { label: "レビュー" },
          { label: review.title },
        ]}
      />

      <article className="glass-card overflow-hidden border border-[var(--color-border)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewStructuredData) }}
        />
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_340px]">
          <div className="relative overflow-hidden p-8 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(211,175,111,0.14),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(163,55,88,0.18),transparent_48%)]" />
            <div className="relative max-w-3xl">
              <p className="eyebrow mb-3">レビュー / {review.productTitle}</p>
              <h1 className="text-3xl font-semibold leading-tight text-[var(--color-text-primary)] md:text-5xl">
                {review.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-[var(--color-text-secondary)]">
                {review.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <span>公開 {review.publishedAt}</span>
                <span>更新 {review.updatedAt}</span>
                <span>評価 {review.rating.toFixed(1)} / 5</span>
                <span>レビュー {review.reviewCount}件</span>
              </div>
              <div className="mt-8">
                <PrimaryCta href={reviewAffiliateUrl} external>
                  {review.ctaLabel}
                </PrimaryCta>
              </div>
            </div>
          </div>

          <aside className="border-t border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-black/20">
              <img
                src={product.imageUrl || review.heroImageUrl}
                alt={`${product.title}の商品画像`}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-5">
              <p className="eyebrow">作品メモ</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">{product.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {product.description}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 border-t border-[var(--color-border)] pt-5">
              <p className="text-xs font-medium tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                Price
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
                ¥{(product.salePrice ?? product.price).toLocaleString()}
              </p>
            </div>
          </aside>
        </div>

        <div className="grid gap-10 border-t border-[var(--color-border)] p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ReviewBody review={review} ctaHref={reviewAffiliateUrl} />

          <aside className="space-y-5">
            <div className="editorial-panel p-5">
              <p className="eyebrow mb-2">レビュー</p>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                次に見たいページ
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <a
                  href={ROUTES.reviews}
                  className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  レビュー一覧に戻る
                </a>
                {genre ? (
                  <a
                    href={getGenreRoute(genre.slug)}
                    className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {genre.name}ジャンルを見る
                  </a>
                ) : null}
                <a
                  href={ROUTES.sale}
                  className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  セール一覧を見る
                </a>
              </div>
            </div>

            <div className="editorial-panel p-5">
              <p className="eyebrow mb-2">最終確認</p>
              <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                収録内容、価格、配信状況は公式ページで最新情報を見てから判断してください。レビューで方向をつかんで、最終確認は公式で行う形が一番ズレにくいです。
              </p>
              <div className="mt-4">
                <PrimaryCta href={reviewAffiliateUrl} external className="w-full">
                  {review.ctaLabel}
                </PrimaryCta>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <ProductGridSection
        eyebrow="関連作品"
        title="流れが近い関連作品"
        description="同じ温度感で選びやすい作品を並べています。レビューを読んだあとに比較対象として見やすい順です。"
        products={sortedRelatedProducts}
      />

      <section className="mt-12">
        <RelatedNavigation
          title="次に見るページ"
          description="レビューを読んだあとに、関連ジャンルや補助ガイドへそのまま動けます。"
          items={[
            {
              href: ROUTES.reviews,
              title: "レビュー一覧へ戻る",
              description: "他の切り口のレビューをまとめて確認できます。",
              eyebrow: "レビュー",
            },
            ...relatedGenres,
            {
              href: ROUTES.articleSaveMoney,
              title: "セール攻略ガイド",
              description: "値引き作品を見る前の基準整理に使えます。",
              eyebrow: "ガイド",
            },
            {
              href: ROUTES.articleFanzaPayment,
              title: "支払い方法ガイド",
              description: "購入前に支払い手段を確認したいとき向けです。",
              eyebrow: "ガイド",
            },
          ].slice(0, 3)}
        />
      </section>
    </main>
  );
}
