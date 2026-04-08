"use client";

import type { ComponentType, ReactNode } from "react";
import { FaBookmark, FaBolt, FaSearch, FaStar, FaTags } from "react-icons/fa";
import type { ProductPoolOption, ProductPoolSource } from "@/lib/product-pool";

const sourceIcons: Record<ProductPoolSource, ComponentType<{ size?: number }>> = {
  all: FaSearch,
  favorites: FaBookmark,
  sale: FaTags,
  new: FaBolt,
  "high-rated": FaStar,
};

export default function ProductPoolToolbar({
  query,
  onQueryChange,
  source,
  onSourceChange,
  options,
  placeholder = "作品名・女優名・メーカー・シリーズで絞り込む",
  summary,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  source: ProductPoolSource;
  onSourceChange: (value: ProductPoolSource) => void;
  options: ProductPoolOption[];
  placeholder?: string;
  summary?: ReactNode;
}) {
  return (
    <section className="glass-card mb-6 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
          <FaSearch size={12} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const Icon = sourceIcons[option.value];

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => onSourceChange(option.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
                  source === option.value
                    ? "border-[var(--color-primary)]/35 bg-[var(--color-primary)]/12 text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-white"
                } ${option.disabled ? "cursor-not-allowed opacity-45 hover:border-[var(--color-border)] hover:text-[var(--color-text-secondary)]" : ""}`}
              >
                <Icon size={11} />
                {option.label}
                <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-[10px]">
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        {summary ? (
          <div className="text-xs text-[var(--color-text-muted)]">{summary}</div>
        ) : null}
      </div>
    </section>
  );
}
