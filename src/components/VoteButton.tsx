"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_WORKERS_API || "";

interface VoteButtonProps {
  contentId: string;
  title: string;
  imageUrl?: string;
  voteCount?: number;
  onVoted?: () => void;
}

export default function VoteButton({
  contentId,
  title,
  imageUrl,
  voteCount,
  onVoted,
}: VoteButtonProps) {
  const [voted, setVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const disabled = !API_BASE || voted || submitting;

  const handleClick = async () => {
    if (disabled) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: contentId,
          title,
          image_url: imageUrl || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setVoted(true);
        if (data.voted && onVoted) onVoted();
      }
    } catch {
      // Silently handle – Workers may not be deployed yet
    } finally {
      setSubmitting(false);
    }
  };

  if (!API_BASE) {
    return (
      <button
        disabled
        title="投票機能は準備中です"
        className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] opacity-50"
      >
        👍 推す
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
        voted
          ? "bg-[var(--color-primary)] text-white"
          : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      } disabled:opacity-50`}
    >
      {submitting ? "..." : voted ? "👍 推した！" : "👍 推す"}
      {typeof voteCount === "number" && (
        <span className="ml-1 opacity-70">{voteCount}</span>
      )}
    </button>
  );
}
