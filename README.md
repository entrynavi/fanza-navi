# FANZAトクナビ

FANZA / DMM アフィリエイト向けの静的メディアです。  
公式カタログの代替ではなく、**シチュエーション検索・今夜の1本診断・セール解析・比較導線** を前面に出した構成にしています。

## 技術スタック

- Next.js 16 App Router (`output: "export"`)
- React 19
- Tailwind CSS v4
- Framer Motion
- Cloudflare Workers + D1
- Vitest + Testing Library
- Playwright
- Cloudflare Pages

## 主要導線

| URL | 役割 |
| --- | --- |
| `/` | ランキング、セール、独自導線をまとめたトップページ |
| `/discover` | **シチュエーション検索**。気分から探しつつ、今夜の1本診断も使える |
| `/buy-timing` | **買い時判定ツール**。買い時、予算内まとめ買い、次のセール波を確認する |
| `/watchlist` | **ウォッチリスト**。ブラウザ保存で作品を溜めて、値下げ候補や次候補まで管理する |
| `/personalized` | ウォッチリスト起点のパーソナライズフィード |
| `/search` | 検索入口。Workers 接続時は FANZA 全体検索、未接続時は 1,200 件超の高速モード |
| `/gacha` | ランダム提案。Workers 接続時は FANZA 全体母数、未接続時はローカル作品プール |
| `/trend-radar` | 急上昇・今夜向き・セール勢いをまとめて見る再訪導線 |
| `/deep-dive` | ウォッチリスト起点で女優・メーカー・シリーズを芋づる提案 |
| `/reviews` | みんなのおすすめ作品レビュー。Workers 接続時は共有レビューとして動作 |
| `/contact` | 問い合わせ・新機能募集フォーム。Workers 経由で受け付け、運営メールは非公開 |
| `/ranking` | 売上ランキング |
| `/custom-ranking` | 独自ランキング |
| `/sale` | セール作品一覧 |
| `/weekly-sale` | 今週のセールまとめ |
| `/guide` | 初心者向けの登録・支払い・お得な買い方ガイド |

## 独自機能

- `/daily-pick` 今日のおすすめ
- `/gacha` ランダム提案（Workers 接続時は FANZA 全体母数）
- `/trend-radar` 急上昇レーダー
- `/cospa-calc` コスパ計算
- `/price-history` 価格推移の確認
- `/sale-predict` 次のセール予測
- `/ranking-battle` 2作品比較
- `/series-guide` シリーズ導線
- `/sns-cards` SNS投稿用カード
- `/community-ranking` 投票型ランキング
- `/simulator` 月額 vs 単品比較

## ローカル起動

```bash
npm install
npm run dev
```

通常は `http://localhost:3000` で確認します。

## ビルド

```bash
npm run build
```

静的出力は `out/` に生成され、Cloudflare Pages ではこのディレクトリを配信します。

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
- `DMM_API_ID` - DMM Web Service API ID
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
- `NEXT_PUBLIC_WORKERS_API` 未設定時、`/search` はローカル高速モード、`/reviews` はブラウザ内保存、`/gacha` はローカル作品プール、`/contact` は接続待ち表示で動作します

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `out`

必要な環境変数:

- `SITE_URL`
- `DMM_AFFILIATE_LINK`
- `DMM_API_ID`
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
