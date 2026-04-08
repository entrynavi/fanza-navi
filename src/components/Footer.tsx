"use client";

import { FaChartLine, FaTags, FaCompass, FaBookOpen, FaArrowRight, FaGift } from "react-icons/fa";
import { ROUTES } from "@/lib/site";

const navSections = [
  {
    title: "独自ツール",
    links: [
      { href: ROUTES.discover, label: "シチュエーション検索", icon: <FaCompass size={10} /> },
      { href: ROUTES.customRanking, label: "独自ランキング", icon: <FaChartLine size={10} /> },
      { href: ROUTES.simulator, label: "コスト比較", icon: null },
      { href: ROUTES.communityRanking, label: "みんなの推し", icon: null },
      { href: ROUTES.weeklySale, label: "週間セールまとめ", icon: <FaTags size={10} /> },
    ],
  },
  {
    title: "探す",
    links: [
      { href: ROUTES.ranking, label: "人気ランキング", icon: null },
      { href: ROUTES.sale, label: "セール作品", icon: null },
      { href: ROUTES.actressRanking, label: "女優ランキング", icon: null },
      { href: ROUTES.makerRanking, label: "メーカー比較", icon: null },
      { href: ROUTES.newReleases, label: "新作", icon: null },
    ],
  },
  {
    title: "読む",
    links: [
      { href: ROUTES.guide, label: "初心者ガイド", icon: <FaBookOpen size={10} /> },
      { href: ROUTES.articles, label: "記事一覧", icon: null },
      { href: ROUTES.compare, label: "サービス比較", icon: null },
      { href: ROUTES.articleSaveMoney, label: "節約術", icon: null },
      { href: ROUTES.about, label: "運営者情報", icon: null },
      { href: ROUTES.privacy, label: "プライバシーポリシー", icon: null },
      { href: ROUTES.terms, label: "利用規約", icon: null },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[rgba(9,10,13,0.6)]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Guide banner — highest revenue CTA (1,050円/signup) */}
        <a
          href={ROUTES.guide}
          className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/5 p-5 transition-all hover:border-[var(--color-primary)]/40 hover:from-[var(--color-primary)]/15 hover:to-[var(--color-accent)]/10 group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20">
              <FaGift size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
                🎁 初めての方はこちら — FANZA完全ガイド
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                無料登録の手順・支払い方法・お得な買い方まで徹底解説。初回限定クーポンあり！
              </p>
            </div>
          </div>
          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-transform group-hover:scale-[1.03] sm:inline-flex">
            ガイドを読む <FaArrowRight size={12} />
          </span>
        </a>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8">
          <div>
            <a href={ROUTES.home} className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(14,10,18,0.9)] border border-[var(--color-border-strong)]">
                <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6">
                  <defs>
                    <linearGradient id="ftr-accent" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#e34a6e"/>
                      <stop offset="1" stopColor="#d3af6f"/>
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="10" fill="none" stroke="url(#ftr-accent)" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="33" y1="33" x2="42" y2="42" stroke="url(#ftr-accent)" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="21" y="28" width="3" height="5" rx="1" fill="#e34a6e" opacity="0.9"/>
                  <rect x="25" y="24" width="3" height="9" rx="1" fill="#d3af6f" opacity="0.9"/>
                  <rect x="29" y="20" width="3" height="13" rx="1" fill="#e34a6e" opacity="0.9"/>
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[var(--color-accent)]">FANZA</span><span className="gradient-text">オトナビ</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--color-text-secondary)]">
              公式FANZAにない切り口で作品を探せる<br className="hidden sm:block" />
              無料ツール集。シチュ検索・独自ランキング・<br className="hidden sm:block" />
              セール解析で、もっとお得に楽しめます。
            </p>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-[var(--color-text-muted)]">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 p-5">
          <p className="mb-2 text-xs font-semibold text-[var(--color-primary)]">
            ⚠️ 免責事項
          </p>
          <div className="text-[11px] text-[var(--color-text-secondary)] space-y-1 leading-relaxed">
            <p>
              当サイトはDMMアフィリエイトを利用しています。リンク経由での購入により、運営者に報酬が発生する場合があります。
            </p>
            <p>価格・セール情報は掲載時点のものです。最新情報はFANZA公式サイトでご確認ください。</p>
            <p>本サイトは18歳未満の方のご利用を固くお断りします。掲載画像・情報の著作権は各権利者に帰属します。</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} FANZAオトナビ
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            18歳以上向けコンテンツ
          </p>
        </div>
      </div>
    </footer>
  );
}
