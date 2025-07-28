# ログインAPI

## 基本情報
- **エンドポイント**: `POST /api/auth/login`
- **目的**: ユーザー（候補者・企業）の認証とセッション開始
- **認証**: 不要（ログイン前）

## 機能概要
このAPIは、メールアドレスとパスワードを使用してユーザーの認証を行い、認証成功時にJWTトークンとユーザー情報を返却します。候補者と企業ユーザーの両方に対応しています。

## リクエスト

### HTTPメソッド
`POST`

### リクエストヘッダー
```
Content-Type: application/json
```

### リクエストボディ
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "userType": "string (optional)"
}
```

#### パラメータ詳細
- **email**: ユーザーのメールアドレス
  - 必須
  - 有効なメールアドレス形式
- **password**: ユーザーのパスワード
  - 必須
  - 最低8文字
- **userType**: ユーザータイプ（候補者または企業）
  - オプション
  - 指定しない場合はデフォルト認証フロー

### リクエスト例
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "candidate"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "email": "string",
    "userType": "string",
    "name": "string"
  }
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Cookie設定
ログイン成功時に以下のクッキーが自動的に設定されます：
- **supabase-auth-token**: JWTトークン（HttpOnly、7日間有効）

## フロントエンドでの使用方法

### 期待される処理フロー
1. フォームからメールアドレスとパスワードを取得
2. APIにPOSTリクエストを送信
3. レスポンスでトークンとユーザー情報を受信
4. トークンをローカルストレージまたはクッキーに保存
5. ユーザー情報をアプリケーション状態に設定
6. 適切なページにリダイレクト

### 実装例（JavaScript/TypeScript）
```typescript
const loginUser = async (email: string, password: string, userType?: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, userType }),
    });

    const data = await response.json();

    if (data.success) {
      // ログイン成功
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      // ログイン失敗
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

## エラーハンドリング
- バリデーションエラーは400ステータスで詳細なエラー情報を含む
- 認証失敗は401ステータス
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## セキュリティ考慮事項
- パスワードは平文で送信されるため、HTTPS必須
- レスポンスのトークンは適切に保存・管理すること
- ログイン試行のレート制限が適用される場合がある 