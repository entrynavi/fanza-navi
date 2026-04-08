"use client";

import { useState } from "react";
import { FaClock, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { useViewHistory } from "@/hooks/useViewHistory";
import { ROUTES } from "@/lib/site";

function HistoryThumb({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imageUrl) && !imgError;

  if (!showImage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(227,74,110,0.2),rgba(123,163,210,0.14))]">
        <span className="text-xs font-semibold text-[var(--color-text-muted)]">FANZA</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="h-full w-full object-cover transition-transform group-hover:scale-105"
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}

export default function RecentlyViewed() {
  const { entries, clearHistory } = useViewHistory();

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="content-shell px-4 pb-8">
      <div className="editorial-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaClock size={13} className="text-[var(--color-accent)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">最近チェックした作品</h2>
            <span className="text-xs text-[var(--color-text-muted)]">({entries.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={ROUTES.watchlist}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            >
              ウォッチリストへ
            </a>
            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            >
              <FaTimes size={10} />
              履歴を消す
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {entries.map((entry) => (
            <a
              key={entry.id}
              href={entry.affiliateUrl || ROUTES.search}
              target={entry.affiliateUrl ? "_blank" : undefined}
              rel={entry.affiliateUrl ? "noopener noreferrer" : undefined}
              className="group w-[148px] shrink-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <HistoryThumb imageUrl={entry.imageUrl} title={entry.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <FaExternalLinkAlt size={10} className="text-white/80" />
                </div>
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-primary-light)]">
                {entry.title}
              </p>
              <p className="text-xs font-semibold text-[var(--color-accent)]">
                ¥{(entry.salePrice ?? entry.price).toLocaleString()}~
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
