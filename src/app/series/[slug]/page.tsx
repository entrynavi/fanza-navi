import { cache } from "react";
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
import { loadEntityDiscoveryCatalog, loadSeriesProducts } from "@/lib/catalog";
import {
  buildActressCandidates,
  buildMakerCandidates,
  decodeEntitySlug,
  getEntitySlug,
  normalizeEntityName,
} from "@/lib/entity-ranking";
import { buildPageMetadata } from "@/lib/metadata";
import {
  ROUTES,
  getActressRoute,
  getGenreRoute,
  getMakerRoute,
  getSeriesRoute,
} from "@/lib/site";
import type { Product } from "@/data/products";

export const dynamicParams = false;

function scoreProduct(product: Product): number {
  const rankScore = product.rank ? Math.max(0, 20 - product.rank) : 0;
  return product.reviewCount * 100 + Math.round(product.rating * 10) + rankScore;
}

function pickLeadProduct(products: Product[]): Product | null {
  return products.reduce<Product | null>((best, product) => {
    if (!best || scoreProduct(product) > scoreProduct(best)) {
      return product;
    }

    return best;
  }, null);
}

function averageRating(products: Product[]): number {
  if (!products.length) {
    return 0;
  }

  return Number(
    (products.reduce((total, product) => total + product.rating, 0) / products.length).toFixed(1)
  );
}

const loadSeriesContext = cache(async () => {
  const catalog = await loadEntityDiscoveryCatalog({ limit: 8 });

  return {
    sourceProducts: catalog.sourceProducts,
    seriesEntries: catalog.seriesCandidates,
  };
});

export async function generateStaticParams() {
  const { seriesEntries } = await loadSeriesContext();
  return seriesEntries.map((entry) => ({ slug: getEntitySlug(entry.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seriesName = decodeEntitySlug(slug);

  if (!seriesName) {
    return {};
  }

  return buildPageMetadata({
    title: `${seriesName}シリーズの作品一覧`,
    description: `${seriesName}系の作品を、レビュー件数と価格差が見やすい順で整理しています。`,
    path: getSeriesRoute(seriesName),
    imageAlt: `${seriesName}ページのOG画像`,
  });
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seriesName = decodeEntitySlug(slug);
  const normalizedSeriesName = normalizeEntityName(seriesName);

  if (!normalizedSeriesName) {
    notFound();
  }

  const { seriesEntries, sourceProducts } = await loadSeriesContext();
  const seriesEntry = seriesEntries.find(
    (entry) => normalizeEntityName(entry.name) === normalizedSeriesName
  );

  if (!seriesEntry) {
    notFound();
  }

  const products = await loadSeriesProducts(normalizedSeriesName, {
    limit: 8,
    seedProducts: sourceProducts,
  });

  if (!products.length) {
    notFound();
  }

  const leadProduct = pickLeadProduct(products);
  const totalReviewCount = products.reduce((total, product) => total + product.reviewCount, 0);
  const relatedGenres = genrePages.filter((genre) =>
    products.some((product) => product.genre === genre.slug)
  );
  const actressCandidates = buildActressCandidates(products, 2);
  const makerCandidates = buildMakerCandidates(products, 2);
  const newCount = products.filter((product) => product.isNew).length;

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "シリーズ別", href: ROUTES.ranking },
          { label: normalizedSeriesName },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="Series Focus"
          title={normalizedSeriesName}
          description={`${normalizedSeriesName}系の作品を、レビュー件数と価格差が見やすい順でまとめています。`}
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              月間ランキングへ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Representative Work</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {leadProduct
                ? `まずは「${leadProduct.title}」から入ると、このシリーズの流れが掴みやすいです。`
                : "代表作から入るとシリーズの流れが掴みやすくなります。"}
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Review Count</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              合計レビュー {totalReviewCount}件 / 平均 {averageRating(products)}。件数が動いている順で見比べやすくしています。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Recent Releases</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              新着 {newCount}件。シリーズで追うときは、最新作から入るか、件数の多い定番作から入るかで見え方が変わります。
            </p>
          </div>
        </div>
      </section>

      <ProductGridSection
        eyebrow="Series Titles"
        title={`${normalizedSeriesName}シリーズの注目作`}
        description="シリーズの流れが分かりやすい順に見やすくしています。気になった作品はそのまま公式レビューへ進めます。"
        products={products}
      />

      {relatedGenres.length > 0 ? (
        <section className="mt-10">
          <SectionIntro
            eyebrow="Related Genres"
            title="近いジャンルも一緒に見る"
            description="同じシリーズでもジャンルの傾向を掴むと、次に見る作品を選びやすくなります。"
          />
          <GenreRail genres={relatedGenres.slice(0, 4)} dense />
        </section>
      ) : null}

      <RelatedNavigation
        title="次に見るページ"
        description="シリーズで掴んだあとに、メーカーや女優へそのまま広げられます。"
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
            description: "値下げ中の近い作品から見たいときに向いています。",
            eyebrow: "Sale",
          },
          makerCandidates[0]
            ? {
                href: getMakerRoute(makerCandidates[0].name),
                title: `${makerCandidates[0].name}ページへ`,
                description: "同じメーカーの他作品から広げられます。",
                eyebrow: "Maker",
              }
            : actressCandidates[0]
              ? {
                  href: getActressRoute(actressCandidates[0].name),
                  title: `${actressCandidates[0].name}ページへ`,
                  description: "出演者から近い作品を追い直せます。",
                  eyebrow: "Actress",
                }
              : {
                  href: relatedGenres[0] ? getGenreRoute(relatedGenres[0].slug) : ROUTES.search,
                  title: relatedGenres[0] ? `${relatedGenres[0].name}ジャンルへ` : "検索入口へ",
                  description: "別の切り口から広げたいときの入口です。",
                  eyebrow: "Genre",
                },
        ]}
      />

      <Footer />
    </main>
  );
}
