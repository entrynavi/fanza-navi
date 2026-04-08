"use client";

import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaArrowRight,
  FaCreditCard,
  FaMobileAlt,
  FaVrCardboard,
  FaShieldAlt,
  FaQuestionCircle,
  FaGift,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { ROUTES } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AFFILIATE_URL = "https://www.dmm.co.jp/";

const CTA_CLASS =
  "inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-all text-lg pulse-glow hover:scale-[1.02] shadow-lg shadow-[var(--color-primary)]/20";

const registrationSteps = [
  {
    num: "01",
    title: "DMM公式サイトにアクセス",
    desc: "DMM.co.jp にアクセスし、画面右上の「無料会員登録」ボタンをクリックします。スマホの場合はメニューアイコンから「会員登録」を選択してください。",
    tip: "当サイトのリンクから登録すると限定クーポンが配布されることがあります",
  },
  {
    num: "02",
    title: "メールアドレスを入力 or SNSログイン",
    desc: "メールアドレスを入力するか、Google・X（旧Twitter）アカウントでワンクリック登録が可能です。本名や住所の入力は一切不要なので、プライバシーも安心。",
    tip: "Googleアカウントなら入力ゼロで登録完了。一番早い方法です",
  },
  {
    num: "03",
    title: "メール認証 → パスワード設定",
    desc: "登録したメールアドレスに認証メールが届きます。メール内のリンクをクリックし、パスワードを設定すれば登録完了。認証メールは通常30秒以内に届きます。",
    tip: "迷惑メールフォルダに入ることがあるので、届かない場合はチェックしてみてください",
  },
  {
    num: "04",
    title: "登録完了！今すぐ作品を楽しめます",
    desc: "これで登録完了です。30万作品以上の中から好きな作品を選んで、サンプル動画の視聴や購入ができるようになります。初回限定クーポンが届いている場合は、忘れずにチェック！",
    tip: "まずは無料サンプルで気になる作品をチェックするのがおすすめ",
  },
];

const paymentMethods = [
  { method: "クレジットカード", fee: "無料", statement: "DMM.com", privacy: "★★★", rating: "⭐⭐⭐⭐⭐" },
  { method: "DMMポイント", fee: "無料", statement: "DMM.com", privacy: "★★★★★", rating: "⭐⭐⭐⭐⭐" },
  { method: "PayPay", fee: "無料", statement: "DMM決済", privacy: "★★★★", rating: "⭐⭐⭐⭐" },
  { method: "コンビニ払い", fee: "無料", statement: "DMM.com", privacy: "★★★★★", rating: "⭐⭐⭐" },
  { method: "キャリア決済", fee: "無料", statement: "DMM利用料", privacy: "★★★", rating: "⭐⭐⭐" },
  { method: "BitCash", fee: "無料", statement: "なし", privacy: "★★★★★", rating: "⭐⭐⭐⭐" },
];

const savingTips = [
  {
    icon: <FaGift className="text-pink-400" size={20} />,
    title: "初回限定クーポン",
    desc: "新規登録直後に使える割引クーポンが配布されることがあります。登録後はすぐにクーポンページをチェックしましょう。初回限定のため、使い忘れると損です。",
  },
  {
    icon: <FaGift className="text-yellow-400" size={20} />,
    title: "週末セール（金〜日曜）",
    desc: "毎週金曜〜日曜にかけて大規模セールが開催されます。人気作品が最大70%OFFになることも。急ぎでなければ週末を待つのが賢い買い方です。",
  },
  {
    icon: <FaCreditCard className="text-blue-400" size={20} />,
    title: "DMMポイントまとめ買い",
    desc: "DMMポイントを一括購入すると最大10%のボーナスポイントが付与されます。頻繁に購入する方は、ポイントをまとめ買いしてから作品を購入するのが最もお得。",
  },
  {
    icon: <FaMobileAlt className="text-green-400" size={20} />,
    title: "ウィッシュリスト活用",
    desc: "気になる作品をウィッシュリストに追加しておくと、セールや値下げ時に通知が届きます。「今すぐ見たい」作品以外はリストに入れて待つのがコツ。",
  },
];

const subscriptionComparison = [
  { label: "月額", monthly: "¥2,980〜", perItem: "作品ごと" },
  { label: "品揃え", monthly: "約10,000作品", perItem: "300,000作品以上" },
  { label: "新作", monthly: "遅れて追加", perItem: "発売日から" },
  { label: "画質", monthly: "HD", perItem: "HD〜4K" },
  { label: "VR", monthly: "△ 一部", perItem: "◎ 全対応" },
  { label: "おすすめ", monthly: "ライトユーザー", perItem: "こだわり派" },
];

const faqs = [
  {
    q: "FANZAの利用は周囲にバレますか？",
    a: "バレません。クレジットカード明細には「DMM.com」と表記され、FANZAの名前は出ません。また、購入履歴はログインしないと見れないため安心です。通知設定もOFFにできます。",
  },
  {
    q: "無料で見れる作品はありますか？",
    a: "はい。無料サンプル動画は全作品に用意されています。また、定期的に「0円セール」や「無料配信キャンペーン」も実施されています。登録するだけでサンプルは見放題です。",
  },
  {
    q: "VR作品を見るには何が必要？",
    a: "最低限スマホがあればOK。安いVRゴーグル（1,000〜3,000円程度）を装着するだけで楽しめます。Meta Quest 3などの本格VR機器ならさらに高品質な体験が可能です。",
  },
  {
    q: "月額制ですか？",
    a: "FANZAは基本的に作品ごとの購入制です。月額見放題プラン（月額2,980円〜）もありますが、気に入った作品だけ購入するスタイルがおすすめ。セールを活用すれば1作品500円以下で購入できることも。",
  },
  {
    q: "セール情報はどこでチェックできる？",
    a: "当サイトのセールページで毎日更新しています。また、FANZA公式サイトのトップページや、会員登録するとメールでもお知らせが届きます。",
  },
  {
    q: "退会はすぐできますか？",
    a: "はい、退会ページからいつでも即時退会が可能です。面倒な引き止めもありません。なお、購入済みの作品は退会後もダウンロード済みであれば視聴できます。",
  },
  {
    q: "スマホでも見れますか？",
    a: "はい、iOS・Android・PC全対応です。ブラウザからそのまま視聴できるほか、DMM専用アプリを使えばダウンロード再生も可能。通勤中やオフライン環境でも楽しめます。",
  },
  {
    q: "家族にバレませんか？",
    a: "クレジットカードの明細には「DMM.com」とだけ表記されます。FANZAの名前は一切出ません。さらに、通知設定をOFFにすれば通知も届きません。アプリも「DMM」名義なので安心です。",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const fadeInView = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function SectionHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <motion.h2
      {...fadeInView}
      className="text-2xl md:text-3xl font-extrabold mb-8 text-center"
    >
      {icon}{" "}
      <span className="gradient-text">{children}</span>
    </motion.h2>
  );
}

function CtaButton({ label = "今すぐFANZAに無料登録する" }: { label?: string }) {
  return (
    <div className="text-center">
      <a
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={CTA_CLASS}
      >
        {label} <FaArrowRight />
      </a>
      <p className="text-xs text-[var(--color-text-secondary)] mt-3">
        ※ 登録は完全無料・1分で完了 ※ PR
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "初心者ガイド" }]} />

      {/* ===== 1. HERO ===== */}
      <motion.section
        {...fadeUp}
        className="text-center mb-10"
      >
        <p className="eyebrow text-[var(--color-primary)] text-xs font-semibold tracking-widest uppercase mb-4">
          Complete Guide 2025
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
          <span className="gradient-text">FANZA完全ガイド</span>
          <br />
          <span className="text-xl md:text-2xl font-bold text-[var(--color-text-secondary)]">
            登録から購入まで徹底解説
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          FANZAは<strong className="text-white">完全無料</strong>で登録でき、
          <strong className="text-white">1分</strong>で完了します。
          登録するだけでお得なクーポンがもらえることも。
          このガイドでは登録方法から支払い方法、お得な買い方まですべて解説します。
        </p>
        <CtaButton />
      </motion.section>

      {/* ===== 2. FANZAとは？ ===== */}
      <section className="mb-10">
        <SectionHeading icon="📖">FANZAとは？</SectionHeading>
        <motion.div
          {...fadeInView}
          className="glass-card p-6 md:p-8"
        >
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
            FANZAは、DMM.comが運営する<strong className="text-white">日本最大級のアダルトコンテンツプラットフォーム</strong>です。
            動画・VR・電子書籍・ゲームなど幅広いジャンルを取り扱い、安全性・品質ともにトップクラス。
            大手企業DMMが運営しているため、決済の安全性やプライバシー保護も万全です。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { num: "300,000+", label: "配信作品数" },
              { num: "50,000+", label: "出演女優数" },
              { num: "VR / 4K", label: "最新フォーマット対応" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <p className="text-2xl md:text-3xl font-extrabold gradient-text mb-1">{stat.num}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["ストリーミング", "ダウンロード", "VR", "4K", "月額見放題", "電子書籍"].map((tag) => (
              <span key={tag} className="chip">{tag}</span>
            ))}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-6">
            <FaShieldAlt className="inline text-green-400 mr-1" size={14} />
            運営元のDMM.comは東証グロース市場に上場するDMMグループの中核企業。
            クレジットカード情報は高度な暗号化で保護され、明細には「DMM.com」とのみ表記されます。
            FANZAの名前は一切出ないので、プライバシー面も安心です。
          </p>
        </motion.div>
      </section>

      {/* ===== 3. 登録方法 ===== */}
      <section className="mb-10">
        <SectionHeading icon="🚀">登録方法（4ステップ）</SectionHeading>
        <div className="space-y-6">
          {registrationSteps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 flex gap-5"
            >
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-extrabold text-lg">
                {step.num}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {step.desc}
                </p>
                <p className="text-xs text-[var(--color-primary)] flex items-center gap-1.5">
                  <FaCheckCircle size={12} className="shrink-0" /> {step.tip}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          <CtaButton label="FANZAに無料登録する" />
        </div>
      </section>

      {/* ===== 4. 支払い方法の比較 ===== */}
      <section className="mb-10">
        <SectionHeading icon="💳">支払い方法の比較</SectionHeading>
        <motion.div {...fadeInView}>
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface)] text-left">
                  <th className="p-4 font-bold">方法</th>
                  <th className="p-4 font-bold">手数料</th>
                  <th className="p-4 font-bold">明細表記</th>
                  <th className="p-4 font-bold">匿名性</th>
                  <th className="p-4 font-bold">おすすめ度</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((pm, i) => (
                  <tr
                    key={pm.method}
                    className={`border-t border-[var(--color-border)] ${
                      i % 2 === 0 ? "bg-[var(--color-surface)]/50" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold whitespace-nowrap">
                      <FaCreditCard className="inline mr-1.5 text-[var(--color-primary)]" size={12} />
                      {pm.method}
                    </td>
                    <td className="p-4 text-green-400">{pm.fee}</td>
                    <td className="p-4 text-[var(--color-text-secondary)]">{pm.statement}</td>
                    <td className="p-4">{pm.privacy}</td>
                    <td className="p-4">{pm.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass-card mt-4 p-4 flex items-start gap-3">
            <FaShieldAlt className="text-green-400 shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-white">プライバシーについて：</strong>
              すべての支払い方法で、明細には「DMM.com」と表記されます。<strong className="text-white">FANZAの名前は出ません。</strong>
              匿名性を最も重視する方は、コンビニでDMMポイントカードを購入し、ポイント払いにするのがおすすめです。
            </p>
          </div>
        </motion.div>
      </section>

      {/* ===== 5. お得な買い方ガイド ===== */}
      <section className="mb-10">
        <SectionHeading icon="💰">お得な買い方ガイド</SectionHeading>

        <div className="space-y-4 mb-6">
          {savingTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 flex gap-4"
            >
              <div className="shrink-0 mt-0.5">{tip.icon}</div>
              <div>
                <h3 className="font-bold mb-1">{tip.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 月額見放題 vs 単品購入 */}
        <motion.div {...fadeInView}>
          <h3 className="text-xl font-bold text-center mb-6">
            📊 月額見放題 vs 単品購入
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface)] text-left">
                  <th className="p-4 font-bold" />
                  <th className="p-4 font-bold text-center">月額見放題</th>
                  <th className="p-4 font-bold text-center">単品購入</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionComparison.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-t border-[var(--color-border)] ${
                      i % 2 === 0 ? "bg-[var(--color-surface)]/50" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold">{row.label}</td>
                    <td className="p-4 text-center text-[var(--color-text-secondary)]">{row.monthly}</td>
                    <td className="p-4 text-center text-[var(--color-text-secondary)]">{row.perItem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-4 text-center leading-relaxed">
            💡 <strong className="text-white">結論：</strong>
            月に3本以上見る方は月額見放題がお得。こだわりの作品を高画質で楽しみたい方は単品購入がおすすめです。
            まずは単品購入で始めて、視聴頻度が上がったら見放題を検討するのが安全なステップです。
          </p>
        </motion.div>
      </section>

      {/* ===== 6. VR視聴ガイド ===== */}
      <section className="mb-10">
        <SectionHeading icon="🥽">VR視聴ガイド（簡易版）</SectionHeading>
        <motion.div
          {...fadeInView}
          className="glass-card p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FaMobileAlt className="text-green-400" /> お手軽コース
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                <strong className="text-white">必要なもの：</strong>スマホ + VRゴーグル（¥1,000〜3,000）
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                スマホをゴーグルにセットするだけ。FANZA専用アプリ「DMM VR動画プレイヤー」をインストールすれば、すぐにVR体験が可能です。
                コスパ重視ならこちらがおすすめ。
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FaVrCardboard className="text-purple-400" /> 本格派コース
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                <strong className="text-white">おすすめ：</strong>Meta Quest 3（¥48,400〜）
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                スタンドアロン型VRヘッドセットなら、PCやスマホ不要で高品質VR体験。
                6DoF対応で没入感が段違いです。FANZA VRを本気で楽しむなら最もおすすめ。
              </p>
            </div>
          </div>
          <div className="text-center">
            <a
              href={ROUTES.articleVrSetup}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline font-semibold"
            >
              <FaVrCardboard size={14} />
              VR視聴の詳細ガイドを見る →
            </a>
          </div>
        </motion.div>
      </section>

      {/* ===== 7. FAQ ===== */}
      <section className="mb-10">
        <SectionHeading icon="❓">よくある質問</SectionHeading>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card group"
            >
              <summary className="p-5 cursor-pointer font-bold text-sm list-none flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <FaQuestionCircle className="text-[var(--color-primary)] shrink-0" size={14} />
                  Q. {faq.q}
                </span>
                <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform text-lg shrink-0">
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

      {/* ===== 関連記事 ===== */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">📚 関連記事</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={ROUTES.articleCostSaving}
            className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
          >
            <h3 className="font-bold text-sm mb-1">
              💰 FANZAで安く買う7つの方法
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              初回クーポン、週末セール、ポイント還元など節約テクニックを徹底解説
            </p>
          </a>
          <a
            href={ROUTES.articleSaleCalendar}
            className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
          >
            <h3 className="font-bold text-sm mb-1">
              📅 年間セールカレンダー
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              毎週・毎月・季節ごとのセール傾向とベストタイミングを一覧で確認
            </p>
          </a>
        </div>
      </section>

      {/* ===== 8. Final CTA ===== */}
      <motion.section
        {...fadeInView}
        className="glass-card p-8 md:p-12 text-center mb-8 border-[var(--color-primary)]/20"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
          さあ、FANZAを始めよう
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
          まずは無料サンプルで気になる作品をチェック。
          登録は無料、1分で完了します。
          お得なクーポンが届いていることもあるので、まずは登録してみましょう。
        </p>
        <CtaButton label="今すぐ無料登録する" />
        <p className="text-xs text-[var(--color-text-secondary)] mt-6">
          <a
            href={ROUTES.articleSaveMoney}
            className="text-[var(--color-primary)] hover:underline"
          >
            もっとお得に買いたい方はこちら →
          </a>
        </p>
      </motion.section>
    </main>
  );
}
