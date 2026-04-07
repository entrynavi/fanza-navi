import {
  FaBalanceScale,
  FaBookOpen,
  FaClock,
  FaCoins,
  FaCompass,
  FaCreditCard,
  FaVrCardboard,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { ROUTES } from "@/lib/site";

const articles = [
  {
    href: ROUTES.guide,
    icon: <FaBookOpen size={18} />,
    title: "FANZA完全ガイド｜登録方法から使い方まで初心者向け徹底解説",
    description:
      "会員登録、作品の探し方、購入までの流れを一通り確認したい人向けの基本ガイドです。",
    tag: "Guide",
    date: "2026.03.28",
    readTime: "10分",
  },
  {
    href: ROUTES.compare,
    icon: <FaBalanceScale size={18} />,
    title: "VR vs 通常・月額見放題 vs 単品購入｜FANZAの楽しみ方を比較",
    description:
      "視聴スタイルや課金の仕方で迷ったときに、比較の軸をまとめて確認できる記事です。",
    tag: "Compare",
    date: "2026.03.28",
    readTime: "8分",
  },
  {
    href: ROUTES.articleFanzaPayment,
    icon: <FaCreditCard size={18} />,
    title: "FANZA（DMM）の支払い方法を完全解説｜クレカ・PayPay・DMMポイント比較",
    description:
      "支払い手段ごとの特徴や、購入前に押さえておきたい違いを整理しています。",
    tag: "Payment",
    date: "2026.03.30",
    readTime: "12分",
  },
  {
    href: ROUTES.articleVrSetup,
    icon: <FaVrCardboard size={18} />,
    title: "FANZA VR動画の視聴方法｜スマホ・PC・Meta Quest別セットアップガイド",
    description:
      "VR視聴で必要な機材や設定を、環境ごとに落ち着いて確認できる記事です。",
    tag: "VR",
    date: "2026.03.31",
    readTime: "15分",
  },
  {
    href: ROUTES.articleSaveMoney,
    icon: <FaCoins size={18} />,
    title: "FANZAで損しないセール・クーポン・ポイント活用術まとめ【2026年版】",
    description:
      "セール時期、クーポン、ポイント活用をまとめて見て、無駄買いを減らしたい人向けです。",
    tag: "節約術",
    date: "2026.04.01",
    readTime: "13分",
  },
];

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "sale", "vr"].includes(genre.slug)
);

const featuredReviews = reviews.slice(0, 3);

export default function ArticlesPage() {
  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "記事一覧" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="ガイド一覧"
          title="記事一覧"
          description="支払い方法、比較、VRの準備、セールの見方など、作品を見る前後で迷いやすい情報をまとめています。レビュー導線やジャンル導線と行き来しやすい構成です。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Before Purchase</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              支払い方法やセール条件を先に整理しておくと、比較の精度が上がります。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Viewing Setup</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              VRや視聴環境の準備が必要な人は、作品選びの前に相性を確認できます。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Route Back</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              記事からレビューやジャンルへ戻りやすくして、読み物で終わらない導線にしています。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="公開中ガイド"
          title="公開中のガイド記事"
          description="まずは迷っているポイントに近いテーマから読むと、作品比較の前提を整えやすくなります。"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className="group editorial-panel p-5 transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                  {article.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 font-medium text-[var(--color-text-secondary)]">
                      {article.tag}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaClock size={10} />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {article.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)]">
                    記事を読む
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="レビュー"
          title="記事のあとに見やすいレビュー"
          description="読み物で判断軸を作ったあと、そのまま作品レビューへ進める導線を近くに置いています。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="ジャンル"
          title="ジャンルから比較に戻る"
          description="記事で基準を作ったあとに、人気作、セール、VRなどの切り口へ戻りやすくしています。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <section className="mt-12 editorial-surface p-6 md:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
            <FaCompass size={18} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              このページの役割
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              記事一覧は、作品を直接選ぶ前に判断材料を整えるための場所です。支払い方法や視聴環境を先に整理しておくと、ランキングやセールを見たときに迷いにくくなります。
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              そのままレビューやジャンルページへ戻れるようにしているので、読み物だけで終わらず比較の起点として使えます。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
