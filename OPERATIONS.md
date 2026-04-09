# FANZAトクナビ 運用・自動化ガイド

> **最終更新:** フォールバックランキング補強・全作品ガチャ拡張・非公開問い合わせフォーム・急上昇レーダー文言調整まで反映した最新版

## 目次
1. [サイト構成](#サイト構成)
2. [品質保証（テスト）](#品質保証テスト)
3. [独自機能の整理案](#独自機能の整理案)
4. [Workers デプロイ手順](#workers-デプロイ手順)
5. [SNS運用戦略](#sns運用戦略)
6. [自動化設定](#自動化設定)
7. [日常運用チェックリスト](#日常運用チェックリスト)
8. [KPI管理](#kpi管理)
9. [コンテンツ更新スケジュール](#コンテンツ更新スケジュール)
10. [トラブルシューティング](#トラブルシューティング)
11. [サイトの使い方ガイド](#サイトの使い方ガイド)
12. [これからの1週間の詳細運用フロー](#これからの1週間の詳細運用フロー)
13. [AIへの指示テンプレート](#aiへの指示テンプレート運用自動化用)
14. [次フェーズ: Workers本番化ロードマップ](#次フェーズ-workers本番化ロードマップ)

---

## サイト構成

### 技術スタック
| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (Static Export) |
| ホスティング | Cloudflare Pages |
| ソースコード | GitLab (algernon3/fanza-navi) |
| API | DMM Web API v3 |
| Workers | Cloudflare Workers + D1 |
| スタイル | Tailwind CSS 4 |

### ページ一覧（主要導線）
| URL | 内容 | 更新頻度 |
|-----|------|----------|
| `/` | トップページ。ランキング・セール・独自導線の入口 | ビルド毎 |
| `/ranking` | 売上ランキングTOP50 | ビルド毎 |
| `/sale` | セール中の商品一覧 | ビルド毎 |
| `/weekly-sale` | 今週のセールまとめ | 週1回 |
| `/custom-ranking` | 独自ランキング（コスパ/隠れた名作/大幅値下げ/新人） | ビルド毎 |
| `/discover` | **シチュエーション検索**。気分から探しつつ、今夜の1本診断も使える | ビルド毎 |
| `/buy-timing` | **買い時判定ツール**。買い時、まとめ買い、次のセール波を確認 | ビルド毎 |
| `/watchlist` | **ウォッチリスト**。ブラウザ自動保存で作品・値下げ候補・次候補を管理 | リアルタイム |
| `/personalized` | ウォッチリスト起点のパーソナライズフィード | リアルタイム |
| `/deep-dive` | 同じ系統を深掘り。保存作品から女優・メーカー・シリーズを芋づる提案 | リアルタイム |
| `/trend-radar` | 急上昇・今夜向き・セール勢いの3軸で再訪価値を作るページ | ビルド毎 |
| `/actress-ranking` | 女優データベース+ランキング | ビルド毎 |
| `/maker-ranking` | メーカー比較ガイド | ビルド毎 |
| `/simulator` | 月額vs単品コスト比較シミュレーター | 静的 |
| `/community-ranking` | ユーザー投票ランキング | リアルタイム |
| `/new` | 新着作品 | ビルド毎 |
| `/search` | 作品検索。Workers接続時はFANZA全体、未接続時は1,200件超の高速モード | リアルタイム / ビルド毎 |
| `/reviews` | みんなのおすすめ作品レビュー。Workers接続時は共有レビュー | リアルタイム |
| `/guide` | 初心者完全ガイド（新規登録導線） | 月1回 |
| `/compare` | サービス比較 | 月1回 |
| `/articles/*` | 記事群（セールカレンダー/節約術/VR/支払い方法/比較） | 適宜 |
| `/daily-pick` | 今日のおすすめ（デイリーピック） | ビルド毎 |
| `/gacha` | ランダム提案。Workers接続時は FANZA 全体母数、未接続時はローカル作品プール | リアルタイム |
| `/cospa-calc` | コスパ計算機（分/円ランキング） | ビルド毎 |
| `/ranking-battle` | 2作品比較投票 | リアルタイム |
| `/series-guide` | シリーズ完走ガイド | ビルド毎 |
| `/sale-predict` | セール予測カレンダー | 週1回 |
| `/price-history` | 価格履歴チャート | ビルド毎 |
| `/sns-cards` | SNS共有カード自動生成 | リアルタイム |
| `/contact` | 問い合わせ・新機能募集フォーム。Workers経由で受け付け、運営メールは非公開 | 静的 |
| `/genre/*` | ジャンル別一覧 | ビルド毎 |
| `/actress/*` | 女優別ページ | ビルド毎 |
| `/maker/*` | メーカー別ページ | ビルド毎 |

### 現行の主導線

1. **シチュエーション検索 (`/discover`)**  
   SNSや検索流入で来たユーザーが、まず気分から候補を探す入口。
2. **今夜の1本診断 (`/discover#night-diagnosis`)**  
   迷っているユーザーに、今すぐ見る候補を3本まで先に絞って提示する導線。
3. **買い時判定ツール (`/buy-timing`)**  
   価格、割引率、次のセール時期、まとめ買い可否を見て離脱を減らす判断ページ。
4. **急上昇レーダー (`/trend-radar`)**  
   何を開けばいいか迷う再訪ユーザー向け。勢い・今夜向き・値下げ熱量を先に見せる。
5. **ウォッチリスト + 深掘り (`/watchlist` / `/deep-dive`)**  
   保存→関連掘り→次候補の流れを作る、継続利用の中核。
6. **全作品ガチャ (`/gacha`)**  
   迷い切って選べないユーザー向け。Workers接続時はFANZA全体から条件に合う候補を抽選。
7. **ランキング / セール / 週間セール / ガイド**  
   検索流入、新規登録導線、情報収集需要を拾う定番ページ群。

## 独自機能の整理案

> **提案のみ。まだ画面統合は未実施。**

### 推奨する見せ方

| まとめ先 | 含める機能 | 狙い |
|---|---|---|
| **探す** | `/search` `/discover` `/gacha` `/trend-radar` | 「今どう探すか」を1カ所にまとめ、初回訪問でも迷わせない |
| **比べる** | `/buy-timing` `/simulator` `/compare` `/ranking-battle` | 購入判断・比較判断を同じ文脈に寄せて離脱を減らす |
| **保存して追う** | `/watchlist` `/deep-dive` `/price-history` `/personalized` | 保存→関連候補→値下げ監視の流れを1本化して再訪理由を強くする |
| **みんなの声** | `/reviews` `/community-ranking` | レビュー投稿・投票・共感をひとつの導線にまとめる |
| **セール攻略** | `/sale` `/weekly-sale` `/sale-predict` `/guide` | 購入の背中を押す情報を分散させず、実利導線を強める |

### ページ単位の具体案

1. `/discover` に **「検索 / 気分で探す / ガチャ」** の3タブを寄せ、ランダム提案を孤立させない  
2. `/buy-timing` に **比較・月額vs単品・ランキングバトル** へのショートカットを集約し、「比較ハブ」にする  
3. `/watchlist` から **深掘り / 値下げ履歴 / パーソナライズ** へ進める構造にし、保存後の次行動を明確にする  
4. `/reviews` に **みんなの推しランキング** の抜粋を出し、投稿と閲覧の往復を増やす  
5. `/sale` に **週間まとめ / 次のセール予測 / 初心者向け買い方** の導線を足し、節約系の需要を1カ所で回す  

### いま残すべき独立ページ

- `/guide`: 新規登録導線として役割が明確  
- `/trend-radar`: 再訪理由が強く、SNSで切り出しやすい  
- `/contact`: 新機能募集の受け皿として独立価値がある  

### 環境変数（Cloudflare Pages）

---

## 品質保証（テスト）

### ユニットテスト（Vitest）
```bash
npx vitest run   # 100テスト / 15ファイル
```
カバー範囲: カタログローダー、アフィリエイトリンク生成、女優ランキング集計、サイト設定、全主要ページのレンダリング

### E2Eテスト（Playwright）
```bash
npx playwright test   # 92テスト（4ファイル）
```
カバー範囲:
- **全ページ基本チェック**（24ページ全て200応答・ヘッダー・フッター表示確認）
- **トップページ詳細**（ヒーロー・独自ツール・ランキング・セールセクション）
- **ナビゲーション完全性**（ヘッダー/フッターの全リンクが有効）
- **レスポンシブ**（モバイル375px/タブレット768px/デスクトップ1280pxで横スクロールなし）
- **独自機能ページ品質**（シチュ検索・独自ランキング・週間セール・シミュレーター）
- **SEO・メタデータ**（meta description・OGPタグ全ページ存在）
- **収益化チェック**（CTA配置・ガイドバナー・アフィリエイトリンク）
- **余白・レイアウト品質**（ヘッダー下の不要な空白なし）
- **日本語テキスト品質**（英語eyebrow残存チェック・価格¥表記）

### テスト実行（変更後の確認手順）
```bash
npm run build && npx vitest run && npx playwright test
```

### 追加の静的監査
- `out/` を対象に内部リンク・静的アセット欠落を走査
- 今回の確認結果: **Vitest 100/100、Playwright 92/92、`out/` の内部リンク欠落 0件**

---

### 環境変数（Cloudflare Pages）
| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DMM_API_ID` | DMM API ID | ✅ |
| `DMM_AFFILIATE_ID` | DMMアフィリエイトID | ✅ |
| `DMM_AFFILIATE_LINK` | アフィリンクベースURL | ✅ |
| `FANZA_FLOOR` | FANZAフロアコード | ✅ |
| `SITE_URL` | サイトURL (https://fanza-navi.pages.dev) | ✅ |
| `NEXT_PUBLIC_WORKERS_API` | Workers APIのURL | Workers使用時 |

補足:
- `DMM_API_ID` 未設定のローカル build はフォールバック作品を使うが、商品画像は生成カバー、遷移先は作品名ベースのFANZA検索リンクで補完されます
- `NEXT_PUBLIC_WORKERS_API` 未設定時、`/search` はローカル高速モード、`/reviews` はブラウザ内保存、`/gacha` はローカル商品プール、`/contact` は接続待ち表示で動作します
- `/contact` を本番運用するには `NEXT_PUBLIC_WORKERS_API` と Workers `/api/contact` の両方が必須です

---

## Workers デプロイ手順

### 1. 初期セットアップ

```bash
cd workers/

# Wrangler CLIインストール
npm install

# Cloudflareにログイン
npx wrangler login

# D1データベース作成
npx wrangler d1 create fanza-otonavi

# wrangler.toml の database_id を返された値に更新

# テーブル作成
npx wrangler d1 execute fanza-otonavi --file=schema.sql

# 既存DBを使っている場合も、schema.sql を再実行して
# reviews / review_helpful_votes / contact_messages など新テーブルを反映
npx wrangler d1 execute fanza-otonavi --remote --file=schema.sql
```

現状メモ:
- この作業環境では `npx wrangler whoami` が **未認証** を返しました
- `workers/wrangler.toml` の `database_id` はまだ placeholder なので、そのままでは deploy できません

### 2. Workers環境変数

```bash
# DMM API認証情報
npx wrangler secret put DMM_API_ID
npx wrangler secret put DMM_AFFILIATE_ID

# CORS設定（本番サイトURL）
npx wrangler secret put CORS_ORIGIN
# → https://fanza-navi.pages.dev

# X/Twitter Bot用（オプション）
npx wrangler secret put X_BEARER_TOKEN

# Web Push用VAPID鍵（オプション）
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

### 3. デプロイ

```bash
npm run doctor
npm run db:migrate:remote
npm run deploy:prod
```

### 4. Next.js側の設定
Cloudflare Pagesの環境変数に追加：
```
NEXT_PUBLIC_WORKERS_API=https://fanza-navi-worker.your-subdomain.workers.dev
```

### 5. Workers有効化で本番反映される機能
- `/search`: `GET /api/search` を使った **FANZA全体検索**
- `/reviews`: `GET /api/reviews` / `POST /api/reviews` / helpful vote / delete による **共有レビュー**
- `/gacha`: `GET /api/search` を使った **FANZA全体母数での抽選**
- `/contact`: `POST /api/contact` を使った **非公開問い合わせフォーム**
- `/community-ranking`: 投票系のリアルタイム集計
- `/price-history`: D1 に蓄積した価格履歴の表示

Workers未接続でもサイトは動きますが、**全作品検索・全作品ガチャ・ブラウザをまたいだレビュー共有・非公開問い合わせフォーム** は本番Workers前提です。

現行本番メモ:
- Worker URL: `https://fanza-otonavi-api.chidori0543.workers.dev`
- D1: `fanza-otonavi`（`3882d698-a33e-43d9-a159-337243bb43f2`）
- Pages production secret `NEXT_PUBLIC_WORKERS_API` は設定済み

---

## SNS運用戦略

### X (Twitter) アカウント運用

#### プロフィール設定
- **名前**: FANZAトクナビ｜セール速報＆お得情報
- **bio**: FANZAのセール・キャンペーン情報を毎日自動配信🔥 お得な買い方・隠れた名作を紹介中。公式にない切り口でFANZAを100倍楽しむ情報サイト
- **リンク**: https://fanza-navi.pages.dev
- **固定ツイート**: 「初めてFANZAを使う方へ → /guide」の誘導

#### 投稿戦略

##### 毎日の自動投稿（Workers Sale Botが自動化）
1. **朝6時** — 「今日のFANZAセール速報」
   - 30%OFF以上の注目作品3〜5本
   - 画像は作品サムネ（OGPカード自動生成）
   - リンクは `/weekly-sale` へ

2. **昼12時** — 「今日の隠れた名作」＆「今日のおすすめ」
   - `/custom-ranking` の隠れた名作から1作品
   - `/daily-pick` の今日のおすすめ作品
   - レビュー内容の要約＋おすすめポイント

3. **夜20時** — 「今日のランキングTOP3」
   - `/ranking` から上位3作品
   - 前日比の順位変動

4. **不定期** — 独自ツール紹介（新機能の認知拡大）
   - ガチャ、買い時判定、コスパ計算機、ランキングバトルなどを日替わりで紹介
   - `/sns-cards` で生成した画像カードをSNS投稿に活用

##### 週次コンテンツ（手動 or 半自動）
- **月曜**: 「今週のFANZAセール完全まとめ」 → `/weekly-sale`
- **火曜**: 「コスパ最強作品ランキング更新」 → `/cospa-calc`
- **水曜**: 「シチュエーション別おすすめ」 → `/discover`
- **木曜**: 「ランキングバトル結果発表＆新お題」 → `/ranking-battle`
- **金曜**: 「今週のコスパ最強作品」 → `/custom-ranking`
- **土曜**: 「シリーズ完走チャレンジ」 → `/series-guide`
- **日曜**: 「来週のセール予想」 → `/sale-predict`

##### 月次コンテンツ
- 月初: 「先月の売上ランキングTOP20振り返り」
- 月中: 「今月の隠れた名作5選」
- 月末: 「来月のセール予想＆お得な買い方」

#### エンゲージメント施策
- **投票機能の告知**: 「あなたの推し作品に投票 → /community-ranking」
- **リプライ対応**: セール情報への質問に回答（サイトへ誘導）
- **ハッシュタグ**: #FANZA #FANZAセール #FANZA割引 #FANZAトクナビ

### SNS自動化ツール

#### X API設定（Sale Bot連携）
1. [X Developer Portal](https://developer.twitter.com/) でアプリ作成
2. OAuth 2.0 Bearer Tokenを取得
3. Workers環境変数 `X_BEARER_TOKEN` に設定
4. Workers Cronが毎日6時（JST）に自動投稿

#### その他のSNSプラットフォーム
- **Reddit**: r/FANZA等のコミュニティにセール情報を投稿
- **5ch/爆サイ**: セール情報のまとめスレにリンク
- **note**: 長文の比較記事・ガイド記事を転載（被リンク獲得）

---

## 自動化設定

### 1. Cloudflare Pages自動ビルド
GitLabへのpushで自動ビルド・デプロイ（設定済み）

#### 定期ビルドの追加（API情報を最新に保つ）
GitLab CI/CDに以下を追加して1日1回自動ビルド：

```yaml
# .gitlab-ci.yml
stages:
  - trigger

daily-rebuild:
  stage: trigger
  rules:
    - if: $CI_PIPELINE_SOURCE == "schedule"
  script:
    - curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<HOOK_ID>"
```

GitLab → Settings → CI/CD → Pipeline schedules で毎日6:00 JSTにスケジュール設定。

### 2. Workers Cron Jobs
`workers/wrangler.toml` に設定済み：
```toml
[triggers]
crons = ["0 21 * * *"]  # UTC 21:00 = JST 6:00
```

Cronが実行する処理：
1. DMM APIから全商品の現在価格を取得 → D1に記録（価格トラッカー）
2. 前日比30%以上の値下げ商品を検出 → セールアラート
3. X/Twitterに自動投稿（X_BEARER_TOKEN設定時）

### 3. Web Push通知
ユーザーがPWAインストール→通知許可した場合：
- Workers CronでセールアラートをPush送信
- VAPID鍵の生成方法：
```bash
npx web-push generate-vapid-keys
```

### 4. 価格トラッカーのデータ蓄積
- Workers Cronが毎日価格を記録
- 1ヶ月分のデータが溜まれば `/price-history` ページで価格推移を表示可能
- 「この作品は先月XX%安かった」等のインサイトが提供可能に

---

## 日常運用チェックリスト

### 毎日（5分）
- [ ] サイトの表示確認（https://fanza-navi.pages.dev）
- [ ] Workers Cronの実行ログ確認（Cloudflare Dashboard → Workers → Logs）
- [ ] X投稿の自動投稿確認
- [ ] アフィリエイト管理画面の売上確認

### 毎週（30分）
- [ ] 週間セールページの内容確認
- [ ] Google Search Consoleのインデックス状況確認
- [ ] Xアカウントのフォロワー推移確認
- [ ] サイトのアクセス解析確認（Cloudflare Analytics）
- [ ] エラーログの確認

### 毎月（1時間）
- [ ] アフィリエイト収益レポート作成
- [ ] 人気ページ・離脱率の分析
- [ ] SEO対策の見直し（KW順位チェック）
- [ ] 記事コンテンツの更新（セールカレンダー等）
- [ ] 新しいジャンルや女優ページの追加検討
- [ ] Workers D1のデータ量確認

---

## KPI管理

### 主要KPI

| 指標 | 目標（初月） | 目標（3ヶ月） | 目標（6ヶ月） |
|------|------------|-------------|-------------|
| PV/月 | 5,000 | 30,000 | 100,000 |
| UU/月 | 2,000 | 10,000 | 40,000 |
| アフィ売上/月 | ¥10,000 | ¥50,000 | ¥200,000 |
| 新規紹介数/月 | 10件 | 50件 | 200件 |
| Xフォロワー | 500 | 2,000 | 5,000 |
| 検索流入/月 | 500 | 5,000 | 30,000 |

### 収益構造
| 収益源 | 単価 | 期待月間件数 | 月間収益 |
|--------|------|------------|---------|
| 新規紹介（初回購入） | ¥1,050 | 50件 | ¥52,500 |
| 商品購入アフィ | 購入額の10% | - | ¥30,000〜 |
| 月額サービス紹介 | 初月¥500〜 | 20件 | ¥10,000 |

### 分析ツール
- **Cloudflare Analytics**: PV/UU/地域（無料・設定済み）
- **Google Search Console**: 検索順位・インデックス状況
- **DMMアフィリエイト管理画面**: 売上・クリック数・CVR
- **X Analytics**: ツイートインプレッション・エンゲージメント

---

## コンテンツ更新スケジュール

### 自動更新（ビルド時）
- ランキング（DMM API sort=rank）
- セール商品（DMM API 割引検出）
- 新着作品（DMM API sort=date）
- 週間セールまとめ
- 独自ランキング4種

### 手動更新（月1回推奨）
| コンテンツ | 更新内容 | 所要時間 |
|-----------|---------|---------|
| セールカレンダー | 来月のセール予想追加 | 15分 |
| 初心者ガイド | クーポン情報の最新化 | 10分 |
| サービス比較 | 料金・サービス内容の更新 | 20分 |
| VRガイド | 新デバイス情報の追加 | 15分 |

### コンテンツ拡充（長期）
- 女優個別ページの拡充（プロフィール・おすすめ作品）
- ジャンル解説記事の追加
- 季節イベント別のおすすめ記事
- ユーザーレビューの集約ページ

---

## トラブルシューティング

### ビルドが失敗する場合
```bash
# ローカルで確認
npm run build

# DMM APIのレート制限に引っかかった場合
# → 5分待ってから再ビルド

# TypeScriptエラー
npx tsc --noEmit
```

### Workers Cronが動かない場合
```bash
# ログ確認
npx wrangler tail

# 手動実行テスト
curl https://your-worker.workers.dev/api/cron-test
```

### 画像が表示されない場合
- DMM APIの画像URLは `pics.dmm.co.jp` ドメイン
- Cloudflare Pagesでは外部画像のプロキシ不要（直リンクOK）
- `next.config.mjs` の `images.remotePatterns` を確認

### アフィリエイトリンクが機能しない場合
- `DMM_AFFILIATE_ID` 環境変数を確認
- `src/lib/affiliate.ts` の `buildAffiliateUrl()` をチェック
- DMMアフィリエイト管理画面でサイト登録状況を確認

---

## 今後のロードマップ

### 短期（1〜2ヶ月）
1. Workers本番デプロイ（価格トラッカー・セールBot稼働開始）
2. X自動投稿の開始
3. Google Search Consoleでのサイトマップ送信
4. PWAアイコン（192x192, 512x512）の作成・設置
5. VAPID鍵生成・Push通知の本番稼働

### 中期（3〜6ヶ月）
1. 価格履歴データの蓄積→価格トラッカーページ公開
2. コミュニティランキングの本格運用
3. 女優・メーカーページの大幅拡充
4. 記事コンテンツの定期追加（月2本目標）
5. 被リンク獲得施策（note/まとめサイトへの転載）

### 長期（6ヶ月〜）
1. 独自ドメイン取得・移行
2. Google AdSense併用（アフィリ+広告のハイブリッド収益）
3. メルマガ/LINE配信の検討
4. APIデータを使ったAI推薦機能
5. 多言語対応（英語・中国語）の検討

---

## サイトの使い方ガイド

### まず見るべき順番
1. **トップページ**で今のセール・ランキング・独自導線を確認する
2. **シチュエーション検索**で「今日は何を見るか」を絞る
3. **今夜の1本診断**で候補を3本程度まで圧縮する
4. **急上昇レーダー**で今動いている作品と今夜向きの作品を確認する
5. **買い時判定ツール**で価格・割引率・まとめ買い候補を比較する
6. **ウォッチリスト**に保存して、必要なら **同じ系統を深掘り** で候補を増やす
7. **みんなのおすすめ作品レビュー**で最後の一押しを確認する

### ユーザー別の誘導
| ユーザー状態 | 入口に使うページ | 目的 |
| --- | --- | --- |
| 初めてFANZAを使う人 | `/guide` | 登録・支払い・初回購入に繋げる |
| 何を買うか迷っている人 | `/discover` | 気分・予算・セールで候補を出す |
| 作品名や女優名が決まっている人 | `/search` | FANZA全体検索または高速モードで直接探す |
| 安く買いたい人 | `/sale` / `/weekly-sale` / `/buy-timing` | 割引と買い時を見せる |
| また使いたい人 | `/watchlist` / `/deep-dive` / `/trend-radar` | 保存作品の延長線で再訪させる |
| 最後に背中を押してほしい人 | `/reviews` | 他ユーザーの感想で不安を減らす |
| 比較して決めたい人 | `/custom-ranking` / `/ranking-battle` | 公式にない切り口で比較させる |

### 運用側の見方
- ホームの訴求で強く出すのは **シチュエーション検索 / 今夜の1本診断 / 急上昇レーダー / 買い時判定 / ウォッチリスト**
- 単発SNS投稿は `/weekly-sale` と `/daily-pick` が最も作りやすい
- 固定導線は `/guide`、回遊導線は `/discover` と `/watchlist`、再訪導線は `/trend-radar` と `/deep-dive`

---

## これからの1週間の詳細運用フロー

### Day 1
- `npm run build && npm test && npm run test:e2e`
- Cloudflare Pages の環境変数 `SITE_URL / DMM_AFFILIATE_LINK / DMM_API_ID / DMM_AFFILIATE_ID / FANZA_FLOOR / NEXT_PUBLIC_WORKERS_API` を再確認
- Workers を使う場合は `cd workers && npx wrangler deploy` を実行し、`schema.sql` の反映漏れがないか確認
- X プロフィール、固定ポスト、リンク先を `/guide` または `/weekly-sale` に合わせる

### Day 2
- `/weekly-sale` から高割引作品を抜き出して X 投稿を3本作成
- `/discover` の「今夜の1本診断」か `/trend-radar` を紹介する短尺投稿を作成
- Google Search Console に sitemap を再送信

### Day 3
- `/buy-timing` の「まとめ買い候補」と「次のセール波」を使って比較投稿を作る
- `/custom-ranking` の上位作品で「公式にない切り口」投稿を作る

### Day 4
- `/watchlist` と `/deep-dive` の導線を使った再訪訴求を投稿
- 価格や画像が欠けていないか、セール作品リンクが正しいか、`/reviews` 投稿が共有されるかを目視確認

### Day 5
- `/guide` から登録導線の文言とCTAを見直す
- Search Console の検索クエリを見て、`/articles/*` と `/search` の見出しや description を微修正

### Day 6
- `community-ranking` / `ranking-battle` / `/reviews` を使った参加型投稿を出す
- 反応が良かった切り口を翌週の固定フォーマットに昇格させる

### Day 7
- 1週間分の PV、クリック、CV、保存数を整理
- クリック率の高かった投稿から、次週の `weekly-sale / guide / discover` 訴求軸を決める

---

---

## AIへの指示テンプレート（運用自動化用）

### 週間セールまとめ記事のSNS投稿文を作成
```
以下のデータを元に、Twitter/X用の投稿文（140文字以内）を3パターン作って。
・今週のセール対象数: ○○件
・最大割引率: ○○%OFF
・注目作品: [タイトル]
・サイトURL: https://fanza-navi.pages.dev/weekly-sale
ハッシュタグ不要。数字と具体性で目を引く文面にして。
```

### 新機能の紹介投稿を作成
```
FANZAトクナビの以下の機能を紹介するTwitter投稿文を3パターン作って。
・機能名: [機能名]
・機能URL: https://fanza-navi.pages.dev/[パス]
・機能の特徴: [特徴]
140文字以内。公式にはない独自機能であることを強調。
```

### 新規記事コンテンツの作成
```
FANZAアフィリエイトサイト用の記事を書いて。
テーマ: [テーマ名]
ターゲットキーワード: [キーワード]
文字数: 3000〜5000字
構成:
- リード文（課題提起）
- 本文（具体的な解説、比較表を含む）
- まとめ（CTAへの誘導）
全てのFANZAへのリンクにアフィリエイトIDを含めること。
```

### DMM APIデータの分析
```
DMM Web API v3 の ItemList エンドポイントで取得した以下のデータを分析して。
[APIレスポンスを貼り付け]
・割引率が高い順にTOP10をリストアップ
・ジャンル別の平均割引率
・SNS投稿用の「今週のお得情報」サマリーを作成
```

### サイト改善の依頼
```
/Users/thisdevice/dmm-affiliate-site を開いて、以下の改善を行って:
1. [具体的な改善内容]
2. [具体的な改善内容]
ビルド（npm run build）とテスト（npx vitest run && npx playwright test）が通ることを確認して、GitLabにpushして。
```

### Cloudflare Workers の更新
```
/Users/thisdevice/dmm-affiliate-site/workers を開いて、以下の機能を追加して:
1. [機能の説明]
テスト後に `cd workers && npx wrangler deploy` でデプロイして。
```

### デイリーピック投稿の自動化
```
FANZAトクナビの「今日のおすすめ」ページ（/daily-pick）の作品情報から、
Twitter投稿文を1つ作って。
・作品タイトル
・価格
・おすすめポイント（1文）
・リンク: https://fanza-navi.pages.dev/daily-pick
140文字以内で。
```

---

## 次フェーズ: Workers本番化ロードマップ

### 🔴 最優先（Workers D1本番データ化）

| # | タスク | 内容 |
|---|--------|------|
| 1 | Workers D1 本番デプロイ | **共有レビュー / 全作品検索 / 価格履歴** の本番稼働開始 |
| 2 | Cronジョブ稼働 | 毎日6時のAPI取得→D1記録 |
| 3 | セール自動検知 | 前日比30%以上の値下げを自動検出 |
| 4 | X自動投稿Bot | セール検知→自動ツイート |
| 5 | Push通知 | ウォッチリスト値下げ時にブラウザ通知 |

### 🟡 中期（コンテンツ拡充）

| # | タスク | 内容 |
|---|--------|------|
| 6 | 女優個別ページ拡充 | 各女優のプロフィール・代表作品・最新作 |
| 7 | ジャンル解説記事 | 各ジャンルの特徴・おすすめ・入門作品 |
| 8 | 季節イベント記事 | バレンタイン・夏休み等のおすすめ特集 |
| 9 | 独自ドメイン取得 | SEO・ブランディング強化 |

### 🟢 長期

| # | タスク | 内容 |
|---|--------|------|
| 10 | GA4導入 | 詳細なユーザー行動分析 |
| 11 | AI推薦エンジン | Workers AI + ベクトルDBで本格レコメンド |
| 12 | メルマガ/LINE配信 | セール速報の定期配信 |
| 13 | 多言語対応 | 英語版の検討 |

### 実装の指示テンプレート
```
/Users/thisdevice/dmm-affiliate-site を開いて、Phase 6の以下のタスクを実装して:
1. [タスク内容]
ビルド・テスト通してからGitLabにpush。
```
