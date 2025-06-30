# 🚀 Mokin Recruit - Vercelデプロイ手順書

## 📋 概要

この手順書では、Mokin
Recruit採用管理システムをVercelにデプロイし、デモ環境を構築する方法を説明します。

## 🎯 デプロイ目標

- **デモURL**: `https://mokin-recruit.vercel.app`
- **ログイン画面**: `https://mokin-recruit.vercel.app/auth/login`
- **管理画面**: `https://mokin-recruit.vercel.app/dashboard`

## 📋 前提条件

### 必要なアカウント・サービス

- [x] GitHub アカウント
- [x] Vercel アカウント
- [x] Supabase プロジェクト

### 必要な環境変数

以下の環境変数が設定済みであることを確認:

```bash
# 現在の環境変数を確認
cat .env.example
```

## 🚀 デプロイ手順

### Step 1: Vercel CLI セットアップ

```bash
# Vercel CLIインストール
npm install -g vercel

# Vercelにログイン
vercel login
```

### Step 2: プロジェクト初期化

```bash
# プロジェクトルートで実行
cd /path/to/mokin-recruit
vercel

# 設定例:
# ? Set up and deploy "mokin-recruit"? [Y/n] y
# ? Which scope do you want to deploy to? [your-team]
# ? Link to existing project? [y/N] n
# ? What's your project's name? mokin-recruit
# ? In which directory is your code located? ./client
```

### Step 3: 環境変数設定

#### 3-1. CLI経由での設定

```bash
# Supabase設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 入力: https://your-project.supabase.co

vercel env add SUPABASE_ANON_KEY
# 入力: your-anon-key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# 入力: your-service-role-key

# アプリケーション設定
vercel env add CORS_ORIGIN
# 入力: https://mokin-recruit.vercel.app

vercel env add JWT_SECRET
# 入力: your-jwt-secret-key

vercel env add NODE_ENV
# 入力: production
```

#### 3-2. Vercel Dashboard での設定

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクト選択 → Settings → Environment Variables
3. 以下の変数を追加:

| 変数名                      | 値                                 | 環境                             |
| --------------------------- | ---------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | `https://xxx.supabase.co`          | Production, Preview, Development |
| `SUPABASE_ANON_KEY`         | `eyJhbGciOiJIUzI1NiIs...`          | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...`          | Production, Preview, Development |
| `CORS_ORIGIN`               | `https://mokin-recruit.vercel.app` | Production                       |
| `JWT_SECRET`                | `your-secret-key`                  | Production, Preview, Development |
| `NODE_ENV`                  | `production`                       | Production                       |

### Step 4: 本番デプロイ

```bash
# 本番デプロイ実行
vercel --prod

# デプロイ完了後、URLが表示されます
# ✅ Production: https://mokin-recruit.vercel.app
```

### Step 5: デプロイ確認

#### 5-1. 基本動作確認

```bash
# ヘルスチェック
curl https://mokin-recruit.vercel.app/api/health

# 認証API確認
curl -X POST https://mokin-recruit.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### 5-2. ブラウザ確認

1. **ログイン画面**: `https://mokin-recruit.vercel.app/auth/login`
2. **ホーム画面**: `https://mokin-recruit.vercel.app/`
3. **API動作**: ログインフォームの送信テスト

## 🔧 トラブルシューティング

### よくある問題と解決法

#### 1. 環境変数が認識されない

```bash
# 環境変数一覧確認
vercel env ls

# 特定の環境変数確認
vercel env ls NEXT_PUBLIC_SUPABASE_URL
```

**解決策:**

- Vercel Dashboard で環境変数を再設定
- デプロイ環境（Production/Preview/Development）の設定確認

#### 2. Supabase接続エラー

```bash
# Supabase設定確認
echo "URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
```

**解決策:**

- Supabase プロジェクトの状態確認
- API キーの有効性確認
- CORS設定の確認

#### 3. ビルドエラー

```bash
# ローカルビルドテスト
cd client
npm run build

# 型チェック
npm run type-check
```

**解決策:**

- 依存関係の再インストール
- TypeScriptエラーの修正
- 環境変数の設定確認

## 📊 デプロイ後の確認項目

### ✅ チェックリスト

- [ ] **基本アクセス**: ホームページが正常に表示される
- [ ] **認証画面**: ログインフォームが表示される
- [ ] **API動作**: 認証APIが正常に応答する
- [ ] **環境変数**: 必要な環境変数がすべて設定されている
- [ ] **Supabase接続**: データベース接続が正常
- [ ] **レスポンシブ**: モバイル・デスクトップで正常表示
- [ ] **HTTPS**: SSL証明書が正常に動作

### 📈 パフォーマンス確認

```bash
# Lighthouse CI (オプション)
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

## 🎉 デモ準備完了

### デモURL

- **本番環境**: `https://mokin-recruit.vercel.app`
- **ログイン画面**: `https://mokin-recruit.vercel.app/auth/login`
- **API Endpoint**: `https://mokin-recruit.vercel.app/api/auth/login`

### 先方への報告用情報

```markdown
## 進捗報告: Mokin Recruit デモ環境構築完了

### 🎯 デモ環境

- **URL**: https://mokin-recruit.vercel.app
- **ログイン画面**: https://mokin-recruit.vercel.app/auth/login
- **ステータス**: ✅ 稼働中

### 🔧 実装済み機能

- Shadcn/ui ベースのモダンUI
- Supabase認証システム
- レスポンシブデザイン
- TypeScript完全対応

### 📱 動作確認方法

1. 上記URLにアクセス
2. ログイン画面でフォーム操作を確認
3. 認証API（/api/auth/login）の動作確認

### 🚀 次のステップ

- ユーザー登録画面の実装
- ダッシュボード画面の構築
- Figma デザインの適用
```

## 📞 サポート・連絡先

デプロイに関する質問や問題が発生した場合:

1. **Vercel ログ確認**: `vercel logs`
2. **環境変数確認**: `vercel env ls`
3. **ローカルテスト**: `npm run build && npm run start`

---

**🎯 デプロイ完了**: `https://mokin-recruit.vercel.app`  
**📊 Vercel Dashboard**: [プロジェクト管理画面](https://vercel.com/dashboard)  
**🔐 環境変数管理**: Settings → Environment Variables
