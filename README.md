# FANZAトクナビ

FANZA / DMM アフィリエイト向けの静的メディアです。  
公式カタログの代替ではなく、**シチュエーション検索・今夜の1本診断・セール解析・比較導線** を前面に出した構成にしています。

## 技術スタック

- Next.js 16 App Router (`output: "export"`)
- React 19
- Tailwind CSS v4
- Framer Motion
- Vitest + Testing Library
- Playwright
- Cloudflare Pages

## 主要導線

| URL | 役割 |
| --- | --- |
| `/` | ランキング、セール、独自導線をまとめたトップページ |
| `/discover` | **シチュエーション検索**。気分から探しつつ、今夜の1本診断も使える |
| `/buy-timing` | **買い時判定ツール**。買い時、予算内まとめ買い、次のセール波を確認する |
| `/watchlist` | **ウォッチリスト**。保存作品、値下げ候補、次に見る候補を整理する |
| `/personalized` | ウォッチリスト起点のパーソナライズフィード |
| `/search` | 検索入口。ジャンル、並び替え、絞り込みの基本導線 |
| `/ranking` | 売上ランキング |
| `/custom-ranking` | 独自ランキング |
| `/sale` | セール作品一覧 |
| `/weekly-sale` | 今週のセールまとめ |
| `/guide` | 初心者向けの登録・支払い・お得な買い方ガイド |

## 独自機能

- `/daily-pick` 今日のおすすめ
- `/gacha` ランダム提案
- `/cospa-calc` コスパ計算
- `/price-history` 価格推移の確認
- `/sale-predict` 次のセール予測
- `/ranking-battle` 2作品比較
- `/series-guide` シリーズ導線
- `/sns-cards` SNS投稿用カード
- `/community-ranking` 投票型ランキング
- `/savings-tips` 節約の見方まとめ
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

## 運用メモ

- DMM API が取れない場合でもフォールバックデータで一覧が空になりにくい構成です
- 18歳確認ゲート、ヘッダー開示表記、運営情報ページは公開前の確認対象です
- 運用フローや SNS 自動化は `OPERATIONS.md` を参照してください
