import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { getReviewBySlug } from "@/data/reviews";
import { loadSaleProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["sale", "popular", "high-rated"].includes(genre.slug)
);

const featuredReviews = [
  getReviewBySlug("sale-selection-buying-guide"),
  getReviewBySlug("popular-series-latest-review"),
].filter((review) => review !== undefined);

export default async function SalePage() {
  const products = await loadSaleProducts({ limit: 8 });

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "セール" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="Sale Discovery"
          title="セール作品"
          description="値下げ中の作品をまとめて比較しやすい導線です。割引率だけでなくレビューと収録内容も見ながら、買い切り向きかまとめ買い向きかを見分けやすくしています。"
          action={
            <PrimaryCta href={ROUTES.articleSaveMoney} size="sm" variant="outline">
              節約ガイドへ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Point 1</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              通常価格との差とレビュー件数をセットで見ると失敗が減ります。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Point 2</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              まとめ買いの前にレビューを読むと、買い方の順番が整理しやすいです。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Point 3</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              セールから人気作品や高評価作品へ横移動すると比較しやすくなります。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionIntro
          eyebrow="Comparison Notes"
          title="セール前に見る比較メモ"
          description="割引率だけで決めたくないときに、見方を整理するための補助メモです。"
          action={
            <PrimaryCta href={getReviewRoute("sale-selection-buying-guide")} size="sm" variant="outline">
              比較メモへ
            </PrimaryCta>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <ProductGridSection
        eyebrow="Sale Picks"
        title="割引中の注目作品"
        description="レビューと価格差を見ながら、そのまま作品詳細やレビューへ移動できます。"
        products={products}
      />

      <section className="mt-10">
        <SectionIntro
          eyebrow="Related Genres"
          title="関連ジャンルへ広げる"
          description="セールで見つけた条件に近い作品を、別の切り口でも比較できます。"
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
            description: "いま動いている王道から見直したいときに向いています。",
            eyebrow: "Ranking",
          },
          {
            href: getGenreRoute("sale"),
            title: "セールジャンルへ",
            description: "近い温度感の値下げ作品をジャンル単位で確認できます。",
            eyebrow: "Genre",
          },
          {
            href: ROUTES.articleSaveMoney,
            title: "節約ガイドへ",
            description: "クーポンやポイントの使い方も含めて整理できます。",
            eyebrow: "Guide",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
