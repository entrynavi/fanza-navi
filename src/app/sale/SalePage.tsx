import Breadcrumb from "@/components/Breadcrumb";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { loadSaleProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["sale", "popular", "high-rated"].includes(genre.slug)
);

export default async function SalePage() {
  const products = await loadSaleProducts({ limit: 8 });

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "セール" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="セール情報"
          title="セール作品"
          description="今値下げされている作品を、価格差とレビュー件数で見比べます。"
          action={
            <PrimaryCta href={ROUTES.articleSaveMoney} size="sm" variant="outline">
              節約ガイドへ
            </PrimaryCta>
          }
        />

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">元値と現在価格を見る</span>
          <span className="chip">件数が多い作品を先に確認</span>
          <span className="chip">人気作品や高評価へ横移動</span>
        </div>
      </section>

      <ProductGridSection
        eyebrow="セール作品"
        title="割引中の注目作品"
        description="割引率だけでなくレビューと収録内容も見ながら、候補を絞れます。"
        products={products}
      />

      <section className="mt-10">
        <SectionIntro
          eyebrow="関連ジャンル"
          title="関連ジャンルへ広げる"
          description="近い条件の作品を、別の切り口でも確認できます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="比較の軸を変える"
        description="セールだけで決めきれないときに、次の候補として使いやすいページをまとめています。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "王道の動きを見直したいときに使えます。",
            eyebrow: "ランキング",
          },
          {
            href: getGenreRoute("sale"),
            title: "セールジャンルへ",
            description: "近い値下げ作品をジャンル単位で確認できます。",
            eyebrow: "ジャンル",
          },
          {
            href: ROUTES.articleSaveMoney,
            title: "節約ガイドへ",
            description: "クーポンとポイントの使い方を整理できます。",
            eyebrow: "ガイド",
          },
        ]}
      />
    </main>
  );
}
