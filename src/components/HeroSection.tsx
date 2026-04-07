import { FaCompass, FaFireAlt, FaShieldAlt } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import type { Product } from "@/data/products";
import { getPrimaryFanzaCtaLabel, getProductSupportLine } from "@/lib/product-presenter";
import { ROUTES } from "@/lib/site";

function formatPrice(product: Product) {
  return `¥${(product.salePrice ?? product.price).toLocaleString()}`;
}

function SnapshotCard({
  product,
  href,
  label,
  tone,
}: {
  product?: Product;
  href: string;
  label: string;
  tone: "sale" | "new";
}) {
  const accentClass =
    tone === "sale"
      ? "from-[rgba(177,120,82,0.5)] to-[rgba(211,175,111,0.12)]"
      : "from-[rgba(91,124,162,0.5)] to-[rgba(123,163,210,0.12)]";
  const badgeClass =
    tone === "sale"
      ? "bg-[rgba(177,120,82,0.18)] text-[#ffd8b2]"
      : "bg-[rgba(91,124,162,0.18)] text-[#d9e8ff]";

  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.04] p-3 transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-white/[0.06]"
    >
      <div className="flex items-start gap-3">
        <div
          className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-[18px] bg-gradient-to-br ${accentClass}`}
        >
          {product?.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold text-white/75">
              {label}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="min-w-0">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass}`}>
            {label}
          </span>
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--color-text-primary)]">
            {product?.title ?? (tone === "sale" ? "値下げ中の作品を見る" : "新着作品を見る")}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            {product ? getProductSupportLine(product) : "いま動いている作品を一覧から確認できます。"}
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
            {product ? formatPrice(product) : tone === "sale" ? "セール一覧へ" : "新作一覧へ"}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function HeroSection({
  leadProduct,
  saleSpotlight,
  newSpotlight,
}: {
  leadProduct?: Product;
  saleSpotlight?: Product;
  newSpotlight?: Product;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-4 md:pt-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[380px] w-[780px] -translate-x-1/2 rounded-full bg-[rgba(163,55,88,0.16)] blur-[120px]" />
        <div className="absolute right-0 top-10 h-[220px] w-[320px] rounded-full bg-[rgba(123,163,210,0.08)] blur-[95px]" />
        <div className="absolute bottom-0 left-0 h-[260px] w-[320px] rounded-full bg-[rgba(211,175,111,0.08)] blur-[90px]" />
      </div>

      <div className="content-shell relative">
        <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--color-accent)]">
              <FaShieldAlt size={11} />
              まずはここから
            </div>

            <h1 className="mt-4 text-[2.55rem] font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--color-text-primary)] md:text-[3.35rem] xl:text-[3.7rem]">
              <span className="block">人気作から探す。</span>
              <span className="mt-1 block">安い日はセールへ。</span>
            </h1>

            <p className="mt-3 text-base font-semibold text-[var(--color-accent)] md:text-lg">
              新作チェックも、ここからそのまま進めます。
            </p>

            <p className="mt-4 max-w-[34rem] text-[15px] leading-7 text-[var(--color-text-secondary)] md:text-[17px]">
              人気1位、値下げ中、新着を最初に並べています。どこから入るかだけ決めれば、
              そのまま一覧や作品詳細へ進めます。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryCta href={ROUTES.ranking} size="lg">
                ランキングから見る
              </PrimaryCta>
              <PrimaryCta href={ROUTES.sale} size="lg" variant="outline">
                セールから見る
              </PrimaryCta>
              <PrimaryCta href={ROUTES.newReleases} size="lg" variant="ghost">
                新作を見る
              </PrimaryCta>
            </div>

            <div className="mt-5 flex flex-wrap gap-6 text-sm">
              {[
                { num: "56+", label: "厳選作品" },
                { num: "10+", label: "ジャンル対応" },
                { num: "毎日", label: "情報更新" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="font-bold text-[var(--color-accent)]">{s.num}</span>{" "}
                  <span className="text-[var(--color-text-muted)]">{s.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-4 max-w-[34rem] text-xs leading-6 text-[var(--color-text-muted)] md:text-sm">
              18歳以上向け。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトで確認できます。
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <article className="overflow-hidden rounded-[32px] border border-white/8 bg-[rgba(14,15,19,0.82)] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                {leadProduct?.imageUrl ? (
                  <img
                    src={leadProduct.imageUrl}
                    alt={leadProduct.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[rgba(163,55,88,0.28)] to-[rgba(211,175,111,0.12)] text-lg font-semibold text-white/70">
                    人気作品
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,11,0.96)] via-[rgba(8,8,11,0.28)] to-transparent" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2 md:left-5 md:top-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(227,74,110,0.92)] px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-[rgba(227,74,110,0.25)]">
                    <FaFireAlt size={11} />
                    人気1位
                  </span>
                  {leadProduct?.isSale ? (
                    <span className="inline-flex rounded-full bg-[rgba(177,120,82,0.86)] px-3 py-1.5 text-xs font-bold text-white">
                      セール対象
                    </span>
                  ) : null}
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white/90 md:right-5 md:top-5">
                  評価 {leadProduct ? leadProduct.rating.toFixed(1) : "4.7"}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="text-xs font-semibold tracking-[0.08em] text-white/70">
                    今週の注目作品
                  </p>
                  <h2 className="mt-2 max-w-3xl text-2xl font-semibold leading-tight text-white md:text-[2rem]">
                    {leadProduct?.title ?? "まず見ておきたい人気作品"}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
                    {leadProduct ? getProductSupportLine(leadProduct) : "人気作、値下げ中、新着の入口をここからまとめて見られます。"}
                  </p>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap items-end gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.08em] text-white/55">価格</p>
                        <p className="mt-1 text-2xl font-semibold text-white">
                          {leadProduct ? formatPrice(leadProduct) : "¥1,980"}
                        </p>
                      </div>
                      <div className="pb-1 text-sm text-white/75">
                        レビュー {leadProduct?.reviewCount ?? 0}件
                      </div>
                    </div>

                    {leadProduct?.affiliateUrl ? (
                      <PrimaryCta href={leadProduct.affiliateUrl} external size="md">
                        {getPrimaryFanzaCtaLabel(leadProduct)}
                      </PrimaryCta>
                    ) : (
                      <PrimaryCta href={ROUTES.ranking} size="md">
                        ランキングを見る
                      </PrimaryCta>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/8 p-4 md:grid-cols-2 md:p-5">
                <SnapshotCard
                  product={saleSpotlight}
                  href={ROUTES.sale}
                  label="値下げ中"
                  tone="sale"
                />
                <SnapshotCard
                  product={newSpotlight}
                  href={ROUTES.newReleases}
                  label="新着"
                  tone="new"
                />
              </div>
            </article>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={ROUTES.search}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-white"
              >
                <FaCompass size={12} />
                ジャンルから絞る
              </a>
              <a
                href={ROUTES.articles}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-white"
              >
                ガイド記事を読む
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
