# パスワードリセットAPI

## 基本情報
- **エンドポイント**: `POST /api/auth/reset-password`
- **目的**: パスワードリセットメールから受信したトークンを使用してパスワードを変更
- **認証**: リセットトークンが必要

## 機能概要
このAPIは、パスワードリセットメールから取得したトークンを使用して、ユーザーのパスワードを新しいパスワードに変更します。複数の認証パラメータ形式に対応しています。

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
  "tokenHash": "string (optional)",
  "type": "string (optional)",
  "accessToken": "string (optional)",
  "refreshToken": "string (optional)",
  "code": "string (optional)",
  "state": "string (optional)",
  "password": "string (required)",
  "confirmPassword": "string (required)"
}
```

#### パラメータ詳細

##### 認証パラメータ（いずれか必須）
- **tokenHash**: 従来のtokenハッシュベースの認証
- **accessToken + refreshToken**: 新しいトークンベースの認証
- **code**: OAuth/PKCEベースの認証コード

##### パスワード情報（必須）
- **password**: 新しいパスワード
  - 必須
  - 8文字以上
  - 半角英数字・記号のみ
  - 英数字を含む必要がある
- **confirmPassword**: パスワード確認
  - 必須
  - passwordと完全一致する必要がある

##### その他のオプションパラメータ
- **type**: トークンタイプ（tokenHashと併用）
- **state**: OAuth状態パラメータ（codeと併用）

### リクエスト例

#### tokenHashを使用する場合
```json
{
  "tokenHash": "abc123def456",
  "type": "recovery",
  "password": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```

#### codeを使用する場合
```json
{
  "code": "recovery_code_123",
  "password": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "パスワードが正常に更新されました",
  "user": {
    "id": "string",
    "email": "string",
    "emailConfirmed": boolean
  }
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "message": "入力データが無効です",
  "errors": [
    {
      "field": "password",
      "message": "パスワードは8文字以上で入力してください"
    },
    {
      "field": "confirmPassword",
      "message": "パスワードが一致しません"
    }
  ]
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "message": "無効または期限切れのリセットトークンです"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "message": "サーバーエラーが発生しました"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. パスワードリセットメールのリンクからページにアクセス
2. URLパラメータからトークン情報を取得
3. 新しいパスワードフォームを表示
4. パスワードとパスワード確認を入力
5. バリデーションを実行
6. APIにPOSTリクエストを送信
7. 成功時はログインページにリダイレクト

### 実装例（JavaScript/TypeScript）
```typescript
interface ResetPasswordData {
  tokenHash?: string;
  type?: string;
  accessToken?: string;
  refreshToken?: string;
  code?: string;
  state?: string;
  password: string;
  confirmPassword: string;
}

const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: result.message,
        user: result.user,
      };
    } else {
      return {
        success: false,
        error: result.message,
        errors: result.errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました',
    };
  }
};
```

### URLパラメータ解析の実装例
```typescript
const parseResetTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  // 複数の形式に対応
  return {
    tokenHash: urlParams.get('token_hash') || hashParams.get('token_hash'),
    type: urlParams.get('type') || hashParams.get('type'),
    accessToken: hashParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token'),
    code: urlParams.get('code'),
    state: urlParams.get('state'),
  };
};
```

### React コンポーネントの実装例
```typescript
const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tokenData = useMemo(() => parseResetTokenFromUrl(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setErrors({});

    const result = await resetPassword({
      ...tokenData,
      password,
      confirmPassword,
    });

    if (result.success) {
      // 成功時の処理（ログインページにリダイレクトなど）
      alert('パスワードが更新されました。ログインページに移動します。');
      window.location.href = '/auth/login';
    } else {
      setError(result.error);
      if (result.errors) {
        const errorMap: Record<string, string> = {};
        result.errors.forEach((err: any) => {
          errorMap[err.field] = err.message;
        });
        setErrors(errorMap);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="新しいパスワード"
        required
        disabled={isSubmitting}
      />
      {errors.password && <div className="error">{errors.password}</div>}
      
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="パスワード確認"
        required
        disabled={isSubmitting}
      />
      {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '更新中...' : 'パスワードを更新'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

### パスワードバリデーション例
```typescript
const validatePassword = (password: string, confirmPassword: string) => {
  const errors: Record<string, string> = {};

  if (!password) {
    errors.password = 'パスワードを入力してください';
  } else if (password.length < 8) {
    errors.password = 'パスワードは8文字以上で入力してください';
  } else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password)) {
    errors.password = '半角英数字・記号のみ使用できます';
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    errors.password = '英数字を含めてください';
  }

  if (!confirmPassword) {
    errors.confirmPassword = '確認パスワードを入力してください';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'パスワードが一致しません';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

## エラーハンドリング
- バリデーションエラーは400ステータスで詳細情報を含む
- 無効なトークンは401ステータス
- サーバーエラーは500ステータス
- トークンが無い場合や期限切れの場合は適切にエラーメッセージを表示

## セキュリティ考慮事項
- リセットトークンは一度きりの使用
- トークンには有効期限がある（通常24時間）
- パスワードは適切な強度要件を満たす必要がある
- HTTPS必須
- パスワード更新後は他のセッションが無効化される場合がある

## 注意事項
- 複数の認証パラメータ形式に対応しているため、URLの形式を確認してください
- パスワード更新成功後は、ユーザーを適切なページ（ログイン画面など）にリダイレクトしてください
- トークンが無効な場合は、新たにパスワードリセット要求を行うよう案内してください 