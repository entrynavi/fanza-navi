import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import ReviewCard from "@/components/ReviewCard";
import { genrePages } from "@/data/genres";
import { getReviewBySlug, reviews } from "@/data/reviews";
import { loadSaleProducts } from "@/lib/catalog";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "セール" }]} />

      <section className="glass-card border border-white/10 p-8">
        <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">Sale Discovery</p>
        <h1 className="text-3xl font-extrabold md:text-4xl">セール作品</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
          値下げ中の作品をまとめて比較しやすい導線です。割引率だけでなくレビューと収録内容も比較しながら、
          買い切り向きかまとめ買い向きかを見分けやすくしています。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">まず見るポイント</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              通常価格との差とレビュー件数をセットで見ると失敗が減ります。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">レビュー導線</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              実際に選ぶときの基準をレビュー記事で先に確認できます。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">関連ジャンル</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              値引き作品から人気作や高評価作品へ横移動しやすくしています。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">セール前に読むレビュー</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              セット作品や大幅値引きを比較するときの見方を先に整理できます。
            </p>
          </div>
          <a
            href={getReviewRoute("sale-selection-buying-guide")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            セールレビューを見る
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
            <h2 className="text-xl font-extrabold">関連ジャンルへ広げる</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              セールで見つけた条件に近い作品を、別の切り口でも比較できます。
            </p>
          </div>
          <a
            href={getGenreRoute("sale")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            セールジャンルを見る
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

      <ProductGridSection title="割引中の注目作品" products={products} />

      <Footer />
    </main>
  );
}
