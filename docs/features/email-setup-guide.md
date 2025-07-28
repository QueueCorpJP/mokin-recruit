# 📧 メール送信設定ガイド

## 🚨 **緊急事項：現在のメール送信エラー**

**現在発生している問題**: `/recover | 500: Error sending recovery email`

### 📋 **問題の詳細**
- パスワードリセットリクエスト自体は正常に処理されている
- Supabaseデフォルトメール機能でメール送信時にエラーが発生
- **チームメンバーに入っていても本番環境で失敗する**
- `"error_code": "unexpected_failure"` - Supabaseデフォルトメール機能の本番環境制限

### ⚡ **即座の解決方法（5分で完了）**

#### **🎯 Resend SMTP設定（推奨）**

**ステップ1: Resendアカウント作成**
1. [https://resend.com](https://resend.com) にアクセス
2. 「Sign up」をクリック
3. メールアドレスとパスワードを入力してアカウント作成

**ステップ2: API Key取得**
1. Resendダッシュボードで「API Keys」をクリック
2. 「Create API Key」をクリック
3. 名前を入力（例：`mokin-recruit-smtp`）
4. 「Add」をクリック
5. **API Keyをコピー**（`re_xxxxxxxxxx`で始まる文字列）

**ステップ3: Supabase設定**
1. [Supabaseダッシュボード](https://supabase.com/dashboard/project/mjhqeagxibsklugikyma/settings/auth) → Settings → Auth
2. **SMTP Settings**セクションを見つける
3. 以下を入力：
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [先程コピーしたAPI Key]
   Sender email: noreply@yourdomain.com (※お持ちのドメイン)
   Sender name: Mokin Recruit
   ```
4. **Save**をクリック

**⚡ これで即座に解決します！**

---

#### **🔄 代替案: SendGrid設定**

**設定値**:
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [SendGrid API Key]
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
4. **本番環境での不安定性**: ベストエフォートベースでの提供

### 🔍 現在のエラーの特定方法

以下のエラーが発生している場合、メール送信制限に達している可能性があります：

```
/recover | 500: Error sending recovery email
"error_code": "unexpected_failure"
```

### ⏰ エラーの即座の解決

1. **カスタムSMTP設定**: すぐにでもカスタムSMTP設定を実装することを強く推奨
2. **Resend推奨**: 月3,000通無料、設定簡単、高い配信率

---

## 🛠️ 解決策

### 1. **即座の対応**（推奨）

#### A. **Resend SMTP設定**（5分で完了）
```bash
# 1. https://resend.com でアカウント作成
# 2. API キー取得（re_xxxxxxxxxx）
# 3. Supabaseダッシュボード → Settings → Auth → SMTP Settings
# 4. 上記の設定値を入力
```

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

## ✅ **まとめ**

**原因**: Supabaseデフォルトメール機能の本番環境での制限・不安定性
**解決**: カスタムSMTP設定（Resend推奨、5分で完了）

これで`/recover`エラーは解決し、安定したパスワードリセット機能が実現できます！ 