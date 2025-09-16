'use server';

import sgMail from '@sendgrid/mail';
import { logger } from '@/lib/server/utils/logger';
import { htmlToText } from 'html-to-text';
// SendGrid API設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

export interface MailMessage {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * SendGridの設定状況を確認
 */
export async function isSendgridConfigured(): Promise<boolean> {
  return Boolean(
    process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL
  );
}

/**
 * 送信者アドレスを取得
 */
export async function getFromAddress(): Promise<string | null> {
  return process.env.SENDGRID_FROM_EMAIL ?? null;
}

/**
 * SendGridを使用して単体メール送信
 * @param params メール送信パラメータ
 * @returns 送信結果
 */
export async function sendEmailViaSendGrid(
  params: EmailParams
): Promise<EmailResult> {
  try {
    // 環境変数チェック
    if (!process.env.SENDGRID_API_KEY) {
      logger.error('SENDGRID_API_KEY is not configured');
      return {
        success: false,
        error: 'メール送信設定が正しくありません',
      };
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      logger.error('SENDGRID_FROM_EMAIL is not configured');
      return {
        success: false,
        error: '送信者メールアドレスが設定されていません',
      };
    }

    // メール設定
    const msg: sgMail.MailDataRequired = {
      to: params.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
        name: 'Mokin Recruit',
      },
      subject: params.subject,
      html: params.html,
      text: params.text || htmlToText(params.html), // HTMLからテキスト生成
    };

    // SendGrid経由で送信
    const [response] = await sgMail.send(msg);

    logger.info('Email sent successfully via SendGrid', {
      to: params.to.substring(0, 3) + '***',
      subject: params.subject,
      messageId: response.headers['x-message-id'],
    });

    return {
      success: true,
      messageId: response.headers['x-message-id'] as string,
    };
  } catch (error: any) {
    logger.error('Failed to send email via SendGrid:', {
      error: error.message,
      response: error.response?.body,
      to: params.to.substring(0, 3) + '***',
      subject: params.subject,
    });

    let errorMessage = 'メールの送信に失敗しました';

    // SendGridのエラー詳細を解析
    if (error.response?.body?.errors) {
      const sendGridErrors = error.response.body.errors;
      if (
        sendGridErrors.some(
          (e: any) => e.field === 'from' || e.message.includes('from')
        )
      ) {
        errorMessage = '送信者メールアドレスが無効です';
      } else if (
        sendGridErrors.some(
          (e: any) => e.field === 'to' || e.message.includes('to')
        )
      ) {
        errorMessage = '送信先メールアドレスが無効です';
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * SendGridを使用して一括メール送信
 * @param messages メール送信リスト
 */
export async function sendBatch(messages: MailMessage[]): Promise<void> {
  if (!(await isSendgridConfigured())) {
    console.warn('SendGrid not configured. Skipping mail send.');
    return;
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    if (messages.length > 0) {
      await sgMail.send(messages as any, false);
      logger.info(`Batch email sent successfully via SendGrid`, {
        count: messages.length,
      });
    }
  } catch (error: any) {
    logger.error('Failed to send batch emails via SendGrid:', {
      error: error.message,
      response: error.response?.body,
      count: messages.length,
    });
    throw error;
  }
}
