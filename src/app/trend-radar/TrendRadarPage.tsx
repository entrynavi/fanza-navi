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
          eyebrow="更新チェック"
          title="急上昇レーダー"
          description="いま動いている作品を、勢い・選びやすさ・セール反応で見分けるページです。ランキングを見たあとにもう一歩掘りたい時の入口として使いやすくしています。"
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
        description="新しさだけでなく、レビューの集まり方や上位入りの勢いまで見て、いま先に押さえたい候補をまとめています。"
        products={trendingNow}
      />

      <ProductGridSection
        eyebrow="今夜向き"
        title="今夜すぐ決めやすい作品"
        description="価格、レビューの厚み、満足度のバランスから、今夜すぐ選びやすい一本を優先しています。"
        products={tonightReady}
      />

      <ProductGridSection
        eyebrow="セール波"
        title="セールで伸びている作品"
        description="割引率だけでなく、レビュー数や価格のバランスも見ながら、反応が集まっているセール作品を拾っています。"
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
          気になる作品が見つかったら、独自ランキングやレビュー、買い時判定まで続けて見ると絞り込みやすくなります。
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
