'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { createClient } from '@supabase/supabase-js';

export interface CandidateResetPasswordFormData {
  email: string;
}

export interface CandidateResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

// リクエストボディのバリデーションスキーマ
const ResetPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

/**
 * パスワードリセット用OTPメールのHTML生成
 */
function generateResetPasswordEmailHtml(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>【Mokin Recruit】パスワードリセット認証コード</title>
    </head>
    <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f9058; font-size: 24px; margin: 0;">Mokin Recruit</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333; font-size: 18px; margin-top: 0;">パスワードリセット認証コード</h2>

          <p>以下の6桁の認証コードを入力して、パスワードリセットを完了してください：</p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #fff; border: 2px solid #0f9058; border-radius: 8px; padding: 20px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #0f9058; letter-spacing: 8px;">${otp}</span>
            </div>
          </div>

          <p style="color: #666; font-size: 14px;">
            ※ この認証コードの有効期限は10分間です。<br>
            ※ 第三者と共有しないでください。
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>このメールに心当たりがない場合は、このメールを削除してください。</p>
          <p>© 2024 Mokin Recruit. All rights reserved.</p>
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

export async function candidateResetPasswordRequestAction(
  formData: CandidateResetPasswordFormData
): Promise<CandidateResetPasswordResult> {
  try {
    logger.info(
      'Candidate password reset request received at:',
      new Date().toISOString()
    );

    // ステップ1: SendGrid環境変数の確認
    if (!process.env.SENDGRID_API_KEY) {
      logger.error('Missing SENDGRID_API_KEY environment variable');
      return {
        success: false,
        error: 'メール送信設定が正しくありません。',
      };
    }

    // ステップ2: Supabase環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
      });
      return {
        success: false,
        error: 'データベース設定エラーが発生しました。',
      };
    }

    // ステップ3: バリデーション
    const validationResult = ResetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Reset password validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { email } = validationResult.data;
    logger.info('Reset password request details:', {
      email: email.substring(0, 3) + '***',
    });

    // ステップ4: Supabaseクライアントの作成
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
      });
    } catch (clientError) {
      logger.error('Failed to create Supabase client:', clientError);
      return {
        success: false,
        error: 'データベース接続の初期化に失敗しました。',
      };
    }

    // ステップ5: 既存候補者ユーザーチェック
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('candidate_accounts')
        .select('id, email, email_verified')
        .eq('email', email.trim())
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        logger.error('Database check error:', checkError);
        return {
          success: false,
          error: 'ユーザー確認中にエラーが発生しました。',
        };
      }

      if (!existingUser) {
        // セキュリティ上、メールアドレスの存在に関係なく成功レスポンスを返す
        return {
          success: true,
          message:
            'パスワードリセット用の認証コードをメールで送信しました。メールをご確認ください。',
        };
      }

      if (!existingUser.email_verified) {
        return {
          success: false,
          error: 'このアカウントはまだメール認証が完了していません。',
        };
      }
    } catch (error) {
      logger.error('Error checking existing user:', error);
      return {
        success: false,
        error: 'ユーザー確認中にエラーが発生しました。',
      };
    }

    // ステップ6: OTPコード生成
    const otp = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10分後

    // ステップ7: OTPをデータベースに保存
    try {
      const { error: otpSaveError } = await supabase
        .from('email_verification_codes')
        .upsert(
          {
            email: email.trim(),
            code: otp,
            expires_at: expiresAt.toISOString(),
            type: 'password-reset',
            created_at: new Date().toISOString(),
          },
          {
            onConflict: 'email,type',
          }
        );

      if (otpSaveError) {
        logger.error('Failed to save password reset OTP:', otpSaveError);
        return {
          success: false,
          error: '認証コードの保存に失敗しました。',
        };
      }
    } catch (error) {
      logger.error('Error saving password reset OTP:', error);
      return {
        success: false,
        error: '認証コードの保存中にエラーが発生しました。',
      };
    }

    // ステップ8: SendGridでOTPメール送信
    try {
      const emailResult = await sendEmailViaSendGrid({
        to: email.trim(),
        subject: '【Mokin Recruit】パスワードリセット認証コード',
        html: generateResetPasswordEmailHtml(otp),
      });

      if (!emailResult.success) {
        logger.error(
          'Failed to send password reset OTP email:',
          emailResult.error
        );
        return {
          success: false,
          error:
            'メールの送信に失敗しました。しばらくしてから再度お試しください。',
        };
      }

      logger.info(
        `Password reset OTP email sent successfully to: ${email.substring(0, 3)}***`,
        { messageId: emailResult.messageId }
      );

      return {
        success: true,
        message:
          'パスワードリセット用の認証コードをメールで送信しました。メールをご確認ください。',
      };
    } catch (emailError) {
      logger.error('Password reset email sending error:', emailError);
      return {
        success: false,
        error: 'メール送信中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in candidate password reset action:', error);

    return {
      success: false,
      error:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
