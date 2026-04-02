"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ExitPopup from "@/components/ExitPopup";
import { FaArrowUp, FaArrowRight, FaBookOpen, FaBalanceScale, FaCreditCard, FaVrCardboard, FaCoins, FaRocket, FaDatabase } from "react-icons/fa";

export default function HomePage() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main>
      {/* Age gate banner */}
      <div className="bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 py-2 text-center text-xs text-[var(--color-text-secondary)]">
        ⚠️ 本サイトは18歳以上の方を対象としています
      </div>

      <HeroSection />

      {/* Article links for SEO — prominent section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-extrabold mb-3 text-center">
          📚 <span className="gradient-text">お役立ちコンテンツ</span>
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-8 text-sm">
          FANZAを快適に使いこなすためのガイド記事を公開中
        </p>

        {/* Featured articles — 2 column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.a
            href="/guide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FaBookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold group-hover:text-[var(--color-primary-light)] transition-colors">
                  FANZA完全ガイド
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  初心者向け・読了10分
                </p>
              </div>
              <FaArrowRight
                size={14}
                className="ml-auto text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors"
              />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              登録方法・使い方・お得な買い方まで完全解説。これ1本でFANZAの全体像がわかります。
            </p>
          </motion.a>
          <motion.a
            href="/compare"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <FaBalanceScale size={20} />
              </div>
              <div>
                <h3 className="font-bold group-hover:text-[var(--color-primary-light)] transition-colors">
                  徹底比較
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  VR vs 通常・サブスク vs 単品
                </p>
              </div>
              <FaArrowRight
                size={14}
                className="ml-auto text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors"
              />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              あなたに最適な楽しみ方を見つけよう。料金・画質・対応デバイスまで徹底比較。
            </p>
          </motion.a>
        </div>

        {/* Additional articles — 3 column */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.a
            href="/articles/fanza-payment"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="glass-card p-5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 mb-3">
              <FaCreditCard size={16} />
            </div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--color-primary-light)] transition-colors">
              支払い方法ガイド
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
              クレカ・PayPay・ポイントを徹底比較。バレない方法も紹介
            </p>
          </motion.a>
          <motion.a
            href="/articles/vr-setup"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
              <FaVrCardboard size={16} />
            </div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--color-primary-light)] transition-colors">
              VRセットアップ
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
              スマホ・Meta Quest・PCデバイス別の設定手順
            </p>
          </motion.a>
          <motion.a
            href="/articles/save-money"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
              <FaCoins size={16} />
            </div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-[var(--color-primary-light)] transition-colors">
              セール攻略法
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
              クーポン・ポイント・セール活用で年間数万円節約
            </p>
          </motion.a>
        </div>

        <div className="text-center">
          <a
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] font-bold hover:underline"
          >
            すべての記事を見る ({5}本) <FaArrowRight size={12} />
          </a>
        </div>
      </section>

      {/* Site features section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-8 md:p-12"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl md:text-4xl font-extrabold mb-3">
              今後の機能追加予定
            </h3>
            <p className="text-lg opacity-90 mb-6">
              FANZA公式APIとの連携により、ランキング・新作・セール情報を自動取得予定
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/ranking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-[var(--color-primary)] bg-white hover:bg-gray-100 transition-colors"
              >
                <FaRocket size={14} />
                ランキング（準備中）
              </a>
              <a
                href="/sale"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-white/20 hover:bg-white/30 transition-colors"
              >
                <FaDatabase size={14} />
                セール情報（準備中）
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About this site */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-extrabold mb-4 text-center">
            このサイトについて
          </h2>
          <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3">
            <p>
              「FANZAおすすめ作品ナビ」は、FANZA（DMM）をもっと便利に、もっとお得に使いたい方のための情報メディアです。
            </p>
            <p>
              実際にFANZAを利用している筆者が、登録方法から支払いの選び方、VRの始め方、セール攻略法まで、
              経験をもとにわかりやすくまとめています。
            </p>
            <p>
              今後はFANZA公式APIを活用して、人気ランキングや新作情報、セール速報なども
              リアルタイムでお届けしていく予定です。ぜひブックマークしてお待ちください。
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Conversion components */}
      <StickyCTA />
      <ExitPopup />

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-16 right-6 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-light)] transition-colors z-40"
        aria-label="ページトップへ"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}
