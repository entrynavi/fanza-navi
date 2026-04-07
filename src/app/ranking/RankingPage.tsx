import ActressRankingSection from "@/components/ActressRankingSection";
import Breadcrumb from "@/components/Breadcrumb";
import EntityDiscoveryBand from "@/components/EntityDiscoveryBand";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { buildActressRanking } from "@/lib/actress-ranking";
import { loadRankingProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "high-rated", "vr"].includes(genre.slug)
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
            <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
              セール一覧へ
            </PrimaryCta>
          }
        />
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--color-text-secondary)]">
          <span className="chip">上位3作で温度感を掴む</span>
          <span className="chip">評価件数で迷いを減らす</span>
          <span className="chip">ジャンルも見る</span>
        </div>
      </section>

      <section className="mt-4">
        <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <RankingPodium products={podiumProducts} />
            {moreProducts.length > 0 ? (
              <div className="mt-2 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
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
            href: ROUTES.guide,
            title: "初心者ガイドへ",
            description: "登録や支払い方法を確認したいときに便利です。",
            eyebrow: "ガイド",
          },
        ]}
      />
    </main>
  );
}
