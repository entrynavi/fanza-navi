# FANZAナビ

FANZA / DMM アフィリエイト向けの静的レビューサイトです。  
Next.js App Router を `output: "export"` で運用し、Cloudflare Pages にそのまま載せられる構成にしています。

## 技術スタック

- Next.js 16
- React 19
- Tailwind CSS v4
- Framer Motion
- Vitest + Testing Library
- Cloudflare Pages 向け static export

## サイト構成

- `/`
  ランキング、セール、ジャンル、レビューに流すトップページ
- `/ranking`
  月間ランキング
- `/sale`
  セール情報
- `/new`
  新作導線
- `/search`
  静的サイト向けの検索入口ページ
- `/genre/[slug]`
  ジャンル別一覧テンプレート
- `/reviews`
  レビュー一覧
- `/reviews/[slug]`
  個別レビューテンプレート
- `/articles`
  ガイド記事一覧
- `/about`
  運営者情報
- `/contact`
  お問い合わせ
- `/privacy`
  プライバシーポリシー
- `/terms`
  利用規約

## ローカル起動

```bash
npm install
npm run dev
```

開発サーバーは通常 `http://localhost:3000` です。

## build / export

```bash
npm run build
```

成功すると `out/` に静的ファイルが出力されます。  
Cloudflare Pages ではこの `out/` を配信します。

## 環境変数

`.env.example` をコピーして使ってください。

```bash
cp .env.example .env.local
```

主な変数:

- `SITE_URL`
  本番URL。canonical / OGP / sitemap / robots に使います
- `DMM_AFFILIATE_LINK`
  DMM アフィリエイトのトラッキングURL
- `DMM_API_ID`
  DMM Web Service API ID
- `DMM_AFFILIATE_ID`
  API用アフィリエイトID
- `FANZA_FLOOR`
  既定フロア。通常は `videoa`
- `FANZA_DEFAULT_GENRE`
  デフォルトのジャンル slug
- `ANALYTICS_ID`
  Google Analytics の測定ID
- `GTM_ID`
  Google Tag Manager ID

補足:

- `SITE_URL` 未設定時はローカル安全値 `http://localhost:3000` にフォールバックします
- `SITE_URL` 未設定の build では robots を noindex 相当にし、sitemap は空で出します
- 本番公開前に `SITE_URL` は必ず設定してください

## Cloudflare Pages 設定

- Build command: `npm run build`
- Build output directory: `out`

補足:

- Cloudflare Pages の Git 連携ビルドはクリーンインストール前提です。`package.json` を変更したら、`package-lock.json` も必ず更新して一緒に commit してください。
- 依存追加後は `npm install` または `npm install --package-lock-only` を実行し、`npm ci && npm run build` が通る状態にしてから push してください。

必要な環境変数:

- `SITE_URL`
- `DMM_AFFILIATE_LINK`
- `DMM_API_ID`
- `DMM_AFFILIATE_ID`
- `FANZA_FLOOR`
- `FANZA_DEFAULT_GENRE`
- `ANALYTICS_ID` または `GTM_ID` は任意

`public/_headers` でセキュリティヘッダーを配信します。

## SEO 実装

- metadata API による title / description / canonical / OGP / Twitter Card
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `JsonLd` による `WebSite`
- レビュー詳細の `Review` 構造化データ

## テスト

```bash
npm test
```

主な対象:

- env 契約
- affiliate link helper
- age gate
- ルート metadata / static params
- ホーム導線
- 商品カード
- レビューデータ

## GitLab への初期 push

空の GitLab repo を作成したあとに:

```bash
git remote remove origin
git remote add origin https://gitlab.com/<user>/<repo>.git
git push -u origin main
```

HTTPS で push する場合は GitLab Personal Access Token を使います。

## 運用メモ

- DMM API が取れない場合でも、フォールバック作品データで一覧が空にならないようにしています
- アフィリエイトリンクは `src/lib/affiliate.ts` を経由して生成します
- 公開時は 18歳確認ゲート、上部開示表記、運営者情報ページをセットで確認してください
