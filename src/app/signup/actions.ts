'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { createClient } from '@supabase/supabase-js';

export interface SignupFormData {
  email: string;
}

export interface SignupResult {
  success: boolean;
  error?: string;
  message?: string;
}

// リクエストボディのバリデーションスキーマ
const SignupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

/**
 * OTP認証メールのHTML生成
 */
function generateOtpEmailHtml(otp: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>【CuePoint】認証コードのお知らせ</title>
    </head>
    <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #fff;">
        <div style="padding: 20px 0;">
          <p>${email} 様</p>

          <p>CuePointをご利用いただきありがとうございます。<br>
          認証コードは以下です。</p>

          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; margin: 20px 0; padding: 20px 0;">
            <p style="margin: 0; font-weight: bold;">■ 認証コード：${otp}</p>
          </div>

          <p><strong>【次のステップ】</strong><br>
          登録画面で上記コードを入力し、本登録を完了してください。<br>
          ※コードの有効期限は発行から24時間です。</p>

          <div style="border-top: 1px solid #ccc; margin-top: 40px; padding-top: 20px;">
            <p><strong>CuePoint</strong><br>
            <a href="https://cuepoint.jp/candidate" style="color: #0066cc;">https://cuepoint.jp/candidate</a></p>

            <p><strong>【お問い合わせ先】</strong><br>
            ${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}</p>

            <p>運営会社：メルセネール株式会社<br>
            東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 6桁のOTPコードを生成
 */
function generateOtp(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
}

export async function signupRequestAction(
  formData: SignupFormData
): Promise<SignupResult> {
  try {
    logger.info('Signup request received at:', new Date().toISOString());

    // ステップ1: SendGrid環境変数の確認
    if (!process.env.SENDGRID_API_KEY) {
      logger.error('Missing SENDGRID_API_KEY environment variable');
      return {
        success: false,
        error: 'メール送信設定が正しくありません。',
      };
    }

    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseActionClient } = await import(
      '@/lib/supabase/server-client'
    );
    const supabase = getSupabaseActionClient();

    // ステップ3: バリデーション
    const validationResult = SignupSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Signup validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { email } = validationResult.data;
    logger.info('Signup request details:', {
      email: email.substring(0, 3) + '***',
    });

    // ステップ5: 既存ユーザーチェック（candidatesテーブル）
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('candidates')
        .select('id, email')
        .eq('email', email.trim())
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        logger.error('Database check error:', checkError);
        return {
          success: false,
          error: 'ユーザー確認中にエラーが発生しました。',
        };
      }

      if (existingUser) {
        return {
          success: false,
          error: 'このメールアドレスは既に登録済みです。ログインしてください。',
        };
      }
    } catch (error) {
      logger.error('Error checking existing user:', error);
      return {
        success: false,
        error: 'ユーザー確認中にエラーが発生しました。',
      };
    }

    // ステップ5.5: Supabase Authでの既存ユーザーチェック
    try {
      const { getSupabaseAdminClient } = await import(
        '@/lib/supabase/server-client'
      );
      const supabaseAdmin = getSupabaseAdminClient();

      if (supabaseAdmin) {
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = authUsers.users?.find(
          user => user.email === email.trim()
        );

        if (existingAuthUser) {
          logger.warn(
            'User exists in Supabase Auth but not in candidates table:',
            {
              email: email.substring(0, 3) + '***',
              authUserId: existingAuthUser.id.substring(0, 8) + '***',
            }
          );
          return {
            success: false,
            error:
              'このメールアドレスは既に登録済みです。ログインしてください。',
          };
        }
      }
    } catch (authCheckError) {
      logger.warn('Could not check Supabase Auth users:', authCheckError);
      // Auth チェックに失敗しても処理を続行（candidatesテーブルのチェックは完了している）
    }

    // ステップ6: OTPコード生成
    const otp = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10分後

    // ステップ7: OTPをデータベースに保存
    try {
      const { error: otpSaveError } = await supabase
        .from('signup_verification_codes')
        .upsert(
          {
            email: email.trim(),
            verification_code: otp,
            expires_at: expiresAt.toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            onConflict: 'email',
          }
        );

      if (otpSaveError) {
        logger.error('Failed to save OTP:', otpSaveError);
        return {
          success: false,
          error: '認証コードの保存に失敗しました。',
        };
      }
    } catch (error) {
      logger.error('Error saving OTP:', error);
      return {
        success: false,
        error: '認証コードの保存中にエラーが発生しました。',
      };
    }

    // ステップ8: SendGridでOTPメール送信
    try {
      const emailResult = await sendEmailViaSendGrid({
        to: email.trim(),
        subject: '【CuePoint】認証コードのお知らせ',
        html: generateOtpEmailHtml(otp, email),
      });

      if (!emailResult.success) {
        logger.error('Failed to send OTP email:', emailResult.error);
        return {
          success: false,
          error:
            'メールの送信に失敗しました。しばらくしてから再度お試しください。',
        };
      }

      logger.info(
        `OTP email sent successfully to: ${email.substring(0, 3)}***`,
        { messageId: emailResult.messageId }
      );

      return {
        success: true,
        message:
          '認証コードをメールで送信しました。メールをご確認いただき、認証を完了してください。',
      };
    } catch (emailError) {
      logger.error('Email sending error:', emailError);
      return {
        success: false,
        error: 'メール送信中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in signup action:', error);

    return {
      success: false,
      error:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
