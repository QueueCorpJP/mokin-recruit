# 🚀 Mokin Recruit - 開発セットアップガイド

## 📋 次に実行すべき手順

### 1. データベーステーブルの作成

**重要**: 以下のSQLスクリプトをSupabaseダッシュボードで実行してください：

1. [Supabase Dashboard](https://supabase.com/dashboard/project/mjhqeagxibsklugikyma) にアクセス
2. 左サイドバーから「SQL Editor」を選択
3. 「New Query」をクリック
4. 以下のファイルの内容をコピー＆ペースト：`database_schema.sql`
5. 「Run」ボタンをクリックしてスクリプトを実行

### 2. アプリケーションの起動確認

```bash
# アプリケーション状態の確認
docker-compose ps

# ヘルスチェック
curl http://localhost:3001/health

# API ドキュメント
open http://localhost:3001/api-docs
```

### 3. 開発環境へのアクセス

- **サーバー**: http://localhost:3001
- **クライアント**: http://localhost:3000
- **API ドキュメント**: http://localhost:3001/api-docs
- **ヘルスチェック**: http://localhost:3001/health
- **MailHog (開発用メール)**: http://localhost:8025

### 4. 開発ワークフロー

```bash
# ログの確認
docker-compose logs -f server
docker-compose logs -f client

# サービスの再起動
docker-compose restart server
docker-compose restart client

# アプリケーションの停止
docker-compose down

# アプリケーションの起動
docker-compose up -d
```

## 🎯 現在の開発状況

✅ **完了済み**:
- Docker環境の構築
- Supabase接続の設定
- サーバーアプリケーションの起動
- API基盤の構築
- ヘルスチェック機能
- Swagger API ドキュメント
- データベーススキーマの生成

⏳ **次のステップ**:
- データベーステーブルの作成（手動実行が必要）
- 認証機能の実装
- API エンドポイントの実装
- フロントエンド開発
- テストの実装

## 🔧 トラブルシューティング

### データベース接続エラー
- Supabase Pro planでは直接PostgreSQL接続が制限されています
- Supabaseクライアントライブラリを使用してください

### Docker関連の問題
```bash
# コンテナの再ビルド
docker-compose build --no-cache

# ボリュームのクリア
docker-compose down -v
docker-compose up -d
```

### 環境変数の問題
- `.env`ファイルが正しく設定されているか確認
- Supabaseの認証情報が最新かチェック

## 📚 参考リンク

- [Supabase Dashboard](https://supabase.com/dashboard/project/mjhqeagxibsklugikyma)
- [API Documentation](http://localhost:3001/api-docs)
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
