"use client";

import { FaFire, FaChartLine, FaTags, FaCompass, FaBookOpen } from "react-icons/fa";
import { ROUTES, getGenreRoute } from "@/lib/site";

const navSections = [
  {
    title: "探す",
    links: [
      { href: ROUTES.ranking, label: "ランキング", icon: <FaChartLine size={10} /> },
      { href: ROUTES.sale, label: "セール", icon: <FaTags size={10} /> },
      { href: getGenreRoute("popular"), label: "ジャンル別", icon: <FaCompass size={10} /> },
      { href: ROUTES.newReleases, label: "新作", icon: null },
    ],
  },
  {
    title: "読む",
    links: [
      { href: ROUTES.articles, label: "記事一覧", icon: <FaBookOpen size={10} /> },
      { href: ROUTES.guide, label: "初心者ガイド", icon: null },
      { href: ROUTES.compare, label: "VR比較", icon: null },
      { href: ROUTES.articleSaveMoney, label: "セール攻略", icon: null },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { href: ROUTES.about, label: "運営者情報", icon: null },
      { href: ROUTES.privacy, label: "プライバシーポリシー", icon: null },
      { href: ROUTES.terms, label: "利用規約", icon: null },
      { href: ROUTES.contact, label: "お問い合わせ", icon: null },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[rgba(9,10,13,0.6)]">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8">
          <div>
            <a href={ROUTES.home} className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-strong)] text-white">
                <FaFire size={13} />
              </span>
              <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                オト<span className="gradient-text">ナビ</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--color-text-secondary)]">
              FANZAの人気作品・セール情報・おすすめ作品を<br className="hidden sm:block" />
              まとめた比較ガイドサイトです。
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
            © {new Date().getFullYear()} オトナビ
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            18歳以上向けコンテンツ
          </p>
        </div>
      </div>
    </footer>
  );
}
