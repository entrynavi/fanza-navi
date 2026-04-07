import ActressRankingSection from "@/components/ActressRankingSection";
import Breadcrumb from "@/components/Breadcrumb";
import EntityDiscoveryBand from "@/components/EntityDiscoveryBand";
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
    <main className="content-shell px-4 py-6">
      <Breadcrumb items={[{ label: "ランキング" }]} />

      <section>
        <SectionIntro
          eyebrow="月間ランキング"
          title="月間ランキング"
          description="今月よく見られている作品を、評価、件数、価格差ごとに見比べやすくまとめています。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--color-text-secondary)]">
          <span className="chip">上位3作で温度感を掴む</span>
          <span className="chip">レビュー件数で迷いを減らす</span>
          <span className="chip">ジャンルとレビューも見る</span>
        </div>
      </section>

      <section className="mt-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <RankingPodium products={podiumProducts} />
            {moreProducts.length > 0 ? (
              <div className="mt-2.5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {moreProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="mt-5">
        <EntityDiscoveryBand
          title="女優・メーカー・レーベルで絞る"
          description="近い入口だけを短く並べています。"
          products={products}
          topActresses={topActresses}
          compact
        />
      </section>

      <section className="mt-6">
        <SectionIntro
          eyebrow="レビュー"
          title="作品レビュー"
          description="人気作品のレビューを読んで購入の参考にできます。"
          action={
            <PrimaryCta href={getReviewRoute(reviews[0].slug)} size="sm" variant="outline">
              レビューへ
            </PrimaryCta>
          }
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} compact />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionIntro
          eyebrow="関連ジャンル"
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
            eyebrow: "セール",
          },
          {
            href: getGenreRoute("popular"),
            title: "人気作品ジャンルへ",
            description: "ランキング寄りの定番作品をジャンル単位でまとめて見られます。",
            eyebrow: "ジャンル",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "作風や向いている人を先に確認したいときの入口です。",
            eyebrow: "レビュー",
          },
        ]}
      />
    </main>
  );
}
