# パスワードリセット要求API

## 基本情報
- **エンドポイント**: `POST /api/auth/reset-password/request`
- **目的**: パスワードリセットの要求とリセットメールの送信
- **認証**: 不要（パスワードを忘れた状態のため）

## 機能概要
このAPIは、ユーザーがパスワードを忘れた際にリセット要求を行うためのエンドポイントです。メールアドレスを受け取り、Supabaseを通じてパスワードリセット用のメールを送信します。

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
  "email": "string (required)"
}
```

#### パラメータ詳細
- **email**: パスワードをリセットしたいアカウントのメールアドレス
  - 必須
  - 有効なメールアドレス形式

### リクエスト例
```json
{
  "email": "user@example.com"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "パスワードリセットメールを送信しました。メールをご確認ください。"
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "message": "有効なメールアドレスを入力してください"
}
```

### エラー時（404 Not Found）
```json
{
  "success": false,
  "message": "指定されたメールアドレスのアカウントが見つかりません"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "message": "サーバー設定エラーが発生しました。"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. パスワードリセットフォームからメールアドレスを取得
2. メールアドレスのバリデーションを実行
3. APIにPOSTリクエストを送信
4. 成功時は確認メッセージを表示
5. ユーザーにメールチェックを促すメッセージを表示

### 実装例（JavaScript/TypeScript）
```typescript
const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch('/api/auth/reset-password/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました。再度お試しください。',
    };
  }
};
```

### React コンポーネントの実装例
```typescript
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    const result = await requestPasswordReset(email);

    if (result.success) {
      setMessage(result.message);
      setEmail(''); // フォームをリセット
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting || !email}>
        {isSubmitting ? '送信中...' : 'リセットメールを送信'}
      </button>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

### バリデーション例
```typescript
const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'メールアドレスを入力してください';
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return '有効なメールアドレスを入力してください';
  }
  
  return null;
};
```

## エラーハンドリング
- バリデーションエラーは400ステータス
- 存在しないメールアドレスは404ステータス（セキュリティ上、同様のメッセージを返す場合もあり）
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## セキュリティ考慮事項
- メールアドレスの存在確認は慎重に行う（セキュリティ上、存在しない場合でも成功メッセージを返す場合がある）
- レート制限により、同一IPアドレスからの過度なリクエストを制限
- HTTPS必須
- リセットメールには期限がある（通常24時間）

## 注意事項
- このAPIはメール送信のトリガーのみを行います
- 実際のパスワードリセット処理は `/api/auth/reset-password` で行います
- ユーザーにはメールチェックとスパムフォルダの確認を促すことを推奨
- メールが届かない場合の再送信機能も検討してください

## メール内容
送信されるメールには以下が含まれます：
- パスワードリセット用のURL
- トークンまたはコード（URL内に含まれる）
- 有効期限の情報
- リセットを要求していない場合の注意書き 