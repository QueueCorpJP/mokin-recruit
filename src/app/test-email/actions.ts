'use server';

import { sendEmailViaSendGrid } from '@/lib/email/sender';

export interface TestEmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * SendGridテスト用：実際にOTPメールを送信
 */
export async function testSendGridEmail(
  testEmail: string
): Promise<TestEmailResult> {
  try {
    // テスト用OTPコード生成（6桁ランダム）
    const otp = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10分後

    // HTMLメール内容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>【テスト】SendGrid動作確認</title>
      </head>
      <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0f9058;">【テスト】SendGrid動作確認</h1>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>認証コード（テスト用）</h2>
            <p style="font-size: 24px; font-weight: bold; color: #0f9058; text-align: center; letter-spacing: 4px;">
              ${otp}
            </p>
            <p style="color: #666; font-size: 14px;">
              有効期限: ${expiresAt.toLocaleString('ja-JP')}
            </p>
          </div>

          <p>このメールはSendGrid送信テスト用です。</p>
          <p>正常に受信できていれば、SendGridライブラリが正しく動作しています。</p>
        </div>
      </body>
      </html>
    `;

    // SendGrid経由で送信
    const result = await sendEmailViaSendGrid({
      to: testEmail,
      subject: '【テスト】SendGrid動作確認 - OTP認証コード',
      html: htmlContent,
    });

    return {
      success: result.success,
      error: result.error,
      messageId: result.messageId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: `テストメール送信エラー: ${error.message}`,
    };
  }
}
