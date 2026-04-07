import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { buildActressRanking, decodeActressSlug, getActressSlug } from "@/lib/actress-ranking";
import { loadActressProducts, loadNewProducts, loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES, getGenreRoute } from "@/lib/site";

export const dynamicParams = false;

async function loadActressContext() {
  const [ranking, sale, latest] = await Promise.all([
    loadRankingProducts({ limit: 8 }),
    loadSaleProducts({ limit: 6 }),
    loadNewProducts({ limit: 6 }),
  ]);

  const sourceProducts = [...ranking, ...sale, ...latest];

  return {
    sourceProducts,
    actresses: buildActressRanking(sourceProducts, 8),
  };
}

export async function generateStaticParams() {
  const { actresses } = await loadActressContext();
  return actresses.map((entry) => ({ slug: getActressSlug(entry.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const actressName = decodeActressSlug(slug);

  if (!actressName) {
    return {};
  }

  return buildPageMetadata({
    title: `${actressName}が気になる人向けの作品一覧`,
    description: `${actressName}の代表作や近いジャンルの作品を、ランキング導線つきで比較しやすく整理しています。`,
    path: `${ROUTES.actresses}/${slug}`,
    imageAlt: `${actressName}ページのOG画像`,
  });
}

export default async function ActressPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actressName = decodeActressSlug(slug);

  if (!actressName) {
    notFound();
  }

  const { actresses: featuredActresses, sourceProducts } = await loadActressContext();
  const products = await loadActressProducts(actressName, {
    limit: 8,
    seedProducts: sourceProducts,
  });

  const actressEntry = featuredActresses.find((entry) => entry.name === actressName);

  if (!products.length && !actressEntry) {
    notFound();
  }

  const relatedGenres = genrePages.filter((genre) =>
    products.some((product) => product.genre === genre.slug)
  );

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ランキング", href: ROUTES.ranking },
          { label: actressName },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="Actress Focus"
          title={actressName}
          description={`${actressName}が気になるときに、そのまま代表作と近いジャンルへ進める入口です。ランキングでよく見られている作品を中心に並べています。`}
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              月間ランキングへ
            </PrimaryCta>
          }
        />

        {actressEntry ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="eyebrow">Representative Work</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                まずは {actressEntry.topProductTitle} から入ると、いまの雰囲気を掴みやすいです。
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="eyebrow">Review Count</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                合計レビュー {actressEntry.totalReviewCount}件。件数が多い作品から見ると外しにくくなります。
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="eyebrow">Genres</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {actressEntry.supportingGenres
                  .map((slug) => genrePages.find((genre) => genre.slug === slug)?.name ?? slug)
                  .join(" / ")}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <ProductGridSection
        eyebrow="Featured Titles"
        title={`${actressName}で見られている作品`}
        description="まずはレビュー件数が動いている作品から見て、そのあと近いジャンルへ広げると比較しやすいです。"
        products={products}
      />

      {relatedGenres.length > 0 ? (
        <section className="mt-10">
          <SectionIntro
            eyebrow="Related Genres"
            title="近いジャンルへ広げる"
            description="出演作の傾向が近いジャンルもそのまま比較できます。"
          />
          <GenreRail genres={relatedGenres.slice(0, 4)} dense />
        </section>
      ) : null}

      <RelatedNavigation
        title="次に見るページ"
        description="女優ページから次の比較先へそのまま移動できます。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "全体の温度感を見直したいときの入口です。",
            eyebrow: "Ranking",
          },
          {
            href: ROUTES.sale,
            title: "セール一覧へ",
            description: "値引き中の出演作から見たいときに向いています。",
            eyebrow: "Sale",
          },
          {
            href: relatedGenres[0] ? getGenreRoute(relatedGenres[0].slug) : ROUTES.search,
            title: relatedGenres[0] ? `${relatedGenres[0].name}ジャンルへ` : "検索入口へ",
            description: relatedGenres[0]
              ? "作風が近い作品をそのまま比較できます。"
              : "別の切り口から探したいときの入口です。",
            eyebrow: "Genre",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
