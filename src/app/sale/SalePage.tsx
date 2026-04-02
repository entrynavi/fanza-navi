"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { FaTags, FaArrowRight } from "react-icons/fa";

export default function SalePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "セール・キャンペーン" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          💰 <span className="gradient-text">セール・キャンペーン</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          FANZAのお得なセール・割引情報
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 text-center mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <FaTags size={24} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold mb-3">FANZA API連携 準備中</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed">
          現在、FANZA公式APIとの連携を準備しています。
          連携完了後、最新のセール・キャンペーン対象作品を自動取得して表示します。
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          セールの活用方法については、下記の記事で詳しく解説しています。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/articles/save-money"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
          >
            セール攻略法を読む <FaArrowRight size={12} />
          </a>
          <a
            href="https://www.dmm.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[var(--color-text-secondary)] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            FANZA公式サイトで確認 <FaArrowRight size={12} />
          </a>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
