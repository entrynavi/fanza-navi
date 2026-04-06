import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import ReviewCard from "@/components/ReviewCard";
import type { Product } from "@/data/products";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import {
  loadNewProducts,
  loadRankingProducts,
  loadSaleProducts,
} from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const discoveryGenres = genrePages.filter((genre) =>
  ["popular", "sale", "new-release", "vr"].includes(genre.slug)
);

function mergeDiscoveryProducts(collections: Product[][], limit: number): Product[] {
  const merged = new Map<string, Product>();

  collections.flat().forEach((product) => {
    if (merged.size >= limit) {
      return;
    }
    if (!product.affiliateUrl.trim() || merged.has(product.id)) {
      return;
    }
    merged.set(product.id, product);
  });

  return Array.from(merged.values());
}

export default async function SearchPage() {
  const [rankingProducts, saleProducts, newProducts] = await Promise.all([
    loadRankingProducts({ limit: 3 }),
    loadSaleProducts({ limit: 3 }),
    loadNewProducts({ limit: 3 }),
  ]);

  const featuredProducts = mergeDiscoveryProducts(
    [rankingProducts, saleProducts, newProducts],
    8
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <section className="glass-card border border-white/10 p-8">
        <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">Search Entry</p>
        <h1 className="text-3xl font-extrabold md:text-4xl">作品検索の入口</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
          静的サイトでも迷わず探せるように、人気、新着、セール、レビューへの入口を1ページにまとめています。
          まずは比較しやすい切り口から進み、そのまま作品詳細へ移動できます。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <a
            href={getGenreRoute("popular")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Popular
            </p>
            <h2 className="mt-2 font-bold">まずは人気から</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              定番タイトルを軸に比較したいときの入口です。
            </p>
          </a>
          <a
            href={getGenreRoute("sale")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Sale
            </p>
            <h2 className="mt-2 font-bold">割引から探す</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              値下げ中の作品を優先して比較したいときに向いています。
            </p>
          </a>
          <a
            href={ROUTES.reviews}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Review
            </p>
            <h2 className="mt-2 font-bold">レビューから探す</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              選び方の基準を先に固めたいときはレビュー一覧から入れます。
            </p>
          </a>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">レビュー付きの入口</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              代表的な切り口をレビュー経由で確かめてから商品ページへ進めます。
            </p>
          </div>
          <a
            href={ROUTES.reviews}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            レビュー一覧へ
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">ジャンルから探す</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              よく使う導線をまとめて置いているので、検索フォームなしでも回遊できます。
            </p>
          </div>
          <a
            href={getGenreRoute("new-release")}
            className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            新作を見る
          </a>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {discoveryGenres.map((genre) => (
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

      <ProductGridSection title="入口ページからそのまま見られる作品" products={featuredProducts} />

      <Footer />
    </main>
  );
}
