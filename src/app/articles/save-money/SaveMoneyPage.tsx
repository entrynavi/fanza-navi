"use client";

import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaCoins,
  FaChartLine,
  FaCheckCircle,
  FaQuestionCircle,
  FaPercentage,
  FaEnvelope,
  FaMobileAlt,
  FaBirthdayCake,
  FaBookmark,
  FaCalculator,
  FaRegLightbulb,
  FaFire,
  FaClock,
  FaStar,
  FaBolt,
  FaGift,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { ROUTES } from "@/lib/site";

/* ───────────────────────── data ───────────────────────── */

const saleTypes = [
  {
    icon: <FaCalendarAlt size={18} />,
    name: "週末セール",
    timing: "毎週金曜日〜日曜日（不定期で月曜まで延長あり）",
    discount: "30%〜50% OFF",
    description:
      "FANZAで最も頻繁に開催されるセール。毎週金曜日の夕方頃から対象作品が更新され、日曜日の深夜まで開催されることが多いです。対象作品は毎回異なり、人気作品が割引されることも珍しくありません。狙い目は金曜夜の更新直後で、人気作品は早めにチェックしましょう。",
    tips: [
      "金曜夕方にFANZAトップページをチェック",
      "ウィッシュリスト登録作品がセール対象になることも",
      "セール終了直前の日曜深夜は駆け込み購入が増える",
    ],
  },
  {
    icon: <FaStar size={18} />,
    name: "月初セール",
    timing: "毎月1日〜7日頃",
    discount: "30%〜60% OFF",
    description:
      "月の初めに開催される大型セール。対象作品数が多く、ジャンルも幅広いのが特徴です。月末に発売された新作が早速セール対象になることもあります。週末セールよりも割引率が高い傾向があり、まとめ買いに最適なタイミングです。",
    tips: [
      "月末にウィッシュリストを整理しておく",
      "まとめ買いセットが特にお得",
      "DMMポイントを事前にチャージしておくとスムーズ",
    ],
  },
  {
    icon: <FaFire size={18} />,
    name: "季節セール（大型セール）",
    timing: "GW（4〜5月）/ 夏（7〜8月）/ 年末年始（12〜1月）",
    discount: "最大70%〜80% OFF",
    description:
      "年に数回開催される最大規模のセール。割引率が通常のセールを大きく上回り、対象作品数も数千〜数万本に及びます。特に年末年始の「歳末セール」とGWの「ゴールデンウィークセール」は、年間で最もお得に購入できるチャンスです。普段セール対象にならない人気作品や新作も大幅割引されることがあります。",
    tips: [
      "セール開始前からウィッシュリストに溜めておく",
      "期間中に複数回セール内容が更新されることがある",
      "DMMポイントまとめ買いと併用で驚異の割引率に",
      "セール期間は1〜2週間と長めなので焦らず吟味",
    ],
  },
  {
    icon: <FaBolt size={18} />,
    name: "メーカー別セール",
    timing: "不定期（各メーカーの周年記念、新作発売記念など）",
    discount: "40%〜70% OFF",
    description:
      "特定のメーカー（レーベル）の全作品または人気作品が一斉にセールになるイベントです。お気に入りのメーカーがある場合は、まとめ買いの絶好のチャンス。メーカーの公式サイトやFANZAのメルマガで告知されることが多いです。",
    tips: [
      "好きなメーカーの作品ページを定期的にチェック",
      "メーカーの周年記念時期を覚えておく",
      "シリーズ一括購入でさらに割引になることも",
    ],
  },
  {
    icon: <FaClock size={18} />,
    name: "ゲリラセール（タイムセール）",
    timing: "不定期（予告なし、24時間〜48時間限定）",
    discount: "50%〜80% OFF",
    description:
      "予告なしに突然始まる限定セール。開催時間が短い代わりに、割引率が非常に高いのが特徴です。対象作品は少なめですが、超人気作品が含まれることも。FANZAのメルマガ登録やアプリの通知をONにしておくと、開催を見逃しにくくなります。",
    tips: [
      "FANZAアプリの通知を必ずONに設定",
      "メルマガ登録で告知メールを受け取る",
      "見つけたら即購入（終了時間が短い）",
    ],
  },
];

const couponTypes = [
  {
    icon: <FaGift size={18} />,
    name: "初回登録クーポン",
    description:
      "DMMアカウントの新規登録時にもらえるウェルカムクーポン。割引額はキャンペーン時期によって変動しますが、数百円〜数千円分の割引が適用されることがあります。",
    howToGet: [
      "DMMアカウントの新規会員登録を完了する",
      "メールアドレス認証を済ませる",
      "自動的にクーポンが付与される（マイページで確認可能）",
    ],
    note: "初回購入時にのみ使用可能。有効期限があるため早めに使いましょう。",
  },
  {
    icon: <FaEnvelope size={18} />,
    name: "メルマガクーポン",
    description:
      "DMMのメールマガジンに登録すると、定期的に配信されるメール内にクーポンコードが記載されていることがあります。セール情報と一緒に届くことが多く、セール価格からさらに割引できるお得なクーポンです。",
    howToGet: [
      "DMMのマイページから「メール配信設定」を開く",
      "FANZA関連のメルマガ配信をONにする",
      "定期的にメールをチェック（週1〜2回程度配信）",
    ],
    note: "クーポンコードはメール本文内に記載。見逃し防止のためフィルタ設定がおすすめ。",
  },
  {
    icon: <FaMobileAlt size={18} />,
    name: "アプリ限定クーポン",
    description:
      "FANZAのスマートフォンアプリを利用すると、アプリ限定のクーポンや特典が配布されることがあります。アプリ内の通知で告知されるため、通知設定をONにしておきましょう。",
    howToGet: [
      "FANZA公式アプリをダウンロード",
      "アプリ内の「クーポン」ページを定期的に確認",
      "プッシュ通知を許可しておく",
    ],
    note: "アプリからの購入時のみ適用されるクーポンもあるため、購入はアプリ経由がおすすめ。",
  },
  {
    icon: <FaBirthdayCake size={18} />,
    name: "誕生日クーポン",
    description:
      "DMMアカウントに誕生日を登録しておくと、誕生月にお祝いのクーポンが届くことがあります。割引率が比較的高めで、年に一度の特別なクーポンです。",
    howToGet: [
      "DMMのプロフィール設定で誕生日を登録",
      "誕生月が近づくとメールまたはマイページで通知",
      "クーポンコードを購入時に入力して適用",
    ],
    note: "誕生日は後から変更できない場合があるため、正確に入力しましょう。有効期限は誕生月内が一般的です。",
  },
];

const pointTable = [
  { amount: "1,000円", rate: "0%", bonus: "0pt", effective: "1pt = 1.00円" },
  {
    amount: "3,000円",
    rate: "1%",
    bonus: "30pt",
    effective: "1pt ≈ 0.99円",
  },
  {
    amount: "5,000円",
    rate: "3%",
    bonus: "150pt",
    effective: "1pt ≈ 0.97円",
    highlight: false,
  },
  {
    amount: "10,000円",
    rate: "5%",
    bonus: "500pt",
    effective: "1pt ≈ 0.95円",
    highlight: true,
  },
  {
    amount: "30,000円",
    rate: "8%",
    bonus: "2,400pt",
    effective: "1pt ≈ 0.93円",
    highlight: false,
  },
  {
    amount: "50,000円",
    rate: "10%",
    bonus: "5,000pt",
    effective: "1pt ≈ 0.91円",
    highlight: true,
  },
];

const pointTips = [
  {
    title: "ポイント還元キャンペーンを活用",
    detail:
      "DMMでは不定期に「ポイント還元率UP」キャンペーンを実施しています。通常の還元率にさらに上乗せされるため、まとめ買い割引と合わせるとかなりお得です。キャンペーン期間中にまとめてチャージするのが最も効率的です。メルマガやDMMトップページの告知を見逃さないようにしましょう。",
  },
  {
    title: "有効期限管理のコツ",
    detail:
      "DMMポイントの有効期限は「購入ポイント」と「キャンペーンポイント」で異なります。購入ポイントは購入日から1年間有効。キャンペーンやイベントで獲得したポイントは取得から3ヶ月程度と短めです。マイページの「ポイント詳細」で期限を確認し、期限が近いポイントから優先的に使いましょう。",
  },
  {
    title: "チャージするタイミング",
    detail:
      "ポイントチャージのベストタイミングは、大型セール（GW・夏・年末年始）の直前です。セール中に使うことで、まとめ買い割引 + セール割引の二重にお得になります。逆に、セール予定がない時期に大量チャージすると、有効期限内に使い切れないリスクがあるので注意。月に使う金額の目安が決まっているなら、その金額に合った単位でチャージするのが安全です。",
  },
];

const wishlistBenefits = [
  "セール対象になった時にお知らせ通知が届く",
  "作品の値下げ・割引情報を自動追跡",
  "購入予定リストとして管理できる",
  "大型セール前にリストを見返して一括購入",
  "過去に気になった作品を忘れずにキープ",
];

const subscriptionComparison = [
  {
    plan: "月額動画見放題（ch1）",
    price: "月額 550円（税込）",
    break_even: "月1本以上",
    detail:
      "旧作・準新作を中心に対象作品が見放題。月に1本以上視聴するなら元が取れます。対象作品は定期的に入れ替わるため、見たい作品があるうちに視聴するのがポイント。",
  },
  {
    plan: "月額動画見放題（ハイクオリティ）",
    price: "月額 2,980円（税込）",
    break_even: "月3〜4本以上",
    detail:
      "高画質・人気作品も含む充実のラインナップ。新作も比較的早く追加されます。ヘビーユーザーならコスパが非常に高い。月3〜4本以上視聴するなら単品購入より確実にお得です。",
  },
  {
    plan: "VR見放題",
    price: "月額 2,800円（税込）",
    break_even: "月2〜3本以上",
    detail:
      "VR作品専門の見放題プラン。VR作品は1本あたりの単価が高い（1,000〜3,000円）ため、月に2〜3本以上視聴するなら見放題がお得。Meta Quest等のVRデバイスを持っている方に特におすすめ。",
  },
];

const annualSavings = {
  monthlySpend: 5000,
  methods: [
    {
      technique: "DMMポイントまとめ買い（10,000円/回）",
      savingRate: "5%",
      annual: 3000,
    },
    {
      technique: "週末セール活用（平均40%OFF）",
      savingRate: "約40%",
      annual: 24000,
    },
    {
      technique: "季節セール活用（年3回、平均60%OFF）",
      savingRate: "約60%",
      annual: 9000,
    },
    {
      technique: "クーポン活用（月1回、平均500円引き）",
      savingRate: "—",
      annual: 6000,
    },
  ],
};

const saleCalendar = [
  { month: "1月", event: "新春セール・正月特大セール", intensity: 5 },
  { month: "2月", event: "バレンタインセール", intensity: 3 },
  { month: "3月", event: "年度末セール・決算セール", intensity: 4 },
  { month: "4月", event: "新生活応援セール", intensity: 3 },
  { month: "5月", event: "GW大型セール", intensity: 5 },
  { month: "6月", event: "梅雨セール（週末セール中心）", intensity: 2 },
  { month: "7月", event: "夏のボーナスセール・サマーセール開始", intensity: 4 },
  { month: "8月", event: "真夏のサマーセール", intensity: 5 },
  { month: "9月", event: "秋のセール・シルバーウィークセール", intensity: 3 },
  { month: "10月", event: "ハロウィンセール", intensity: 3 },
  { month: "11月", event: "ブラックフライデーセール", intensity: 4 },
  { month: "12月", event: "歳末セール・年末超大型セール", intensity: 5 },
];

const faqs = [
  {
    q: "セールはいつ開催されますか？事前に知る方法はありますか？",
    a: "週末セールはほぼ毎週金曜〜日曜に開催されます。大型セールはGW・夏・年末年始が定番です。事前に知るには、①FANZAのメルマガ登録、②アプリの通知設定ON、③当サイトのセール情報ページをチェックするのが確実です。大型セールは開催1〜2日前に告知されることが多いです。",
  },
  {
    q: "セール価格とクーポンは併用できますか？",
    a: "クーポンの種類によりますが、セール価格にクーポンを重ねて適用できるケースがあります。ただし、「他のクーポン・割引との併用不可」と記載されているクーポンは併用できません。購入前にクーポンの利用条件を必ず確認しましょう。DMMポイント払いとセール価格の併用は常に可能です。",
  },
  {
    q: "DMMポイントの有効期限が切れそうな場合はどうすればいい？",
    a: "期限切れ間近のポイントは、何か作品を購入して消費するのが一番です。少額でもポイント消費できるレンタル作品（100pt〜）もあります。なお、新たにポイントをチャージしても既存ポイントの有効期限は延長されません。マイページの「ポイント通帳」で定期的に残高と期限を確認する習慣をつけましょう。",
  },
  {
    q: "月額見放題に入っていてもセールで作品を購入するメリットはある？",
    a: "あります。月額見放題の対象作品は定期的に入れ替わるため、お気に入りの作品がラインナップから外れる可能性があります。特に気に入った作品はセールで単品購入しておくと、いつでも視聴できる永久保有になります。見放題でお気に入りを見つけ → セールで購入、という使い方が最もコスパが良いです。",
  },
  {
    q: "セールの割引率は作品によって違いますか？",
    a: "はい、作品ごとに割引率は異なります。一般的に、発売から時間が経った作品ほど割引率が高くなる傾向があります。新作は10〜30%OFF程度、旧作は50〜80%OFFになることも。メーカー別セールでは全作品一律の割引率になることもあります。最安値で購入したい場合は、大型セール（GW・夏・年末）を待つのがおすすめです。",
  },
  {
    q: "購入した作品を返品・返金してもらえますか？",
    a: "デジタルコンテンツのため、原則として購入後の返品・返金はできません。そのため、購入前にサンプル動画とレビューを必ず確認しましょう。万が一、作品に技術的な不具合（再生不可・映像の乱れ等）がある場合は、DMMカスタマーサポートに問い合わせることで対応してもらえる場合があります。",
  },
];

/* ───────────────────────── component ───────────────────────── */
export default function SaveMoneyPage() {
  const totalAnnualSaving = annualSavings.methods.reduce(
    (sum, m) => sum + m.annual,
    0
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "記事一覧", href: "/articles" },
          { label: "セール・クーポン活用術" },
        ]}
      />

      {/* ───── Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          💰{" "}
          <span className="gradient-text">
            FANZAで損しない！セール・クーポン・ポイント活用術
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
          セールの種類と時期、クーポンの入手方法、DMMポイントのまとめ買い割引など、FANZAで賢くお得に作品を購入するためのテクニックを完全網羅。年間で数万円の節約も夢ではありません。
        </p>
        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold">
          2025年最新版
        </span>
      </motion.div>

      <article>
        {/* ───── Introduction ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">
              🔰 定価で買うのはもったいない理由
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                FANZAで作品を購入する際、定価のまま購入するのは実はかなりもったいない行為です。なぜなら、FANZAでは常時何らかのセール・キャンペーンが実施されており、賢く活用すれば定価の半額以下で購入できることが珍しくないからです。
              </p>
              <div className="glass-card p-4 text-center bg-[var(--color-primary)]/5">
                <p className="text-xs mb-2">定価1,000円の作品を例にすると…</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="font-bold text-lg line-through opacity-50">
                    1,000円
                  </span>
                  <span className="text-[var(--color-primary)]">→</span>
                  <span className="font-bold text-lg">
                    週末セール: 600円
                  </span>
                  <span className="text-[var(--color-primary)]">→</span>
                  <span className="font-bold text-lg text-yellow-400">
                    セール + ポイント割引: 約500円
                  </span>
                </div>
                <p className="text-xs mt-2 text-[var(--color-primary)]">
                  ※ テクニックを組み合わせれば実質半額以下に！
                </p>
              </div>
              <p>
                この記事では、FANZAのセール情報、クーポン入手方法、DMMポイント活用術を体系的にまとめました。知っているだけで年間数万円の差が出るテクニックばかりなので、ぜひ最後まで読んで実践してください。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── Sale Types ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            🏷️ セールの種類と開催パターン
          </h2>
          <div className="space-y-6">
            {saleTypes.map((sale, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
                    {sale.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{sale.name}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        📅 {sale.timing}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                        {sale.discount}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {sale.description}
                </p>

                <div>
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1 text-[var(--color-primary)]">
                    <FaRegLightbulb size={12} /> 攻略のコツ
                  </h4>
                  <ul className="space-y-1">
                    {sale.tips.map((tip, j) => (
                      <li
                        key={j}
                        className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                      >
                        <FaCheckCircle
                          className="text-green-400 shrink-0 mt-0.5"
                          size={10}
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── Coupons ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            🎟️ クーポンの入手方法と使い方
          </h2>
          <div className="space-y-6">
            {couponTypes.map((coupon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
                    {coupon.icon}
                  </div>
                  <h3 className="font-bold text-lg">{coupon.name}</h3>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {coupon.description}
                </p>

                <div className="mb-3">
                  <h4 className="text-xs font-bold mb-2">📝 入手手順</h4>
                  <ol className="space-y-1">
                    {coupon.howToGet.map((step, j) => (
                      <li
                        key={j}
                        className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                      >
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-[10px]">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    ⚠️ {coupon.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── DMMポイント活用法 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            💎 DMMポイント活用法
          </h2>

          {/* Point discount table */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-x-auto mb-6"
          >
            <h3 className="p-4 pb-2 font-bold">まとめ買い割引率テーブル</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-3 text-left font-bold">チャージ額</th>
                  <th className="p-3 text-left font-bold">還元率</th>
                  <th className="p-3 text-left font-bold">ボーナスpt</th>
                  <th className="p-3 text-left font-bold">実質単価</th>
                </tr>
              </thead>
              <tbody>
                {pointTable.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--color-border)]/50 ${
                      row.highlight
                        ? "bg-[var(--color-primary)]/5"
                        : "hover:bg-white/5"
                    } transition-colors`}
                  >
                    <td
                      className={`p-3 ${row.highlight ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {row.amount}
                      {row.highlight && " ⭐"}
                    </td>
                    <td
                      className={`p-3 ${row.highlight ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {row.rate}
                    </td>
                    <td
                      className={`p-3 ${row.highlight ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {row.bonus}
                    </td>
                    <td
                      className={`p-3 ${row.highlight ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {row.effective}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] text-center mb-6">
            ※ 還元率はキャンペーン時に変動する場合があります。最新情報は公式サイトでご確認ください。
          </p>

          {/* Point tips */}
          <div className="space-y-4">
            {pointTips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5"
              >
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <FaCoins className="text-[var(--color-primary)]" size={14} />
                  {tip.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {tip.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── ウィッシュリスト活用法 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📌 ウィッシュリスト活用法
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaBookmark className="text-[var(--color-primary)]" size={18} />
              <h3 className="font-bold">
                値下げ通知で最安値のタイミングを逃さない
              </h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              FANZAのウィッシュリスト（お気に入り）機能は、単なるブックマークではありません。登録した作品がセール対象になると通知が届くため、最安のタイミングを逃さず購入できる強力なツールです。気になった作品はとりあえずウィッシュリストに追加しておき、セール通知が届いたら購入する、というスタイルが最もコスパが良い買い方です。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {wishlistBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]"
                >
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={10}
                  />
                  {benefit}
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/5 rounded-lg p-3">
              <p className="text-xs text-[var(--color-text-secondary)]">
                💡{" "}
                <strong>プロのテクニック：</strong>
                大型セール前に気になる作品を一気にウィッシュリストに追加しておきましょう。セール開始時にウィッシュリストをチェックするだけで、お得な作品をすぐに見つけられます。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── 月額見放題 損益分岐点 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📊 月額見放題の損益分岐点
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            月に何本見るなら見放題プランがお得？プラン別に損益分岐点を解説します。
          </p>
          <div className="space-y-4">
            {subscriptionComparison.map((sub, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="font-bold text-base">{sub.plan}</h3>
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {sub.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FaCalculator
                    className="text-[var(--color-primary)]"
                    size={12}
                  />
                  <span className="text-xs font-bold">
                    損益分岐点：{sub.break_even}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {sub.detail}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="glass-card p-5 mt-4 border-l-4 border-[var(--color-primary)]">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-[var(--color-primary)]">
                💡 おすすめの使い分け：
              </strong>
              月に1〜2本程度なら単品購入（セール活用）、月3本以上コンスタントに視聴するなら見放題プランがお得です。見放題で気に入った作品を見つけ、それをセール時に単品購入して永久保有するのが最もコスパの良い運用方法です。
            </p>
          </div>
        </section>

        {/* ───── 年間節約試算 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            💹 年間の節約額シミュレーション
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              月額{annualSavings.monthlySpend.toLocaleString()}
              円（年間
              {(annualSavings.monthlySpend * 12).toLocaleString()}
              円）の利用を想定した場合の節約額試算：
            </p>
            <div className="space-y-3 mb-4">
              {annualSavings.methods.map((method, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FaCheckCircle
                      className="text-green-400 shrink-0"
                      size={12}
                    />
                    <span className="text-[var(--color-text-secondary)]">
                      {method.technique}
                    </span>
                  </div>
                  <span className="font-bold text-[var(--color-primary)] whitespace-nowrap">
                    年間 約{method.annual.toLocaleString()}円
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 rounded-xl p-5 text-center">
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                すべてのテクニックを組み合わせた場合の年間節約額（理論値）
              </p>
              <p className="text-3xl font-extrabold text-[var(--color-primary)]">
                最大 約{totalAnnualSaving.toLocaleString()}円
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                ※
                実際の節約額は利用頻度・購入作品・セール時期により異なります。セール割引とポイント割引は重複適用できるため、組み合わせることで大きな節約が可能です。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── セールカレンダー ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📅 セールカレンダー（月別傾向）
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-x-auto"
          >
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-3 text-left font-bold">月</th>
                  <th className="p-3 text-left font-bold">主なセール</th>
                  <th className="p-3 text-left font-bold">お得度</th>
                </tr>
              </thead>
              <tbody>
                {saleCalendar.map((month, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--color-border)]/50 transition-colors ${
                      month.intensity >= 4
                        ? "bg-[var(--color-primary)]/5"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <td className="p-3 font-bold whitespace-nowrap">
                      {month.month}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {month.event}
                    </td>
                    <td className="p-3">
                      <span className="text-yellow-400">
                        {"🔥".repeat(month.intensity)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            ※
            セールの開催時期や内容は年によって変動します。あくまで過去の傾向に基づく目安としてご参考ください。
          </p>
        </section>

        {/* ───── FAQ ───── */}
        <section className="mb-8">
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
                  <span className="flex items-center gap-2">
                    <FaQuestionCircle
                      className="text-[var(--color-primary)] shrink-0"
                      size={14}
                    />
                    {faq.q}
                  </span>
                  <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform text-lg shrink-0 ml-2">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </section>

        {/* ───── まとめ ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-[var(--color-primary)]/20"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-center">
              📝 最終まとめ：FANZAで賢く節約する5つの鉄則
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    1
                  </span>
                  <span>
                    <strong>定価では買わない。</strong>
                    FANZAでは常時セールが開催されています。急ぎでなければセールを待ちましょう。
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    2
                  </span>
                  <span>
                    <strong>ウィッシュリストを活用。</strong>
                    気になる作品はすべて登録。セール通知で最安タイミングをキャッチ。
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    3
                  </span>
                  <span>
                    <strong>DMMポイントはまとめ買い。</strong>
                    10,000円以上のチャージで5%以上の還元。セール割引と二重にお得。
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    4
                  </span>
                  <span>
                    <strong>クーポンを見逃さない。</strong>
                    メルマガ登録・アプリ通知ON・誕生日登録で入手チャンスを最大化。
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    5
                  </span>
                  <span>
                    <strong>大型セールを有効活用。</strong>
                    GW・夏・年末の大型セールは最大80%OFF。ここでまとめ買いするのが最強。
                  </span>
                </li>
              </ol>
              <p>
                これらのテクニックを組み合わせれば、年間で数万円の節約が可能です。最初は少し面倒に感じるかもしれませんが、一度習慣化すれば自然とお得に購入できるようになります。賢くFANZAを楽しみましょう。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── 関連記事リンク ───── */}
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
      </article>
    </main>
  );
}
