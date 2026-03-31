# FANZAおすすめ作品ナビ

FANZA（DMM）アフィリエイトサイト — 人気ランキング・新作・セール情報を毎日自動更新

**🌐 Live:** <https://chidori0543-sys.github.io/fanza-navi/>

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (Static Export) |
| スタイル | Tailwind CSS v4 |
| アニメーション | Framer Motion |
| デプロイ | GitHub Pages + GitHub Actions |
| API | DMM FANZA Affiliate API v3 |

## ページ構成（全11ページ）

| パス | 内容 |
|------|------|
| `/` | トップページ（ランキング・セール・ジャンルフィルター） |
| `/ranking` | 総合ランキング |
| `/new` | 新作リリース |
| `/sale` | セール商品 |
| `/search` | 作品検索 |
| `/guide` | FANZA初心者ガイド（SEO記事） |
| `/compare` | VR vs 通常 / サブスク比較（SEO記事） |
| `/terms` | 利用規約 |
| `/privacy` | プライバシーポリシー |
| `/about` | 運営者情報・特定商取引法表記 |
| `404` | カスタムエラーページ |

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー
npm run dev

# ビルド（静的エクスポート）
npm run build

# ビルド結果の確認
npx serve out
```

## 環境変数

GitHub Actions Secrets または `.env.local` に設定:

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DMM_API_ID` | DMM API ID（審査承認後に取得） | ビルド時 |
| `DMM_AFFILIATE_ID` | DMMアフィリエイトID | ビルド時 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 測定ID | 任意 |

### DMM API キー設定手順

1. [DMM アフィリエイト](https://affiliate.dmm.com/) で審査承認後、API IDを取得
2. GitHub リポジトリ → Settings → Secrets and variables → Actions
3. `DMM_API_ID` と `DMM_AFFILIATE_ID` を追加
4. Actions タブから Deploy workflow を手動実行（または次回の自動デプロイを待つ）

## 自動デプロイ

- **トリガー:** `main` ブランチへの push + 毎日 0:00 UTC（JST 9:00）のcron
- **処理:** DMM API から最新データ取得 → 静的ビルド → GitHub Pages デプロイ
- **ワークフロー:** `.github/workflows/deploy.yml`

## コンバージョン最適化機能

- **スティッキーCTA** — スクロール時に追従するアクションバー
- **ソーシャルプルーフ** — リアルタイム閲覧数・購入カウンター・トースト通知
- **カウントダウンタイマー** — セール終了までの緊急性表示
- **離脱防止ポップアップ** — マウスが画面外に出た時のリテンション
- **関連商品レコメンド** — クロスセル・回遊率向上
- **ジャンルフィルター** — ワンクリックでジャンル絞り込み

## SEO対策

- `robots.txt` + `sitemap.xml`（全ページ網羅）
- JSON-LD 構造化データ (WebSite + SearchAction)
- OGP / Twitter Cards メタタグ + OGP画像
- セマンティック HTML + アクセシビリティ
- SEO記事2本（初心者ガイド・比較表）

## セキュリティ

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## ライセンス

Private — All rights reserved.
