import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'メールアドレスが無効です' },
        { status: 400 }
      );
    }

    const { default: sgMail } = await import('@sendgrid/mail');
    const apiKey = process.env.SENDGRID_API_KEY || '';
    const from = process.env.SENDGRID_FROM_EMAIL || '';
    if (!apiKey || !from) {
      return NextResponse.json(
        { success: false, error: 'SendGrid設定が不足しています' },
        { status: 500 }
      );
    }

    sgMail.setApiKey(apiKey);
    const msg = {
      to: email,
      from,
      subject: 'SendGrid テストメール',
      text: 'これはテストメールです',
      html: '<strong>これはテストメールです</strong>',
    } as any;

    const [response] = await sgMail.send(msg);
    const messageId = response?.headers?.['x-message-id'] || null;
    return NextResponse.json({ success: true, messageId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || '送信に失敗しました' },
      { status: 500 }
    );
  }
}
