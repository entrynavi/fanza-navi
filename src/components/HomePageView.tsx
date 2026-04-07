"use client";

import { FaArrowUp, FaBalanceScale, FaBookOpen, FaCoins, FaCreditCard } from "react-icons/fa";
import ActressRankingSection from "@/components/ActressRankingSection";
import GenreRail from "@/components/GenreRail";
import HeroSection from "@/components/HeroSection";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import ProductGridSection from "@/components/ProductGridSection";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import StickyCTA from "@/components/StickyCTA";
import type { ActressRankingEntry } from "@/lib/actress-ranking";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import type { Review } from "@/data/reviews";
import { ROUTES } from "@/lib/site";

const supportingGuides = [
  {
    href: ROUTES.articles,
    title: "記事一覧",
    description: "支払い方法や節約記事をまとめて見返せます。",
    eyebrow: "記事",
  },
  {
    href: ROUTES.guide,
    title: "FANZA完全ガイド",
    description: "最初の登録から購入までの流れを短時間で確認できます。",
    eyebrow: "ガイド",
  },
  {
    href: ROUTES.compare,
    title: "VR・通常作品の比較",
    description: "視聴スタイルごとの違いを整理して無駄買いを減らします。",
    eyebrow: "比較",
  },
  {
    href: ROUTES.articleFanzaPayment,
    title: "支払い方法ガイド",
    description: "クレカ、PayPay、ポイントの使い分けをまとめています。",
    eyebrow: "支払い",
  },
  {
    href: ROUTES.articleSaveMoney,
    title: "セール攻略法",
    description: "クーポンとポイント活用で購入単価を抑える記事です。",
    eyebrow: "セール術",
  },
];

export default function HomePageView({
  leadProduct,
  saleSpotlight,
  newSpotlight,
  rankingPreview,
  salePreview,
  topActresses,
  featuredGenres,
  featuredReviews,
}: {
  leadProduct?: Product;
  saleSpotlight?: Product | null;
  newSpotlight?: Product | null;
  rankingPreview: Product[];
  salePreview: Product[];
  topActresses: ActressRankingEntry[];
  featuredGenres: GenreLandingPage[];
  featuredReviews: Review[];
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const rankingSpotlight = rankingPreview.slice(0, 3);
  const rankingMore = rankingPreview.slice(3);

  return (
    <main className="pb-24">
      <HeroSection
        leadProduct={leadProduct}
        saleSpotlight={saleSpotlight ?? undefined}
        newSpotlight={newSpotlight ?? undefined}
      />

      <section className="content-shell px-4 pb-8">
        <SectionIntro
          eyebrow="月間ランキング"
          title="今月よく見られている作品"
          description="上位から見ていくと、いま動いている作品がつかみやすいです。気になるものだけ詳細やレビューへ進めます。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              ランキング一覧へ
            </PrimaryCta>
          }
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <RankingPodium products={rankingSpotlight} />
            {rankingMore.length > 0 ? (
              <div className="mt-2.5 grid gap-3 md:grid-cols-3">
                {rankingMore.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="content-shell px-4 pb-8">
        <div className="grid gap-4 lg:grid-cols-[1.14fr_0.86fr] lg:items-start">
          <ProductGridSection
            eyebrow="セール注目作"
            title="値下げ中の作品"
            description="価格差とレビュー件数を見ながら、いま買いやすい作品を拾えます。"
            action={
              <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
                セール一覧へ
              </PrimaryCta>
            }
            products={salePreview}
            columns="grid-cols-1 sm:grid-cols-2"
          />

          <aside className="editorial-surface p-4 md:p-5">
            <p className="eyebrow">Buying Notes</p>
            <h2 className="mt-1.5 text-[1.5rem] font-semibold text-[var(--color-text-primary)]">
              セール前に見る比較メモ
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              価格だけで決めにくいときの短い確認用です。
            </p>
            <div className="mt-3 space-y-2.5">
              <a
                href={ROUTES.articleSaveMoney}
                className="block rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaCoins size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">節約ガイドを読む</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      クーポンとポイントの使い分けだけ先に押さえられます。
                    </p>
                  </div>
                </div>
              </a>
              <a
                href={ROUTES.sale}
                className="block rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaBookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">セール会場へ進む</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      値引き作品を見て、そのまま詳細とレビューへ進めます。
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="genre-discovery" className="content-shell px-4 pb-14">
        <SectionIntro
          eyebrow="ジャンル別"
          title="ジャンルから探す"
          description="人気、セール、VRなど、見たい切り口からそのまま進めます。"
          action={
            <PrimaryCta href={ROUTES.search} size="sm" variant="outline">
              検索入口へ
            </PrimaryCta>
          }
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <section className="content-shell px-4 pb-12">
        <SectionIntro
          eyebrow="比較メモ"
          title="迷ったときの比較メモ"
          description="買う前に少しだけ基準を整理したいときの補助入口です。主役は作品一覧で、ここは迷いを減らすための短いメモとして置いています。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              比較メモ一覧へ
            </PrimaryCta>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="content-shell px-4 pb-18">
        <RelatedNavigation
          title="支払い方法や比較記事も見ておけます"
          description="作品を開く前に確認しておきたい情報だけをまとめています。"
          items={supportingGuides}
        />
      </section>

      <StickyCTA />

      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(17,18,21,0.9)] text-[var(--color-text-primary)] shadow-lg backdrop-blur-xl transition-colors hover:border-[var(--color-border-strong)]"
        aria-label="ページトップへ"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}
