"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "fanza-navi-history";
const MAX_HISTORY = 20;

export interface HistoryEntry {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  genre: string;
  affiliateUrl: string;
  viewedAt: number;
}

export function useViewHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {}
  }, []);

  const record = useCallback(
    (entry: Omit<HistoryEntry, "viewedAt">) => {
      const next = [
        { ...entry, viewedAt: Date.now() },
        ...entries.filter((e) => e.id !== entry.id),
      ].slice(0, MAX_HISTORY);
      setEntries(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    },
    [entries]
  );

  return { entries, record, count: entries.length };
}
