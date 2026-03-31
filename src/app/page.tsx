"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import GenreFilter from "@/components/GenreFilter";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SocialProof from "@/components/SocialProof";
import CountdownTimer from "@/components/CountdownTimer";
import ExitPopup from "@/components/ExitPopup";
import RelatedProducts from "@/components/RelatedProducts";
import { genres, sampleProducts } from "@/data/products";
import { FaArrowUp, FaArrowRight, FaBookOpen, FaBalanceScale } from "react-icons/fa";

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeGenre === "all") return sampleProducts;
    return sampleProducts.filter((p) => p.genre === activeGenre);
  }, [activeGenre]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main>
      {/* Age gate banner */}
      <div className="bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 py-2 text-center text-xs text-[var(--color-text-secondary)]">
        ⚠️ 本サイトは18歳以上の方を対象としています
      </div>

      <HeroSection />

      {/* Social proof + Countdown */}
      <div className="max-w-4xl mx-auto px-4">
        <SocialProof />
        <CountdownTimer />
      </div>

      {/* Main content */}
      <section id="ranking" className="max-w-6xl mx-auto px-4 pb-20">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold mb-2">
            🏆 <span className="gradient-text">作品ランキング</span>
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            ジャンル別に人気作品をチェック
          </p>
        </motion.div>

        {/* Genre filter */}
        <div className="mb-10">
          <GenreFilter
            genres={genres}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
          />
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGenre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[var(--color-text-secondary)]">
            <div className="text-5xl mb-4">🔍</div>
            <p>このジャンルの作品はまだありません</p>
          </div>
        )}

        {/* Load more */}
        <div className="text-center mt-12">
          <a
            href="/fanza-navi/ranking"
            className="inline-block px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity text-lg"
          >
            ランキングをもっと見る →
          </a>
        </div>

        {/* Related */}
        <RelatedProducts />
      </section>

      {/* Sale banner */}
      <section id="sale" className="max-w-5xl mx-auto px-4 pb-20">
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
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl md:text-4xl font-extrabold mb-3">
              春の大感謝セール開催中！
            </h3>
            <p className="text-lg opacity-90 mb-6">
              対象作品が最大<span className="font-extrabold text-2xl">80%OFF</span>
              ！見逃すな！
            </p>
            <a
              href="/fanza-navi/sale"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-[var(--color-primary)] bg-white hover:bg-gray-100 transition-colors text-lg"
            >
              セール会場へ →
            </a>
          </div>
        </motion.div>
      </section>

      {/* Article links for SEO */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-extrabold mb-8 text-center">
          📚 <span className="gradient-text">お役立ちコンテンツ</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.a
            href="/fanza-navi/guide"
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
                  初心者向け
                </p>
              </div>
              <FaArrowRight
                size={14}
                className="ml-auto text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors"
              />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              登録方法・使い方・お得な買い方まで完全解説
            </p>
          </motion.a>
          <motion.a
            href="/fanza-navi/compare"
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
              あなたに最適な楽しみ方を見つけよう
            </p>
          </motion.a>
        </div>
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
