import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import ReviewCard from "@/components/ReviewCard";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { loadRankingProducts } from "@/lib/catalog";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "high-rated", "vr"].includes(genre.slug)
);

const featuredReviews = reviews.filter((review) =>
  ["popular", "sale"].includes(review.genreSlug)
);

export default async function RankingPage() {
  const products = await loadRankingProducts({ limit: 8 });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "ランキング" }]} />

      <section className="glass-card border border-white/10 p-8">
        <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">Monthly Discovery</p>
        <h1 className="text-3xl font-extrabold md:text-4xl">月間ランキング</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
          今月の売れ筋を起点に、レビュー件数と評価の伸びまで見比べやすい形でまとめたランキングです。
          レビューから人気作の傾向を先に確認してから作品詳細へ進めます。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Focus
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              月内で安定して動いている定番タイトルを優先して並べています。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Compare
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              評価点だけでなくレビュー件数の厚みも合わせて判断できます。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Route
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              気になるジャンルページやレビュー導線へそのまま移動できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">レビューから人気作をつかむ</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              売れ筋の理由を短時間で把握しやすいレビューを先に読めます。
            </p>
          </div>
          <a
            href={getReviewRoute(reviews[0].slug)}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            人気作レビューへ
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">ランキング周辺の探し方</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              月間上位から近いジャンルへ広げて、取りこぼしを減らせます。
            </p>
          </div>
          <a
            href={getGenreRoute("popular")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            人気作品を見る
          </a>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {featuredGenres.map((genre) => (
            <a
              key={genre.slug}
              href={getGenreRoute(genre.slug)}
              className="rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-white/10"
            >
              <div className="mb-2 text-2xl">{genre.icon}</div>
              <h3 className="mb-1 font-bold">{genre.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{genre.headline}</p>
            </a>
          ))}
        </div>
      </section>

      <ProductGridSection title="今月よく見られている作品" products={products} />

      <Footer />
    </main>
  );
}
