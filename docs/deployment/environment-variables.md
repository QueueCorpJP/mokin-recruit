# 🔧 Environment Variables - Mokin Recruit

## 🎯 環境変数設定ガイド

このドキュメントでは、Mokin Recruitで使用する環境変数の設定方法と管理について説明します。

---

## 📋 必須環境変数

### **Supabase設定**

```bash
# Supabase プロジェクトURL
SUPABASE_URL=https://your-project.supabase.co

# Supabase 匿名キー（フロントエンド用）
SUPABASE_ANON_KEY=your-anon-key

# Supabase サービスロールキー（サーバーサイド用）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase プロジェクトID（型生成用）
SUPABASE_PROJECT_ID=your-project-id
```

### **認証設定**

```bash
# JWT シークレット（ランダムな32文字以上の文字列）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# セッション有効期限（秒）
JWT_EXPIRES_IN=86400

# パスワードリセット有効期限（秒）
PASSWORD_RESET_EXPIRES_IN=3600
```

### **Redis設定**

```bash
# Redis接続URL
REDIS_URL=redis://localhost:6379

# Redis パスワード（本番環境）
REDIS_PASSWORD=your-redis-password

# Redis データベース番号
REDIS_DB=0
```

---

## 🌍 環境別設定

### **開発環境 (.env.development)**

```bash
# 基本設定
NODE_ENV=development
PORT=3000

# Supabase（開発用）
SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co
SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key

# 認証（開発用）
JWT_SECRET=dev-jwt-secret-key-change-in-production

# Redis（ローカル）
REDIS_URL=redis://localhost:6379

# デバッグ設定
DEBUG=mokin-recruit:*
LOG_LEVEL=debug

# メール設定（開発用）
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@localhost
```

### **本番環境 (.env.production)**

```bash
# 基本設定
NODE_ENV=production
PORT=3000

# Supabase（本番用）
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# 認証（本番用 - 強力なキー）
JWT_SECRET=your-super-strong-production-jwt-secret-key-32-chars-minimum

# Redis（本番用）
REDIS_URL=redis://your-redis-host:6379
REDIS_PASSWORD=your-strong-redis-password

# セキュリティ設定
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# メール設定（本番用）
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@your-domain.com

# 監視設定
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

### **テスト環境 (.env.test)**

```bash
# 基本設定
NODE_ENV=test
PORT=3000

# Supabase（テスト用）
SUPABASE_URL=https://your-test-project.supabase.co
SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key

# 認証（テスト用）
JWT_SECRET=test-jwt-secret-key

# Redis（テスト用）
REDIS_URL=redis://localhost:6380

# テスト設定
TEST_TIMEOUT=30000
JEST_TIMEOUT=30000
```

---

## 📁 ファイル構成

### **環境変数ファイルの配置**

```
mokin-recruit/
├── .env                    # 共通設定（Git管理対象外）
├── .env.example           # 設定例（Git管理対象）
├── .env.development       # 開発環境設定
├── .env.production        # 本番環境設定
├── .env.test              # テスト環境設定
└── .env.local             # ローカル設定（Git管理対象外）
```

### **.env.example（設定例）**

```bash
# ==============================================
# Mokin Recruit - Environment Variables Example
# ==============================================

# 🌍 基本設定
NODE_ENV=development
PORT=3000

# 🗄️ Supabase設定
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_ID=your-project-id

# 🔐 認証設定
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=86400
PASSWORD_RESET_EXPIRES_IN=3600

# 💾 Redis設定
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# 📧 メール設定
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@localhost

# 🔍 デバッグ設定
DEBUG=mokin-recruit:*
LOG_LEVEL=info

# 🛡️ セキュリティ設定
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# 📊 監視設定（オプション）
SENTRY_DSN=
NEW_RELIC_LICENSE_KEY=
```

---

## 🔒 セキュリティ設定

### **環境変数の暗号化**

```bash
# 本番環境では環境変数を暗号化
# 例: AWS Systems Manager Parameter Store
aws ssm put-parameter \
    --name "/mokin-recruit/prod/jwt-secret" \
    --value "your-jwt-secret" \
    --type "SecureString"

# 例: Azure Key Vault
az keyvault secret set \
    --vault-name "mokin-recruit-vault" \
    --name "jwt-secret" \
    --value "your-jwt-secret"
```

### **環境変数検証**

```typescript
// client/src/lib/server/config/env-validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## 🚀 デプロイ時の設定

### **Docker Compose設定**

```yaml
# docker-compose.yml
version: '3.8'

services:
  client:
    build: ./client
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=${REDIS_URL}
    env_file:
      - .env
      - .env.${NODE_ENV:-development}
```

### **Next.js設定**

```typescript
// next.config.ts
const nextConfig = {
  env: {
    // フロントエンドで使用する環境変数のみ公開
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },

  // サーバーサイド専用環境変数は自動的に利用可能
  // SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET など
};
```

---

## 🔧 開発ツール

### **環境変数管理スクリプト**

```bash
#!/bin/bash
# scripts/setup-env.sh

set -e

echo "🔧 Setting up environment variables..."

# 環境選択
read -p "Environment (development/production/test): " ENV
ENV=${ENV:-development}

# .envファイル作成
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
fi

# 環境別設定ファイル作成
if [ ! -f .env.$ENV ]; then
    cp .env.example .env.$ENV
    echo "✅ Created .env.$ENV"
fi

echo "📝 Please edit .env and .env.$ENV with your actual values"
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard"
```

### **環境変数検証スクリプト**

```bash
#!/bin/bash
# scripts/validate-env.sh

echo "🔍 Validating environment variables..."

# 必須変数チェック
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "JWT_SECRET"
    "REDIS_URL"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo "✅ All required environment variables are set"
```

---

## 📚 環境変数リファレンス

### **完全な環境変数一覧**

| 変数名                      | 必須 | デフォルト        | 説明                       |
| --------------------------- | ---- | ----------------- | -------------------------- |
| `NODE_ENV`                  | ✅   | development       | 実行環境                   |
| `PORT`                      | ❌   | 3000              | アプリケーションポート     |
| `SUPABASE_URL`              | ✅   | -                 | SupabaseプロジェクトURL    |
| `SUPABASE_ANON_KEY`         | ✅   | -                 | Supabase匿名キー           |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅   | -                 | Supabaseサービスロールキー |
| `SUPABASE_PROJECT_ID`       | ❌   | -                 | SupabaseプロジェクトID     |
| `JWT_SECRET`                | ✅   | -                 | JWT署名用シークレット      |
| `JWT_EXPIRES_IN`            | ❌   | 86400             | JWT有効期限（秒）          |
| `REDIS_URL`                 | ✅   | -                 | Redis接続URL               |
| `REDIS_PASSWORD`            | ❌   | -                 | Redisパスワード            |
| `REDIS_DB`                  | ❌   | 0                 | Redisデータベース番号      |
| `SMTP_HOST`                 | ❌   | localhost         | SMTPホスト                 |
| `SMTP_PORT`                 | ❌   | 1025              | SMTPポート                 |
| `SMTP_USER`                 | ❌   | -                 | SMTPユーザー               |
| `SMTP_PASS`                 | ❌   | -                 | SMTPパスワード             |
| `SMTP_FROM`                 | ❌   | noreply@localhost | 送信者メールアドレス       |
| `DEBUG`                     | ❌   | -                 | デバッグフラグ             |
| `LOG_LEVEL`                 | ❌   | info              | ログレベル                 |
| `CORS_ORIGIN`               | ❌   | \*                | CORS許可オリジン           |
| `RATE_LIMIT_WINDOW`         | ❌   | 900000            | レート制限ウィンドウ（ms） |
| `RATE_LIMIT_MAX`            | ❌   | 100               | レート制限最大リクエスト数 |
| `SENTRY_DSN`                | ❌   | -                 | Sentry DSN                 |
| `NEW_RELIC_LICENSE_KEY`     | ❌   | -                 | New Relic ライセンスキー   |

---

## 🆘 トラブルシューティング

### **よくある問題**

**環境変数が読み込まれない**

```bash
# 1. ファイル存在確認
ls -la .env*

# 2. 権限確認
chmod 600 .env

# 3. 構文確認
cat .env | grep -v '^#' | grep -v '^$'
```

**Supabase接続エラー**

```bash
# 環境変数テスト
node -e "
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
"
```

---

## 📞 サポート

環境変数設定でお困りの場合：

- **設定ガイド**: [Setup Guide](../getting-started/setup-guide.md)
- **トラブルシューティング**: [Troubleshooting](../getting-started/troubleshooting.md)
- **開発チーム**: Slack `#mokin-recruit-dev`

---

_セキュリティ上、本番環境の環境変数は適切に管理し、決してコードリポジトリにコミットしないでください。_
