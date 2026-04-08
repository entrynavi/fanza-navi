import type { Product } from "@/data/products";
import {
  formatPriceYen,
  getDiscountPercent,
  getPresentedCurrentPrice,
} from "@/lib/product-presenter";

/* ------------------------------------------------------------------ */
/*  Rarity — maps review rating to a gacha-style tier                  */
/* ------------------------------------------------------------------ */

export interface RarityTier {
  label: string;
  short: string;
  emoji: string;
  color: string;
  glow: string;
}

const RARITY_TIERS: { min: number; tier: RarityTier }[] = [
  {
    min: 4.5,
    tier: {
      label: "SSR",
      short: "SSR",
      emoji: "🌟",
      color: "#fbbf24",
      glow: "rgba(251,191,36,0.35)",
    },
  },
  {
    min: 4.0,
    tier: {
      label: "SR",
      short: "SR",
      emoji: "✨",
      color: "#c084fc",
      glow: "rgba(192,132,252,0.3)",
    },
  },
  {
    min: 3.5,
    tier: {
      label: "R",
      short: "R",
      emoji: "🔷",
      color: "#60a5fa",
      glow: "rgba(96,165,250,0.25)",
    },
  },
  {
    min: 2.0,
    tier: {
      label: "A",
      short: "A",
      emoji: "🔹",
      color: "#34d399",
      glow: "rgba(52,211,153,0.2)",
    },
  },
  {
    min: 0,
    tier: {
      label: "N",
      short: "N",
      emoji: "📦",
      color: "#94a3b8",
      glow: "rgba(148,163,184,0.15)",
    },
  },
];

const MYSTERY_TIER: RarityTier = {
  label: "???",
  short: "???",
  emoji: "🎲",
  color: "#f472b6",
  glow: "rgba(244,114,182,0.25)",
};

export function getRarity(rating: number): RarityTier {
  if (rating <= 0) return MYSTERY_TIER;
  for (const { min, tier } of RARITY_TIERS) {
    if (rating >= min) return tier;
  }
  return RARITY_TIERS[RARITY_TIERS.length - 1].tier;
}

/* ------------------------------------------------------------------ */
/*  Share text builders — stay within X's 280 weighted-char limit      */
/*  CJK = 2 weighted, ASCII = 1, URLs always = 23                     */
/* ------------------------------------------------------------------ */

function weightedLength(text: string): number {
  let len = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    // Basic Latin + Latin Supplement = 1; everything else = 2
    len += code <= 0x024f ? 1 : 2;
  }
  return len;
}

function truncateForX(title: string, maxWeighted: number): string {
  let len = 0;
  let i = 0;
  const chars = [...title];
  while (i < chars.length) {
    const code = chars[i].codePointAt(0) ?? 0;
    const w = code <= 0x024f ? 1 : 2;
    if (len + w > maxWeighted) break;
    len += w;
    i++;
  }
  return i < chars.length ? chars.slice(0, i).join("") + "…" : title;
}

export interface ShareTextOptions {
  product: Product;
  context?: "gacha" | "daily" | "recommend" | "review";
  siteUrl?: string;
}

/**
 * Build share text for X (Twitter).
 * Always includes the product affiliate URL. Stays under 280 weighted chars.
 */
export function buildXShareText(opts: ShareTextOptions): string {
  const { product, context = "recommend" } = opts;
  const price = formatPriceYen(getPresentedCurrentPrice(product));
  const rarity = getRarity(product.rating);
  const rating = product.rating > 0 ? `★${product.rating.toFixed(1)}` : "";
  const discount = getDiscountPercent(product);
  const saleTag = discount ? `${discount}%OFF ` : product.isSale ? "セール中 " : "";

  // Build the affiliate link (or site URL as fallback)
  const url = product.affiliateUrl.trim() || opts.siteUrl || "";

  const contextPrefixes: Record<string, string> = {
    gacha: `🎰 ガチャ結果`,
    daily: `📅 今日のおすすめ`,
    recommend: `🔍 おすすめ発見`,
    review: `📝 レビュー`,
  };
  const prefix = contextPrefixes[context] ?? contextPrefixes.recommend;

  // Rarity tag for gacha context
  const rarityTag = context === "gacha" ? `【${rarity.emoji}${rarity.short}】` : "";

  // Template without title (to calculate remaining budget)
  // URL always counts as 23 weighted chars on X
  const fixedParts = [
    prefix,
    rarityTag,
    "\n",
    saleTag,
    "「」\n",
    `${price} ${rating}`,
    "\n#FANZAトクナビ",
    "\n",
  ].join("");

  const fixedWeight = weightedLength(fixedParts) + 23; // 23 for t.co URL
  const titleBudget = Math.max(20, 280 - fixedWeight - 4); // 4 for safety
  const truncatedTitle = truncateForX(product.title, titleBudget);

  return [
    `${prefix}${rarityTag}`,
    `${saleTag}「${truncatedTitle}」`,
    `${price} ${rating}`,
    `#FANZAトクナビ`,
    url,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a shorter share text for LINE / generic.
 */
export function buildLineShareText(opts: ShareTextOptions): string {
  const { product, context = "recommend" } = opts;
  const price = formatPriceYen(getPresentedCurrentPrice(product));
  const rating = product.rating > 0 ? `★${product.rating.toFixed(1)}` : "";
  const url = product.affiliateUrl.trim() || opts.siteUrl || "";

  const labels: Record<string, string> = {
    gacha: "🎰 FANZAガチャで引いた！",
    daily: "📅 今日のおすすめ",
    recommend: "🔍 FANZAで見つけた",
    review: "📝 レビュー投稿",
  };

  return [
    labels[context] ?? labels.recommend,
    `「${product.title}」`,
    `${price} ${rating}`,
    url,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ------------------------------------------------------------------ */
/*  Share URL builders for each platform                                */
/* ------------------------------------------------------------------ */

export function getXShareUrl(text: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function getLineShareUrl(text: string): string {
  return `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}`;
}

/**
 * Attempt Web Share API (works on mobile for Instagram Stories, etc.).
 * Returns true if the share dialog was triggered, false otherwise.
 */
export async function triggerWebShare(opts: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share(opts);
    return true;
  } catch {
    return false;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}
