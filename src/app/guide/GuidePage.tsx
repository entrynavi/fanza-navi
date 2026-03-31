"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedProducts from "@/components/RelatedProducts";
import Footer from "@/components/Footer";

const steps = [
  {
    num: "01",
    title: "無料会員登録",
    desc: "メールアドレスだけで簡単登録。Googleアカウントでも可能。本名の入力は不要で、すぐに利用開始できます。",
    tip: "登録で即使える割引クーポンがもらえることも！",
  },
  {
    num: "02",
    title: "支払い方法を設定",
    desc: "クレジットカード、DMMポイント、PayPay、キャリア決済など豊富な支払い方法に対応。明細には「FANZA」ではなく「DMM」と表記されるので安心。",
    tip: "DMMポイントをまとめ買いすると最大10%お得に！",
  },
  {
    num: "03",
    title: "お好みの作品を探す",
    desc: "ランキング、ジャンル検索、女優検索、キーワード検索など多彩な検索方法で作品を発見。サンプル動画で事前チェックも可能。",
    tip: "ウィッシュリストに追加しておくとセール時に通知が届く！",
  },
  {
    num: "04",
    title: "購入＆視聴",
    desc: "ストリーミングで即視聴可能。ダウンロード購入なら永久に視聴OK。スマホ・PC・タブレットなどマルチデバイス対応。",
    tip: "VR作品はスマホ+VRゴーグルで没入体験！",
  },
];

const faqs = [
  {
    q: "FANZAの利用は周囲にバレますか？",
    a: "バレません。クレジットカード明細には「DMM.com」と表記され、FANZAの名前は出ません。また、購入履歴はログインしないと見れないため安心です。",
  },
  {
    q: "無料で見れる作品はありますか？",
    a: "はい。無料サンプル動画は全作品に用意されています。また、定期的に「0円セール」や「無料配信キャンペーン」も実施されています。",
  },
  {
    q: "VR作品を見るには何が必要？",
    a: "最低限スマホがあればOK。安いVRゴーグル（1,000〜3,000円程度）を装着するだけで楽しめます。Meta Questなどの本格VR機器ならさらに高品質な体験が可能です。",
  },
  {
    q: "月額制ですか？",
    a: "FANZAは基本的に作品ごとの購入制です。月額見放題プラン（月額2,980円〜）もありますが、気に入った作品だけ購入するスタイルがおすすめ。セールを活用すれば1作品500円以下で購入できることも。",
  },
  {
    q: "セール情報はどこでチェックできる？",
    a: "当サイトのセールページで毎日更新しています。また、FANZA公式サイトのトップページや、会員登録するとメールでもお知らせが届きます。",
  },
];

const tips = [
  "🎯 セールは毎週金曜〜日曜に開催されることが多い",
  "💎 まとめ買いセットは単品購入より50%以上お得",
  "⭐ レビュー4.5以上の作品はハズレが少ない",
  "🆕 新作は発売直後にセール価格になることもある",
  "🔖 ウィッシュリスト登録で値下げ時に自動通知",
  "📱 アプリよりブラウザ版の方がセール情報が見やすい",
];

export default function GuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "初心者ガイド" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          📖 <span className="gradient-text">FANZA完全ガイド</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          登録方法からお得な買い方まで徹底解説
        </p>
      </motion.div>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          🚀 4ステップで始めよう
        </h2>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex gap-5"
            >
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-extrabold text-lg">
                {step.num}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                  {step.desc}
                </p>
                <p className="text-xs text-[var(--color-primary)] flex items-center gap-1">
                  <FaCheckCircle size={12} /> {step.tip}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity text-lg pulse-glow"
          >
            FANZAに無料登録する <FaArrowRight />
          </a>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">
            ※ 登録は1分で完了・無料です
          </p>
        </div>
      </section>

      {/* Money-saving tips */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          💰 お得に買うコツ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 text-sm"
            >
              {tip}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          ❓ よくある質問
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card group"
            >
              <summary className="p-5 cursor-pointer font-bold text-sm list-none flex items-center justify-between">
                <span>Q. {faq.q}</span>
                <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform text-lg">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                A. {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="glass-card p-8 text-center mb-12 border-[var(--color-primary)]/20">
        <h2 className="text-2xl font-extrabold mb-3">
          さっそく始めてみよう！
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-6">
          登録は無料。今ならセール開催中でお得にスタートできます。
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity text-lg pulse-glow"
        >
          🎉 FANZAに無料登録する <FaArrowRight />
        </a>
      </section>

      <RelatedProducts />
      <Footer />
    </main>
  );
}
