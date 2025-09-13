'use server';

import { ERROR_CODES, createError } from '@/constants/error-codes';
import nodemailer from 'nodemailer';
import { maskEmail , safeLog} from '@/lib/utils/pii-safe-logger';

export async function sendContactFormEmail(formData: {
  name: string;
  companyName: string;
  department: string;
  email: string;
  inquiryType: string;
  content: string;
}) {
  try {
    if (process.env.NODE_ENV === 'development') safeLog('debug', '=== sendContactFormEmail開始 ===');
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'フォームデータ:', formData);

    // Gmail SMTPでメール送信
    if (process.env.NODE_ENV === 'development') safeLog('debug', 'メール送信設定を確認中...');

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      if (process.env.NODE_ENV === 'development') safeLog('debug', 'Gmail設定が不完全です');
      return { error: 'メール送信設定が正しく構成されていません' };
    }

    try {
      if (process.env.NODE_ENV === 'development') safeLog('debug', 'Gmail SMTPトランスポーターを作成中...');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') // スペースを削除
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      if (process.env.NODE_ENV === 'development') safeLog('debug', 'メール送信中...');
      
      // 管理者への通知メール
      const adminMsg = {
        to: process.env.SENDGRID_FROM_EMAIL, // 管理者のメールアドレス
        from: process.env.SENDGRID_FROM_EMAIL,
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
        `
      };
      
      await sgMail.send(adminMsg);

      // お客様への自動返信メール
      const customerMsg = {
        to: formData.email,
        from: process.env.SENDGRID_FROM_EMAIL,
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
        `
      };
      
      await sgMail.send(customerMsg);
      
      if (process.env.NODE_ENV === 'development') console.log(`✅ メール送信成功! 送信先: ${maskEmail(formData.email)}`);
      
    } catch (emailErr) {
      safeLog('error', '❌ メール送信エラー:', emailErr);
      return { error: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。' };
    }
    
    safeLog('info', '=== sendContactFormEmail完了 ===');
    return { success: true };
  } catch (error) {
    safeLog('error', '❌ sendContactFormEmail全体エラー:', error);
    return { error: 'システムエラーが発生しました' };
  }
}