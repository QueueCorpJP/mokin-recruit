#!/bin/bash

# ==============================================================================
# Docker環境用Supabase接続診断スクリプト
# ==============================================================================

set -e

echo "🔍 Docker環境でのSupabase接続診断を開始します..."
echo "=================================================================="

# 色付きログ出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 環境変数チェック
echo ""
echo "📋 1. 環境変数チェック"
echo "----------------------------------------"

check_env_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        log_error "$var_name が設定されていません"
        return 1
    else
        log_success "$var_name が設定されています"
        return 0
    fi
}

# 必須環境変数のチェック
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "JWT_SECRET"
)

all_vars_ok=true
for var in "${required_vars[@]}"; do
    if ! check_env_var "$var"; then
        all_vars_ok=false
    fi
done

if [ "$all_vars_ok" = false ]; then
    log_error "必須環境変数が不足しています"
    exit 1
fi

# DNS解決チェック
echo ""
echo "🌐 2. DNS解決チェック"
echo "----------------------------------------"

SUPABASE_HOST=$(echo $SUPABASE_URL | sed 's|https\?://||' | cut -d'/' -f1)
log_info "Supabaseホスト: $SUPABASE_HOST"

if nslookup $SUPABASE_HOST > /dev/null 2>&1; then
    log_success "DNS解決成功: $SUPABASE_HOST"
    
    # IPアドレス表示
    IP_ADDRESS=$(nslookup $SUPABASE_HOST | grep 'Address:' | tail -1 | awk '{print $2}')
    log_info "解決されたIPアドレス: $IP_ADDRESS"
else
    log_error "DNS解決失敗: $SUPABASE_HOST"
    exit 1
fi

# ネットワーク接続チェック
echo ""
echo "🔌 3. ネットワーク接続チェック"
echo "----------------------------------------"

# HTTPS接続テスト
if curl -s --max-time 10 -I "$SUPABASE_URL/rest/v1/" > /dev/null; then
    log_success "HTTPS接続成功: $SUPABASE_URL"
else
    log_error "HTTPS接続失敗: $SUPABASE_URL"
    
    # 詳細診断
    log_info "詳細診断を実行中..."
    curl -v --max-time 10 "$SUPABASE_URL/rest/v1/" 2>&1 | head -20
    exit 1
fi

# Supabase API接続テスト
echo ""
echo "🔑 4. Supabase API接続テスト"
echo "----------------------------------------"

# 匿名キーでのテスト
API_RESPONSE=$(curl -s --max-time 10 \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    "$SUPABASE_URL/rest/v1/" 2>/dev/null)

if [ $? -eq 0 ] && [ -n "$API_RESPONSE" ]; then
    log_success "Supabase API接続成功"
    log_info "APIレスポンス: $(echo $API_RESPONSE | head -c 100)..."
else
    log_error "Supabase API接続失敗"
    exit 1
fi

# Redis接続チェック（Docker環境）
echo ""
echo "📦 5. Redis接続チェック"
echo "----------------------------------------"

if command -v redis-cli > /dev/null; then
    if redis-cli -h redis -p 6379 ping > /dev/null 2>&1; then
        log_success "Redis接続成功: redis:6379"
    else
        log_warning "Redis接続失敗: redis:6379"
    fi
else
    log_info "redis-cliが利用できません（スキップ）"
fi

# SSL証明書チェック
echo ""
echo "🔒 6. SSL証明書チェック"
echo "----------------------------------------"

if openssl s_client -connect $SUPABASE_HOST:443 -servername $SUPABASE_HOST < /dev/null 2>/dev/null | openssl x509 -noout -dates; then
    log_success "SSL証明書検証成功"
else
    log_warning "SSL証明書検証に問題があります"
fi

# Docker環境固有チェック
echo ""
echo "🐳 7. Docker環境固有チェック"
echo "----------------------------------------"

# コンテナ内かどうかの確認
if [ -f /.dockerenv ]; then
    log_info "Dockerコンテナ内で実行中"
    
    # メモリ使用量チェック
    MEMORY_USAGE=$(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2 }')
    log_info "メモリ使用率: $MEMORY_USAGE"
    
    # ディスク使用量チェック
    DISK_USAGE=$(df -h / | awk 'NR==2{print $5}')
    log_info "ディスク使用率: $DISK_USAGE"
else
    log_info "通常環境で実行中（非Docker）"
fi

# Next.js アプリケーションヘルスチェック
echo ""
echo "⚡ 8. Next.jsアプリケーションヘルスチェック"
echo "----------------------------------------"

if curl -s --max-time 5 http://localhost:3000/api/health > /dev/null; then
    log_success "Next.jsアプリケーション正常動作中"
    
    # ヘルスチェックレスポンス詳細
    HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
    log_info "ヘルスチェックレスポンス: $(echo $HEALTH_RESPONSE | jq -r '.status // "No status"' 2>/dev/null || echo "JSON解析不可")"
else
    log_warning "Next.jsアプリケーションが応答しません"
fi

echo ""
echo "=================================================================="
log_success "🎉 Docker環境でのSupabase接続診断が完了しました"
echo "=================================================================="

# 推奨事項の表示
echo ""
echo "💡 推奨事項:"
echo "----------------------------------------"
echo "1. 定期的にこのスクリプトを実行して接続状態を監視してください"
echo "2. エラーが発生した場合は、docker-compose.ymlの設定を確認してください"
echo "3. 本番環境では、環境変数を適切に暗号化してください"
echo "4. Supabaseのレート制限に注意してください"
echo "" 