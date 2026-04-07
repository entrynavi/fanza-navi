"use client";

import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="content-shell flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]">
          <FaExclamationTriangle size={28} />
        </div>
        <h1 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
          エラーが発生しました
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
          ページの読み込み中に問題が発生しました。もう一度お試しください。
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
        >
          もう一度試す
        </button>
      </div>
    </main>
  );
}
