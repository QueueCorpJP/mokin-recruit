# メール認証設定ガイド

## 重要: OTPコード送信のためのメールテンプレート設定

現在の実装では、Supabaseの標準OTP機能を使用してメールで認証コードを送信しています。

### 必要な設定

#### 1. Supabaseダッシュボードでのメールテンプレート設定

1. Supabaseダッシュボードにログイン
2. Authentication → Email Templates に移動
3. **Magic Link** テンプレートを編集
4. テンプレート内容を以下のように変更:

```html
<h2>認証コード</h2>

<p>以下の認証コードを入力してください: <strong>{{ .Token }}</strong></p>

<p>このコードは{{ .TokenValidityDuration }}間有効です。</p>
```

#### 2. 重要なポイント

- `{{ .Token }}` 変数を使用することで、Magic Linkの代わりにOTPコードが表示されます
- `{{ .ConfirmationURL }}` ではなく `{{ .Token }}` を使用する必要があります
- Magic LinkテンプレートとOTPは同じ実装を共有しているため、Magic Linkテンプレートを変更します

### 現在の実装の動作

1. `signInWithOtp()` でOTPコードを生成・送信
2. Magic Linkテンプレートが使用される
3. テンプレートに `{{ .Token }}` が設定されていれば、6桁のOTPコードがメールに表示される
4. ユーザーがコードを入力して `verifyOtp()` で認証

### トラブルシューティング

**問題**: メールにパスワードリセットリンクが表示される
**原因**: Magic Linkテンプレートに `{{ .ConfirmationURL }}` が設定されている
**解決**: テンプレートを `{{ .Token }}` に変更する

**問題**: メールが送信されない
**原因**: Supabaseのメール制限またはSMTP設定の問題
**解決**: カスタムSMTPプロバイダーの設定を検討

### 参考資料

- [Supabase Email OTP Documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)