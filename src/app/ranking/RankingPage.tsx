"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { FaDatabase, FaArrowRight } from "react-icons/fa";

export default function RankingPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "人気ランキング" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          🏆 <span className="gradient-text">人気ランキング</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          FANZA公式データを元にした人気作品ランキング
        </p>
      </motion.div>

      {/* Coming soon notice */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 text-center mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6">
          <FaDatabase size={24} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="text-xl font-bold mb-3">FANZA API連携 準備中</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed">
          現在、FANZA公式APIとの連携を準備しています。
          連携完了後、売上・評価データを元にした人気作品ランキングをリアルタイムで表示します。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/guide"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
          >
            初心者ガイドを読む <FaArrowRight size={12} />
          </a>
          <a
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[var(--color-text-secondary)] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            記事を読む <FaArrowRight size={12} />
          </a>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
