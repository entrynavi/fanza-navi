import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import ReviewCard from "@/components/ReviewCard";
import { genrePages } from "@/data/genres";
import { getReviewBySlug } from "@/data/reviews";
import { loadNewProducts } from "@/lib/catalog";
import { getGenreRoute } from "@/lib/site";

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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "新作" }]} />

      <section className="glass-card border border-white/10 p-8">
        <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">New Arrival Guide</p>
        <h1 className="text-3xl font-extrabold md:text-4xl">新着リリース</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
          配信直後の作品をまとめて追える新着導線です。配信直後の温度感をつかみやすい新着導線として、
          初回の反応が見えやすい作品を中心に並べています。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">配信直後を確認</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              新作フラグ付きの作品から今週の動きを素早く追えます。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">レビューへ分岐</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              まだ件数が少ないときは既存レビューで好みの軸を補えます。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="font-bold">関連ジャンルへ移動</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              新作からVRや人気作品ページへ横断して比較できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">新作選びの補助になるレビュー</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              初見で選びにくいときは、人気作やVRのレビューから判断軸を補えます。
            </p>
          </div>
          <a
            href={getGenreRoute("new-release")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            新作ジャンルを見る
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
            <h2 className="text-xl font-extrabold">新着から広げる導線</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              発売直後の勢いだけで決めず、近いジャンルへ比較範囲を広げられます。
            </p>
          </div>
          <a
            href={getGenreRoute("vr")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            VRページへ
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

      <ProductGridSection title="新着で見られている作品" products={products} />

      <Footer />
    </main>
  );
}
