#!/bin/bash

set -e

# 色付きログ用関数
log_info() { echo -e "\033[32m[INFO]\033[0m $1"; }
log_warn() { echo -e "\033[33m[WARN]\033[0m $1"; }
log_error() { echo -e "\033[31m[ERROR]\033[0m $1"; }
log_step() { echo -e "\033[36m[STEP]\033[0m $1"; }

# プロジェクトルートを確認
if [ ! -f "package.json" ] && [ ! -f "client/package.json" ]; then
    log_error "Run this script from the project root directory"
    exit 1
fi

# clientディレクトリに移動
if [ -d "client" ]; then
    cd client
fi

log_info "🔧 Mokin Recruit - Environment Setup Script"
echo "=================================================="

# 環境選択
echo ""
log_step "Select environment to setup:"
echo "1) Development (Local)"
echo "2) Production (Vercel)"
echo "3) Test"
echo "4) Custom"
read -p "Choose [1-4]: " env_choice

case $env_choice in
    1) ENV_TYPE="development" ;;
    2) ENV_TYPE="production" ;;
    3) ENV_TYPE="test" ;;
    4) ENV_TYPE="custom" ;;
    *) log_error "Invalid choice"; exit 1 ;;
esac

log_info "Setting up environment: $ENV_TYPE"

# .env.local ファイルの作成
ENV_FILE=".env.local"
if [ "$ENV_TYPE" != "development" ]; then
    ENV_FILE=".env.$ENV_TYPE"
fi

log_step "Creating $ENV_FILE..."

# 既存ファイルのバックアップ
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    log_warn "Existing $ENV_FILE backed up"
fi

# 基本設定の作成
cat > "$ENV_FILE" << EOF
# ==============================================
# Mokin Recruit - $ENV_TYPE Environment
# Generated: $(date)
# ==============================================

# ===== 基本設定 =====
NODE_ENV=$ENV_TYPE
EOF

# 環境別の設定
case $ENV_TYPE in
    "development")
        cat >> "$ENV_FILE" << EOF
PORT=3000

# ===== Supabase設定 =====
SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMyNjUzNywiZXhwIjoyMDY1OTAyNTM3fQ.WZVAdSCbl9yP5wQ2YDvFGYvo0AUHXrYV1eMaFeb6uNE
NEXT_PUBLIC_SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co

# ===== セキュリティ設定 =====
JWT_SECRET=mokin-recruit-development-jwt-secret-key-32-chars-minimum
JWT_EXPIRES_IN=24h

# ===== URL・CORS設定 =====
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===== デバッグ・ログ設定 =====
DEBUG=mokin-recruit:*
LOG_LEVEL=debug

# ===== レート制限設定 =====
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
        ;;
    "production")
        cat >> "$ENV_FILE" << EOF
PORT=3000

# ===== Supabase設定 =====
# TODO: Replace with your production Supabase values
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co

# ===== セキュリティ設定 =====
# TODO: Generate a strong JWT secret (64+ characters)
JWT_SECRET=your-super-strong-production-jwt-secret-key-64-chars-minimum-change-me
JWT_EXPIRES_IN=24h

# ===== URL・CORS設定 =====
# TODO: Replace with your production domain
CORS_ORIGIN=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# ===== ログ設定 =====
LOG_LEVEL=info

# ===== レート制限設定 =====
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# ===== 監視設定 =====
# SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
# NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
EOF
        ;;
    "test")
        cat >> "$ENV_FILE" << EOF
PORT=3001

# ===== Supabase設定（テスト用） =====
SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMyNjUzNywiZXhwIjoyMDY1OTAyNTM3fQ.WZVAdSCbl9yP5wQ2YDvFGYvo0AUHXrYV1eMaFeb6uNE
NEXT_PUBLIC_SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co

# ===== セキュリティ設定 =====
JWT_SECRET=test-jwt-secret-key-32-chars-minimum
JWT_EXPIRES_IN=1h

# ===== URL・CORS設定 =====
CORS_ORIGIN=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# ===== ログ設定 =====
LOG_LEVEL=error

# ===== レート制限設定 =====
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=1000
EOF
        ;;
esac

log_info "✅ $ENV_FILE created successfully"

# 環境変数の検証
log_step "Validating environment variables..."

# Node.jsスクリプトで検証
cat > temp_validate.js << 'EOF'
const fs = require('fs');
const path = require('path');

// .envファイルを読み込み
const envFile = process.argv[2] || '.env.local';
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      envVars[key] = valueParts.join('=');
    }
  });
  
  // 必須変数のチェック
  const required = [
    'NODE_ENV',
    'SUPABASE_URL', 
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET'
  ];
  
  let valid = true;
  const issues = [];
  
  required.forEach(key => {
    if (!envVars[key]) {
      issues.push(`Missing required variable: ${key}`);
      valid = false;
    }
  });
  
  // JWT_SECRETの長さチェック
  if (envVars.JWT_SECRET && envVars.JWT_SECRET.length < 32) {
    issues.push('JWT_SECRET should be at least 32 characters');
    valid = false;
  }
  
  // URLの形式チェック
  if (envVars.SUPABASE_URL && !envVars.SUPABASE_URL.startsWith('https://')) {
    issues.push('SUPABASE_URL should start with https://');
    valid = false;
  }
  
  if (valid) {
    console.log('✅ Environment validation passed');
    console.log(`📊 Found ${Object.keys(envVars).length} environment variables`);
  } else {
    console.log('❌ Environment validation failed:');
    issues.forEach(issue => console.log(`  - ${issue}`));
    process.exit(1);
  }
} else {
  console.log('❌ Environment file not found:', envFile);
  process.exit(1);
}
EOF

if command -v node >/dev/null 2>&1; then
    node temp_validate.js "$ENV_FILE"
    rm temp_validate.js
else
    log_warn "Node.js not found, skipping validation"
fi

# セットアップ完了メッセージ
echo ""
log_info "🎉 Environment setup completed!"
echo "=================================================="
echo "📁 Configuration file: $ENV_FILE"
echo ""

case $ENV_TYPE in
    "development")
        echo "🚀 Next steps:"
        echo "   1. Run: npm run dev"
        echo "   2. Open: http://localhost:3000"
        ;;
    "production")
        echo "⚠️  Production setup requires manual configuration:"
        echo "   1. Edit $ENV_FILE with your production values"
        echo "   2. Set strong JWT_SECRET (64+ characters)"
        echo "   3. Configure production Supabase project"
        echo "   4. Set your production domain URLs"
        ;;
    "test")
        echo "🧪 Test environment ready:"
        echo "   1. Run: npm run test"
        ;;
esac

echo ""
echo "📚 Documentation:"
echo "   - Environment Guide: docs/deployment/environment-variables.md"
echo "   - Setup Guide: docs/getting-started/setup-guide.md"

# セキュリティ警告
if [ "$ENV_TYPE" = "production" ]; then
    echo ""
    log_warn "🔒 SECURITY REMINDER:"
    echo "   - Never commit production secrets to Git"
    echo "   - Use strong, unique passwords and keys"
    echo "   - Regularly rotate sensitive credentials"
fi 