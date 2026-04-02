"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { FaBolt, FaArrowRight } from "react-icons/fa";

export default function NewReleasesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "新作リリース" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          ✨ <span className="gradient-text">新作リリース</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          FANZAの最新作品をいち早くチェック
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 text-center mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
          <FaBolt size={24} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold mb-3">FANZA API連携 準備中</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed">
          現在、FANZA公式APIとの連携を準備しています。
          連携完了後、最新リリース作品を自動で取得して表示します。
        </p>
        <a
          href="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
        >
          記事を読む <FaArrowRight size={12} />
        </a>
      </motion.div>

      <Footer />
    </main>
  );
}
