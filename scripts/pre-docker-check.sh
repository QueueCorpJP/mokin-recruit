#!/bin/bash

# ==============================================================================
# Docker起動前の事前チェックスクリプト
# ==============================================================================

set -e

echo "🔍 Docker起動前の事前チェックを開始します..."
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

# エラー時の終了処理
cleanup() {
    log_error "事前チェックに失敗しました。問題を修正してから再実行してください。"
    exit 1
}

trap cleanup ERR

# 1. Docker環境チェック
echo ""
echo "🐳 1. Docker環境チェック"
echo "----------------------------------------"

if ! command -v docker &> /dev/null; then
    log_error "Dockerがインストールされていません"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Composeがインストールされていません"
    exit 1
fi

DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)

log_success "Docker: $DOCKER_VERSION"
log_success "Docker Compose: $COMPOSE_VERSION"

# Dockerデーモンの確認
if ! docker info &> /dev/null; then
    log_error "Dockerデーモンが起動していません"
    exit 1
fi

log_success "Dockerデーモンが正常に動作しています"

# 2. 必要なファイルの存在確認
echo ""
echo "📁 2. 必要なファイルの存在確認"
echo "----------------------------------------"

required_files=(
    "docker-compose.yml"
    "client/Dockerfile.dev"
    "client/package.json"
    ".env"
    "docker.env"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file が存在します"
    else
        log_error "$file が存在しません"
        exit 1
    fi
done

# 3. 環境変数の検証
echo ""
echo "🔧 3. 環境変数の検証"
echo "----------------------------------------"

# .envファイルの読み込み
if [ -f ".env" ]; then
    source .env
    log_success ".env ファイルを読み込みました"
else
    log_error ".env ファイルが存在しません"
    exit 1
fi

# 必須環境変数のチェック
required_env_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "JWT_SECRET"
)

for var in "${required_env_vars[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "環境変数 $var が設定されていません"
        exit 1
    else
        log_success "$var が設定されています"
    fi
done

# Supabase URL形式チェック
if [[ $SUPABASE_URL =~ ^https://[a-zA-Z0-9-]+\.supabase\.co$ ]]; then
    log_success "Supabase URL形式が正しいです"
else
    log_error "Supabase URL形式が正しくありません: $SUPABASE_URL"
    exit 1
fi

# 4. ネットワーク接続チェック
echo ""
echo "🌐 4. ネットワーク接続チェック"
echo "----------------------------------------"

# DNS解決チェック
SUPABASE_HOST=$(echo $SUPABASE_URL | sed 's|https\?://||' | cut -d'/' -f1)
if nslookup $SUPABASE_HOST &> /dev/null; then
    log_success "DNS解決成功: $SUPABASE_HOST"
else
    log_error "DNS解決失敗: $SUPABASE_HOST"
    exit 1
fi

# HTTPS接続チェック
if curl -s --max-time 10 -I "$SUPABASE_URL/rest/v1/" &> /dev/null; then
    log_success "Supabase接続成功"
else
    log_warning "Supabase接続に問題があります（Docker環境で解決される可能性があります）"
fi

# 5. ポート使用状況チェック
echo ""
echo "🔌 5. ポート使用状況チェック"
echo "----------------------------------------"

check_port() {
    local port=$1
    local service=$2
    
    if lsof -i :$port &> /dev/null; then
        log_warning "ポート $port ($service) が使用中です"
        lsof -i :$port
    else
        log_success "ポート $port ($service) は利用可能です"
    fi
}

check_port 3000 "Next.js"
check_port 6379 "Redis"
check_port 1025 "SMTP"
check_port 8025 "MailHog Web UI"

# 6. Docker Composeファイルの構文チェック
echo ""
echo "📋 6. Docker Composeファイルの構文チェック"
echo "----------------------------------------"

if docker-compose config &> /dev/null; then
    log_success "docker-compose.yml の構文が正しいです"
else
    log_error "docker-compose.yml の構文エラーがあります"
    docker-compose config
    exit 1
fi

# 7. ディスク容量チェック
echo ""
echo "💾 7. ディスク容量チェック"
echo "----------------------------------------"

AVAILABLE_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
REQUIRED_SPACE=2

if [ "$AVAILABLE_SPACE" -gt "$REQUIRED_SPACE" ]; then
    log_success "十分なディスク容量があります (${AVAILABLE_SPACE}GB利用可能)"
else
    log_warning "ディスク容量が不足している可能性があります (${AVAILABLE_SPACE}GB利用可能)"
fi

# 8. 既存のコンテナチェック
echo ""
echo "🔄 8. 既存のコンテナチェック"
echo "----------------------------------------"

if docker ps -a --format "table {{.Names}}" | grep -q "mokin-recruit"; then
    log_info "既存のmokin-recruitコンテナが見つかりました"
    docker ps -a --filter "name=mokin-recruit" --format "table {{.Names}}\t{{.Status}}"
    
    read -p "既存のコンテナを停止・削除しますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "既存のコンテナを停止・削除しています..."
        docker-compose down -v
        log_success "既存のコンテナを削除しました"
    fi
else
    log_success "既存のコンテナは見つかりませんでした"
fi

# 9. 推奨設定の確認
echo ""
echo "⚙️ 9. 推奨設定の確認"
echo "----------------------------------------"

# Node.js バージョンチェック（ローカル）
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_info "ローカルNode.js: $NODE_VERSION"
else
    log_info "ローカルNode.jsが見つかりません（Docker環境で実行されます）"
fi

# npm バージョンチェック（ローカル）
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    log_info "ローカルnpm: $NPM_VERSION"
else
    log_info "ローカルnpmが見つかりません（Docker環境で実行されます）"
fi

echo ""
echo "=================================================================="
log_success "🎉 事前チェックが完了しました！"
echo "=================================================================="

# 起動コマンドの提案
echo ""
echo "💡 次のステップ:"
echo "----------------------------------------"
echo "1. Docker環境を起動:"
echo "   docker-compose up -d"
echo ""
echo "2. ログを確認:"
echo "   docker-compose logs -f client"
echo ""
echo "3. 接続診断を実行:"
echo "   docker-compose exec client /bin/sh -c 'source /usr/local/bin/connectivity-test.sh'"
echo ""
echo "4. アプリケーションにアクセス:"
echo "   http://localhost:3000"
echo ""
echo "5. ヘルスチェック:"
echo "   curl http://localhost:3000/api/health"
echo ""

# 自動起動の確認
read -p "今すぐDocker環境を起動しますか？ (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Docker環境を起動しています..."
    docker-compose up -d
    
    # 起動完了まで待機
    log_info "コンテナの起動を待機中..."
    sleep 10
    
    # ヘルスチェック
    if curl -s --max-time 5 http://localhost:3000/api/health &> /dev/null; then
        log_success "アプリケーションが正常に起動しました！"
        log_info "アクセスURL: http://localhost:3000"
    else
        log_warning "アプリケーションの起動に時間がかかっています"
        log_info "ログを確認してください: docker-compose logs -f client"
    fi
else
    log_info "手動で起動してください: docker-compose up -d"
fi

echo ""
log_success "事前チェックスクリプトが完了しました！" 