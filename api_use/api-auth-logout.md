# ログアウトAPI

## 基本情報
- **エンドポイント**: `POST /api/auth/logout`
- **目的**: ユーザーセッションの終了と認証トークンの無効化
- **認証**: 必要（JWTトークンまたはクッキー）

## 機能概要
このAPIは、ユーザーのセッションを終了し、認証トークンを無効化します。ログアウト処理により、認証が必要なAPIへのアクセスができなくなります。

## リクエスト

### HTTPメソッド
`POST`

### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

### リクエストボディ
```json
{}
```
*空のオブジェクトまたは空のボディ*

### 認証方法
以下のいずれかの方法で認証トークンを提供：
1. **Authorizationヘッダー**: `Bearer <jwt_token>`
2. **Cookie**: `supabase-auth-token=<jwt_token>`

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "message": "No valid authentication token provided"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. ユーザーがログアウトボタンをクリック
2. 保存されている認証トークンを取得
3. APIにPOSTリクエストを送信
4. ローカルストレージやクッキーからトークンを削除
5. アプリケーション状態をクリア
6. ログインページにリダイレクト

### 実装例（JavaScript/TypeScript）
```typescript
const logoutUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    // 成功・失敗に関わらず、フロントエンドの認証情報をクリア
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Cookieもクリア（可能であれば）
    document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    return { success: true };
  } catch (error) {
    // エラーが発生してもローカルの認証情報はクリア
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: false, error: 'Network error' };
  }
};
```

### React Hookの例
```typescript
const useLogout = () => {
  const logout = useCallback(async () => {
    await logoutUser();
    // アプリケーション状態をリセット
    // 例: setUser(null), setIsAuthenticated(false)
  }, []);

  return logout;
};
```

## エラーハンドリング
- 認証トークンが無効または未提供の場合は401エラー
- サーバーエラーは500ステータス
- フロントエンドでは、APIエラーに関わらずローカルの認証情報をクリアすることを推奨

## セキュリティ考慮事項
- ログアウト後は認証トークンが無効化される
- フロントエンドでも確実にトークンと認証状態をクリアすること
- ログアウト処理は冪等性がある（複数回実行しても安全）

## 注意事項
- このAPIは認証トークンの有効性をチェックしますが、無効なトークンでもログアウト操作は受け付けられます
- ログアウト後は全ての認証が必要なAPIへのアクセスが無効になります 