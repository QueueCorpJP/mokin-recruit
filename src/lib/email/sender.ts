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
 * スカウト通知メールの送信パラメータ
 */
export interface ScoutNotificationParams {
  candidateEmail: string;
  candidateName: string;
  companyName: string;
  jobTitle?: string;
  messagePageUrl: string;
}

/**
 * スカウト通知メールを送信
 * @param params スカウト通知パラメータ
 * @returns 送信結果
 */
export async function sendScoutNotificationEmail(
  params: ScoutNotificationParams
): Promise<EmailResult> {
  try {
    const subject = `【CuePoint】${params.companyName}からスカウトが届きました`;

    const html = `
<html>
<body style="font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', 'メイリオ', Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb; font-size: 18px; margin-bottom: 20px;">【CuePoint】${params.companyName}からスカウトが届きました</h1>

    <p>${params.candidateName} 様</p>

    <p>${params.companyName} よりスカウトが届いています。<br>
    内容を確認の上、ご対応ください。</p>

    <div style="border: 2px solid #e5e7eb; padding: 20px; margin: 20px 0; background-color: #f9fafb;">
      <p style="margin: 0 0 10px 0;"><strong>■ 企業名：</strong>${params.companyName}</p>
      ${params.jobTitle ? `<p style="margin: 0 0 10px 0;"><strong>■ 求人タイトル：</strong>${params.jobTitle}</p>` : ''}
      <p style="margin: 0;"><strong>■ メッセージ詳細：</strong><a href="${params.messagePageUrl}" style="color: #2563eb;">こちらをクリック</a></p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0;"><strong>CuePoint</strong><br>
      <a href="https://cuepoint.jp/candidate" style="color: #2563eb;">https://cuepoint.jp/candidate</a></p>

      <p style="margin: 20px 0 0 0; font-size: 12px; color: #666;">
        <strong>【お問い合わせ先】</strong><br>
        ${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}<br><br>
        運営会社：メルセネール株式会社<br>
        東京都千代田区神田須田町１丁目３２番地 クレス不動産神田ビル
      </p>
    </div>
  </div>
</body>
</html>`;

    const text = `
【CuePoint】${params.companyName}からスカウトが届きました

${params.candidateName} 様

${params.companyName} よりスカウトが届いています。
内容を確認の上、ご対応ください。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
■ 企業名：${params.companyName}
${params.jobTitle ? `■ 求人タイトル：${params.jobTitle}` : ''}
■ メッセージ詳細：${params.messagePageUrl}
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

CuePoint
https://cuepoint.jp/candidate

【お問い合わせ先】
${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}

運営会社：メルセネール株式会社
東京都千代田区神田須田町１丁目３２番地 クレス不動産神田ビル
`;

    return await sendEmailViaSendGrid({
      to: params.candidateEmail,
      subject,
      html,
      text,
    });
  } catch (error: any) {
    logger.error('Failed to send scout notification email:', {
      error: error.message,
      candidateEmail: params.candidateEmail.substring(0, 3) + '***',
      companyName: params.companyName,
    });

    return {
      success: false,
      error: 'スカウト通知メールの送信に失敗しました',
    };
  }
}

/**
 * メッセージ通知メールの送信パラメータ
 */
export interface MessageNotificationParams {
  candidateEmail: string;
  candidateName: string;
  companyName: string;
  jobTitle?: string;
  messagePageUrl: string;
}

/**
 * メッセージ通知メールを送信
 * @param params メッセージ通知パラメータ
 * @returns 送信結果
 */
export async function sendMessageNotificationEmail(
  params: MessageNotificationParams
): Promise<EmailResult> {
  try {
    const subject = `【CuePoint】${params.companyName}からメッセージが届いています`;

    const html = `
<html>
<body style="font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', 'メイリオ', Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb; font-size: 18px; margin-bottom: 20px;">【CuePoint】${params.companyName}からメッセージが届いています</h1>

    <p>${params.candidateName} 様</p>

    <p>${params.companyName} 様からのメッセージが届きました。<br>
    下記よりご確認ください。</p>

    <div style="border: 2px solid #e5e7eb; padding: 20px; margin: 20px 0; background-color: #f9fafb;">
      <p style="margin: 0 0 10px 0;"><strong>■ 企業名：</strong>${params.companyName}</p>
      ${params.jobTitle ? `<p style="margin: 0 0 10px 0;"><strong>■ 求人タイトル：</strong>${params.jobTitle}</p>` : ''}
      <p style="margin: 0;"><strong>■ メッセージ詳細：</strong><a href="${params.messagePageUrl}" style="color: #2563eb;">こちらをクリック</a></p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0;"><strong>CuePoint</strong><br>
      <a href="https://cuepoint.jp/candidate" style="color: #2563eb;">https://cuepoint.jp/candidate</a></p>

      <p style="margin: 20px 0 0 0; font-size: 12px; color: #666;">
        <strong>【お問い合わせ先】</strong><br>
        ${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}<br><br>
        運営会社：メルセネール株式会社<br>
        東京都千代田区神田須田町１丁目３２番地 クレス不動産神田ビル
      </p>
    </div>
  </div>
</body>
</html>`;

    const text = `
【CuePoint】${params.companyName}からメッセージが届いています


${params.candidateName} 様

${params.companyName} 様からのメッセージが届きました。
下記よりご確認ください。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
■ 企業名：${params.companyName}
${params.jobTitle ? `■ 求人タイトル：${params.jobTitle}` : ''}
■ メッセージ詳細：${params.messagePageUrl}
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

CuePoint
https://cuepoint.jp/candidate

【お問い合わせ先】
${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}

運営会社：メルセネール株式会社
東京都千代田区神田須田町１丁目３２番地 クレス不動産神田ビル
`;

    return await sendEmailViaSendGrid({
      to: params.candidateEmail,
      subject,
      html,
      text,
    });
  } catch (error: any) {
    logger.error('Failed to send message notification email:', {
      error: error.message,
      candidateEmail: params.candidateEmail.substring(0, 3) + '***',
      companyName: params.companyName,
    });

    return {
      success: false,
      error: 'メッセージ通知メールの送信に失敗しました',
    };
  }
}

/**
 * メンバー招待メールの送信パラメータ
 */
export interface InvitationParams {
  inviteeEmail: string;
  companyName: string;
  groupName: string;
  invitationUrl: string;
}

/**
 * メンバー招待メールを送信
 * @param params 招待メールパラメータ
 * @returns 送信結果
 */
export async function sendInvitationEmail(
  params: InvitationParams
): Promise<EmailResult> {
  try {
    const subject = `【CuePoint】${params.companyName}様 ${params.groupName}に招待されています`;

    const html = `
<html>
<body style="font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', 'メイリオ', Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #2563eb; font-size: 18px; margin-bottom: 20px;">【CuePoint】${params.companyName}様 ${params.groupName}に招待されています</h1>

    <p>${params.companyName}<br>
    ご担当者様</p>

    <p>CuePointへの招待が届いています。<br>
    招待リンクから企業グループに参加してください。</p>

    <div style="border: 2px solid #e5e7eb; padding: 20px; margin: 20px 0; background-color: #f9fafb;">
      <p style="margin: 0 0 10px 0;"><strong>■ 企業名：</strong>${params.companyName}</p>
      <p style="margin: 0 0 10px 0;"><strong>■ 企業グループ名：</strong>${params.groupName}</p>
      <p style="margin: 0;"><strong>■ 招待リンク：</strong><a href="${params.invitationUrl}" style="color: #2563eb;">こちらをクリック</a></p>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0;"><strong>CuePoint</strong><br>
      <a href="https://cuepoint.jp/" style="color: #2563eb;">https://cuepoint.jp/</a></p>

      <p style="margin: 20px 0 0 0; font-size: 12px; color: #666;">
        <strong>【お問い合わせ先】</strong><br>
        ${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}<br><br>
        運営会社：メルセネール株式会社<br>
        東京都千代田区神田須田町１丁目３２番地 クレス不動産神田ビル
      </p>
    </div>
  </div>
</body>
</html>`;

    const text = `
【CuePoint】${params.companyName}様 ${params.groupName}に招待されています

${params.companyName}
ご担当者様

CuePointへの招待が届いています。
招待リンクから企業グループに参加してください。

──────────────────────────────
■ 企業名 ： ${params.companyName}
■ 企業グループ名 ： ${params.groupName}
■ 招待リンク ： ${params.invitationUrl}
──────────────────────────────

===============================

CuePoint
https://cuepoint.jp/

【お問い合わせ先】
${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}

運営会社：メルセネール株式会社
東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル
`;

    return await sendEmailViaSendGrid({
      to: params.inviteeEmail,
      subject,
      html,
      text,
    });
  } catch (error: any) {
    logger.error('Failed to send invitation email:', {
      error: error.message,
      inviteeEmail: params.inviteeEmail.substring(0, 3) + '***',
      companyName: params.companyName,
      groupName: params.groupName,
    });

    return {
      success: false,
      error: '招待メールの送信に失敗しました',
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
