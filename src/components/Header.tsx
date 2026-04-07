"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaBookOpen,
  FaChartLine,
  FaCompass,
  FaFire,
  FaSearch,
  FaTags,
  FaTimes,
  FaBolt,
} from "react-icons/fa";
import { ROUTES, getGenreRoute } from "@/lib/site";

const primaryLinks = [
  { href: ROUTES.ranking, label: "ランキング", icon: <FaChartLine size={12} />, accent: false },
  { href: ROUTES.sale, label: "セール", icon: <FaTags size={12} />, accent: true },
  { href: getGenreRoute("popular"), label: "ジャンル別", icon: <FaCompass size={12} />, accent: false },
  { href: ROUTES.articles, label: "記事", icon: <FaBookOpen size={12} />, accent: false },
];

const utilityLinks = [
  { href: ROUTES.newReleases, label: "新作", icon: <FaBolt size={11} /> },
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border-strong)] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-strong)] text-white shadow-lg shadow-[rgba(143,29,70,0.2)] transition-transform duration-200 group-hover:scale-105">
                <FaFire size={15} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight">
                  <span className="text-[var(--color-accent)]">FANZA</span><span className="gradient-text">オトナビ</span>
                </p>
                <p className="truncate text-[10px] font-medium text-[var(--color-text-muted)]">
                  セール速報＆おすすめ作品ナビ
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
                目的から探す
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
              <div className="flex flex-wrap gap-2 pt-1">
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
                  href={ROUTES.search}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  <FaSearch size={11} />
                  検索
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
