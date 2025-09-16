import { setApiKey, send } from '@sendgrid/mail';

// SendGrid APIキーを設定
if (process.env.SENDGRID_API_KEY) {
  setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * SendGridを使用してメールを送信する
 */
export async function sendEmailViaSendGrid(
  options: EmailOptions
): Promise<EmailResult> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable is not set');
    }

    if (!process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SENDGRID_FROM_EMAIL environment variable is not set');
    }

    const msg = {
      to: options.to,
      from: options.from || process.env.SENDGRID_FROM_EMAIL,
      subject: options.subject,
      html: options.html,
    };

    const response = await send(msg);

    // SendGridは成功時に配列を返し、最初の要素にレスポンス情報が含まれる
    const [responseData] = response;

    return {
      success: true,
      messageId: responseData.headers['x-message-id'] as string,
    };
  } catch (error) {
    console.error('SendGrid email sending failed:', error);

    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
