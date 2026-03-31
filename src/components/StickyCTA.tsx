"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTags, FaTimes } from "react-icons/fa";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-[0_-4px_30px_rgba(228,0,127,0.3)]"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-white min-w-0">
              <FaTags className="shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">
                  🎉 今だけ最大80%OFF！春の大感謝セール
                </p>
                <p className="text-xs opacity-80 hidden sm:block">
                  期間限定の特別価格をお見逃しなく
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#ranking"
                className="px-5 py-2 rounded-xl text-sm font-bold text-[var(--color-primary)] bg-white hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                今すぐチェック
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="閉じる"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
