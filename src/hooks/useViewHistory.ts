"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "fanza-navi-history";
const HISTORY_EVENT = "fanza-navi:history-changed";
const MAX_HISTORY = 24;
const EMPTY_HISTORY: HistoryEntry[] = [];
let lastKnownHistory: HistoryEntry[] = EMPTY_HISTORY;

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

function areHistoryEntriesEqual(left: HistoryEntry[], right: HistoryEntry[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((entry, index) => {
    const other = right[index];

    return (
      entry.id === other.id &&
      entry.title === other.title &&
      entry.imageUrl === other.imageUrl &&
      entry.price === other.price &&
      entry.salePrice === other.salePrice &&
      entry.genre === other.genre &&
      entry.affiliateUrl === other.affiliateUrl &&
      entry.viewedAt === other.viewedAt
    );
  });
}

function normalizeHistoryEntries(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries = value
    .filter((entry): entry is Partial<HistoryEntry> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      id: String(entry.id ?? "").trim(),
      title: String(entry.title ?? "").trim(),
      imageUrl: String(entry.imageUrl ?? "").trim(),
      price: Number(entry.price ?? 0) || 0,
      salePrice:
        typeof entry.salePrice === "number" && Number.isFinite(entry.salePrice)
          ? entry.salePrice
          : undefined,
      genre: String(entry.genre ?? "").trim() || "popular",
      affiliateUrl: String(entry.affiliateUrl ?? "").trim(),
      viewedAt: Number(entry.viewedAt ?? 0) || 0,
    }))
    .filter((entry) => entry.id && entry.title && entry.affiliateUrl)
    .sort((left, right) => right.viewedAt - left.viewedAt);

  return Array.from(new Map(entries.map((entry) => [entry.id, entry])).values()).slice(
    0,
    MAX_HISTORY
  );
}

function readHistorySnapshot() {
  if (typeof window === "undefined") {
    return lastKnownHistory;
  }

  try {
    const nextHistory = normalizeHistoryEntries(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));

    if (areHistoryEntriesEqual(lastKnownHistory, nextHistory)) {
      return lastKnownHistory;
    }

    lastKnownHistory = nextHistory.length > 0 ? nextHistory : EMPTY_HISTORY;
    return lastKnownHistory;
  } catch {
    return lastKnownHistory;
  }
}

function writeHistorySnapshot(entries: HistoryEntry[]) {
  if (typeof window === "undefined") {
    return EMPTY_HISTORY;
  }

  const normalized = normalizeHistoryEntries(entries);

  if (areHistoryEntriesEqual(lastKnownHistory, normalized)) {
    return lastKnownHistory;
  }

  lastKnownHistory = normalized.length > 0 ? normalized : EMPTY_HISTORY;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastKnownHistory));
  } catch {
    // Keep navigation non-blocking when persistence is unavailable.
  }

  window.dispatchEvent(new Event(HISTORY_EVENT));

  return lastKnownHistory;
}

function subscribeHistory(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => listener();
  window.addEventListener("storage", handleChange);
  window.addEventListener(HISTORY_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(HISTORY_EVENT, handleChange);
  };
}

export function useViewHistory() {
  const entries = useSyncExternalStore(subscribeHistory, readHistorySnapshot, () => EMPTY_HISTORY);

  const record = useCallback((entry: Omit<HistoryEntry, "viewedAt">) => {
    const current = readHistorySnapshot();
    writeHistorySnapshot([{ ...entry, viewedAt: Date.now() }, ...current]);
  }, []);

  const clearHistory = useCallback(() => {
    writeHistorySnapshot([]);
  }, []);

  return { entries, record, clearHistory, count: entries.length, maxHistory: MAX_HISTORY };
}
