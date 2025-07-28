# 候補者登録 API フロー

新しい候補者登録フローは以下の3段階に分かれています：

## 1. 認証コード送信

**エンドポイント:** `POST /api/auth/register/candidate/send-code`

メールアドレスに認証コードを送信します。

### リクエスト

```json
{
  "email": "candidate@example.com"
}
```

### レスポンス

```json
{
  "success": true,
  "message": "認証コードをメールアドレスに送信しました。メールをご確認ください。",
  "data": {
    "email": "candidate@example.com"
  }
}
```

## 2. 認証コード確認

**エンドポイント:** `POST /api/auth/register/candidate/verify-code`

送信された認証コードを確認し、一時トークンを取得します。

### リクエスト

```json
{
  "email": "candidate@example.com",
  "code": "123456"
}
```

### レスポンス

```json
{
  "success": true,
  "message": "認証コードが確認されました。続いてパスワードを設定してください。",
  "data": {
    "email": "candidate@example.com",
    "userId": "uuid-string",
    "tempToken": "temporary-jwt-token",
    "expiresAt": 1234567890
  }
}
```

## 3. パスワード設定・登録完了

**エンドポイント:** `POST /api/auth/register/candidate/complete-registration`

パスワードを設定して登録を完了します。

### リクエスト

```json
{
  "email": "candidate@example.com",
  "password": "securepassword123",
  "tempToken": "temporary-jwt-token"
}
```

### レスポンス

```json
{
  "success": true,
  "message": "登録が完了しました。ログインしてください。",
  "data": {
    "userId": "uuid-string",
    "email": "candidate@example.com",
    "registrationCompleted": true
  }
}
```

## 4. 個人情報入力（オプション）

**エンドポイント:** `POST /api/auth/register/candidate/profile`

登録後に個人情報を入力します。

### リクエスト

```json
{
  "userId": "uuid-string",
  "lastName": "田中",
  "firstName": "太郎",
  "lastNameKana": "タナカ",
  "firstNameKana": "タロウ",
  "gender": "male",
  "birthDate": "1995-06-15",
  "phoneNumber": "090-1234-5678",
  "address": "東京都渋谷区...",
  "educationLevel": "university",
  "schoolName": "東京大学",
  "major": "情報工学",
  "graduationYear": 2018,
  "jobPreferences": {
    "preferredIndustries": ["IT", "エンジニアリング"],
    "preferredLocations": ["東京", "大阪"],
    "desiredSalary": 5000000,
    "workStyle": "full_time"
  }
}
```

### レスポンス

```json
{
  "success": true,
  "message": "プロフィール情報が保存されました",
  "data": {
    "userId": "uuid-string",
    "profileCompleted": true
  }
}
```

### プロフィール取得

**エンドポイント:** `GET /api/auth/register/candidate/profile?userId=uuid-string`

既存のプロフィール情報を取得します。

## フロントエンド実装例

```typescript
// 1. 認証コード送信
const sendVerificationCode = async (email: string) => {
  const response = await fetch('/api/auth/register/candidate/send-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

// 2. 認証コード確認
const verifyCode = async (email: string, code: string) => {
  const response = await fetch('/api/auth/register/candidate/verify-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return response.json();
};

// 3. パスワード設定・登録完了
const completeRegistration = async (email: string, password: string, tempToken: string) => {
  const response = await fetch('/api/auth/register/candidate/complete-registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, tempToken }),
  });
  return response.json();
};

// 4. プロフィール情報設定
const saveProfile = async (profileData: ProfileData) => {
  const response = await fetch('/api/auth/register/candidate/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return response.json();
};
```

## エラーハンドリング

各APIは以下の形式でエラーを返します：

```json
{
  "success": false,
  "message": "エラーメッセージ",
  "code": "ERROR_CODE", // オプション
  "errors": [...] // バリデーションエラーの場合
}
```

### 主なエラーコード

- `VERIFICATION_FAILED`: 認証コードの確認に失敗
- `INVALID_TEMP_TOKEN`: 一時トークンが無効
- `USER_NOT_FOUND`: ユーザーが見つからない

## セキュリティ考慮事項

1. **一時トークン**: 認証コード確認後に発行される一時トークンは、パスワード設定完了まで有効です。
2. **認証コード**: 認証コードは6桁の数字で、一定時間後に期限切れになります。
3. **レート制限**: 認証コード送信には適切なレート制限が適用されています。

## 既存APIとの互換性

既存の `/api/auth/register/candidate` エンドポイントはレガシー版として引き続き利用可能ですが、新しいフローの使用を推奨します。 