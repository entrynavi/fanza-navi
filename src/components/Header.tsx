"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaBookOpen,
  FaChartLine,
  FaCompass,
  FaSearch,
  FaTags,
  FaTimes,
  FaBolt,
  FaCalculator,
  FaThumbsUp,
  FaCalendarAlt,
  FaTheaterMasks,
  FaUserFriends,
} from "react-icons/fa";
import { ROUTES } from "@/lib/site";

const primaryLinks = [
  { href: ROUTES.discover, label: "シチュ検索", icon: <FaTheaterMasks size={12} />, accent: true },
  { href: ROUTES.customRanking, label: "独自ランキング", icon: <FaChartLine size={12} />, accent: false },
  { href: ROUTES.sale, label: "セール", icon: <FaTags size={12} />, accent: false },
  { href: ROUTES.ranking, label: "人気作", icon: <FaBolt size={12} />, accent: false },
];

const utilityLinks = [
  { href: ROUTES.weeklySale, label: "週間セール", icon: <FaCalendarAlt size={11} /> },
  { href: ROUTES.simulator, label: "コスト比較", icon: <FaCalculator size={11} /> },
  { href: ROUTES.communityRanking, label: "みんなの推し", icon: <FaThumbsUp size={11} /> },
  { href: ROUTES.guide, label: "初心者ガイド", icon: <FaBookOpen size={11} /> },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-[var(--color-border)] bg-[rgba(17,18,21,0.88)] backdrop-blur-2xl">
      <div className="content-shell">
        <div className="flex min-h-[64px] items-center justify-between gap-4 py-3">
          <a href={ROUTES.home} className="group min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-strong)] bg-[rgba(14,10,18,0.9)] shadow-lg shadow-[rgba(227,74,110,0.15)] transition-transform duration-200 group-hover:scale-105">
                <svg viewBox="0 0 64 64" fill="none" className="h-7 w-7">
                  <defs>
                    <linearGradient id="hdr-accent" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#e34a6e"/>
                      <stop offset="1" stopColor="#d3af6f"/>
                    </linearGradient>
                  </defs>
                  <circle cx="26" cy="26" r="10" fill="none" stroke="url(#hdr-accent)" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="33" y1="33" x2="42" y2="42" stroke="url(#hdr-accent)" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="21" y="28" width="3" height="5" rx="1" fill="#e34a6e" opacity="0.9"/>
                  <rect x="25" y="24" width="3" height="9" rx="1" fill="#d3af6f" opacity="0.9"/>
                  <rect x="29" y="20" width="3" height="13" rx="1" fill="#e34a6e" opacity="0.9"/>
                  <text x="47" y="56" fontFamily="sans-serif" fontSize="16" fontWeight="800" fill="url(#hdr-accent)">N</text>
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight">
                  <span className="text-[var(--color-accent)]">FANZA</span><span className="gradient-text">オトナビ</span>
                </p>
                <p className="truncate text-[10px] font-medium text-[var(--color-text-muted)]">
                  セール解析 × シチュ検索 × 独自ランキング
                </p>
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-1.5 lg:flex">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  link.accent
                    ? "border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/8 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/15"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="hidden items-center gap-1 lg:flex">
              {utilityLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href={ROUTES.search}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] hover:shadow-lg hover:shadow-[rgba(143,29,70,0.1)]"
              aria-label="検索入口"
            >
              <FaSearch size={13} />
            </a>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:bg-white/8 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        <div className="hidden border-t border-[var(--color-border)] py-2.5 md:flex lg:hidden">
          <div className="flex flex-wrap gap-2">
            {[...primaryLinks, ...utilityLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
          >
            <div className="content-shell py-4 space-y-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                メイン機能
              </p>
              <div className="grid grid-cols-2 gap-2">
                {primaryLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="pt-2 text-xs font-semibold tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                ツール・ガイド
              </p>
              <div className="flex flex-wrap gap-2">
                {utilityLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
                <a
                  href={ROUTES.actressRanking}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaUserFriends size={11} />
                  女優ランキング
                </a>
                <a
                  href={ROUTES.articles}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaBookOpen size={11} />
                  記事
                </a>
                <a
                  href={ROUTES.search}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaSearch size={11} />
                  作品検索
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
