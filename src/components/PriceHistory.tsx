"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_WORKERS_API || "";

interface PriceRecord {
  price: number;
  sale_price: number | null;
  discount_pct: number;
  recorded_at: string;
}

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function formatMonth(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

/** Pure SVG sparkline – no external chart library */
function Sparkline({ data }: { data: PriceRecord[] }) {
  if (data.length < 2) return null;

  const prices = data.map((d) => d.sale_price ?? d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const w = 200;
  const h = 40;
  const padding = 2;

  const points = prices.map((p, i) => {
    const x = padding + (i / (prices.length - 1)) * (w - padding * 2);
    const y = h - padding - ((p - min) / range) * (h - padding * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-10 w-full"
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="var(--color-primary, #d3af6f)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Mark lowest point */}
      {(() => {
        const minIdx = prices.indexOf(min);
        const x =
          padding + (minIdx / (prices.length - 1)) * (w - padding * 2);
        const y = h - padding - ((min - min) / range) * (h - padding * 2);
        return <circle cx={x} cy={y} r="3" fill="var(--color-accent, #4ade80)" />;
      })()}
    </svg>
  );
}

export default function PriceHistory({ contentId }: { contentId: string }) {
  const [data, setData] = useState<PriceRecord[] | null>(null);

  useEffect(() => {
    if (!API_BASE || !contentId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/price-history?content_id=${encodeURIComponent(contentId)}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json.history?.length > 0) {
          setData(json.history);
        }
      } catch {
        // Workers not deployed yet – graceful degradation
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  // Render nothing if no data or API unavailable
  if (!data || data.length === 0) return null;

  const prices = data.map((d) => d.sale_price ?? d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = prices[prices.length - 1];
  const minRecord = data[prices.indexOf(minPrice)];

  return (
    <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <p className="mb-2 text-xs font-semibold text-[var(--color-text-secondary)]">
        📈 価格推移
      </p>
      <Sparkline data={data} />
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-secondary)]">
        <span>
          最安値{" "}
          <strong className="text-[var(--color-accent)]">
            {formatYen(minPrice)}
          </strong>{" "}
          ({formatMonth(minRecord.recorded_at)})
        </span>
        <span>
          最高値{" "}
          <strong className="text-[var(--color-text-primary)]">
            {formatYen(maxPrice)}
          </strong>
        </span>
        <span>
          現在{" "}
          <strong className="text-[var(--color-text-primary)]">
            {formatYen(currentPrice)}
          </strong>
        </span>
      </div>
    </div>
  );
}
