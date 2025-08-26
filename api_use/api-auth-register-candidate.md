# 候補者登録API

## 基本情報
- **エンドポイント**: `POST /api/auth/register/candidate`
- **目的**: 候補者（求職者）の新規アカウント作成
- **認証**: 不要（新規登録のため）

## 機能概要
このAPIは、求職者（候補者）の新規アカウントを作成します。メールアドレス、パスワード、氏名などの基本情報を受け取り、アカウント作成後に認証トークンを返却します。

**注意**: このAPIはレガシー版です。新しい登録フローでは以下のエンドポイントの使用を推奨します：
- `/api/auth/register/candidate/send-code`
- `/api/auth/register/candidate/verify-code`
- `/api/auth/register/candidate/complete-registration`
- `/api/auth/register/candidate/profile`

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
  "lastName": "string (required)",
  "firstName": "string (required)",
  "lastNameKana": "string (optional)",
  "firstNameKana": "string (optional)",
  "gender": "string (optional)"
}
```

#### パラメータ詳細
- **email**: メールアドレス
  - 必須
  - 有効なメールアドレス形式
  - 既存ユーザーと重複不可
- **password**: パスワード
  - 必須
  - 最低8文字
- **lastName**: 姓
  - 必須
  - 1文字以上
- **firstName**: 名
  - 必須
  - 1文字以上
- **lastNameKana**: 姓（カナ）
  - オプション
- **firstNameKana**: 名（カナ）
  - オプション
- **gender**: 性別
  - オプション

### リクエスト例
```json
{
  "email": "candidate@example.com",
  "password": "securepassword123",
  "lastName": "田中",
  "firstName": "太郎",
  "lastNameKana": "タナカ",
  "firstNameKana": "タロウ",
  "gender": "male"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Candidate registration successful",
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "email": "string",
    "lastName": "string",
    "firstName": "string",
    "lastNameKana": "string",
    "firstNameKana": "string",
    "gender": "string",
    "userType": "candidate"
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
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### エラー時（409 Conflict）
```json
{
  "success": false,
  "message": "Email already exists"
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
1. 登録フォームからユーザー情報を取得
2. バリデーションを実行
3. APIにPOSTリクエストを送信
4. レスポンスでトークンとユーザー情報を受信
5. トークンをローカルストレージまたはクッキーに保存
6. ユーザー情報をアプリケーション状態に設定
7. プロフィール完成ページまたはダッシュボードにリダイレクト

### 実装例（JavaScript/TypeScript）
```typescript
interface CandidateRegistrationData {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  gender?: string;
}

const registerCandidate = async (data: CandidateRegistrationData) => {
  try {
    const response = await fetch('/api/auth/register/candidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      // 登録成功
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return { success: true, user: result.user };
    } else {
      // 登録失敗
      return { success: false, error: result.message, errors: result.errors };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

### フォームバリデーション例
```typescript
const validateCandidateRegistration = (data: CandidateRegistrationData) => {
  const errors: Record<string, string> = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'パスワードは8文字以上で入力してください';
  }

  if (!data.lastName) {
    errors.lastName = '姓を入力してください';
  }

  if (!data.firstName) {
    errors.firstName = '名を入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

## エラーハンドリング
- バリデーションエラーは400ステータスで詳細なエラー情報を含む
- メールアドレス重複は409ステータス
- サーバーエラーは500ステータス
- フロントエンドでは各エラーを適切に表示すること

## セキュリティ考慮事項
- パスワードは平文で送信されるため、HTTPS必須
- メールアドレスの重複チェックが実装されている
- 登録後は自動的にログイン状態になる

## 注意事項
- このAPIはレガシー版のため、新規開発では新しい登録フローの使用を推奨
- 登録成功後は追加のプロフィール情報の入力が必要な場合がある
- メール認証が必要な場合は、別途認証フローを実装すること 