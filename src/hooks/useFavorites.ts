"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "fanza-navi-favorites";
const MAX_FAVORITES = 50;

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setIds(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const toggle = useCallback(
    (id: string) => {
      persist(
        ids.includes(id)
          ? ids.filter((x) => x !== id)
          : [id, ...ids].slice(0, MAX_FAVORITES)
      );
    },
    [ids, persist]
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isFavorite, count: ids.length };
}
