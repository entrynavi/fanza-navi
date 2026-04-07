import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { getGenreBySlug, genrePages, genreSlugs } from "@/data/genres";
import { getReviewsByGenreSlug } from "@/data/reviews";
import { loadGenreProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES, getGenreRoute } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return genreSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);

  if (!genre) {
    return {};
  }

  const path = getGenreRoute(genre.slug);
  const title = `${genre.name}おすすめ作品と選び方`;
  const description = `${genre.name}の注目作品をレビュー導線付きで整理。${genre.intro}`;

  return buildPageMetadata({
    title,
    description,
    path,
    imageAlt: `${genre.name}ページのOG画像`,
  });
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);

  if (!genre) {
    notFound();
  }

  const [products, relatedReviews] = await Promise.all([
    loadGenreProducts(genre.slug, {
      articleId: genre.articleId,
      limit: 8,
    }),
    Promise.resolve(getReviewsByGenreSlug(genre.slug)),
  ]);

  const neighborGenres = genrePages.filter(
    (candidate) => candidate.slug !== genre.slug
  ).slice(0, 3);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ジャンル別" },
          { label: genre.name },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] text-3xl">
            {genre.icon}
          </span>
          <div>
            <p className="eyebrow">Genre Landing</p>
            <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{genre.name}</h1>
          </div>
        </div>

        <p className="text-lg text-[var(--color-text-secondary)]">{genre.headline}</p>
        <p className="mt-4 max-w-3xl leading-8 text-[var(--color-text-secondary)]">
          {genre.intro}
        </p>
        <div className="mt-5 rounded-[24px] border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] p-4 text-sm leading-7 text-[var(--color-text-primary)]">
          {genre.highlight}
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Reviews"
          title="レビューから探す"
          description="ジャンルの見どころを短時間でつかめるレビューを先に読めます。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />

        {relatedReviews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedReviews.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        ) : (
          <p className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-6 text-sm text-[var(--color-text-secondary)]">
            このジャンルのレビューは準備中です。先に作品一覧から比較できます。
          </p>
        )}
      </section>

      <ProductGridSection
        eyebrow="ジャンル作品"
        title={`${genre.name}のおすすめ作品`}
        description="このジャンルでよく見られている作品を、比較しやすい密度で並べています。"
        products={products}
      />

      <section className="mt-12">
        <SectionIntro
          eyebrow="近いジャンル"
          title="近いジャンルにも広げる"
          description="作風が近いページへ横移動すると、比較の視野が広がります。"
        />
        <GenreRail genres={neighborGenres} />
      </section>

      <RelatedNavigation
        title="次に見るページ"
        description="このジャンルから別の切り口へ動くときに使いやすいページです。"
        items={[
          {
            href: getGenreRoute("popular"),
            title: "人気作品ジャンルへ",
            description: "定番側の強さも合わせて見たいときに向いています。",
            eyebrow: "Genre",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "ジャンルをまたいで作風を比較したいときの入口です。",
            eyebrow: "Review",
          },
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "今月全体の温度感を見直したいときに使えます。",
            eyebrow: "Ranking",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
