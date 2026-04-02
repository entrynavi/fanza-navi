"use client";

import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaVrCardboard,
  FaCoins,
  FaBookOpen,
  FaBalanceScale,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

const articles = [
  {
    href: "/guide",
    icon: "book",
    title: "FANZA完全ガイド｜登録方法から使い方まで初心者向け徹底解説",
    description:
      "FANZAを初めて使う方に向けて、会員登録の手順から作品の探し方、購入・視聴方法、お得な活用テクニックまでを4ステップで解説。よくある質問もカバー。",
    tag: "初心者向け",
    date: "2026.03.28",
    readTime: "10分",
  },
  {
    href: "/compare",
    icon: "balance",
    title: "VR vs 通常・月額見放題 vs 単品購入｜FANZAの楽しみ方を徹底比較",
    description:
      "VR作品と通常作品、月額見放題と単品購入の違いを比較表付きで解説。利用頻度やスタイルに合った最適な楽しみ方を提案。",
    tag: "比較",
    date: "2026.03.28",
    readTime: "8分",
  },
  {
    href: "/articles/fanza-payment",
    icon: "credit",
    title: "FANZA（DMM）の支払い方法を完全解説｜クレカ・PayPay・DMMポイント比較",
    description:
      "クレジットカード・PayPay・DMMポイント・キャリア決済など、全支払い方法を徹底比較。明細表記のプライバシー面も検証。",
    tag: "支払い",
    date: "2026.03.30",
    readTime: "12分",
  },
  {
    href: "/articles/vr-setup",
    icon: "vr",
    title: "FANZA VR動画の視聴方法｜スマホ・PC・Meta Quest別セットアップガイド",
    description:
      "スマホ・Meta Quest・PC・PSVR2でFANZA VRを楽しむ方法を徹底解説。機材選びからトラブル対処法まで網羅。",
    tag: "VR",
    date: "2026.03.31",
    readTime: "15分",
  },
  {
    href: "/articles/save-money",
    icon: "coins",
    title: "FANZAで損しない！セール・クーポン・ポイント活用術まとめ【2026年版】",
    description:
      "週末セール、季節セール、クーポン入手法、DMMポイント割引など、FANZAでお得に購入するテクニックを網羅。年間節約額も試算。",
    tag: "節約",
    date: "2026.04.01",
    readTime: "13分",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  book: <FaBookOpen size={24} />,
  balance: <FaBalanceScale size={24} />,
  credit: <FaCreditCard size={24} />,
  vr: <FaVrCardboard size={24} />,
  coins: <FaCoins size={24} />,
};

export default function ArticlesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "記事一覧" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          📚 <span className="gradient-text">お役立ち記事一覧</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
          FANZAをもっと便利に、もっとお得に楽しむための情報をまとめました。
          初心者ガイドから節約術まで、全{articles.length}記事を公開中です。
        </p>
      </motion.div>

      <div className="space-y-5 mb-16">
        {articles.map((article, i) => (
          <motion.a
            key={article.href}
            href={article.href}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 flex gap-5 hover:border-[var(--color-primary)]/30 transition-colors block group"
          >
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
              {iconMap[article.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold">
                  {article.tag}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1">
                  <FaClock size={10} /> {article.readTime}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {article.date}
                </span>
              </div>
              <h2 className="font-bold text-base md:text-lg mb-2 group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                {article.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-2 font-bold group-hover:gap-2 transition-all">
                続きを読む <FaArrowRight size={10} />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <section className="glass-card p-8 mb-12 border-[var(--color-primary)]/20">
        <h2 className="text-xl font-extrabold mb-4 text-center">
          このサイトについて
        </h2>
        <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-3">
          <p>
            「FANZAおすすめ作品ナビ」は、FANZA（DMM）の動画コンテンツを快適に楽しむための情報サイトです。
            初心者の方が安心して利用開始できるよう、登録方法から支払い方法、お得な購入テクニックまで網羅的に解説しています。
          </p>
          <p>
            当サイトでは、実際の利用経験に基づいた正直な情報と、ユーザー目線で本当に役立つコンテンツだけをお届けすることを心がけています。
            セール情報やキャンペーン情報は定期的に更新し、最新の状態を保つよう努めています。
          </p>
          <p>
            ※ 当サイトはDMMアフィリエイトプログラムに参加しています。リンク経由でのご購入により、
            サイト運営費用の一部を得ている場合があります。記事内容はアフィリエイト関係なく、正確な情報提供を最優先にしています。
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
