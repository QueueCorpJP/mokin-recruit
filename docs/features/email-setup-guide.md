# 📧 メール送信設定ガイド

## 🚨 **緊急事項：現在のメール送信エラー**

**現在発生している問題**: `/recover | 500: Error sending recovery email`

### 📋 **問題の詳細**
- パスワードリセットリクエスト自体は正常に処理されている
- Supabaseデフォルトメール機能でメール送信時にエラーが発生
- レート制限（30通/時間）には達していない

### ⚡ **即座の解決方法**

#### 1. **テスト対象の確認**
Supabaseデフォルトメール機能は**プロジェクトチームメンバーのメールアドレスにのみ**送信されます：

1. **Supabaseダッシュボード**の[Team設定](https://supabase.com/dashboard/org/_/team)を確認
2. **テスト用メールアドレス**がチームメンバーに追加されているか確認
3. **追加されていない場合**：チームメンバーとして追加するか、カスタムSMTP設定を実装

#### 2. **カスタムSMTP設定（推奨）**
```bash
# Supabaseダッシュボード → Settings → Auth → SMTP Settings
# または config.toml の設定を有効化：

[auth.email.smtp]
host = "smtp.resend.com"  # 例：Resend
port = 587
user = "resend"
pass = "YOUR_API_KEY"
admin_email = "noreply@yourdomain.com"
sender_name = "Your App Name"
```

---

## 🎯 現在の設定方針

**現在、Mokin RecruitではSupabaseのデフォルトメール機能を使用していますが、本番環境では制限があります。**

- 外部SMTPサーバー（SendGrid等）の設定を**強く推奨**
- Supabaseが提供するメール送信サービスは**開発用途のみ**
- 設定ファイル：`client/supabase/config.toml` でSMTP設定はコメントアウト済み

---

## 🚨 現在の制限とエラーについて

### 📋 Supabaseデフォルトメール機能の制限

**重要**: Supabaseのデフォルトメール機能には以下の**厳しい制限**があります：

1. **送信制限**: **認証されたドメインのみ**
   - プロジェクトチームメンバーのメールアドレスにのみ送信
   - 未認証のメールアドレスには**送信されない**
2. **開発目的のみ**: 本番環境での使用は**非推奨**
3. **配信保証なし**: メール配信のSLA保証なし

### 🔍 現在のエラーの特定方法

以下のエラーが発生している場合、メール送信制限に達している可能性があります：

```
/recover | 500: Error sending recovery email
```

### ⏰ エラーの即座の解決

1. **チームメンバー確認**: テスト用メールアドレスがSupabaseプロジェクトのチームメンバーになっているか確認
2. **カスタムSMTP設定**: すぐにでもカスタムSMTP設定を実装することを強く推奨

---

## 🛠️ 解決策

### 1. **即座の対応**（推奨）

#### A. チームメンバーとして追加
- Supabaseダッシュボードでテスト用メールアドレスをチームメンバーに追加
- 一時的な回避策として有効

#### B. カスタムSMTP設定（推奨）
```bash
# 推奨: Resend（無料で月3,000通）
# 1. https://resend.com でアカウント作成
# 2. API キー取得
# 3. Supabaseダッシュボード → Settings → Auth → SMTP Settings

# または config.toml で設定:
[auth.email.smtp]
host = "smtp.resend.com"
port = 587
user = "resend"
pass = "YOUR_RESEND_API_KEY"
admin_email = "noreply@yourdomain.com"
sender_name = "Mokin Recruit"
```

### 2. **恒久的解決（必須）**

#### **推奨SMTPプロバイダー**

1. **Resend**（推奨）
   - 月3,000通まで無料
   - 簡単設定、高い配信率
   - ドメイン認証サポート

2. **SendGrid**
   - 月40,000通まで無料（初月のみ）
   - 企業向け機能充実

3. **AWS SES**
   - 低コスト、高い信頼性
   - AWS環境との親和性

### 🔐 **セキュリティ対策の追加**
- DKIM、SPF、DMARC設定
- カスタムドメイン設定
- 定期的なセキュリティ監査

これで`/recover`エラーは解決し、安定したパスワードリセット機能が実現できます！ 