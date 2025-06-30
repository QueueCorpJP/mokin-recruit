# 🚀 Mokin Recruit - 即座デプロイ手順書

## 📋 準備完了状況

- ✅ ビルド成功確認済み
- ✅ Supabase環境変数取得済み
- ✅ Vercel設定ファイル準備完了

## 🎯 5分でデプロイ完了

### Step 1: Vercel CLI セットアップ

```bash
# Vercel CLI インストール
npm install -g vercel

# Vercelにログイン（ブラウザが開きます）
vercel login
```

### Step 2: プロジェクト初期化

```bash
# プロジェクトルートで実行
vercel

# 設定時の回答:
# ? Set up and deploy "mokin-recruit"? [Y/n] → y
# ? Which scope do you want to deploy to? → [your-account/team]
# ? Link to existing project? [y/N] → N
# ? What's your project's name? → mokin-recruit
# ? In which directory is your code located? → ./client
```

### Step 3: 環境変数設定

```bash
# NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 入力値: https://mjhqeagxibsklugikyma.supabase.co

# SUPABASE_ANON_KEY
vercel env add SUPABASE_ANON_KEY production
# 入力値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk

# SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 入力値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMyNjUzNywiZXhwIjoyMDY1OTAyNTM3fQ.WZVAdSCbl9yP5wQ2YDvFGYvo0AUHXrYV1eMaFeb6uNE

# JWT_SECRET
vercel env add JWT_SECRET production
# 入力値: mokin-recruit-super-secret-jwt-key-2024-production-change-me

# NODE_ENV
vercel env add NODE_ENV production
# 入力値: production

# CORS_ORIGIN (デプロイ後に更新)
vercel env add CORS_ORIGIN production
# 入力値: https://your-app-name.vercel.app
```

### Step 4: 本番デプロイ実行

```bash
# 本番デプロイ
vercel --prod

# 結果例:
# ✅ Production: https://mokin-recruit-xxxx.vercel.app [2s]
```

## 🎉 デプロイ完了後の確認

### デモURL

- **メインサイト**: `https://your-app.vercel.app`
- **ログイン画面**: `https://your-app.vercel.app/auth/login`
- **API確認**: `https://your-app.vercel.app/api/auth/login`

### 動作確認手順

1. **基本アクセス確認**

   ```bash
   curl https://your-app.vercel.app
   ```

2. **ログイン画面確認**

   - ブラウザで `https://your-app.vercel.app/auth/login` にアクセス
   - フォームが正常に表示されることを確認

3. **API動作確認**
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## 🔧 CORS設定の更新

デプロイ完了後、実際のURLでCORS_ORIGINを更新:

```bash
# 実際のデプロイURLに更新
vercel env rm CORS_ORIGIN production
vercel env add CORS_ORIGIN production
# 入力値: https://your-actual-app.vercel.app

# 再デプロイ
vercel --prod
```

## 📊 先方報告用情報

```markdown
## 🎉 Mokin Recruit デモ環境デプロイ完了

### 📱 デモURL

- **本番環境**: https://your-app.vercel.app
- **ログイン画面**: https://your-app.vercel.app/auth/login
- **ステータス**: ✅ 稼働中

### 🔧 実装済み機能

- ✅ モダンUI（Shadcn/ui + TailwindCSS）
- ✅ 認証システム（Supabase Auth）
- ✅ レスポンシブデザイン
- ✅ TypeScript完全対応
- ✅ 本番環境デプロイ

### 🚀 技術スタック

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **UI**: TailwindCSS 4 + Shadcn/ui
- **Backend**: Supabase (認証・DB)
- **Deploy**: Vercel
- **Architecture**: クリーンアーキテクチャ + DDD

### 📱 動作確認

1. 上記デモURLにアクセス
2. ログイン画面でUI/UXを確認
3. レスポンシブデザインの確認（PC・スマホ）

### 🎯 次のステップ

1. ユーザー登録画面の実装
2. ダッシュボード画面の構築
3. Figmaデザインの適用
4. 候補者・企業管理機能の実装
```

## 🛠️ トラブルシューティング

### よくある問題

1. **環境変数エラー**

   ```bash
   # 環境変数確認
   vercel env ls

   # 再設定
   vercel env rm VARIABLE_NAME production
   vercel env add VARIABLE_NAME production
   ```

2. **ビルドエラー**

   ```bash
   # ローカルビルド確認
   cd client && npm run build

   # Vercelログ確認
   vercel logs
   ```

3. **Supabase接続エラー**
   - Supabase プロジェクトの稼働状況確認
   - API キーの有効性確認
   - ネットワーク設定確認

## 📞 サポート

問題が発生した場合:

1. `vercel logs` でログ確認
2. `vercel env ls` で環境変数確認
3. ローカル環境での動作確認

---

**🎯 即座デプロイ完了**: 約5分  
**📊 管理画面**: https://vercel.com/dashboard  
**🔐 環境変数管理**: Vercel Dashboard > Settings > Environment Variables
