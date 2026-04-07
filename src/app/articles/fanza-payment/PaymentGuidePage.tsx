"use client";

import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaPaypal,
  FaMobileAlt,
  FaStore,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCoins,
  FaQuestionCircle,
  FaArrowRight,
  FaMoneyBillWave,
  FaUserSecret,
  FaRegLightbulb,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

/* ───────────────────────── data ───────────────────────── */

const paymentMethods = [
  {
    id: "credit",
    icon: <FaCreditCard size={22} />,
    name: "クレジットカード",
    brands: "VISA / Mastercard / JCB / American Express / Diners Club",
    pros: [
      "即時決済で購入後すぐ視聴可能",
      "明細表記は「DMM.com」で安心",
      "DMMポイント還元あり（1%）",
      "定期購読・月額サービスに対応",
    ],
    cons: [
      "カード情報の入力が必要",
      "利用限度額に注意",
      "家族カードの場合は明細共有の可能性あり",
    ],
    steps: [
      "FANZAにログインし「アカウント設定」を開く",
      "「クレジットカード情報」を選択",
      "カード番号・有効期限・セキュリティコードを入力",
      "登録完了後、作品購入時に自動適用",
    ],
    privacy: 4,
    convenience: 5,
    cost: 4,
  },
  {
    id: "dmmpoint",
    icon: <FaCoins size={22} />,
    name: "DMMポイント",
    brands: "DMMポイント（1pt = 1円）",
    pros: [
      "まとめ買いで5%〜10%OFFになる",
      "クレジットカード不要のチャージ方法あり",
      "残高管理がしやすい",
      "匿名性が高い（コンビニチャージ可能）",
    ],
    cons: [
      "有効期限がある（購入から1年間）",
      "キャンペーンポイントは期限が短い（取得から3ヶ月）",
      "余ったポイントの返金不可",
    ],
    steps: [
      "DMMトップページ右上の「DMMポイント」をクリック",
      "チャージ金額を選択（1,000pt〜50,000pt）",
      "支払い方法を選択（クレカ・コンビニ・銀行振込など）",
      "チャージ完了後、FANZA作品購入時に「DMMポイント払い」を選択",
    ],
    privacy: 5,
    convenience: 4,
    cost: 5,
  },
  {
    id: "paypay",
    icon: <FaMobileAlt size={22} />,
    name: "PayPay",
    brands: "PayPay残高払い",
    pros: [
      "スマホで簡単決済",
      "PayPayポイント還元あり（0.5%〜1.5%）",
      "クレジットカード不要",
      "銀行口座やコンビニからチャージ可能",
    ],
    cons: [
      "PayPayアカウントとの連携が必要",
      "一部の月額サービスは非対応",
      "PayPay残高が不足すると決済不可",
    ],
    steps: [
      "PayPayアプリをインストールし、本人確認を完了させる",
      "PayPay残高をチャージ（銀行口座・コンビニ・ATM）",
      "FANZAの作品購入画面で「PayPay」を選択",
      "PayPayアプリが起動し、決済を承認して完了",
    ],
    privacy: 4,
    convenience: 5,
    cost: 4,
  },
  {
    id: "carrier",
    icon: <FaMobileAlt size={22} />,
    name: "キャリア決済",
    brands: "ドコモ払い / auかんたん決済 / ソフトバンクまとめて支払い",
    pros: [
      "携帯料金と一緒に支払える手軽さ",
      "クレジットカード不要",
      "月々の携帯料金に合算されるため管理が楽",
    ],
    cons: [
      "月間利用上限額がある（キャリア・年齢で異なる）",
      "明細に「DMM.com」の記載あり",
      "携帯料金を家族が確認する場合は注意",
      "手数料がかかる場合がある",
    ],
    steps: [
      "FANZAの購入画面で「キャリア決済」を選択",
      "利用するキャリア（ドコモ/au/ソフトバンク）を選ぶ",
      "各キャリアの認証画面でパスワードを入力",
      "認証完了後、即座に作品の視聴が可能",
    ],
    privacy: 2,
    convenience: 4,
    cost: 3,
  },
  {
    id: "convenience",
    icon: <FaStore size={22} />,
    name: "コンビニ払い",
    brands:
      "ローソン / ファミリーマート / ミニストップ / セイコーマート / デイリーヤマザキ",
    pros: [
      "現金で支払える",
      "クレジットカード・銀行口座不要",
      "個人情報の入力が最小限",
    ],
    cons: [
      "支払いまでタイムラグがある（入金確認後に利用可能）",
      "手数料がかかる場合がある（100〜300円程度）",
      "コンビニに行く手間がある",
      "一部作品・サービスは対象外",
    ],
    steps: [
      "DMMポイントのチャージ画面で「コンビニ払い」を選択",
      "チャージ金額を選び、支払い番号を発行",
      "指定のコンビニのレジまたは端末で番号を入力し支払い",
      "入金確認後（通常数分〜30分）ポイントが反映",
    ],
    privacy: 5,
    convenience: 2,
    cost: 3,
  },
  {
    id: "prepaid",
    icon: <FaMoneyBillWave size={22} />,
    name: "BitCash / WebMoney",
    brands: "BitCash / WebMoney（プリペイド型電子マネー）",
    pros: [
      "完全匿名で利用可能",
      "コンビニで現金購入できる",
      "クレジットカード・銀行口座一切不要",
      "個人情報の紐づけなし",
    ],
    cons: [
      "購入時に手数料が上乗せされることがある",
      "おつりが出ない（端数は残高として残る）",
      "大量購入には不向き",
      "取扱店舗が限られる場合がある",
    ],
    steps: [
      "コンビニや家電量販店でBitCash/WebMoneyカードを購入",
      "カード裏面のスクラッチを削り、ひらがなID（BitCash）またはプリペイド番号（WebMoney）を確認",
      "DMMポイントのチャージ画面で該当する支払い方法を選択",
      "ID/番号を入力してチャージ完了",
    ],
    privacy: 5,
    convenience: 2,
    cost: 2,
  },
];

const comparisonData = [
  {
    method: "クレジットカード",
    fee: "無料",
    speed: "即時",
    limit: "カード限度額",
    privacy: "★★★★☆",
    recommend: "最もスタンダード",
  },
  {
    method: "DMMポイント",
    fee: "無料（まとめ買いで割引）",
    speed: "即時",
    limit: "50,000pt/回",
    privacy: "★★★★★",
    recommend: "コスパ最強",
  },
  {
    method: "PayPay",
    fee: "無料",
    speed: "即時",
    limit: "PayPay残高上限",
    privacy: "★★★★☆",
    recommend: "スマホ派に最適",
  },
  {
    method: "キャリア決済",
    fee: "無料〜数%",
    speed: "即時",
    limit: "月1万〜10万円",
    privacy: "★★☆☆☆",
    recommend: "手軽さ重視",
  },
  {
    method: "コンビニ払い",
    fee: "100〜300円",
    speed: "数分〜30分",
    limit: "300,000円/回",
    privacy: "★★★★★",
    recommend: "現金派向け",
  },
  {
    method: "BitCash/WebMoney",
    fee: "無料",
    speed: "即時",
    limit: "カード額面",
    privacy: "★★★★★",
    recommend: "完全匿名派",
  },
];

const privacyRanking = [
  {
    rank: 1,
    method: "BitCash / WebMoney",
    reason:
      "コンビニで現金購入 → ひらがなID入力でチャージ。個人情報の紐づけが一切なく、最も匿名性が高い。購入履歴を見られても、支払い元の特定は不可能。",
  },
  {
    rank: 2,
    method: "DMMポイント（コンビニチャージ）",
    reason:
      "コンビニ端末で支払い番号を入力して現金チャージ。クレカ情報も銀行口座も不要で、支払い記録が他のサービスに残らない。",
  },
  {
    rank: 3,
    method: "PayPay（銀行チャージ）",
    reason:
      "PayPay残高からの支払い。銀行口座の明細には「PayPay」としか表示されず、DMMの利用は分からない。ただしPayPayアプリ内の履歴は残る。",
  },
  {
    rank: 4,
    method: "クレジットカード",
    reason:
      "明細には「DMM.com」と表記されFANZAの名前は出ない。ただし家族カードや明細共有がある場合はDMM利用が分かってしまう点に注意。",
  },
  {
    rank: 5,
    method: "キャリア決済",
    reason:
      "携帯料金の明細に「DMM.com」が記載される。家族割や請求書共有をしている場合は利用がバレやすいため注意。",
  },
];

const situationRecommendations = [
  {
    icon: <FaRegLightbulb size={20} />,
    situation: "初心者・まず試したい方",
    recommendation: "クレジットカード",
    detail:
      "設定が最も簡単で、購入から視聴までシームレス。DMMポイント還元もあり、最初の支払い方法として最適です。まずはクレカで登録して使い勝手を確認し、慣れてきたらDMMポイントのまとめ買いに切り替えるのがおすすめの流れです。",
  },
  {
    icon: <FaUserSecret size={20} />,
    situation: "匿名性・プライバシー重視の方",
    recommendation: "BitCash / WebMoney → DMMポイントチャージ",
    detail:
      "コンビニでプリペイドカードを現金購入し、DMMポイントにチャージする方法が最も安全。クレジットカードや銀行口座の情報を一切使わないため、支払い記録が完全に残りません。同居家族がいる方にもおすすめ。",
  },
  {
    icon: <FaCoins size={20} />,
    situation: "コスパ重視・ヘビーユーザー",
    recommendation: "DMMポイント（まとめ買い）",
    detail:
      "月に複数作品を購入するなら、DMMポイントのまとめ買いが最もお得。10,000pt購入で5%還元、50,000pt購入なら10%還元。さらにセール時期に合わせてポイントを使えば、実質40%OFF以上での購入も可能になります。",
  },
  {
    icon: <FaMobileAlt size={20} />,
    situation: "スマホ中心・キャッシュレス派",
    recommendation: "PayPay",
    detail:
      "スマホ決済に慣れている方にはPayPayが最もスムーズ。銀行口座から自動チャージを設定しておけば、残高不足の心配もなし。PayPayポイントの還元もあり、他のお買い物にも使えるので無駄がありません。",
  },
];

const faqs = [
  {
    q: "クレジットカードの明細に「FANZA」と表示されますか？",
    a: "いいえ、表示されません。クレジットカードの明細には「DMM.com」と表記されます。FANZAという文字は一切出ないため、明細を見ただけでは成人向けコンテンツの購入かどうか判別できません。DMMは動画配信だけでなく、英会話・ゲーム・FXなど幅広いサービスを展開しているため、「DMM.com」という表記は全く不自然ではありません。",
  },
  {
    q: "DMMポイントのまとめ買い割引はどのくらいお得ですか？",
    a: "購入金額に応じて段階的に還元率が上がります。具体的には、5,000pt購入で3%還元（実質150pt獲得）、10,000pt購入で5%還元（実質500pt獲得）、30,000pt購入で8%還元（実質2,400pt獲得）、50,000pt購入で10%還元（実質5,000pt獲得）となります。年間で数万円分購入する方なら、まとめ買いだけで数千円の節約が可能です。",
  },
  {
    q: "コンビニ払いの手数料はいくらですか？",
    a: "DMMポイントへのチャージの場合、コンビニによって異なりますが、100円〜300円程度の手数料がかかる場合があります。手数料無料のキャンペーンが実施されることもあるので、公式サイトで最新情報を確認してください。まとめて大きな金額をチャージすれば、手数料の割合を抑えられます。",
  },
  {
    q: "支払い方法は後から変更できますか？",
    a: "はい、いつでも変更可能です。作品購入時に支払い方法を選択する画面があるため、購入ごとに異なる支払い方法を使うことも可能です。月額サービスに加入している場合は、アカウント設定から支払い方法を変更できます。ただし、変更が反映されるのは次回の請求からとなります。",
  },
  {
    q: "デビットカードやプリペイドカード（Kyash、バンドルカードなど）は使えますか？",
    a: "VISA/Mastercard/JCBブランドのデビットカードやプリペイドカードは基本的に利用可能です。Kyash、バンドルカード、LINE Payカードなどで利用実績があります。ただし、一部のカード発行会社によっては利用制限がかかっている場合もあるため、実際に登録して確認するのが確実です。なお、月額サービスではデビットカードが利用できない場合があります。",
  },
  {
    q: "海外発行のクレジットカードは使えますか？",
    a: "VISA、Mastercard、JCB、American Express、Diners Clubの各ブランドに対応しているため、これらのブランドであれば海外発行のカードでも基本的に利用可能です。ただし、一部の海外カードではセキュリティの都合上、決済がブロックされることがあります。その場合は、DMMポイントのPayPal経由チャージを検討してください。",
  },
];

/* ───────────────────────── stars helper ───────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-400">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

/* ───────────────────────── component ───────────────────────── */
export default function PaymentGuidePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "記事一覧", href: "/articles" },
          { label: "支払い方法ガイド" },
        ]}
      />

      {/* ───── Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          💳{" "}
          <span className="gradient-text">
            FANZA（DMM）の支払い方法を完全解説
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
          クレジットカード・PayPay・DMMポイント・キャリア決済など、FANZAで使える全支払い方法を徹底比較。プライバシーが気になる方のための「バレない支払い方法」も詳しく解説します。
        </p>
      </motion.div>

      {/* ───── Introduction ───── */}
      <article>
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold mb-4">
              🔰 支払い方法選びが重要な理由
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                FANZAを利用する際、作品選びと同じくらい大切なのが「支払い方法」の選択です。なぜなら、支払い方法によって以下の3つの重要な要素が大きく変わるからです。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="glass-card p-4 text-center">
                  <FaShieldAlt
                    className="mx-auto mb-2 text-[var(--color-primary)]"
                    size={24}
                  />
                  <h3 className="font-bold mb-1">プライバシー</h3>
                  <p className="text-xs">
                    明細への表記内容や、支払い記録の残り方が方法によって大きく異なります
                  </p>
                </div>
                <div className="glass-card p-4 text-center">
                  <FaCoins
                    className="mx-auto mb-2 text-[var(--color-primary)]"
                    size={24}
                  />
                  <h3 className="font-bold mb-1">コスパ</h3>
                  <p className="text-xs">
                    まとめ買い割引やポイント還元率が支払い方法で変わります。年間で数千円の差が出ることも
                  </p>
                </div>
                <div className="glass-card p-4 text-center">
                  <FaMobileAlt
                    className="mx-auto mb-2 text-[var(--color-primary)]"
                    size={24}
                  />
                  <h3 className="font-bold mb-1">利便性</h3>
                  <p className="text-xs">
                    即時決済できるものから、事前チャージが必要なものまで。ライフスタイルに合った方法を選びましょう
                  </p>
                </div>
              </div>
              <p>
                この記事では、FANZAで利用できる6つの支払い方法すべてについて、登録手順・メリット・デメリット・プライバシー面を詳しく比較解説します。記事の後半では「バレない支払い方法ランキング」や「状況別おすすめ」もまとめていますので、最後まで読んで自分に最適な方法を見つけてください。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── Payment Methods Detail ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            📋 支払い方法 全6種を徹底解説
          </h2>

          <div className="space-y-8">
            {paymentMethods.map((pm, i) => (
              <motion.div
                key={pm.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white">
                    {pm.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{pm.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {pm.brands}
                    </p>
                  </div>
                </div>

                {/* Rating bars */}
                <div className="grid grid-cols-3 gap-4 mb-5 text-center">
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                      匿名性
                    </p>
                    <Stars count={pm.privacy} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                      利便性
                    </p>
                    <Stars count={pm.convenience} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                      コスパ
                    </p>
                    <Stars count={pm.cost} />
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-1 text-green-400">
                      <FaCheckCircle size={14} /> メリット
                    </h4>
                    <ul className="space-y-1">
                      {pm.pros.map((pro, j) => (
                        <li
                          key={j}
                          className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                        >
                          <span className="text-green-400 mt-0.5">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-1 text-orange-400">
                      <FaExclamationTriangle size={14} /> デメリット・注意点
                    </h4>
                    <ul className="space-y-1">
                      {pm.cons.map((con, j) => (
                        <li
                          key={j}
                          className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                        >
                          <span className="text-orange-400 mt-0.5">△</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="text-sm font-bold mb-3">📝 設定・利用手順</h4>
                  <ol className="space-y-2">
                    {pm.steps.map((step, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-xs text-[var(--color-text-secondary)]"
                      >
                        <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center font-bold text-[11px]">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── Comparison Table ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📊 支払い方法 比較表
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
                  <th className="p-3 text-left font-bold">支払い方法</th>
                  <th className="p-3 text-left font-bold">手数料</th>
                  <th className="p-3 text-left font-bold">反映速度</th>
                  <th className="p-3 text-left font-bold">上限額</th>
                  <th className="p-3 text-left font-bold">匿名性</th>
                  <th className="p-3 text-left font-bold">おすすめポイント</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-border)]/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 font-bold whitespace-nowrap">
                      {row.method}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {row.fee}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {row.speed}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {row.limit}
                    </td>
                    <td className="p-3">{row.privacy}</td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {row.recommend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            ※ 手数料・上限額は変更される場合があります。最新情報は公式サイトをご確認ください。
          </p>
        </section>

        {/* ───── Privacy Ranking ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔒「バレない」支払い方法ランキング
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            プライバシーを重視する方のために、匿名性の高い順にランキング化しました。
          </p>
          <div className="space-y-4">
            {privacyRanking.map((item, i) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 flex gap-4"
              >
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white ${
                    item.rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : item.rank === 2
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : item.rank === 3
                          ? "bg-gradient-to-br from-amber-600 to-amber-800"
                          : "bg-[var(--color-primary)]/30"
                  }`}
                >
                  {item.rank}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{item.method}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="glass-card p-5 mt-6 border-l-4 border-[var(--color-primary)]">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-[var(--color-primary)]">
                💡 ポイント：
              </strong>
              どの支払い方法でも、クレジットカード明細やキャリア請求書には「FANZA」という名前は表示されません。表記はすべて「DMM.com」です。DMMは英会話、ゲーム、FX、通販など多様なサービスを展開しているため、「DMM.com」という記載だけで利用内容を推測されることはまずありません。さらに匿名性を高めたい場合は、プリペイド型の支払い方法を選びましょう。
            </p>
          </div>
        </section>

        {/* ───── Situation-based Recommendation ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎯 状況別おすすめ支払い方法
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {situationRecommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 mb-2 text-[var(--color-primary)]">
                  {rec.icon}
                  <h3 className="font-bold text-sm">{rec.situation}</h3>
                </div>
                <p className="text-base font-extrabold mb-2">
                  👉 {rec.recommendation}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {rec.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── DMMポイントまとめ買い詳細 ───── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            💎 DMMポイントまとめ買い割引テーブル
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-3 text-left font-bold">購入額</th>
                  <th className="p-3 text-left font-bold">還元率</th>
                  <th className="p-3 text-left font-bold">還元ポイント</th>
                  <th className="p-3 text-left font-bold">実質単価</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="p-3">1,000円</td>
                  <td className="p-3">0%</td>
                  <td className="p-3">0pt</td>
                  <td className="p-3">1pt = 1円</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="p-3">3,000円</td>
                  <td className="p-3">1%</td>
                  <td className="p-3">30pt</td>
                  <td className="p-3">1pt ≈ 0.99円</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="p-3">5,000円</td>
                  <td className="p-3">3%</td>
                  <td className="p-3">150pt</td>
                  <td className="p-3">1pt ≈ 0.97円</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="p-3 font-bold text-[var(--color-primary)]">
                    10,000円
                  </td>
                  <td className="p-3 font-bold text-[var(--color-primary)]">
                    5%
                  </td>
                  <td className="p-3 font-bold text-[var(--color-primary)]">
                    500pt
                  </td>
                  <td className="p-3 font-bold text-[var(--color-primary)]">
                    1pt ≈ 0.95円
                  </td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="p-3">30,000円</td>
                  <td className="p-3">8%</td>
                  <td className="p-3">2,400pt</td>
                  <td className="p-3">1pt ≈ 0.93円</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-yellow-400">50,000円</td>
                  <td className="p-3 font-bold text-yellow-400">10%</td>
                  <td className="p-3 font-bold text-yellow-400">5,000pt</td>
                  <td className="p-3 font-bold text-yellow-400">
                    1pt ≈ 0.91円
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            ※ 還元率はキャンペーン時に変動する場合があります。購入前に公式サイトで最新の還元率をご確認ください。
          </p>
        </section>

        {/* ───── FAQ ───── */}
        <section className="mb-12">
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
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-[var(--color-primary)]/20"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-center">
              📝 最終まとめ
            </h2>
            <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                FANZAでは6種類の豊富な支払い方法が用意されており、それぞれに明確なメリットとデメリットがあります。ここで改めてポイントを整理しましょう。
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>手軽さ重視</strong>
                    なら、クレジットカードが最も簡単。明細表記も「DMM.com」なので安心です。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>コスパ重視</strong>
                    なら、DMMポイントのまとめ買いが最強。10%還元を活用すれば年間で大きな節約になります。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>匿名性重視</strong>
                    なら、BitCash/WebMoneyでのDMMポイントチャージが最も安全。個人情報が一切紐づきません。
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle
                    className="text-green-400 shrink-0 mt-0.5"
                    size={14}
                  />
                  <span>
                    <strong>スマホ派</strong>
                    なら、PayPayがスムーズ。ポイント還元もあり、日常使いのアプリで完結します。
                  </span>
                </li>
              </ul>
              <p>
                どの方法を選んでも「FANZA」という名前が外部に出ることはありませんので、安心して利用してください。自分のライフスタイルや重視するポイントに合わせて、最適な支払い方法を選びましょう。
              </p>
              <p>
                まだDMMアカウントをお持ちでない方は、まずは無料会員登録から始めてみてください。登録後にセール情報やクーポンが届くので、初回からお得に作品を購入できます。
              </p>
            </div>
          </motion.div>
        </section>

        {/* ───── 関連記事リンク ───── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 text-center">📚 関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/articles/save-money"
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">
                💰 セール・クーポン活用術
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                DMMポイントをさらにお得に使うためのセール攻略法を紹介
              </p>
            </a>
            <a
              href="/articles/vr-setup"
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">
                🥽 VR視聴ガイド
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                スマホ・Meta Quest・PCでFANZA VRを楽しむ方法を解説
              </p>
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
