#!/bin/bash

# Mokin Recruit - Vercel デプロイスクリプト
echo "🚀 Mokin Recruit デプロイ開始..."

# 1. ビルド確認
echo "📦 ビルド確認中..."
cd client && npm run build

if [ $? -eq 0 ]; then
    echo "✅ ビルド成功"
else
    echo "❌ ビルド失敗"
    exit 1
fi

# 2. Vercel CLI確認
echo "🔧 Vercel CLI確認中..."
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI インストール中..."
    npm install -g vercel
fi

# 3. プロジェクトルートに移動
cd ..

# 4. デプロイ実行
echo "🚀 Vercel デプロイ実行中..."
vercel --prod

echo "🎉 デプロイ完了！"
echo "📱 デモURL: https://your-app.vercel.app/auth/login"
echo "🔧 管理画面: https://vercel.com/dashboard" 