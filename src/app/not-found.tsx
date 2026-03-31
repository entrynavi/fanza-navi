import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">😵</div>
      <h1 className="text-4xl font-extrabold mb-4">
        <span className="gradient-text">404</span>
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)] mb-8">
        お探しのページは見つかりませんでした
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/fanza-navi/"
          className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
        >
          🏠 トップページへ
        </Link>
        <Link
          href="/fanza-navi/ranking"
          className="px-8 py-3 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          🏆 ランキングを見る
        </Link>
      </div>
    </main>
  );
}
