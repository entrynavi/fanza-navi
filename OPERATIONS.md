# FANZAオトナビ 運用・自動化ガイド

## 目次
1. [サイト構成](#サイト構成)
2. [Workers デプロイ手順](#workers-デプロイ手順)
3. [SNS運用戦略](#sns運用戦略)
4. [自動化設定](#自動化設定)
5. [日常運用チェックリスト](#日常運用チェックリスト)
6. [KPI管理](#kpi管理)
7. [コンテンツ更新スケジュール](#コンテンツ更新スケジュール)
8. [トラブルシューティング](#トラブルシューティング)

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

### ページ一覧（全29ページ）
| URL | 内容 | 更新頻度 |
|-----|------|----------|
| `/` | トップページ（ランキング・新作・セール） | ビルド毎 |
| `/ranking` | 売上ランキングTOP50 | ビルド毎 |
| `/sale` | セール中の商品一覧 | ビルド毎 |
| `/weekly-sale` | 今週のセールまとめ | 週1回 |
| `/custom-ranking` | 独自ランキング（コスパ/隠れた名作/大幅値下げ/新人） | ビルド毎 |
| `/discover` | シチュエーション別逆引き検索 | ビルド毎 |
| `/actress-ranking` | 女優データベース+ランキング | ビルド毎 |
| `/maker-ranking` | メーカー比較ガイド | ビルド毎 |
| `/simulator` | 月額vs単品コスト比較シミュレーター | 静的 |
| `/community-ranking` | ユーザー投票ランキング | リアルタイム |
| `/new` | 新着作品 | ビルド毎 |
| `/search` | 作品検索 | ビルド毎 |
| `/guide` | 初心者完全ガイド（新規登録導線） | 月1回 |
| `/compare` | サービス比較 | 月1回 |
| `/articles/*` | 記事群（セールカレンダー/節約術/VR/支払い方法） | 適宜 |
| `/genre/*` | ジャンル別一覧 | ビルド毎 |
| `/actress/*` | 女優別ページ | ビルド毎 |
| `/maker/*` | メーカー別ページ | ビルド毎 |

### 環境変数（Cloudflare Pages）
| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DMM_API_ID` | DMM API ID | ✅ |
| `DMM_AFFILIATE_ID` | DMMアフィリエイトID | ✅ |
| `DMM_AFFILIATE_LINK` | アフィリンクベースURL | ✅ |
| `FANZA_FLOOR` | FANZAフロアコード | ✅ |
| `SITE_URL` | サイトURL (https://fanza-navi.pages.dev) | ✅ |
| `NEXT_PUBLIC_WORKERS_API` | Workers APIのURL | Workers使用時 |

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
npx wrangler d1 create fanza-navi-db

# wrangler.toml の database_id を返された値に更新

# テーブル作成
npx wrangler d1 execute fanza-navi-db --file=schema.sql
```

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
npx wrangler deploy
```

### 4. Next.js側の設定
Cloudflare Pagesの環境変数に追加：
```
NEXT_PUBLIC_WORKERS_API=https://fanza-navi-worker.your-subdomain.workers.dev
```

---

## SNS運用戦略

### X (Twitter) アカウント運用

#### プロフィール設定
- **名前**: FANZAオトナビ｜セール速報＆お得情報
- **bio**: FANZAのセール・キャンペーン情報を毎日自動配信🔥 お得な買い方・隠れた名作を紹介中。公式にない切り口でFANZAを100倍楽しむ情報サイト
- **リンク**: https://fanza-navi.pages.dev
- **固定ツイート**: 「初めてFANZAを使う方へ → /guide」の誘導

#### 投稿戦略

##### 毎日の自動投稿（Workers Sale Botが自動化）
1. **朝6時** — 「🔥今日のFANZAセール速報」
   - 30%OFF以上の注目作品3〜5本
   - 画像は作品サムネ（OGPカード自動生成）
   - リンクは `/weekly-sale` へ

2. **昼12時** — 「💎今日の隠れた名作」
   - `/custom-ranking` の隠れた名作から1作品
   - レビュー内容の要約＋おすすめポイント

3. **夜20時** — 「📊今日のランキングTOP3」
   - `/ranking` から上位3作品
   - 前日比の順位変動

##### 週次コンテンツ（手動 or 半自動）
- **月曜**: 「今週のFANZAセール完全まとめ」 → `/weekly-sale`
- **水曜**: 「シチュエーション別おすすめ」 → `/discover`
- **金曜**: 「今週のコスパ最強作品」 → `/custom-ranking`
- **日曜**: 「来週のセール予想」 → `/articles/sale-calendar`

##### 月次コンテンツ
- 月初: 「先月の売上ランキングTOP20振り返り」
- 月中: 「今月の隠れた名作5選」
- 月末: 「来月のセール予想＆お得な買い方」

#### エンゲージメント施策
- **投票機能の告知**: 「あなたの推し作品に投票 → /community-ranking」
- **リプライ対応**: セール情報への質問に回答（サイトへ誘導）
- **ハッシュタグ**: #FANZA #FANZAセール #FANZA割引 #FANZAオトナビ

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
