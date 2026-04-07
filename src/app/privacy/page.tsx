import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "プライバシーポリシー",
  description:
    "オトナビのプライバシーポリシー。アクセス解析、Cookie、アフィリエイト計測、個人情報の取り扱い方針を記載しています。",
  path: ROUTES.privacy,
});

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8 gradient-text">
        プライバシーポリシー
      </h1>
      <div className="space-y-8 text-sm text-[var(--color-text-secondary)] leading-relaxed">
        <p>最終更新日: 2026年3月31日</p>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            1. はじめに
          </h2>
          <p>
            オトナビ（以下「本サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーでは、本サイトにおける情報の取り扱いについて説明します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            2. 収集する情報
          </h2>
          <h3 className="font-bold text-white mb-2 text-sm">
            2.1 自動的に収集される情報
          </h3>
          <p className="mb-3">
            本サイトでは、Google
            Analyticsを使用してアクセス解析を行っています。これにより以下の情報が自動的に収集されます：
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>IPアドレス（匿名化処理済み）</li>
            <li>ブラウザの種類・バージョン</li>
            <li>オペレーティングシステム</li>
            <li>参照元URL</li>
            <li>閲覧ページ・滞在時間</li>
            <li>デバイスの種類</li>
          </ul>
          <h3 className="font-bold text-white mb-2 mt-4 text-sm">
            2.2 Cookie（クッキー）
          </h3>
          <p>
            本サイトでは、Google Analyticsおよびアフィリエイトプログラムの計測のためにCookieを使用しています。Cookieはブラウザの設定により無効化することが可能ですが、一部の機能が制限される場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            3. 情報の利用目的
          </h2>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>サイトの利用状況の分析・改善</li>
            <li>コンテンツの最適化</li>
            <li>アフィリエイト成果の計測</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            4. 第三者への情報提供
          </h2>
          <p>
            収集した情報は、法令に基づく場合を除き、第三者に提供することはありません。ただし、Google
            Analyticsの利用に伴い、Googleのプライバシーポリシーに従ってデータが処理されます。
          </p>
          <p className="mt-2">
            Google Analyticsの詳細:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              https://policies.google.com/privacy
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            5. アフィリエイトプログラムについて
          </h2>
          <p>
            本サイトは、DMM.comのアフィリエイトプログラムに参加しています。本サイトのリンクを経由して商品の購入が行われた場合、サイト運営者に報酬が発生します。これにより利用者の購入価格が変動することはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            6. セキュリティ
          </h2>
          <p>
            本サイトはSSL/TLS暗号化通信に対応しており、データの送受信を保護しています。ただし、インターネット上の通信において100%の安全性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            7. ポリシーの変更
          </h2>
          <p>
            本ポリシーは、必要に応じて変更されることがあります。重要な変更がある場合は、本サイト上でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">
            8. お問い合わせ
          </h2>
          <p>
            本ポリシーに関するお問い合わせは、
            <a href="/contact" className="text-[var(--color-primary)] hover:underline">
              お問い合わせフォーム
            </a>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </main>
  );
}
