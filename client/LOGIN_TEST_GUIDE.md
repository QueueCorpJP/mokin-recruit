# ログインテストガイド

## 🎯 概要

このガイドでは、開発環境でのログイン機能のテスト方法について説明します。

## 📋 テストユーザー情報

### 候補者ユーザー

- **メールアドレス**: `test-candidate@example.com`
- **パスワード**: `TestPassword123!`
- **名前**: 山田 太郎
- **タイプ**: candidate

### 企業ユーザー

- **メールアドレス**: `test-company@example.com`
- **パスワード**: `TestPassword123!`
- **名前**: 田中花子
- **タイプ**: company_user

## 🌐 フロントエンドテスト

### 1. ブラウザでのテスト

1. ブラウザで `http://localhost:3000/auth/login` にアクセス
2. 上記のテストユーザー情報を入力
3. ログインボタンをクリック
4. 成功時は `/dashboard` にリダイレクトされる

### 2. 期待される動作

- **成功時**: 緑色の成功メッセージが表示され、1秒後にダッシュボードにリダイレクト
- **失敗時**: 赤色のエラーメッセージが表示され、詳細な理由が表示される

## 🔧 API テスト

### 成功ケース

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-candidate@example.com","password":"TestPassword123!"}'
```

**期待されるレスポンス:**

```json
{
  "success": true,
  "message": "ログインに成功しました",
  "data": {
    "token": "eyJ...",
    "user": {
      "id": "...",
      "email": "test-candidate@example.com",
      "type": "candidate",
      "name": "山田 太郎",
      "profile": {...}
    }
  }
}
```

### エラーケース

#### 1. 間違ったパスワード

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test-candidate@example.com","password":"WrongPassword"}'
```

**期待されるレスポンス:**

```json
{
  "success": false,
  "error": "メールアドレスまたはパスワードが正しくありません",
  "message": "メールアドレスまたはパスワードが正しくありません",
  "code": "INVALID_CREDENTIALS"
}
```

#### 2. バリデーションエラー

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":""}'
```

**期待されるレスポンス:**

```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": [...]
}
```

## 🎨 改善されたエラーハンドリング

### フロントエンドの改善点

1. **詳細なエラーメッセージ**: APIからの具体的なエラーメッセージを表示
2. **ログ出力**: コンソールに詳細なデバッグ情報を出力
3. **成功判定の改善**: `success` フラグと `token` の存在の両方をチェック
4. **トークン保存**: 成功時にlocalStorageにトークンを保存

### バックエンドの改善点

1. **統一されたレスポンス形式**: 全てのレスポンスに `success` フラグを含む
2. **詳細なエラー分類**: エラーコードと具体的なメッセージを提供
3. **ログ強化**: 認証の各段階で詳細なログを出力
4. **バリデーション強化**: 入力データの詳細なバリデーション

## 🚀 次のステップ

1. **会員登録機能の実装**
2. **パスワードリセット機能の実装**
3. **ダッシュボード機能の実装**
4. **セッション管理の強化**

## 📝 注意事項

- テストユーザーは開発環境専用です
- 本番環境では異なる認証設定が必要です
- トークンの有効期限は設定に依存します
