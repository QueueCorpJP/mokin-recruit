# SupabaseカスタムSMTP設定ガイド

## 1. SMTPプロバイダーの選択

### Gmail SMTP (推奨)
```
SMTP Server: smtp.gmail.com
Port: 587 (TLS) or 465 (SSL)
Username: your-email@gmail.com
Password: アプリパスワード
```

### SendGrid SMTP
```
SMTP Server: smtp.sendgrid.net
Port: 587
Username: apikey
Password: SendGrid APIキー
```

## 2. Supabaseダッシュボード設定

1. Supabaseプロジェクト > Settings > Authentication
2. SMTP Settings セクションに移動
3. 以下を設定：

```
Enable custom SMTP: ON
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Pass: your-app-password
SMTP Admin Email: your-email@gmail.com
SMTP Sender Name: モキンリクルート
```

## 3. メールテンプレートのカスタマイズ

Supabase Auth > Email Templates で以下をカスタマイズ：

### Reset Password Template
```html
<h2>パスワードリセットのご案内</h2>
<p>{{ .SiteName }}をご利用いただき、ありがとうございます。</p>
<p>パスワードリセットのご依頼を承りました。</p>
<p><a href="{{ .ConfirmationURL }}">新しいパスワードを設定する</a></p>
<p>※ このリンクは1時間有効です。</p>
```

## 4. 元のAPIルートに戻す

```typescript
// src/app/api/auth/reset-password/request/route.ts
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const { email, userType } = await request.json();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password/complete?type=${userType}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'パスワードリセット用のリンクを送信しました。' 
  });
}
```

## 5. 必要な環境変数

```bash
# 基本のSupabase設定のみ
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=https://your-domain.com
``` 