"use client";

import {
  FaArrowUp, FaCoins, FaGift, FaPercentage, FaTicketAlt, FaTags,
  FaTheaterMasks, FaChartLine, FaCalculator, FaThumbsUp, FaCalendarAlt,
  FaUserFriends, FaIndustry, FaArrowRight, FaBookmark, FaStar, FaDice,
  FaClock, FaShoppingCart, FaTrophy, FaListOl, FaChartBar, FaPiggyBank,
  FaHistory, FaShareAlt, FaUser, FaVoteYea, FaRandom,
} from "react-icons/fa";
import ActressRankingSection from "@/components/ActressRankingSection";
import GenreRail from "@/components/GenreRail";
import HeroSection from "@/components/HeroSection";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import ProductGridSection from "@/components/ProductGridSection";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import StickyCTA from "@/components/StickyCTA";
import type { ActressRankingEntry } from "@/lib/actress-ranking";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";

const toolSuites = [
  {
    href: ROUTES.discover,
    title: "探す/決めるラボ",
    description: "シチュ検索、今夜の1本診断、給料日前ピックを1画面で回せます。",
    icon: <FaTheaterMasks size={20} />,
    accent: true,
    badge: "中心導線",
    highlights: ["今夜の1本診断", "安牌フィルタ", "サプライズ選出"],
  },
  {
    href: ROUTES.buyTiming,
    title: "買う前チェック",
    description: "買い時判定、予算内まとめ買い、価格履歴の見どころをまとめて確認。",
    icon: <FaShoppingCart size={20} />,
    accent: true,
    badge: "高CV",
    highlights: ["買い時スコア", "予算内セット", "セール波チェック"],
  },
  {
    href: ROUTES.watchlist,
    title: "ウォッチリスト司令室",
    description: "保存作品の優先順位、値下げ中の候補、似た作品の深掘りまで対応。",
    icon: <FaBookmark size={20} />,
    accent: false,
    badge: "再訪向け",
    highlights: ["値下げ監視", "優先順位", "似た作品深掘り"],
  },
  {
    href: ROUTES.personalized,
    title: "自分向けフィード",
    description: "履歴とウォッチリストから、次に刺さりやすい候補を濃く出します。",
    icon: <FaUser size={20} />,
    accent: false,
    badge: "習慣化",
    highlights: ["好み学習", "保存中に近い作品", "新作の掘り起こし"],
  },
  {
    href: ROUTES.customRanking,
    title: "比較/ランキング",
    description: "独自ランキングと比較導線で、迷っている候補を決め切る用途に寄せました。",
    icon: <FaChartLine size={20} />,
    accent: false,
    badge: "比較用",
    highlights: ["独自ランキング", "ランキングバトル", "推し決定"],
  },
  {
    href: ROUTES.weeklySale,
    title: "節約攻略",
    description: "週間セール、予測カレンダー、節約術、比較系をまとめた節約導線です。",
    icon: <FaGift size={20} />,
    accent: false,
    badge: "更新型",
    highlights: ["週間セール", "予測カレンダー", "節約投稿/比較"],
  },
];

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
}: {
  leadProduct?: Product;
  saleSpotlight?: Product | null;
  newSpotlight?: Product | null;
  rankingPreview: Product[];
  salePreview: Product[];
  topActresses: ActressRankingEntry[];
  featuredGenres: GenreLandingPage[];
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const rankingSpotlight = rankingPreview.slice(0, 3);
  const rankingMore = rankingPreview.slice(3, 6);
  const saleCompact = salePreview.slice(0, 4);

  return (
    <main className="pb-12">
      <HeroSection
        leadProduct={leadProduct}
        saleSpotlight={saleSpotlight ?? undefined}
        newSpotlight={newSpotlight ?? undefined}
      />

      {/* ★ UNIQUE TOOLS — Main Feature of This Site */}
      <section className="content-shell px-4 pb-10">
        <SectionIntro
          eyebrow="トクナビ独自機能"
          title="公式FANZAにない、ここだけのツール"
          description="バラバラだった独自機能を「探す・買う・比較する」の流れでまとめ直しました。まずは目的に近い導線から入れます。"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {toolSuites.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className={`group relative overflow-hidden rounded-[20px] border p-5 transition-all duration-200 hover:shadow-lg ${
                tool.accent
                  ? "border-[var(--color-accent)]/25 bg-gradient-to-br from-[var(--color-accent)]/8 to-transparent hover:border-[var(--color-accent)]/40 hover:shadow-[var(--color-accent)]/5"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  tool.accent
                    ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                    : "bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]"
                }`}>
                  {tool.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{tool.title}</p>
                    {tool.badge && (
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tool.accent
                          ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                          : "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)]"
                      }`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--color-text-secondary)]">
                    {tool.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tool.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-[var(--color-border)] px-2 py-1 text-[10px] font-medium text-[var(--color-text-muted)]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary-light)] opacity-0 transition-opacity group-hover:opacity-100">
                使ってみる <FaArrowRight size={9} />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="content-shell px-4 pb-8">
        <SectionIntro
          eyebrow="月間ランキング"
          title="今月よく見られている作品"
          description="上位から見ていくと、いま動いている作品がつかみやすいです。"
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
            {rankingPreview.length > 6 && (
              <div className="mt-4 text-center">
                <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
                  ランキング全体を見る →
                </PrimaryCta>
              </div>
            )}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="content-shell px-4 pb-2">
        <div className="grid gap-3 lg:grid-cols-[1.14fr_0.86fr] lg:items-start">
          <ProductGridSection
            eyebrow="セール注目作"
            title="値下げ中の作品"
            description="価格差とレビュー件数を見ながら、いま買いやすい作品を拾えます。"
            action={
              <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
                セール一覧へ
              </PrimaryCta>
            }
            products={saleCompact}
            columns="grid-cols-1 sm:grid-cols-2"
            compact
          />

          <aside className="editorial-surface p-4 md:p-5 lg:sticky lg:top-20 space-y-4">
            <div>
              <p className="eyebrow flex items-center gap-1.5">
                <FaTags size={10} />
                セール・キャンペーン情報
              </p>
              <h2 className="mt-1.5 text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                お得に購入するヒント
              </h2>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-[20px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    <FaPercentage size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">定期セール開催中</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  FANZAでは毎月定期的にセールを開催。対象作品が最大70%OFFになることも。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]">
                    <FaTicketAlt size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">クーポン活用法</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  初回限定クーポンや週末クーポンでさらにお得に。まとめ買いクーポンも定期配布中。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaCoins size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">ポイント還元</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  購入金額の最大10%がポイント還元。貯めたポイントは次回の購入に使えます。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[#7ba3d2]">
                    <FaGift size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">キャンペーン情報</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  季節ごとの大型セールやポイント倍増キャンペーンをお見逃しなく。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={ROUTES.articleSaveMoney}
                className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                  <FaCoins size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">節約ガイドを読む</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    クーポンとポイントの使い分けを確認
                  </p>
                </div>
              </a>
              <a
                href={ROUTES.sale}
                className="flex items-center gap-3 rounded-[20px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3 transition-colors hover:bg-[var(--color-accent)]/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <FaTags size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">セール会場へ進む</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    値引き中の作品を今すぐチェック
                  </p>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="genre-discovery" className="content-shell px-4 pb-8">
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

      <section className="content-shell px-4 pb-8">
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
