"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaFire, FaStar, FaBolt, FaTags, FaSearch, FaBookOpen } from "react-icons/fa";

const navLinks = [
  { href: "/fanza-navi/", label: "ホーム", icon: <FaFire size={14} /> },
  { href: "/fanza-navi/ranking", label: "ランキング", icon: <FaStar size={14} /> },
  { href: "/fanza-navi/new", label: "新作", icon: <FaBolt size={14} /> },
  { href: "/fanza-navi/sale", label: "セール", icon: <FaTags size={14} /> },
  { href: "/fanza-navi/articles", label: "記事", icon: <FaBookOpen size={14} /> },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-dark)]/90 backdrop-blur-lg border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/fanza-navi/" className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-lg font-extrabold gradient-text hidden sm:inline">
            FANZAナビ
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>

        {/* Search + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/fanza-navi/search"
            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 transition-all"
          >
            <FaSearch size={14} />
          </a>
          <button
            className="md:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-text-secondary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
