"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGift } from "react-icons/fa";

export default function ExitPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("exit-popup-shown");
    if (shown) return;

    const handler = (e: MouseEvent) => {
      // マウスが画面上部から出ようとした時（離脱意図）
      if (e.clientY < 10) {
        setShow(true);
        sessionStorage.setItem("exit-popup-shown", "1");
        document.removeEventListener("mousemove", handler);
      }
    };

    // 5秒後から検知開始（すぐ出るとUX悪い）
    const timer = setTimeout(() => {
      document.addEventListener("mousemove", handler);
    }, 5000);

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
            className="relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              <FaTimes size={14} />
            </button>

            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
              <FaGift size={28} className="text-[var(--color-primary)]" />
            </div>

            <h3 className="text-xl font-extrabold mb-2">
              ちょっと待って！🎁
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-4 leading-relaxed">
              今なら<span className="text-[var(--color-primary)] font-bold">春の大感謝セール</span>で
              人気作品が<span className="text-white font-bold">最大80%OFF</span>！
              <br />
              この機会をお見逃しなく。
            </p>

            <div className="space-y-3">
              <a
                href="#ranking"
                onClick={() => setShow(false)}
                className="block w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity pulse-glow"
              >
                🔥 セール作品を見る
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
