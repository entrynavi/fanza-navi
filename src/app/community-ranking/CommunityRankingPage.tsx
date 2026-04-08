"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import SectionIntro from "@/components/SectionIntro";
import VoteButton from "@/components/VoteButton";

type Period = "week" | "month" | "all";

interface RankedItem {
  content_id: string;
  title: string;
  image_url: string;
  vote_count: number;
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "今週" },
  { key: "month", label: "今月" },
  { key: "all", label: "全期間" },
];

const API_BASE = process.env.NEXT_PUBLIC_WORKERS_API || "";

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "from-[#d3af6f] to-[#b8943f]",
    2: "from-[#bdb7af] to-[#9a938b]",
    3: "from-[#b17852] to-[#8a5c3c]",
  };
  const bg =
    colors[rank] ??
    "from-[var(--color-surface-strong)] to-[var(--color-surface)]";

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${bg} text-xs font-bold text-white shadow`}
    >
      {rank}
    </span>
  );
}

export default function CommunityRankingPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [ranking, setRanking] = useState<RankedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRanking = useCallback(async (p: Period) => {
    if (!API_BASE) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `${API_BASE}/api/vote/ranking?period=${p}&limit=20`,
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setRanking(data.ranking ?? []);
    } catch {
      setError(true);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking(period);
  }, [period, fetchRanking]);

  const handleVoted = () => {
    fetchRanking(period);
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "みんなの推しランキング" }]} />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="editorial-surface p-6 md:p-8"
      >
        <SectionIntro
          eyebrow="コミュニティ投票"
          title="👍 みんなの推し作品ランキング"
          description="ユーザーの投票で決まるランキングです。あなたの推し作品に投票して、みんなのおすすめを共有しましょう。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">👍 1人1票</span>
          <span className="chip">📊 リアルタイム集計</span>
          <span className="chip">🏆 期間別ランキング</span>
        </div>
      </motion.section>

      {/* Period Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              period === p.key
                ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {error && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              🚧 投票機能は準備中です
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Workers APIのデプロイ後にご利用いただけます。
            </p>
          </div>
        )}

        {loading && !error && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          </div>
        )}

        {!loading && !error && ranking.length === 0 && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              まだ投票がありません
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              最初の投票者になりましょう！作品ページから「👍 推す」ボタンで投票できます。
            </p>
          </div>
        )}

        {!loading && !error && ranking.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={period}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {ranking.map((item, i) => (
                <div
                  key={item.content_id}
                  className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
                >
                  <RankBadge rank={i + 1} />

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-16 w-12 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                      {item.vote_count} 票
                    </p>
                  </div>

                  <VoteButton
                    contentId={item.content_id}
                    title={item.title}
                    imageUrl={item.image_url}
                    onVoted={handleVoted}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
