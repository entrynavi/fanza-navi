"use client";

import {
  FaArrowRight,
  FaBookOpen,
  FaBookmark,
  FaChartLine,
  FaCompass,
  FaGift,
  FaShoppingCart,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { ROUTES } from "@/lib/site";

const navSections = [
  {
    title: "探す/決める",
    links: [
      { href: ROUTES.discover, label: "探す/決めるラボ", icon: <FaCompass size={10} /> },
      { href: ROUTES.watchlist, label: "ウォッチリスト司令室", icon: <FaBookmark size={10} /> },
      { href: ROUTES.personalized, label: "自分向けフィード", icon: <FaUser size={10} /> },
      { href: ROUTES.dailyPick, label: "今日の1本", icon: null },
      { href: ROUTES.gacha, label: "サプライズ選出", icon: null },
    ],
  },
  {
    title: "買う前/節約",
    links: [
      { href: ROUTES.buyTiming, label: "買う前チェック", icon: <FaShoppingCart size={10} /> },
      { href: ROUTES.weeklySale, label: "週間セールまとめ", icon: <FaTags size={10} /> },
      { href: ROUTES.salePredict, label: "セール予測カレンダー", icon: null },
      { href: ROUTES.priceHistory, label: "価格履歴チャート", icon: null },
      { href: ROUTES.cospaCalc, label: "コスパ計算機", icon: null },
    ],
  },
  {
    title: "比較/ガイド",
    links: [
      { href: ROUTES.customRanking, label: "独自ランキング", icon: <FaChartLine size={10} /> },
      { href: ROUTES.rankingBattle, label: "ランキングバトル", icon: null },
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
                初めての方はこちら — FANZA完全ガイド
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
                  <circle cx="27" cy="27" r="16" fill="none" stroke="url(#ftr-accent)" strokeWidth="3.5" strokeLinecap="round"/>
                  <line x1="38" y1="38" x2="52" y2="52" stroke="url(#ftr-accent)" strokeWidth="4" strokeLinecap="round"/>
                  <text x="27" y="30.4" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontSize="22" fontWeight="900" fill="url(#ftr-accent)" textAnchor="middle" dominantBaseline="middle" letterSpacing="-1">F</text>
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[var(--color-accent)]">FANZA</span><span className="gradient-text">トクナビ</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--color-text-secondary)]">
              公式FANZAにない切り口で、探す・買う・比較するをまとめた<br className="hidden sm:block" />
              無料ツール集です。診断ラボ・買う前チェック・<br className="hidden sm:block" />
              セール解析で、迷わず選びやすくしています。
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
            © {new Date().getFullYear()} FANZAトクナビ
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            18歳以上向けコンテンツ
          </p>
        </div>
      </div>
    </footer>
  );
}
