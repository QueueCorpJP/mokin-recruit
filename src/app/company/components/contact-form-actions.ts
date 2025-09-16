'use server';

import { sendEmailViaSendGrid } from '@/lib/email/sender';

export async function sendContactFormEmail(formData: {
  name: string;
  companyName: string;
  department: string;
  email: string;
  inquiryType: string;
  content: string;
}) {
  try {
    console.log('=== sendContactFormEmail開始 ===');
    console.log('フォームデータ:', formData);

    // メール送信
    console.log('メール送信中...');

    // 管理者への通知メール
    const adminEmailResult = await sendEmailViaSendGrid({
      to: process.env.SENDGRID_FROM_EMAIL!, // 管理者のメールアドレス
      subject: '【CuePoint】新しいお問い合わせ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f9058;">新しいお問い合わせ</h2>
          <p>以下の内容でお問い合わせがありました。</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #0f9058; margin-top: 0;">お問い合わせ詳細</h3>
            <p><strong>お名前:</strong> ${formData.name}</p>
            <p><strong>会社名:</strong> ${formData.companyName}</p>
            <p><strong>部署名・役職:</strong> ${formData.department || '未入力'}</p>
            <p><strong>メールアドレス:</strong> ${formData.email}</p>
            <p><strong>お問い合わせ種別:</strong> ${formData.inquiryType || '未選択'}</p>
            <p><strong>お問い合わせ内容:</strong></p>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border: 1px solid #ddd; border-radius: 3px;">${formData.content}</div>
          </div>

          <p style="color: #666; font-size: 12px;">このメールは自動送信です。</p>
        </div>
      `,
    });

    if (!adminEmailResult.success) {
      console.error('❌ 管理者メール送信エラー:', adminEmailResult.error);
      return {
        error:
          adminEmailResult.error ||
          'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。',
      };
    }

    // お客様への自動返信メール
    const customerEmailResult = await sendEmailViaSendGrid({
      to: formData.email,
      subject: '【CuePoint】お問い合わせ受付完了のお知らせ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f9058;">お問い合わせ受付完了</h2>
          <p>${formData.name} 様</p>
          <p>この度は、CuePointにお問い合わせいただき、誠にありがとうございます。</p>
          <p>以下の内容でお問い合わせを受け付けました。</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #0f9058; margin-top: 0;">お問い合わせ内容</h3>
            <p><strong>お名前:</strong> ${formData.name}</p>
            <p><strong>会社名:</strong> ${formData.companyName}</p>
            <p><strong>部署名・役職:</strong> ${formData.department || '未入力'}</p>
            <p><strong>メールアドレス:</strong> ${formData.email}</p>
            <p><strong>お問い合わせ種別:</strong> ${formData.inquiryType || '未選択'}</p>
            <p><strong>お問い合わせ内容:</strong></p>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border: 1px solid #ddd; border-radius: 3px;">${formData.content}</div>
          </div>

          <p style="color: #666;">担当者よりご返信させていただきます。しばらくお待ちください。</p>
          <p style="color: #666; font-size: 12px;">このメールは自動送信です。心当たりがない場合は、お手数ですが削除をお願いいたします。</p>
        </div>
      `,
    });

    if (!customerEmailResult.success) {
      console.error('❌ 顧客メール送信エラー:', customerEmailResult.error);
      return {
        error:
          customerEmailResult.error ||
          'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。',
      };
    }

    console.log(`✅ メール送信成功! 送信先: ${formData.email}`);
    console.log('管理者メッセージID:', adminEmailResult.messageId);
    console.log('顧客メッセージID:', customerEmailResult.messageId);

    console.log('=== sendContactFormEmail完了 ===');
    return { success: true };
  } catch (error) {
    console.error('❌ sendContactFormEmail全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}
