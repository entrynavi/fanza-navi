"use client";

import { FaChartLine, FaCompass, FaTags } from "react-icons/fa";

const items = [
  {
    icon: <FaChartLine size={14} />,
    title: "月間ランキング",
    description: "いま動いている作品を上から追いやすい順で整理しています。",
  },
  {
    icon: <FaTags size={14} />,
    title: "セール比較",
    description: "割引率だけでなく、レビュー件数と価格差も一緒に見られます。",
  },
  {
    icon: <FaCompass size={14} />,
    title: "ジャンル回遊",
    description: "人気作、VR、新作など目的別の入り口を近くに置いています。",
  },
];

export default function SocialProof() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="glass-card flex items-start gap-3 p-4 text-left">
          <div className="mt-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-2 text-[var(--color-accent)]">
            {item.icon}
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
