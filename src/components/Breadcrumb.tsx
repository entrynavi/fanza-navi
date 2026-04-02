"use client";

import { FaChevronRight, FaHome } from "react-icons/fa";
import { ROUTES } from "@/lib/site";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-6 flex-wrap">
      <a
        href={ROUTES.home}
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        <FaHome size={12} /> ホーム
      </a>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <FaChevronRight size={8} />
          {item.href ? (
            <a href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
