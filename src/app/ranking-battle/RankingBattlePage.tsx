"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaVoteYea,
  FaCrown,
  FaRedo,
  FaExternalLinkAlt,
  FaStar,
  FaCoins,
  FaBolt,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import ProductPoolToolbar from "@/components/ProductPoolToolbar";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from "@/data/products";
import {
  filterProductPool,
  getProductPoolOptions,
  type ProductPoolSource,
} from "@/lib/product-pool";

/* ------------------------------------------------------------------ */
/*  Tournament logic                                                   */
/* ------------------------------------------------------------------ */

interface Match {
  a: Product;
  b: Product;
}

function buildBracket(products: Product[]): Match[] {
  const matches: Match[] = [];
  for (let i = 0; i < products.length - 1; i += 2) {
    matches.push({ a: products[i], b: products[i + 1] });
  }
  return matches;
}

function getRoundLabel(remaining: number): string {
  if (remaining <= 1) return "優勝";
  if (remaining <= 2) return "決勝";
  if (remaining <= 4) return "準決勝";
  if (remaining <= 8) return "準々決勝";
  return `${remaining * 2}作品 → ${remaining}作品`;
}

function getTotalRounds(count: number): number {
  return Math.ceil(Math.log2(count));
}

/* ------------------------------------------------------------------ */
/*  VS animation                                                       */
/* ------------------------------------------------------------------ */

function VsBadge() {
  return (
    <motion.div
      className="relative z-10 flex h-16 w-16 items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
        animate={{
          boxShadow: [
            "0 0 20px rgba(228,0,127,0.4)",
            "0 0 40px rgba(228,0,127,0.7)",
            "0 0 20px rgba(228,0,127,0.4)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="relative text-2xl font-black text-white">VS</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product battle card                                                */
/* ------------------------------------------------------------------ */

function BattleCard({
  product,
  side,
  onVote,
}: {
  product: Product;
  side: "left" | "right";
  onVote: () => void;
}) {
  return (
    <motion.button
      onClick={onVote}
      className="glass-card group w-full cursor-pointer overflow-hidden border-2 border-transparent p-4 text-left transition-all hover:border-[var(--color-primary)] hover:shadow-[0_0_30px_rgba(228,0,127,0.2)] md:p-6"
      initial={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === "left" ? -50 : 50 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-white/5">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="line-clamp-2 text-sm font-bold text-white drop-shadow-lg">
            {product.title}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1">
          <FaCoins className="text-yellow-400" />
          {product.salePrice ? (
            <span className="font-bold text-[var(--color-accent)]">
              ¥{product.salePrice.toLocaleString()}~
            </span>
          ) : (
            <span>¥{product.price.toLocaleString()}~</span>
          )}
        </span>
        {product.rating > 0 && (
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {product.rating.toFixed(1)}
          </span>
        )}
        {product.genre && (
          <span className="rounded-full bg-white/5 px-2 py-0.5">
            {product.genre}
          </span>
        )}
      </div>

      {/* Vote CTA */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)]/10 py-3 text-sm font-bold text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)]/20">
        <FaVoteYea />
        こっちに投票！
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress bar                                                       */
/* ------------------------------------------------------------------ */

function TournamentProgress({
  currentRound,
  totalRounds,
  matchInRound,
  totalMatchesInRound,
}: {
  currentRound: number;
  totalRounds: number;
  matchInRound: number;
  totalMatchesInRound: number;
}) {
  const roundPct = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const matchPct =
    totalMatchesInRound > 0 ? (matchInRound / totalMatchesInRound) * 100 : 0;

  return (
    <div className="glass-card mb-6 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">
          トーナメント進行
        </span>
        <span className="font-bold text-white">
          ラウンド {currentRound + 1}/{totalRounds}
        </span>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
          animate={{ width: `${roundPct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>
          対戦 {matchInRound}/{totalMatchesInRound}
        </span>
        <span>{Math.round(matchPct)}% 完了</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Champion display                                                   */
/* ------------------------------------------------------------------ */

function ChampionDisplay({
  champion,
  onReset,
}: {
  champion: Product;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="text-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6"
      >
        <FaCrown className="mx-auto text-6xl text-yellow-400" />
      </motion.div>

      <h2 className="mb-2 text-3xl font-extrabold">
        <span className="gradient-text">優勝作品</span>
      </h2>
      <p className="mb-8 text-[var(--color-text-secondary)]">
        トーナメントを勝ち抜いた、あなたの推し作品！
      </p>

      <div className="glass-card mx-auto max-w-md overflow-hidden border-2 border-yellow-400/30 p-6">
        <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-white/5">
          {champion.imageUrl && (
            <img
              src={champion.imageUrl}
              alt={champion.title}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute -right-1 -top-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 shadow-lg">
              <FaTrophy className="text-xl text-black" />
            </div>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-bold text-white">{champion.title}</h3>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1">
            <FaCoins className="text-yellow-400" />
            {champion.salePrice ? (
              <span className="font-bold text-[var(--color-accent)]">
                ¥{champion.salePrice.toLocaleString()}~
              </span>
            ) : (
              <span>¥{champion.price.toLocaleString()}~</span>
            )}
          </span>
          {champion.rating > 0 && (
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              {champion.rating.toFixed(1)}
            </span>
          )}
        </div>

        <a
          href={champion.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:brightness-110"
        >
          <FaBolt />
          この作品をチェック
          <FaExternalLinkAlt size={12} />
        </a>
      </div>

      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-primary)]/40 hover:text-white"
      >
        <FaRedo />
        もう一回トーナメント
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

export default function RankingBattlePage({ products }: Props) {
  const { ids } = useFavorites();
  const [source, setSource] = useState<ProductPoolSource>("all");
  const [query, setQuery] = useState("");
  const [bracketSize, setBracketSize] = useState<16 | 32 | 64>(32);

  const sourceOptions = useMemo(
    () => getProductPoolOptions(products, ids),
    [ids, products]
  );
  const filteredProducts = useMemo(
    () =>
      filterProductPool(products, {
        source,
        query,
        favoriteIds: ids,
      }),
    [ids, products, query, source]
  );

  // Ensure even number of contestants
  const contestants = useMemo(() => {
    const list = filteredProducts.slice(0, bracketSize);
    return list.length % 2 === 0 ? list : list.slice(0, -1);
  }, [bracketSize, filteredProducts]);

  const totalRounds = useMemo(
    () => getTotalRounds(contestants.length),
    [contestants.length]
  );

  const [currentContestants, setCurrentContestants] =
    useState<Product[]>(contestants);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [winners, setWinners] = useState<Product[]>([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [champion, setChampion] = useState<Product | null>(null);
  const [matchKey, setMatchKey] = useState(0);

  useEffect(() => {
    setCurrentContestants(contestants);
    setCurrentMatchIndex(0);
    setWinners([]);
    setRoundNumber(0);
    setChampion(null);
    setMatchKey((key) => key + 1);
  }, [contestants]);

  const currentBracket = useMemo(
    () => buildBracket(currentContestants),
    [currentContestants]
  );
  const currentMatch: Match | null = currentBracket[currentMatchIndex] ?? null;
  const roundLabel = getRoundLabel(currentBracket.length);

  const handleVote = useCallback(
    (winner: Product) => {
      const newWinners = [...winners, winner];

      if (currentMatchIndex + 1 < currentBracket.length) {
        // More matches in this round
        setWinners(newWinners);
        setCurrentMatchIndex((i) => i + 1);
        setMatchKey((k) => k + 1);
      } else {
        // Round complete
        if (newWinners.length === 1) {
          // Tournament over
          setChampion(newWinners[0]);
        } else {
          // Start next round
          setCurrentContestants(newWinners);
          setWinners([]);
          setCurrentMatchIndex(0);
          setRoundNumber((r) => r + 1);
          setMatchKey((k) => k + 1);
        }
      }
    },
    [winners, currentMatchIndex, currentBracket.length]
  );

  const handleReset = useCallback(() => {
    setCurrentContestants(contestants);
    setCurrentMatchIndex(0);
    setWinners([]);
    setRoundNumber(0);
    setChampion(null);
    setMatchKey((k) => k + 1);
  }, [contestants]);

  if (contestants.length < 2) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Breadcrumb items={[{ label: "ランキングバトル" }]} />
        <div className="glass-card p-8 text-center">
          <FaTrophy className="mx-auto mb-3 text-4xl text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            トーナメントに必要な作品数が不足しています
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: "ランキングバトル" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          <FaTrophy className="mr-2 inline-block text-yellow-400" />
          <span className="gradient-text">ランキングバトル</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          1対1のトーナメント形式で推し作品を決めよう！
        </p>
      </motion.div>

      <ProductPoolToolbar
        query={query}
        onQueryChange={setQuery}
        source={source}
        onSourceChange={setSource}
        options={sourceOptions}
        placeholder="作品名・女優名・シリーズで対戦候補を絞る"
        summary={
          source === "favorites"
            ? "ウォッチリストだけで推し対決できます。買う候補の最終比較にも使えます。"
            : `候補母数は ${filteredProducts.length} 件。全取得作品・セール・新作・高評価からトーナメントを組めます。`
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">対戦規模</span>
        {[16, 32, 64].map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => setBracketSize(size as 16 | 32 | 64)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              bracketSize === size
                ? "border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            {size}作品
          </button>
        ))}
      </div>

      {champion ? (
        <ChampionDisplay champion={champion} onReset={handleReset} />
      ) : (
        <>
          {/* Progress */}
          <TournamentProgress
            currentRound={roundNumber}
            totalRounds={totalRounds}
            matchInRound={currentMatchIndex + 1}
            totalMatchesInRound={currentBracket.length}
          />

          {/* Round label */}
          <motion.div
            key={roundLabel}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2 text-sm font-bold text-white">
              <FaVoteYea className="text-[var(--color-primary)]" />
              {roundLabel}
              <span className="text-[var(--color-text-muted)]">
                （{currentMatchIndex + 1}/{currentBracket.length}）
              </span>
            </span>
          </motion.div>

          {/* Battle area */}
          {currentMatch && (
            <AnimatePresence mode="wait">
              <motion.div
                key={matchKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4"
              >
                <BattleCard
                  product={currentMatch.a}
                  side="left"
                  onVote={() => handleVote(currentMatch.a)}
                />
                <VsBadge />
                <BattleCard
                  product={currentMatch.b}
                  side="right"
                  onVote={() => handleVote(currentMatch.b)}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-[var(--color-text-muted)]"
          >
            カードをクリックして投票してください
          </motion.p>

          {/* Reset */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-primary)]/40 hover:text-white"
            >
              <FaRedo size={10} />
              もう一回トーナメント
            </button>
          </div>
        </>
      )}

      {/* PR note */}
      <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
        ※ PR
      </p>
    </main>
  );
}
