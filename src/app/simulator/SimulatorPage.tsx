"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaCalculator,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaRegLightbulb,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MONTHLY_PRICE = 2980;
const PRICE_OPTIONS = [980, 1980, 2980] as const;
const VR_SURCHARGE = 500;
const MIN_COUNT = 1;
const MAX_COUNT = 20;
const DEFAULT_COUNT = 5;

/* ------------------------------------------------------------------ */
/*  Animated number display                                            */
/* ------------------------------------------------------------------ */

function AnimatedYen({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 25 });
  const display = useTransform(spring, (v) =>
    `¥${Math.round(v).toLocaleString()}`
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsub;
  }, [display]);

  return <span ref={ref}>¥{value.toLocaleString()}</span>;
}

/* ------------------------------------------------------------------ */
/*  Bar chart                                                          */
/* ------------------------------------------------------------------ */

function ComparisonBar({
  label,
  amount,
  maxAmount,
  color,
  delay,
}: {
  label: string;
  amount: number;
  maxAmount: number;
  color: string;
  delay: number;
}) {
  const pct = maxAmount > 0 ? Math.max((amount / maxAmount) * 100, 4) : 4;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-bold">
          <AnimatedYen value={amount} />
          <span className="text-xs text-[var(--color-text-secondary)]">
            /月
          </span>
        </span>
      </div>
      <div className="h-8 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function SimulatorPage() {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [selectedPrice, setSelectedPrice] = useState<number>(1980);
  const [customPrice, setCustomPrice] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [vrEnabled, setVrEnabled] = useState(false);

  const avgPrice =
    (isCustom ? Number(customPrice) || 0 : selectedPrice) +
    (vrEnabled ? VR_SURCHARGE : 0);

  const singleMonthly = count * avgPrice;
  const singleYearly = singleMonthly * 12;
  const monthlyYearly = MONTHLY_PRICE * 12;
  const diff = singleMonthly - MONTHLY_PRICE;
  const monthlyCheaper = diff > 0;
  const breakEven =
    avgPrice > 0 ? Math.ceil(MONTHLY_PRICE / avgPrice) : Infinity;
  const maxBar = Math.max(singleMonthly, MONTHLY_PRICE);

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Number(e.target.value) || MIN_COUNT));
      setCount(v);
    },
    []
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb items={[{ label: "シミュレーター" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          <FaCalculator className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">月額 vs 単品 お得度シミュレーター</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          あなたの視聴スタイルに合った最適プランを診断しよう
        </p>
      </motion.div>

      {/* Calculator card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card mb-8 p-6 md:p-8"
      >
        <h2 className="mb-6 text-xl font-bold">📊 シミュレーション条件</h2>

        {/* Count slider */}
        <div className="mb-6">
          <label className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>🎬 月に何本見る？</span>
            <span className="rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-lg font-extrabold text-[var(--color-primary)]">
              {count}本
            </span>
          </label>
          <input
            type="range"
            min={MIN_COUNT}
            max={MAX_COUNT}
            step={1}
            value={count}
            onChange={handleCountChange}
            className="slider-thumb h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--color-primary)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--color-text-secondary)]">
            <span>{MIN_COUNT}本</span>
            <span>{MAX_COUNT}本</span>
          </div>
        </div>

        {/* Price radio */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold">💴 平均単価</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setSelectedPrice(p);
                  setIsCustom(false);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  !isCustom && selectedPrice === p
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
                }`}
              >
                ¥{p.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                isCustom
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
              }`}
            >
              カスタム
            </button>
          </div>

          <AnimatePresence>
            {isCustom && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    ¥
                  </span>
                  <input
                    type="number"
                    min={100}
                    max={9999}
                    placeholder="例: 1500"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-white placeholder:text-[var(--color-text-secondary)]/50 focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VR toggle */}
        <div className="mb-2">
          <button
            type="button"
            onClick={() => setVrEnabled((v) => !v)}
            className="flex items-center gap-3"
          >
            <span className="text-sm font-semibold">🥽 VR作品見る？</span>
            <span
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                vrEnabled
                  ? "bg-[var(--color-primary)]"
                  : "bg-white/10"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  vrEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
            {vrEnabled && (
              <span className="text-xs text-[var(--color-text-secondary)]">
                （+¥{VR_SURCHARGE.toLocaleString()}/本）
              </span>
            )}
          </button>
        </div>
      </motion.section>

      {/* Results */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card mb-8 p-6 md:p-8"
      >
        <h2 className="mb-6 text-xl font-bold">📈 シミュレーション結果</h2>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {/* Monthly plan */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
            <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
              📱 月額見放題
            </p>
            <p className="text-2xl font-extrabold text-green-400">
              <AnimatedYen value={MONTHLY_PRICE} />
              <span className="text-sm font-normal">/月</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              年間 ¥{monthlyYearly.toLocaleString()}
            </p>
          </div>

          {/* Single purchase */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
            <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
              🛒 単品購入
            </p>
            <p className="text-2xl font-extrabold text-yellow-400">
              <AnimatedYen value={singleMonthly} />
              <span className="text-sm font-normal">/月</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              年間 ¥{singleYearly.toLocaleString()}
            </p>
          </div>

          {/* Difference */}
          <div
            className={`rounded-xl border p-4 text-center ${
              monthlyCheaper
                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5"
                : "border-blue-500/20 bg-blue-500/5"
            }`}
          >
            <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
              💰 差額
            </p>
            <p
              className={`text-2xl font-extrabold ${
                monthlyCheaper ? "text-[var(--color-primary)]" : "text-blue-400"
              }`}
            >
              {diff > 0 ? "+" : ""}
              <AnimatedYen value={Math.abs(diff)} />
              <span className="text-sm font-normal">/月</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {monthlyCheaper ? "単品が高い" : diff === 0 ? "同額" : "月額が高い"}
            </p>
          </div>
        </div>

        {/* Visual bar chart */}
        <div className="mb-6 space-y-4">
          <ComparisonBar
            label="📱 月額見放題"
            amount={MONTHLY_PRICE}
            maxAmount={maxBar}
            color="linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
            delay={0.15}
          />
          <ComparisonBar
            label="🛒 単品購入"
            amount={singleMonthly}
            maxAmount={maxBar}
            color="linear-gradient(90deg, #eab308 0%, #ca8a04 100%)"
            delay={0.3}
          />
        </div>

        {/* Result message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={monthlyCheaper ? "monthly" : diff === 0 ? "even" : "single"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border p-5 text-center ${
              monthlyCheaper
                ? "border-green-500/30 bg-green-500/5"
                : "border-yellow-500/30 bg-yellow-500/5"
            }`}
          >
            {monthlyCheaper ? (
              <>
                <p className="mb-1 text-2xl font-extrabold text-green-400">
                  🎉 月額見放題がお得！
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  年間{" "}
                  <span className="font-bold text-green-400">
                    ¥{(diff * 12).toLocaleString()}
                  </span>{" "}
                  節約できます
                </p>
              </>
            ) : diff === 0 ? (
              <>
                <p className="mb-1 text-2xl font-extrabold text-blue-400">
                  ⚖️ ちょうど同額！
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  どちらを選んでもコストは同じです
                </p>
              </>
            ) : (
              <>
                <p className="mb-1 text-2xl font-extrabold text-yellow-400">
                  👍 単品購入がお得！
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  月{count}本なら単品がベスト
                </p>
              </>
            )}

            {/* Break-even */}
            {avgPrice > 0 && breakEven <= MAX_COUNT && (
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                <FaRegLightbulb className="mr-1 inline-block text-yellow-400" />
                損益分岐点：月{" "}
                <span className="font-bold text-white">{breakEven}本</span>{" "}
                以上なら月額見放題がお得
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Pros / Cons table */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">
          📋 メリット・デメリット比較
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly plan card */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-green-500/20 bg-green-500/10 px-5 py-3 text-center">
              <p className="font-bold text-green-400">📱 月額見放題</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-green-400">
                  <FaCheck size={12} /> メリット
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
                  <li>✅ 月5本以上見るならコスパ最強</li>
                  <li>✅ 見放題対象の全作品を好きなだけ視聴</li>
                  <li>✅ 毎月新作が追加される</li>
                  <li>✅ 好みのジャンルを気軽に開拓できる</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-red-400">
                  <FaTimes size={12} /> デメリット
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
                  <li>❌ 最新作の反映が遅い場合がある</li>
                  <li>❌ 解約すると視聴不可になる</li>
                  <li>❌ 月1〜2本なら割高</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Single purchase card */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-center">
              <p className="font-bold text-yellow-400">🛒 単品購入</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-green-400">
                  <FaCheck size={12} /> メリット
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
                  <li>✅ 最新作を発売日から視聴できる</li>
                  <li>✅ 購入作品は永久保有</li>
                  <li>✅ セール時に大幅割引あり</li>
                  <li>✅ 見る本数が少ないなら圧倒的に安い</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-red-400">
                  <FaTimes size={12} /> デメリット
                </p>
                <ul className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
                  <li>❌ たくさん見ると高額になる</li>
                  <li>❌ ハズレ作品でも返金不可</li>
                  <li>❌ ジャンル開拓しづらい</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA section */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card mb-8 border-[var(--color-primary)]/20 p-8 text-center"
      >
        <h2 className="mb-2 text-xl font-extrabold">
          🚀 さっそく始めてみよう
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          まずは無料サンプルで雰囲気をチェック！
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryCta
            href="https://www.dmm.co.jp/"
            variant="solid"
            size="lg"
            external
          >
            月額見放題を始める
          </PrimaryCta>
          <PrimaryCta href="/guide" variant="outline" size="lg">
            まずは無料登録
          </PrimaryCta>
        </div>
        <p className="mt-4 flex items-start justify-center gap-1 text-xs text-[var(--color-text-secondary)]">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>
            ※ 月額見放題は新作反映が遅い場合があります。新作重視なら単品がおすすめ。
          </span>
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">※ PR</p>
      </motion.section>
    </main>
  );
}
