"use client";

import { useCallback, useState } from "react";
import { FaCheck, FaCopy, FaLine, FaShareAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { Product } from "@/data/products";
import {
  buildLineShareText,
  buildXShareText,
  copyToClipboard,
  getLineShareUrl,
  getXShareUrl,
  triggerWebShare,
  type ShareTextOptions,
} from "@/lib/share-utils";
import {
  formatPriceYen,
  getPresentedCurrentPrice,
} from "@/lib/product-presenter";

interface ShareMenuProps {
  product: Product;
  context?: ShareTextOptions["context"];
  siteUrl?: string;
  /** compact = inline row, full = vertical buttons */
  variant?: "compact" | "full";
  className?: string;
}

export default function ShareMenu({
  product,
  context = "recommend",
  siteUrl,
  variant = "compact",
  className = "",
}: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const opts: ShareTextOptions = { product, context, siteUrl };

  const handleX = useCallback(() => {
    const text = buildXShareText(opts);
    window.open(getXShareUrl(text), "_blank", "noopener");
  }, [opts]);

  const handleLine = useCallback(() => {
    const text = buildLineShareText(opts);
    window.open(getLineShareUrl(text), "_blank", "noopener");
  }, [opts]);

  const handleCopy = useCallback(async () => {
    const text = buildXShareText(opts);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [opts]);

  const handleNativeShare = useCallback(async () => {
    const price = formatPriceYen(getPresentedCurrentPrice(product));
    const url = product.affiliateUrl.trim() || siteUrl || "";
    const text = `${product.title}\n${price}\n#FANZAトクナビ`;
    const shared = await triggerWebShare({ title: product.title, text, url });
    if (!shared) {
      handleX();
    }
  }, [product, siteUrl, handleX]);

  if (variant === "full") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <button
          onClick={handleX}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-black border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-900"
        >
          <FaXTwitter size={14} />
          Xでシェア
        </button>
        <button
          onClick={handleLine}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#06C755] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#05b34d]"
        >
          <FaLine size={14} />
          LINE
        </button>
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-white"
        >
          <FaShareAlt size={12} />
          その他
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-white"
        >
          {copied ? <FaCheck size={12} className="text-[var(--color-accent)]" /> : <FaCopy size={12} />}
          {copied ? "コピー済" : "コピー"}
        </button>
      </div>
    );
  }

  // Compact variant — inline icon buttons
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        onClick={handleX}
        title="Xでシェア"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
      >
        <FaXTwitter size={13} />
      </button>
      <button
        onClick={handleLine}
        title="LINEでシェア"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[#06C755] transition-colors hover:bg-[#06C755]/10"
      >
        <FaLine size={14} />
      </button>
      <button
        onClick={handleNativeShare}
        title="その他のアプリでシェア"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
      >
        <FaShareAlt size={12} />
      </button>
      <button
        onClick={handleCopy}
        title={copied ? "コピー済" : "コピー"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
      >
        {copied ? <FaCheck size={12} className="text-[var(--color-accent)]" /> : <FaCopy size={12} />}
      </button>
    </div>
  );
}
