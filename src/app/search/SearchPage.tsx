"use client";

import { motion } from "framer-motion";
import { FaSearch, FaArrowRight, FaDatabase } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function SearchPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-extrabold mb-6">
          🔍 <span className="gradient-text">作品検索</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 md:p-12 text-center mb-12"
      >
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
          <FaDatabase size={24} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold mb-3">FANZA API連携 準備中</h2>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed">
          現在、FANZA公式APIとの連携を準備しています。
          連携完了後、キーワード・ジャンル・女優名などでFANZAの作品をリアルタイム検索できるようになります。
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          今すぐFANZAで検索したい方は公式サイトをご利用ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.dmm.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
          >
            <FaSearch size={14} />
            FANZA公式で検索 <FaArrowRight size={12} />
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
