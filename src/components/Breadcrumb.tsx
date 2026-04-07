"use client";

import { FaChevronRight, FaHome } from "react-icons/fa";
import { ROUTES } from "@/lib/site";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
      <a
        href={ROUTES.home}
        className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 transition-colors hover:text-white"
      >
        <FaHome size={12} /> ホーム
      </a>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <FaChevronRight size={8} />
          {item.href ? (
            <a
              href={item.href}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ) : (
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] px-3 py-1.5 text-white">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
