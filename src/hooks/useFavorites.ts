"use client";

import { useCallback, useSyncExternalStore } from "react";

export const FAVORITES_STORAGE_KEY = "fanza-navi-favorites";
const FAVORITES_EVENT = "fanza-navi:favorites-changed";
const MAX_FAVORITES = 80;
const EMPTY_FAVORITES: string[] = [];
let lastKnownFavorites: string[] = EMPTY_FAVORITES;

function areFavoriteIdsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

function normalizeFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const ids = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return Array.from(new Set(ids)).slice(0, MAX_FAVORITES);
}

function readFavoritesSnapshot(): string[] {
  if (typeof window === "undefined") {
    return lastKnownFavorites;
  }

  try {
    const nextFavorites = normalizeFavoriteIds(
      JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]")
    );

    if (areFavoriteIdsEqual(lastKnownFavorites, nextFavorites)) {
      return lastKnownFavorites;
    }

    lastKnownFavorites = nextFavorites.length > 0 ? nextFavorites : EMPTY_FAVORITES;
    return lastKnownFavorites;
  } catch {
    return lastKnownFavorites;
  }
}

function writeFavoritesSnapshot(ids: string[]) {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITES;
  }

  const normalized = normalizeFavoriteIds(ids);

  if (areFavoriteIdsEqual(lastKnownFavorites, normalized)) {
    return lastKnownFavorites;
  }

  lastKnownFavorites = normalized.length > 0 ? normalized : EMPTY_FAVORITES;

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(lastKnownFavorites));
  } catch {
    // Keep the in-memory UI responsive even when persistence fails.
  }

  window.dispatchEvent(new Event(FAVORITES_EVENT));

  return lastKnownFavorites;
}

function subscribeFavorites(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => listener();
  window.addEventListener("storage", handleChange);
  window.addEventListener(FAVORITES_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(FAVORITES_EVENT, handleChange);
  };
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribeFavorites, readFavoritesSnapshot, () => EMPTY_FAVORITES);

  const update = useCallback((updater: (current: string[]) => string[]) => {
    const current = readFavoritesSnapshot();
    return writeFavoritesSnapshot(updater(current));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const normalizedId = id.trim();

      if (!normalizedId) {
        return;
      }

      update((current) =>
        current.includes(normalizedId)
          ? current.filter((entry) => entry !== normalizedId)
          : [normalizedId, ...current]
      );
    },
    [update]
  );

  const clearAll = useCallback(() => {
    update(() => []);
  }, [update]);

  const replaceAll = useCallback(
    (nextIds: string[]) => {
      update(() => nextIds);
    },
    [update]
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return {
    ids,
    toggle,
    clearAll,
    replaceAll,
    isFavorite,
    count: ids.length,
    maxFavorites: MAX_FAVORITES,
  };
}
