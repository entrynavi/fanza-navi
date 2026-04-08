import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { loadEntityDiscoveryCatalog, loadMakerProducts } from "@/lib/catalog";
import {
  buildActressCandidates,
  buildSeriesCandidates,
  decodeEntitySlug,
  getEntitySlug,
  normalizeEntityName,
  type EntityCandidate,
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

const loadMakerContext = cache(async () => {
  const catalog = await loadEntityDiscoveryCatalog({ limit: 24 });

  return {
    makers: catalog.makers,
  };
});

export async function generateStaticParams() {
  const { makers } = await loadMakerContext();
  return makers.map((entry) => ({ slug: getEntitySlug(entry.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const makerName = decodeEntitySlug(slug);

  if (!makerName) {
    return {};
  }

  return buildPageMetadata({
    title: `${makerName}の作品一覧`,
    description: `${makerName}で見られている作品を、レビュー件数と価格差が見やすい順で整理しています。`,
    path: getMakerRoute(makerName),
    imageAlt: `${makerName}ページのOG画像`,
  });
}

export default async function MakerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const makerName = decodeEntitySlug(slug);
  const normalizedMakerName = normalizeEntityName(makerName);

  if (!normalizedMakerName) {
    notFound();
  }

  const { makers } = await loadMakerContext();
  const makerEntry = makers.find((entry) => normalizeEntityName(entry.name) === normalizedMakerName);

  if (!makerEntry) {
    notFound();
  }

  const products = await loadMakerProducts(normalizedMakerName, {
    limit: 8,
  });

  if (!products.length) {
    notFound();
  }

  const leadProduct = pickLeadProduct(products);
  const totalReviewCount = products.reduce((total, product) => total + product.reviewCount, 0);
  const saleCount = products.filter((product) => product.isSale).length;
  const relatedGenres = genrePages.filter((genre) =>
    products.some((product) => product.genre === genre.slug)
  );
  const actressCandidates = buildActressCandidates(products, 2);
  const seriesCandidates = buildSeriesCandidates(products, 2);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "メーカー別", href: ROUTES.ranking },
          { label: normalizedMakerName },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="メーカー情報"
          title={normalizedMakerName}
          description={`${normalizedMakerName}で動いている作品を、レビュー件数と値下げ状況が見やすい形でまとめています。`}
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              月間ランキングへ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">代表作</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {leadProduct
                ? `まずは「${leadProduct.title}」から入ると、このメーカーの空気が掴みやすいです。`
                : "代表作から入ると雰囲気を掴みやすくなります。"}
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">レビュー数</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              合計レビュー {totalReviewCount}件 / 平均 {averageRating(products)}。件数が動いている順で見比べやすくしています。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">セール中</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              値下げ中 {saleCount}件。割引率だけでなく、件数が多い作品から見ると判断しやすくなります。
            </p>
          </div>
        </div>
      </section>

      <ProductGridSection
        eyebrow="メーカー作品"
        title={`${normalizedMakerName}で見られている作品`}
        description="件数が動いている作品から先に並べています。気になった作品はそのまま公式レビューへ進めます。"
        products={products}
      />

      {relatedGenres.length > 0 ? (
        <section className="mt-10">
          <SectionIntro
            eyebrow="関連ジャンル"
            title="近いジャンルも一緒に見る"
            description="同じメーカーでも作風の違いが出やすいので、ジャンル側から見ると比較しやすくなります。"
          />
          <GenreRail genres={relatedGenres.slice(0, 4)} dense />
        </section>
      ) : null}

      <RelatedNavigation
        title="次に見るページ"
        description="メーカー単位で掴んだあとに、女優やシリーズへそのまま広げられます。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "全体の温度感を見直したいときの入口です。",
            eyebrow: "ランキング",
          },
          {
            href: ROUTES.sale,
            title: "セール一覧へ",
            description: "同じメーカーの値下げ作品を先に見たいときに向いています。",
            eyebrow: "セール",
          },
          actressCandidates[0]
            ? {
                href: getActressRoute(actressCandidates[0].name),
                title: `${actressCandidates[0].name}ページへ`,
                description: "出演者から作品の傾向を追い直せます。",
                eyebrow: "女優",
              }
            : seriesCandidates[0]
              ? {
                  href: getSeriesRoute(seriesCandidates[0].name),
                  title: `${seriesCandidates[0].name}シリーズへ`,
                  description: "同じシリーズの流れで見たいときの入口です。",
                  eyebrow: "シリーズ",
                }
              : {
                  href: relatedGenres[0] ? getGenreRoute(relatedGenres[0].slug) : ROUTES.search,
                  title: relatedGenres[0] ? `${relatedGenres[0].name}ジャンルへ` : "検索入口へ",
                  description: "別の切り口から広げたいときの入口です。",
                  eyebrow: "ジャンル",
                },
        ]}
      />
    </main>
  );
}
