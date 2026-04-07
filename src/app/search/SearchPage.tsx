import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { loadNewProducts, loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
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
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="作品検索"
          title="作品検索の入口"
          description="静的サイトでも迷わず探せるように、人気、新着、セール、レビューへの入口を1ページにまとめています。まずは比較しやすい切り口から進み、そのまま作品詳細へ移動できます。"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <a
            href={getGenreRoute("popular")}
            className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
          >
            <p className="eyebrow">Popular</p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">まずは人気から</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              定番タイトルを軸に比較したいときの入口です。
            </p>
          </a>
          <a
            href={getGenreRoute("sale")}
            className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
          >
            <p className="eyebrow">Sale</p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">割引から探す</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              値下げ中の作品を優先して比較したいときに向いています。
            </p>
          </a>
          <a
            href={ROUTES.reviews}
            className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
          >
            <p className="eyebrow">Review</p>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-text-primary)]">レビューから探す</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              選び方の基準を先に固めたいときはレビュー一覧から入れます。
            </p>
          </a>
        </div>
      </section>

      <section id="genre-discovery" className="mt-12">
        <SectionIntro
          eyebrow="ジャンル一覧"
          title="ジャンル別の入口"
          description="検索フォームがなくても、よく使う切り口へ迷わず移動できるようにしています。"
          action={
            <PrimaryCta href={ROUTES.newReleases} size="sm" variant="outline">
              新作を見る
            </PrimaryCta>
          }
        />
        <GenreRail genres={discoveryGenres} dense />
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="レビュー"
          title="レビュー付きの入口"
          description="代表的な切り口をレビュー経由で確かめてから商品ページへ進めます。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <ProductGridSection
        eyebrow="注目作品"
        title="入口ページからそのまま見られる作品"
        description="人気、新作、セールを横断して、まず見ておきたい作品を拾えるようにしています。"
        products={featuredProducts}
      />

      <RelatedNavigation
        title="次の比較先"
        description="検索入口から、さらに深く見たいページへそのまま移動できます。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "今月動いている王道を先に見て基準を作れます。",
            eyebrow: "Ranking",
          },
          {
            href: ROUTES.sale,
            title: "セール一覧へ",
            description: "値引き作品だけで比較したいときの入口です。",
            eyebrow: "Sale",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "作風や向いている人を先に読みたいときに向いています。",
            eyebrow: "Review",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
