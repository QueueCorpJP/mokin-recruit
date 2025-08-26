# 候補者登録フロー - セットアップガイド

新しい認証コード付き候補者登録フローを有効にするために必要な設定を説明します。

## 1. Supabase設定

### 1.1 Authenticationの設定

Supabaseダッシュボードで以下の設定を確認してください：

1. **Email Templates**
   - Auth > Templates に移動
   - "Confirm signup" テンプレートを編集
   - テンプレートに `{{ .Token }}` を含めて、6桁のOTPコードが表示されるようにする

   例：
   ```html
   <h2>認証コード</h2>
   <p>あなたの認証コードは以下の通りです：</p>
   <h3>{{ .Token }}</h3>
   <p>このコードは10分間有効です。</p>
   ```

2. **Authentication Settings**
   - Auth > Settings で以下を確認：
     - `Enable email confirmations`: 有効
     - `Email OTP expiration time`: 600秒（10分）推奨
     - `Email rate limiting`: 適切な値に設定（例：60秒に1回）

### 1.2 Email Provider設定

本番環境では、Supabaseの内蔵メール送信制限（1時間あたり3通）では不十分なため、カスタムSMTPプロバイダーの設定を推奨します：

1. Auth > Settings > SMTP Settings に移動
2. カスタムSMTPプロバイダー（SendGrid, Mailgun, AWS SES等）を設定

## 2. 環境変数

`.env.local` または適切な環境設定ファイルに以下の変数が設定されていることを確認してください：

```bash
# Supabase設定
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Next.js設定（フロントエンド用）
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. データベーススキーマ

`candidates` テーブルが以下の構造になっていることを確認してください：

```sql
-- candidates テーブルの確認・作成
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  last_name VARCHAR(100),
  first_name VARCHAR(100),
  last_name_kana VARCHAR(100),
  first_name_kana VARCHAR(100),
  gender VARCHAR(10),
  birth_date DATE,
  phone_number VARCHAR(20),
  address TEXT,
  education_level VARCHAR(50),
  school_name VARCHAR(200),
  major VARCHAR(100),
  graduation_year INTEGER,
  job_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSポリシーの設定
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- 自分の候補者情報のみ表示・更新可能
CREATE POLICY "Users can view own candidate profile" ON candidates
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own candidate profile" ON candidates
  FOR UPDATE USING (auth.uid() = id);

-- 管理者は全ての候補者情報を表示可能（必要に応じて）  
CREATE POLICY "Admins can view all candidates" ON candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_app_metadata->>'role' = 'admin'
    )
  );
```

## 4. テスト手順

新しいAPIの動作確認：

### 4.1 手動テスト

```bash
# 1. 認証コード送信
curl -X POST http://localhost:3000/api/auth/register/candidate/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. 認証コード確認（メールから6桁コードを取得後）
curl -X POST http://localhost:3000/api/auth/register/candidate/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "code":"123456"}'

# 3. 登録完了（上記レスポンスのtempTokenを使用）
curl -X POST http://localhost:3000/api/auth/register/candidate/complete-registration \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com", 
    "password":"securepassword123",
    "tempToken":"jwt-token-from-step-2"
  }'

# 4. プロフィール設定（上記レスポンスのuserIdを使用）
curl -X POST http://localhost:3000/api/auth/register/candidate/profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-id-from-step-3",
    "lastName":"田中",
    "firstName":"太郎"
  }'
```

### 4.2 ログ確認

API の動作確認のため、以下のログを確認してください：

```bash
# 開発環境
npm run dev

# ログ確認（別ターミナル）
tail -f client/logs/app.log
```

## 5. トラブルシューティング

### 5.1 認証コードが送信されない

- Supabaseのメール設定を確認
- SMTPプロバイダーの設定を確認
- レート制限に引っかかっていないか確認

### 5.2 認証コード確認エラー

- コードの有効期限（デフォルト10分）を確認
- メールアドレスの大文字小文字を確認
- コードの入力ミスがないか確認

### 5.3 パスワード設定エラー

- 一時トークンの有効期限を確認
- メールアドレスとトークンの整合性を確認
- パスワードの強度要件を確認

## 6. セキュリティ強化

本番環境では以下の追加設定を推奨します：

1. **レート制限の強化**
   - IPアドレスベースの制限
   - ユーザーベースの制限

2. **監視とアラート**
   - 異常な認証試行の検知
   - 失敗率の監視

3. **ログ分析**
   - 不正アクセスの検知
   - パフォーマンス監視

## 7. 移行計画

既存システムから新しいフローへの移行：

1. **段階的移行**
   - 新規ユーザーのみ新フローに誘導
   - 既存ユーザーは従来フローを維持

2. **A/Bテスト**
   - 新旧フローの比較テスト
   - コンバージョン率の分析

3. **完全移行**
   - 新フローの安定性確認後
   - 旧APIの非推奨化 