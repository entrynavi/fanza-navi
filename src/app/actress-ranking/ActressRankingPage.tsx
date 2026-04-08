"use client";

import { motion } from "framer-motion";
import { FaStar, FaTrophy, FaUser, FaCommentDots } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import { ROUTES, getActressRoute } from "@/lib/site";

export interface ActressRankingData {
  name: string;
  appearances: number;
  averageRating: number;
  totalReviewCount: number;
  topGenres: string[];
}

const rankBadgeColors: Record<number, string> = {
  1: "from-[#d3af6f] to-[#f5e0b0]",
  2: "from-[#bdb7af] to-[#e0dbd6]",
  3: "from-[#b17852] to-[#daa87c]",
};

export default function ActressRankingPage({
  actresses,
}: {
  actresses: ActressRankingData[];
}) {
  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ランキング", href: ROUTES.ranking },
          { label: "人気女優ランキング" },
        ]}
      />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <SectionIntro
          eyebrow="女優ランキング"
          title="人気女優ランキング"
          description="ランキング上位作品への出演回数・平均評価・レビュー数をもとに集計した女優ランキングです。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              作品ランキングへ
            </PrimaryCta>
          }
        />
      </section>

      <section>
        <div className="space-y-3">
          {actresses.map((actress, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;

            return (
              <motion.a
                key={actress.name}
                href={getActressRoute(actress.name)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="glass-card flex items-center gap-4 p-4 md:p-5 transition-all hover:shadow-[0_0_20px_rgba(158,68,90,0.15)] hover:border-[var(--color-border-strong)]"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                    isTop3
                      ? `bg-gradient-to-br ${rankBadgeColors[rank]} text-[var(--color-bg)]`
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  {rank}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
                    {actress.name}
                  </h3>
                  {actress.topGenres.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {actress.topGenres.slice(0, 3).map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-5 text-sm text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1.5">
                    <FaTrophy size={12} className="text-[var(--color-accent)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {actress.appearances}
                    </span>
                    本
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaStar size={12} className="text-[var(--color-accent)]" />
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {actress.averageRating.toFixed(1)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCommentDots size={12} className="text-[var(--color-text-muted)]" />
                    <span>{actress.totalReviewCount}件</span>
                  </span>
                </div>

                <div className="flex sm:hidden flex-col items-end gap-0.5 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <FaStar size={10} className="text-[var(--color-accent)]" />
                    {actress.averageRating.toFixed(1)}
                  </span>
                  <span>{actress.appearances}本</span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      <section className="mt-10 editorial-surface p-6 md:p-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          気になる女優をタップすると、出演作品の一覧へ進めます
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
            作品ランキングへ
          </PrimaryCta>
          <PrimaryCta href={ROUTES.guide} size="sm">
            初心者ガイドへ
          </PrimaryCta>
        </div>
      </section>

    </main>
  );
}
