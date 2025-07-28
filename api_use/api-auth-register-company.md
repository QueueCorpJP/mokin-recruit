# 企業登録API

## 基本情報
- **エンドポイント**: `POST /api/auth/register/company`
- **目的**: 企業ユーザーの新規アカウント作成
- **認証**: 不要（新規登録のため）

## 機能概要
このAPIは、企業ユーザーの新規アカウントを作成します。メールアドレス、パスワード、氏名、企業アカウントIDなどの情報を受け取り、アカウント作成後に認証トークンを返却します。

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
  "fullName": "string (required)",
  "companyAccountId": "string (required)",
  "positionTitle": "string (optional)"
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
- **fullName**: 氏名（フルネーム）
  - 必須
  - 1文字以上
- **companyAccountId**: 企業アカウントID
  - 必須
  - 1文字以上
  - 企業を識別するためのID
- **positionTitle**: 役職・職位
  - オプション

### リクエスト例
```json
{
  "email": "hr@company.com",
  "password": "securepassword123",
  "fullName": "山田花子",
  "companyAccountId": "company-001",
  "positionTitle": "人事部長"
}
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "Company user registration successful",
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "companyAccountId": "string",
    "positionTitle": "string",
    "userType": "company"
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
    },
    {
      "field": "companyAccountId",
      "message": "Company account ID is required"
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
1. 企業登録フォームからユーザー情報を取得
2. バリデーションを実行
3. APIにPOSTリクエストを送信
4. レスポンスでトークンとユーザー情報を受信
5. トークンをローカルストレージまたはクッキーに保存
6. ユーザー情報をアプリケーション状態に設定
7. 企業ダッシュボードにリダイレクト

### 実装例（JavaScript/TypeScript）
```typescript
interface CompanyRegistrationData {
  email: string;
  password: string;
  fullName: string;
  companyAccountId: string;
  positionTitle?: string;
}

const registerCompanyUser = async (data: CompanyRegistrationData) => {
  try {
    const response = await fetch('/api/auth/register/company', {
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
const validateCompanyRegistration = (data: CompanyRegistrationData) => {
  const errors: Record<string, string> = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'パスワードは8文字以上で入力してください';
  }

  if (!data.fullName) {
    errors.fullName = '氏名を入力してください';
  }

  if (!data.companyAccountId) {
    errors.companyAccountId = '企業アカウントIDを入力してください';
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
- 企業アカウントIDは適切に管理されること
- 登録後は自動的にログイン状態になる

## 注意事項
- 企業アカウントIDは企業を一意に識別するためのIDです
- 同一企業内で複数のユーザーが登録する場合は、同じcompanyAccountIdを使用
- 登録成功後は企業向けの機能（求人投稿、候補者管理など）が利用可能になります
- 役職情報は後から変更可能ですが、登録時に設定することを推奨します 