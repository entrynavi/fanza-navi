"use client";

import Link from "next/link";
import Image from "next/image";
import { useViewHistory } from "@/hooks/useViewHistory";
import { ROUTES } from "@/lib/site";
import { FaClock, FaExternalLinkAlt } from "react-icons/fa";

export default function RecentlyViewed() {
  const { entries } = useViewHistory();

  if (entries.length === 0) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <FaClock size={13} className="text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          最近チェックした作品
        </h3>
        <span className="text-xs text-[var(--color-text-muted)]">
          ({entries.length})
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.affiliateUrl || ROUTES.search}
            target={entry.affiliateUrl ? "_blank" : undefined}
            rel={entry.affiliateUrl ? "noopener noreferrer" : undefined}
            className="group flex-shrink-0 w-[140px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <Image
                src={entry.imageUrl}
                alt={entry.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="140px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaExternalLinkAlt size={10} className="text-white/80" />
              </div>
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary-light)] transition-colors">
              {entry.title}
            </p>
            <p className="text-xs font-semibold text-[var(--color-accent)]">
              ¥{(entry.salePrice ?? entry.price).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
