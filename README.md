# FANZAトクナビ

迷ったら、ここで今夜の1本を。  
21万件超のFANZA作品を独自の切り口で検索・比較・レコメンドできる無料ツール集です。

## 技術スタック

- Next.js 16 App Router (`output: "export"`)
- React 19
- Tailwind CSS v4
- Framer Motion
- Cloudflare Workers + D1（レビュー・問い合わせ・投票用）
- 静的カタログ（21万件・FANZA GraphQL から nightly 生成）
- Vitest + Testing Library
- Playwright
- Cloudflare Pages

## サイト構成（3ハブ）

### 探す・決める

| URL | 役割 |
| --- | --- |
| `/search` | **作品検索**。21万件超の静的カタログからブラウザ内高速検索 |
| `/discover` | **シチュエーション検索**。気分から探しつつ、今夜の1本診断も使える |
| `/daily-pick` | 今日のおすすめ |
| `/gacha` | ランダム提案。21万件超の静的カタログから抽選 |
| `/trend-radar` | 急上昇・今夜向き・セール勢いをまとめて見る再訪導線 |
| `/personalized` | ウォッチリスト起点のパーソナライズフィード |
| `/deep-dive` | ウォッチリスト起点で女優・メーカー・シリーズを芋づる提案 |

### ランキング・比較

| URL | 役割 |
| --- | --- |
| `/custom-ranking` | 独自ランキング（コスパ・隠れ名作・大幅値下げ・新人注目） |
| `/ranking` | 売上ランキング |
| `/community-ranking` | 投票型ランキング |
| `/actress-ranking` | 女優ランキング |
| `/maker-ranking` | メーカー比較ガイド |
| `/cospa-calc` | コスパ計算機 |
| `/reviews` | みんなのおすすめ作品レビュー（Workers 接続時は共有） |

### セール・買い時

| URL | 役割 |
| --- | --- |
| `/weekly-sale` | 今週のセールまとめ |
| `/buy-timing` | 買い時判定ツール |
| `/sale-predict` | セール予測カレンダー |
| `/price-history` | 価格履歴チャート |
| `/sale` | セール作品一覧 |
| `/simulator` | 月額 vs 単品コスト比較 |

### その他

| URL | 役割 |
| --- | --- |
| `/watchlist` | ウォッチリスト（ブラウザ保存） |
| `/sns-cards` | SNS共有カード生成 |
| `/guide` | 初心者ガイド |
| `/contact` | 問い合わせ・新機能募集（Workers 経由） |

## ローカル起動

```bash
npm install
npm run dev
```

通常は `http://localhost:3000` で確認します。

## ビルド

```bash
# 通常ビルド（事前にカタログ生成済みの場合）
npm run build

# カタログ生成 + ビルド（本番デプロイ用）
npm run build:full

# カタログのみ生成
npm run catalog:build
```

静的出力は `out/` に生成され、Cloudflare Pages ではこのディレクトリを配信します。  
カタログは `public/catalog/` に生成されます（gitignored、デプロイ時に `build:full` で生成）。

## テスト

```bash
npm test
npm run test:e2e
```

## 環境変数

`.env.example` をコピーして使います。

```bash
cp .env.example .env.local
```

主な変数:

- `SITE_URL` - canonical / OGP / sitemap 用の本番 URL
- `DMM_AFFILIATE_LINK` - DMM アフィリエイトのトラッキング URL
- `DMM_API_ID` - DMM Web Service API ID（ビルド時のDMM API取得や、Workerの価格追跡系を使う場合）
- `DMM_AFFILIATE_ID` - API 用アフィリエイト ID
- `FANZA_FLOOR` - 通常は `videoa`
- `FANZA_DEFAULT_GENRE` - 既定ジャンル slug
- `ANALYTICS_ID` - Google Analytics ID
- `GTM_ID` - Google Tag Manager ID
- `NEXT_PUBLIC_WORKERS_API` - Workers API の URL（Workers 導入時）

補足:

- `SITE_URL` 未設定時は `http://localhost:3000` を使います
- `SITE_URL` 未設定の build では sitemap は空、robots は noindex 相当で出力します
- アフィリエイトリンクは `src/lib/affiliate.ts` を通して生成します
- `DMM_API_ID` 未設定のローカル build はフォールバック作品を使いますが、商品画像は生成カバー、CTA は作品名ベースの FANZA 検索リンクで補完されます
- `/search` と `/gacha` は静的カタログ（21万件超）をブラウザ内で検索・抽選するため Workers リクエストを消費しません
- `NEXT_PUBLIC_WORKERS_API` 未設定時、`/reviews` はブラウザ内保存、`/contact` は接続待ち表示で動作します

## Cloudflare Pages

- Build command: `npm run build:full`
- Build output directory: `out`

必要な環境変数:

- `SITE_URL`
- `DMM_AFFILIATE_LINK`
- `DMM_API_ID`（任意: DMM API を使う build/runtime 補助機能向け）
- `DMM_AFFILIATE_ID`
- `FANZA_FLOOR`
- `FANZA_DEFAULT_GENRE`

## Workers 補助コマンド

```bash
cd workers
npm run doctor           # Cloudflare認証とD1 database_idの事前チェック
npm run db:migrate:remote
npm run deploy:prod
```

現在の production Worker:

- `https://fanza-otonavi-api.chidori0543.workers.dev`

## 運用メモ

- DMM API が取れない場合でもフォールバックデータで一覧が空になりにくく、トップランキングも生成カバー画像つきで崩れにくい構成です
- `workers/wrangler.toml` の D1 `database_id` を実値に差し替え、`wrangler login` 後に `schema.sql` を再適用しないと `/contact` と共有機能は本番接続できません
- 18歳確認ゲート、ヘッダー開示表記、運営情報ページは公開前の確認対象です
- 運用フローや SNS 自動化は `OPERATIONS.md` を参照してください
