import ActressRankingSection from "@/components/ActressRankingSection";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { buildActressRanking } from "@/lib/actress-ranking";
import { loadRankingProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "high-rated", "vr"].includes(genre.slug)
);

const featuredReviews = reviews.filter((review) =>
  ["popular", "sale"].includes(review.genreSlug)
);

export default async function RankingPage() {
  const products = await loadRankingProducts({ limit: 8 });
  const podiumProducts = products.slice(0, 3);
  const moreProducts = products.slice(3);
  const topActresses = buildActressRanking(products, 5);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "ランキング" }]} />

      <section>
        <SectionIntro
          eyebrow="Monthly Discovery"
          title="月間ランキング"
          description="今月よく見られている作品を、評価とレビュー件数ごとに見比べやすくまとめています。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">上位3作で温度感を掴む</span>
          <span className="chip">レビュー件数で迷いを減らす</span>
          <span className="chip">ジャンルと比較メモへ横移動</span>
        </div>
      </section>

      <section className="mt-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <SectionIntro
              eyebrow="Top 3"
              title="今月の上位3作"
              description="まずはここだけ見れば、いま動いている作品の傾向をすぐ掴めます。"
            />
            <RankingPodium products={podiumProducts} />
            {moreProducts.length > 0 ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {moreProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="mt-8">
        <SectionIntro
          eyebrow="Comparison Notes"
          title="人気作で迷ったときの比較メモ"
          description="一覧だけでは決めにくいときに、見比べる軸を短く整理したメモです。"
          action={
            <PrimaryCta href={getReviewRoute(reviews[0].slug)} size="sm" variant="outline">
              比較メモへ
            </PrimaryCta>
          }
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} compact />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionIntro
          eyebrow="Related Genres"
          title="ランキング周辺の探し方"
          description="月間上位から近いジャンルへ広げて、取りこぼしを減らせます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="次に見るページ"
        description="ランキングから別の切り口へ動くときに迷いにくいよう、近いページをまとめています。"
        items={[
          {
            href: ROUTES.sale,
            title: "セール情報へ",
            description: "値下げ中の作品だけを見て価格差から比較できます。",
            eyebrow: "Sale",
          },
          {
            href: getGenreRoute("popular"),
            title: "人気作品ジャンルへ",
            description: "ランキング寄りの定番作品をジャンル単位でまとめて見られます。",
            eyebrow: "Genre",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "作風や向いている人を先に確認したいときの入口です。",
            eyebrow: "Review",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
