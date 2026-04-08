"use client";

import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaFire,
  FaStar,
  FaBolt,
  FaClock,
  FaGift,
  FaCheckCircle,
  FaRegLightbulb,
  FaBookmark,
  FaCoins,
  FaEnvelope,
  FaBell,
  FaQuestionCircle,
  FaPercentage,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import { ROUTES } from "@/lib/site";

/* ───────────────────────── data ───────────────────────── */

const saleTypes = [
  {
    icon: <FaCalendarAlt size={18} />,
    name: "毎週のセール（週末セール）",
    timing: "毎週金曜18:00〜日曜23:59",
    discount: "30〜50%OFF",
    description:
      "FANZAで最も頻繁に開催される定番セール。毎週金曜日の夕方から対象作品が更新され、日曜の深夜まで続きます。対象は週替わりで異なるジャンル・メーカーから選ばれ、人気作品が大幅割引になることも珍しくありません。まずはこのセールをチェックする習慣をつけるのが節約の第一歩です。",
    tips: [
      "金曜夕方にFANZAトップページをチェックするのがベスト",
      "ウィッシュリスト登録作品がセール対象になることも",
      "月曜まで延長されるケースもあるので見逃したら月曜もチェック",
    ],
  },
  {
    icon: <FaStar size={18} />,
    name: "月初セール（月替わりセール）",
    timing: "毎月1日〜7日頃",
    discount: "最大70%OFF",
    description:
      "月の初めに開催される中〜大規模セール。前月の人気作品が中心にラインナップされ、週末セールより割引率が高い傾向があります。対象作品数も多く、ジャンルも幅広いためまとめ買いに最適なタイミングです。月末にウィッシュリストを整理しておくとスムーズに狙えます。",
    tips: [
      "月末にウィッシュリストを整理しておくと狙い目が明確に",
      "まとめ買いセットが特にお得になることが多い",
      "DMMポイントを事前にチャージしておくとセール開始直後に即購入可能",
    ],
  },
  {
    icon: <FaFire size={18} />,
    name: "大型セール（年数回）",
    timing: "GW / 夏 / 秋 / 年末年始 / バレンタイン",
    discount: "最大80%OFF",
    description:
      "年に数回開催される最大規模のセール。割引率が通常セールを大きく上回り、対象作品数も数千〜数万本に及びます。特に年末年始の「歳末セール」とGWの「ゴールデンウィークセール」は年間最大級のお得チャンスです。普段セール対象にならない人気作品や新作も大幅割引されることがあります。",
    tips: [
      "セール開始前からウィッシュリストに溜めておくのが鉄則",
      "期間中に複数回セール内容が更新されることがある",
      "DMMポイントまとめ買いと併用で驚異の割引率に",
      "セール期間は1〜2週間と長めなので焦らず吟味できる",
    ],
    subEvents: [
      { name: "GW大セール", period: "4月末〜5月上旬", max: "最大80%OFF" },
      { name: "夏の大セール", period: "7月中旬〜8月上旬", max: "最大70%OFF" },
      { name: "秋の収穫祭", period: "10月頃", max: "最大60%OFF" },
      {
        name: "年末年始大セール",
        period: "12月中旬〜1月上旬",
        max: "年間最大級",
      },
      {
        name: "バレンタインセール",
        period: "2月中旬",
        max: "最大50%OFF",
      },
    ],
  },
  {
    icon: <FaBolt size={18} />,
    name: "不定期セール",
    timing: "随時（予告なし〜数日前告知）",
    discount: "40〜70%OFF",
    description:
      "新作発売記念セール、メーカー周年セール、ポイント還元キャンペーン（最大30%還元）など、タイミングが読みにくい不定期開催のセールです。ゲリラ的に始まることもあり、割引率が非常に高い場合があります。メルマガやアプリ通知をONにしておくことで見逃しを防げます。",
    tips: [
      "FANZAアプリの通知を必ずONに設定",
      "メルマガ登録でセール告知メールを受け取る",
      "お気に入りメーカーの周年時期を覚えておくと有利",
      "ポイント還元キャンペーンはまとめ買いのチャンス",
    ],
  },
];

const calendarData = [
  {
    month: "1月",
    event: "新春セール・正月特大セール",
    scale: "★★★★★",
    recommend: "最大級",
    highlight: true,
  },
  {
    month: "2月",
    event: "バレンタインセール",
    scale: "★★★",
    recommend: "中規模",
    highlight: false,
  },
  {
    month: "3月",
    event: "年度末セール・決算セール",
    scale: "★★★★",
    recommend: "大規模",
    highlight: true,
  },
  {
    month: "4月",
    event: "新生活応援セール",
    scale: "★★★",
    recommend: "中規模",
    highlight: false,
  },
  {
    month: "5月",
    event: "GW大型セール",
    scale: "★★★★★",
    recommend: "最大級",
    highlight: true,
  },
  {
    month: "6月",
    event: "梅雨セール（週末セール中心）",
    scale: "★★",
    recommend: "小規模",
    highlight: false,
  },
  {
    month: "7月",
    event: "夏のボーナスセール・サマーセール開始",
    scale: "★★★★",
    recommend: "大規模",
    highlight: true,
  },
  {
    month: "8月",
    event: "真夏のサマーセール",
    scale: "★★★★★",
    recommend: "最大級",
    highlight: true,
  },
  {
    month: "9月",
    event: "秋のセール・シルバーウィークセール",
    scale: "★★★",
    recommend: "中規模",
    highlight: false,
  },
  {
    month: "10月",
    event: "ハロウィンセール・秋の収穫祭",
    scale: "★★★",
    recommend: "中規模",
    highlight: false,
  },
  {
    month: "11月",
    event: "ブラックフライデーセール",
    scale: "★★★★",
    recommend: "大規模",
    highlight: true,
  },
  {
    month: "12月",
    event: "歳末セール・年末超大型セール",
    scale: "★★★★★",
    recommend: "最大級",
    highlight: true,
  },
];

const tips = [
  {
    icon: <FaBookmark size={14} />,
    title: "当サイトのセールページをブックマーク",
    detail:
      "当サイトのセール情報ページをブックマークしておけば、最新のセール対象作品をいつでもすぐに確認できます。大型セール時には特集ページも更新されるので定期的にチェックしましょう。",
  },
  {
    icon: <FaCoins size={14} />,
    title: "DMMポイントを事前チャージ",
    detail:
      "セール開始時にすぐ購入できるよう、DMMポイントを事前にチャージしておきましょう。まとめ買い割引（10,000円以上で5%還元）も適用されるため、セール割引との二重でお得になります。",
  },
  {
    icon: <FaHeart size={14} />,
    title: "ウィッシュリストを活用",
    detail:
      "気になった作品はすべてウィッシュリストに追加。セール対象になった時に通知が届くため、最安のタイミングを逃さず購入できます。大型セール前にまとめてリストを見返すのがおすすめです。",
  },
  {
    icon: <FaClock size={14} />,
    title: "週末のチェックを習慣に",
    detail:
      "毎週金曜の夕方にFANZAをチェックする習慣をつけましょう。週末セールは最も頻繁に開催されるセールで、これだけでも年間でかなりの節約になります。スマホのリマインダー設定もおすすめ。",
  },
  {
    icon: <FaEnvelope size={14} />,
    title: "メルマガ登録でセール情報を自動受信",
    detail:
      "FANZAのメールマガジンに登録しておけば、大型セールの開催告知やクーポン情報がメールで届きます。ゲリラセールやタイムセールの情報もいち早くキャッチできるため、登録必須です。",
  },
];

const faqs = [
  {
    q: "FANZAのセールは毎週やっていますか？",
    a: "はい。FANZAでは毎週金曜18:00〜日曜23:59に週末セールが開催されます。対象作品は毎回変わるため、毎週チェックすることをおすすめします。加えて月初セールや不定期セールもあるため、何かしらのセールがほぼ常に実施されている状態です。",
  },
  {
    q: "年間で一番お得なセールはいつですか？",
    a: "年末年始（12月中旬〜1月上旬）の「歳末セール」が年間最大級です。次いでGW大型セール（4月末〜5月上旬）、真夏のサマーセール（8月）が大規模です。この3つの時期は割引率も最大80%OFFに達することがあり、まとめ買いに最適なタイミングです。",
  },
  {
    q: "セールの事前告知はありますか？",
    a: "大型セールは開催1〜2日前に告知されることが多いです。週末セールは毎週定期的に開催されるため特別な告知はありません。メルマガ登録やアプリ通知ONにしておくと、告知を見逃しにくくなります。当サイトのセールページでも最新情報を更新しています。",
  },
  {
    q: "セール価格とポイント・クーポンは併用できますか？",
    a: "DMMポイント払いとセール価格の併用は常に可能です。クーポンについては種類により異なり、「他の割引と併用不可」と記載されているものは使えません。ポイントまとめ買い割引 + セール割引の組み合わせが最も確実にお得な方法です。",
  },
];

/* ───────────────────────── component ───────────────────────── */
export default function SaleCalendarPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "記事一覧", href: "/articles" },
          { label: "セールカレンダー" },
        ]}
      />

      {/* ───── Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          📅{" "}
          <span className="gradient-text">
            FANZAセールはいつ？年間セールカレンダー【2026年版】
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
          FANZAのセールパターンを分析して、最もお得に買えるタイミングをまとめました。毎週・毎月・季節ごとのセール傾向を把握して、賢くお得に作品を手に入れましょう。
        </p>
        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold">
          2026年最新版
        </span>
      </motion.div>

      <article>
        {/* ───── セール種類の解説 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            🏷️ FANZAセールの種類と開催パターン
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

                {sale.subEvents && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          <th className="p-2 text-left font-bold">セール名</th>
                          <th className="p-2 text-left font-bold">時期</th>
                          <th className="p-2 text-left font-bold">割引</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sale.subEvents.map((ev, j) => (
                          <tr
                            key={j}
                            className="border-b border-[var(--color-border)]/50 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-2 font-medium">{ev.name}</td>
                            <td className="p-2 text-[var(--color-text-secondary)]">
                              {ev.period}
                            </td>
                            <td className="p-2 text-[var(--color-primary)] font-bold">
                              {ev.max}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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

        {/* ───── Mid CTA ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6 text-center border-[var(--color-primary)]/20"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              最新のセール対象作品を今すぐチェックしませんか？
            </p>
            <PrimaryCta href={ROUTES.sale} size="lg">
              最新のセール情報をチェック
            </PrimaryCta>
          </motion.div>
        </section>

        {/* ───── 年間セールカレンダー ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📅 年間セールカレンダー（月別傾向）
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            月ごとのセール傾向を一覧で把握して、お得な購入タイミングを逃さないようにしましょう。
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="p-3 text-left font-bold">月</th>
                  <th className="p-3 text-left font-bold">セール</th>
                  <th className="p-3 text-left font-bold">規模</th>
                  <th className="p-3 text-left font-bold">おすすめ度</th>
                </tr>
              </thead>
              <tbody>
                {calendarData.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--color-border)]/50 transition-colors ${
                      row.highlight
                        ? "bg-[var(--color-primary)]/5"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <td className="p-3 font-bold whitespace-nowrap">
                      {row.month}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {row.event}
                    </td>
                    <td className="p-3">
                      <span className="text-yellow-400">{row.scale}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          row.recommend === "最大級"
                            ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                            : row.recommend === "大規模"
                              ? "bg-yellow-400/20 text-yellow-400"
                              : row.recommend === "中規模"
                                ? "bg-blue-400/20 text-blue-400"
                                : "bg-white/10 text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {row.recommend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            ※ セールの開催時期や内容は年によって変動します。過去の傾向に基づく目安としてご参考ください。
          </p>
        </section>

        {/* ───── セールを逃さないコツ ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            🎯 セールを逃さない5つのコツ
          </h2>
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                      <span className="text-[var(--color-primary)]">
                        {tip.icon}
                      </span>
                      {tip.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {tip.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

        {/* ───── Bottom CTA ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-[var(--color-primary)]/20"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-center">
              🛒 さっそくセールをチェックしよう
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6 leading-relaxed">
              セールの仕組みが分かったら、あとは実際にチェックするだけ。
              まだFANZA未登録の方は初回クーポンももらえるので、まずは登録から始めましょう。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrimaryCta href={ROUTES.sale} size="lg">
                今すぐセール会場へ
              </PrimaryCta>
              <PrimaryCta href={ROUTES.guide} size="lg" variant="outline">
                FANZA登録ガイドを見る
              </PrimaryCta>
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
              href={ROUTES.guide}
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">📖 FANZA完全ガイド</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                会員登録から購入までの流れを初心者向けに徹底解説
              </p>
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
