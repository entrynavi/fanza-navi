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
import { loadNewProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["new-release", "vr", "popular"].includes(genre.slug)
);

const featuredReviews = [
  getReviewBySlug("vr-immersive-viewing-review"),
  getReviewBySlug("popular-series-latest-review"),
].filter((review) => review !== undefined);

export default async function NewReleasesPage() {
  const products = await loadNewProducts({ limit: 8 });

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "新作" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="新作情報"
          title="新着リリース"
          description="配信直後の作品を、反応の早さと件数で追いやすく並べています。"
          action={
            <PrimaryCta href={getGenreRoute("new-release")} size="sm" variant="outline">
              新作ジャンルへ
            </PrimaryCta>
          }
        />

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">新作フラグを先に確認</span>
          <span className="chip">反応が薄いときはレビューで補う</span>
          <span className="chip">VRや人気作品へ横移動</span>
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="関連レビュー"
          title="作品レビュー"
          description="新作で迷ったときだけ、短い確認用として使えます。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} compact />
          ))}
        </div>
      </section>

      <ProductGridSection
        eyebrow="新作一覧"
        title="新着で見られている作品"
        description="配信直後の作品を、そのまま比較しやすい密度で並べています。"
        products={products}
      />

      <section className="mt-12">
        <SectionIntro
          eyebrow="近いジャンル"
          title="新着から広げる導線"
          description="近いジャンルへ広げて比べやすくしています。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="新作のあとに見ておくページ"
        description="新作だけでは判断しきれないときに、比較の軸を増やしやすいページです。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "定番側の強さを見直したいときに使えます。",
            eyebrow: "Ranking",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "作風や向いている人を短く確認できます。",
            eyebrow: "Review",
          },
          {
            href: getGenreRoute("vr"),
            title: "VRジャンルへ",
            description: "没入感重視の作品を別軸で見られます。",
            eyebrow: "Genre",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
