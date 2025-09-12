import sgMail from '@sendgrid/mail';

export type MailMessage = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
};

export function isSendgridConfigured(): boolean {
  return Boolean(
    process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL
  );
}

export function getFromAddress(): string | null {
  return process.env.SENDGRID_FROM_EMAIL ?? null;
}

export async function sendBatch(messages: MailMessage[]): Promise<void> {
  if (!isSendgridConfigured()) {
    // eslint-disable-next-line no-console
    console.warn('SendGrid not configured. Skipping mail send.');
    return;
  }
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    if (messages.length > 0) {
      await sgMail.send(messages as any, false);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('SendGrid error:', e);
  }
}
