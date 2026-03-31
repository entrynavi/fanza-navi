"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-3xl font-extrabold mb-4">
            エラーが発生しました
          </h1>
          <p className="text-gray-400 mb-8">
            申し訳ございません。しばらく時間をおいて再度お試しください。
          </p>
          <button
            onClick={() => reset()}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 transition-opacity"
          >
            再読み込み
          </button>
        </div>
      </body>
    </html>
  );
}
