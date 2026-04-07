"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBookOpen } from "react-icons/fa";

export default function ExitPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("exit-popup-shown");
    if (shown) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setShow(true);
        sessionStorage.setItem("exit-popup-shown", "1");
        document.removeEventListener("mousemove", handler);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousemove", handler);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousemove", handler);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-8 max-w-md w-full text-center shadow-[0_40px_120px_rgba(143,29,70,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white transition-colors"
              aria-label="閉じる"
            >
              <FaTimes size={14} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4">
              <FaBookOpen size={28} className="text-[var(--color-accent)]" />
            </div>

            <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-2">
              お探しの作品は見つかりましたか？
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-5 leading-relaxed">
              初めての方には<span className="text-[var(--color-accent)] font-bold">完全ガイド</span>がおすすめです。
              登録方法からお得な使い方まで解説しています。
            </p>

            <div className="space-y-3">
              <a
                href="/guide"
                onClick={() => setShow(false)}
                className="block w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-strong)] hover:opacity-90 transition-opacity shadow-lg shadow-[rgba(143,29,70,0.2)]"
              >
                📚 初心者ガイドを読む
              </a>
              <a
                href="/search"
                onClick={() => setShow(false)}
                className="block w-full py-3 rounded-xl font-bold text-[var(--color-text-primary)] bg-white/5 border border-[var(--color-border)] hover:bg-white/10 transition-colors"
              >
                🔍 作品を検索する
              </a>
              <button
                onClick={() => setShow(false)}
                className="text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
