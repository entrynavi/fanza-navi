import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "レビュー一覧",
  description:
    "FANZA作品を比べるときの短い補助レビューを一覧で確認。ジャンル別ページへの導線付きで気になる作品を探せます。",
  path: ROUTES.reviews,
});

export default function ReviewsIndexPage() {
  const featuredGenres = genrePages.filter((genre) =>
    ["popular", "sale", "vr"].includes(genre.slug)
  );

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "レビュー一覧" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="レビュー"
          title="レビュー一覧"
          description="迷ったときだけ開く補助ページです。最終判断は公式ページで確認できます。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              ランキングへ
            </PrimaryCta>
          }
        />
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="レビュー一覧"
          title="公開中のレビュー"
          description="気になる作品の特徴やポイントを短くまとめています。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.slug} review={review} compact />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Genres"
          title="ジャンル別に深掘りする"
          description="レビューのあとに、近い作品をまとめて見られます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="比較の起点になるページ"
        description="レビューのあとに、別の軸で比較したいときに使いやすいページです。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "王道の動きを見直したいときに向いています。",
            eyebrow: "Ranking",
          },
          {
            href: ROUTES.sale,
            title: "セール一覧へ",
            description: "価格差を基準に比較したいときの入口です。",
            eyebrow: "Sale",
          },
          {
            href: ROUTES.guide,
            title: "初心者ガイドへ",
            description: "登録や支払い方法を整理したいときに使えます。",
            eyebrow: "Guide",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
