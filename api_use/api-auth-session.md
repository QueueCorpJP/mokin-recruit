# セッション管理API

## 基本情報
- **エンドポイント**: `/api/auth/session`
- **目的**: ユーザーセッションの取得、更新、削除
- **認証**: 必要（JWTトークンまたはクッキー）

## 機能概要
このAPIは、ユーザーのセッション情報を管理します。セッションの検証、更新、削除の機能を提供し、認証状態の確認とトークンのリフレッシュを行います。

## サポートするHTTPメソッド
- `GET`: セッション情報の取得
- `POST`: セッションの更新/リフレッシュ
- `DELETE`: セッションの削除

---

## GET - セッション情報の取得

### 目的
現在のユーザーセッションの有効性を確認し、ユーザー情報を取得します。

### リクエスト

#### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### リクエストボディ
なし

### レスポンス

#### 成功時（200 OK）
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "userType": "string",
    "name": "string",
    "emailConfirmed": boolean,
    "lastSignIn": "string (ISO date)"
  },
  "session": {
    "expiresAt": "string (ISO date)",
    "needsRefresh": boolean
  }
}
```

#### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "No authentication token provided"
}
```

---

## POST - セッションの更新/リフレッシュ

### 目的
期限切れまたは期限切れ間近のセッションを更新し、新しいトークンを取得します。

### リクエスト

#### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### リクエストボディ
```json
{
  "refreshToken": "string (optional)"
}
```

### レスポンス

#### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Session refreshed successfully",
  "token": "new_jwt_token_string",
  "user": {
    "id": "string",
    "email": "string",
    "userType": "string",
    "name": "string"
  },
  "session": {
    "expiresAt": "string (ISO date)"
  }
}
```

#### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

---

## DELETE - セッション削除

### 目的
ユーザーセッションを削除し、ログアウト処理を行います。

### リクエスト

#### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### リクエストボディ
なし

### レスポンス

#### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

---

## フロントエンドでの使用方法

### セッション確認の実装例
```typescript
const checkSession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return {
        isValid: true,
        user: data.user,
        needsRefresh: data.session.needsRefresh,
      };
    } else {
      return { isValid: false, error: data.error };
    }
  } catch (error) {
    return { isValid: false, error: 'Network error' };
  }
};
```

### セッション更新の実装例
```typescript
const refreshSession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('authToken', data.token);
      return { success: true, token: data.token, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

### セッション削除の実装例
```typescript
const deleteSession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('/api/auth/session', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    // 成功・失敗に関わらず、ローカルの認証情報をクリア
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return { success: data.success };
  } catch (error) {
    // エラーが発生してもローカル情報はクリア
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return { success: false, error: 'Network error' };
  }
};
```

### React Hookの実装例
```typescript
const useSession = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const result = await checkSession();
    
    if (result.isValid) {
      setUser(result.user);
      setIsAuthenticated(true);
      
      // リフレッシュが必要な場合は自動更新
      if (result.needsRefresh) {
        await refreshSession();
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, isLoading, isAuthenticated, checkAuth, refreshSession, deleteSession };
};
```

## エラーハンドリング
- 認証トークンが無効または未提供の場合は401エラー
- サーバーエラーは500ステータス
- セッション期限切れの場合は自動的にリフレッシュを試行すること
- リフレッシュに失敗した場合はログイン画面にリダイレクト

## セキュリティ考慮事項
- セッション情報には機密データを含まない
- トークンの自動リフレッシュ機能を活用する
- セッション削除時は確実にクライアント側の認証情報もクリア
- HTTPS環境での使用を前提とする

## 使用シナリオ
1. **アプリケーション起動時**: ユーザーの認証状態を確認
2. **定期的な認証チェック**: セッションの有効性を定期確認
3. **自動ログイン**: 有効なセッションがある場合の自動認証
4. **トークンリフレッシュ**: 期限切れ前のトークン更新
5. **ログアウト処理**: セッション削除による安全なログアウト 