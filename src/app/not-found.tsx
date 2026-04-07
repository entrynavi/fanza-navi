import Link from "next/link";
import { ROUTES } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="content-shell flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="mb-4 text-7xl font-black bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent opacity-30">
          404
        </div>
        <h1 className="mb-2 text-xl font-bold text-[var(--color-text-primary)]">
          ページが見つかりません
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href={ROUTES.home}
            className="rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            トップページへ
          </Link>
          <Link
            href={ROUTES.search}
            className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)]"
          >
            作品を検索
          </Link>
        </div>
      </div>
    </main>
  );
}
