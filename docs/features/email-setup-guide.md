# 📧 メール送信設定ガイド

## 🚨 緊急対応 - メールが届かない問題の解決

パスワードリセットメールが届かない問題の原因と解決策をご説明します。

### 📋 問題の原因

1. **Supabaseデフォルトメール制限**: 本番環境では **1時間あたり3通まで** の厳しい制限
2. **SMTP設定未構成**: 独自のメールサーバーが設定されていない
3. **スパムフィルター**: デフォルトメールがスパム扱いされる可能性

---

## 🛠️ 即座の解決策

### 1. SendGrid設定（推奨）

#### **Step 1: SendGridアカウント作成**
1. [SendGrid](https://sendgrid.com/) にアクセス
2. 無料アカウントを作成（月間40,000通まで無料）
3. API Keyを生成

#### **Step 2: Vercelで環境変数設定**
```bash
# Vercelダッシュボードで以下を設定
SENDGRID_API_KEY=SG.your-sendgrid-api-key
```

#### **Step 3: Supabaseダッシュボード設定**
1. Supabaseプロジェクトにアクセス
2. **Authentication** → **Settings** → **SMTP Settings**
3. 以下を入力：
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [SendGrid API Key]
   Sender email: noreply@your-domain.com
   Sender name: Mokin Recruit
   ```

---

## 🔄 代替案

### 2. Mailgun設定

#### **設定値**
```
Host: smtp.mailgun.org
Port: 587
Username: postmaster@your-domain.mailgun.org
Password: [Mailgun SMTP Password]
```

#### **環境変数**
```bash
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.com
```

### 3. AWS SES設定

#### **設定値**
```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
Username: [AWS SMTP Username]
Password: [AWS SMTP Password]
```

#### **環境変数**
```bash
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SES_REGION=us-east-1
```

---

## 🧪 テスト手順

### 1. ローカルテスト
```bash
# 開発環境でInbucketを使用
npm run dev
# http://localhost:54324 でメール確認
```

### 2. 本番環境テスト
1. SMTP設定完了後
2. パスワードリセット実行
3. **実際のメールボックス確認**
4. スパムフォルダも確認

---

## 🔍 トラブルシューティング

### よくある問題と解決策

#### **問題1: "Authentication failed"**
- **原因**: API Keyが間違っている
- **解決**: SendGridのAPI Key再生成

#### **問題2: "Sender not verified"**
- **原因**: 送信者メールアドレスが未認証
- **解決**: SendGridでSender Authentication設定

#### **問題3: メールがスパム扱い**
- **原因**: SPF/DKIM設定不備
- **解決**: ドメイン認証設定

#### **問題4: 配信遅延**
- **原因**: プロバイダー制限
- **解決**: 少し時間を置いて確認

---

## 📊 配信状況の監視

### SendGrid Analytics
1. SendGridダッシュボード → Activity
2. 配信状況、エラー率を確認
3. バウンス・スパム報告を監視

### ログ確認
```bash
# Vercelログで確認
vercel logs --app=mokin-recruit-client

# 成功例
✅ Password reset email sent successfully

# エラー例
❌ SMTP authentication failed
```

---

## 🚀 本番環境での推奨設定

### 必須環境変数
```bash
# SendGrid（推奨）
SENDGRID_API_KEY=SG.your-api-key

# ドメイン設定
EMAIL_FROM=noreply@mokin-recruit.jp
EMAIL_FROM_NAME=Mokin Recruit
EMAIL_REPLY_TO=support@mokin-recruit.jp

# 監視設定
EMAIL_DELIVERY_WEBHOOK=https://your-domain.com/webhooks/email
```

### セキュリティ設定
- API Key定期ローテーション
- IP制限設定
- 配信レート制限
- バウンス処理自動化

---

## 📞 緊急時の対応

### 即座にできること
1. **別のメールアドレスでテスト**
2. **スパムフォルダ確認**
3. **SendGrid無料アカウント即座作成**
4. **Vercel環境変数即座設定**

### 暫定措置
```javascript
// 開発中のテスト用バイパス（本番では削除）
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Password reset link:', resetUrl);
}
```

---

## ✅ チェックリスト

- [ ] SendGridアカウント作成
- [ ] API Key生成
- [ ] Vercel環境変数設定
- [ ] Supabase SMTP設定
- [ ] テストメール送信
- [ ] 実メールボックス確認
- [ ] スパムフォルダ確認
- [ ] 配信ログ確認

---

**⚡ 緊急時は SendGrid の無料プランを即座に設定することで問題解決できます！** 