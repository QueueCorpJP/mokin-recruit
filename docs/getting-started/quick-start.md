# ⚡ Quick Start Guide - Mokin Recruit

## 🎯 5分で開発開始

このガイドに従って、最短でMokin Recruitの開発を開始できます。

---

## 📋 前提条件

- **Node.js** 18.0.0以上
- **Docker** & **Docker Compose**
- **Git**

---

## 🚀 セットアップ（3ステップ）

### 1️⃣ リポジトリのクローン

```bash
git clone <repository-url>
cd mokin-recruit
```

### 2️⃣ 環境変数の設定

```bash
# ルートディレクトリに.envファイルを作成
cp .env.example .env

# 必要な環境変数を設定
SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

### 3️⃣ アプリケーション起動

```bash
# Docker環境で起動
docker-compose up -d

# または直接起動
npm install
npm run dev
```

---

## 🌐 アクセス確認

起動後、以下のURLでアクセス確認：

- **フロントエンド**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health
- **MailHog (開発用メール)**: http://localhost:8025

---

## 📁 プロジェクト構造（重要ファイル）

```
mokin-recruit/
├── client/                    # Next.js フロントエンド
│   ├── src/app/              # App Router
│   ├── src/lib/server/       # サーバーサイドロジック
│   └── package.json
├── packages/shared-types/     # 共有型定義
├── docs/                     # ドキュメント
└── docker-compose.yml        # Docker設定
```

---

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# リンター実行
npm run lint

# フォーマット
npm run format

# Supabase型生成
npm run supabase:types
```

---

## 🎯 最初にやること

### 1. データベース初期化

```bash
# Supabase Dashboardにアクセス
# SQL Editorで docs/database/schema.sql を実行
```

### 2. 認証機能テスト

```bash
# 候補者登録API
curl -X POST http://localhost:3000/api/auth/register/candidate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. 開発フロー確認

1. **機能開発**: `client/src/app/` でページ作成
2. **API作成**: `client/src/app/api/` でAPI Route作成
3. **型定義**: `packages/shared-types/src/` で型定義
4. **テスト**: 各機能のテスト実装

---

## 🔗 次のステップ

開発を本格的に始める前に以下を確認：

1. [Architecture Overview](../architecture/overview.md) - システム全体理解
2. [Development Workflow](./development-workflow.md) - 開発フロー詳細
3. [Feature Specifications](../features/) - 実装すべき機能一覧

---

## 🆘 トラブルシューティング

### よくある問題

**Docker起動エラー**

```bash
# コンテナ再構築
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**型エラー**

```bash
# 型定義再生成
npm run supabase:types
npm run type-check
```

**環境変数エラー**

- `.env`ファイルの存在確認
- Supabase認証情報の正確性確認

---

## 📞 サポート

- **詳細ガイド**: [Setup Guide](./setup-guide.md)
- **技術的問題**: [Troubleshooting](./troubleshooting.md)
- **開発チーム**: Slack `#mokin-recruit-dev`

---

_これで開発準備完了です！🎉_
