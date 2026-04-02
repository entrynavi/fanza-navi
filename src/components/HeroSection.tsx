"use client";

import { motion } from "framer-motion";
import { FaBookOpen, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: "📖",
    title: "充実のガイド記事",
    desc: "登録方法から支払い・VR設定まで初心者向けに徹底解説",
  },
  {
    icon: "💰",
    title: "節約テクニック",
    desc: "セール・クーポン・ポイント活用で賢くお得に楽しむ方法",
  },
  {
    icon: "🥽",
    title: "VR完全ガイド",
    desc: "デバイス別のセットアップ手順をわかりやすく紹介",
  },
  {
    icon: "⚖️",
    title: "比較＆検証",
    desc: "VR vs 通常・サブスク vs 単品などを実体験をもとに比較",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-primary)] opacity-[0.07] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[var(--color-accent)] opacity-[0.05] blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6"
        >
          <FaShieldAlt size={12} className="text-[var(--color-primary)]" />
          <span className="text-sm">FANZA公式情報をもとにした総合ガイド</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
        >
          <span className="gradient-text">FANZA</span>
          <span className="text-white">おすすめ作品ナビ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto"
        >
          FANZAの使い方・お得な活用法・VR設定ガイドなど、
          <br className="hidden sm:block" />
          役立つ情報をわかりやすくお届けするメディアサイトです。
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="/guide"
            className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)] transition-all duration-300 text-lg pulse-glow"
          >
            <FaBookOpen className="inline mr-2" />
            初心者ガイドを読む
          </a>
          <a
            href="/articles"
            className="px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-lg"
          >
            📚 すべての記事を見る
          </a>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
