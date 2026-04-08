import { FaBolt, FaFire, FaTags } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";

export default function TrendRadarPage({
  trendingNow,
  tonightReady,
  saleMomentum,
}: {
  trendingNow: Product[];
  tonightReady: Product[];
  saleMomentum: Product[];
}) {
  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "急上昇レーダー" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="再訪向け"
          title="急上昇レーダー"
          description="売れ筋の勢い・今夜決めやすいか・セールの伸び方を分けて見る専用ページです。ランキングだけでは埋もれる“今動いている作品”を拾いやすくしています。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip inline-flex items-center gap-1">
            <FaFire size={10} /> 今伸びている作品
          </span>
          <span className="chip inline-flex items-center gap-1">
            <FaBolt size={10} /> 今夜すぐ決めやすい作品
          </span>
          <span className="chip inline-flex items-center gap-1">
            <FaTags size={10} /> セールで動いている作品
          </span>
        </div>
      </section>

      <ProductGridSection
        eyebrow="今伸びている"
        title="急上昇中の作品"
        description="新しさ・レビューの伸び・上位入りの勢いをまとめて見た、今まず押さえておきたい候補です。"
        products={trendingNow}
      />

      <ProductGridSection
        eyebrow="今夜向き"
        title="今夜すぐ決めやすい作品"
        description="価格の重さ、レビューの厚み、満足度の高さから“外しにくい一本”を優先しています。"
        products={tonightReady}
      />

      <ProductGridSection
        eyebrow="セール波"
        title="セールで伸びている作品"
        description="割引率だけでなく、レビューの厚みと価格バランスまで見て“買われやすい”セール作品を拾っています。"
        products={saleMomentum}
        action={
          <PrimaryCta href={ROUTES.buyTiming} size="sm" variant="outline">
            買い時判定へ
          </PrimaryCta>
        }
      />

      <section className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">急上昇を見たら、そのまま比較まで進める</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          迷ったら独自ランキング、さらに決めきれなければレビューや買い時判定まで一気に回すと選びやすくなります。
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <PrimaryCta href={ROUTES.customRanking} size="md">
            独自ランキングへ
          </PrimaryCta>
          <PrimaryCta href={ROUTES.reviews} size="md" variant="outline">
            みんなのレビューへ
          </PrimaryCta>
        </div>
      </section>
    </main>
  );
}
