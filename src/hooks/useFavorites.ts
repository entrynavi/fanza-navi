"use client";

import { useCallback, useEffect, useState } from "react";

export const FAVORITES_STORAGE_KEY = "fanza-navi-favorites";
const FAVORITES_EVENT = "fanza-navi:favorites-changed";
const MAX_FAVORITES = 50;

function readFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setIds(readFavorites());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, []);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
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
