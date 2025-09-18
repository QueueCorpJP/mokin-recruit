'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { createClient } from '@supabase/supabase-js';
// Supabase recoveryリンク方式は使わない（OTP方式へ戻す）

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

// 指定フォーマットのHTML生成（OTP方式）
function generateOtpEmailHtml(displayName: string, otp: string): string {
  return `
    <div style="font-family: 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.8; color: #323232; max-width: 640px; margin: 0 auto;">
      <p>【${displayName}】様</p>
      <p>CuePointをご利用いただきありがとうございます。<br/>パスワードの再設定は、下記ページにて認証コードをご入力ください。</p>
      <p><strong>■認証コード：</strong>${otp}</p>
      <p><strong>■認証コード入力ページ：</strong><a href="https://cuepoint.jp/auth/reset-password/new" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/auth/reset-password/new</a></p>
      <p>※認証コードの有効期限は10分です。</p>
      <p>=============================</p>
      <p>CuePoint<br/><a href="https://cuepoint.jp/" target="_blank" rel="noopener noreferrer">https://cuepoint.jp/</a></p>
      <p>【お問い合わせ先】<br/>（メールアドレスが入ります）</p>
      <p>運営会社：メルセネール株式会社<br/>東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
    </div>
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

    // ステップ6: 宛名用の候補者名を取得（なければメールローカル部/ユーザー）
    let displayName = 'ユーザー';
    try {
      const { data: candidateName } = await supabase
        .from('candidates')
        .select('first_name, last_name')
        .eq('email', email.trim())
        .maybeSingle();
      if (candidateName) {
        const name =
          `${candidateName.last_name || ''} ${candidateName.first_name || ''}`.trim();
        if (name) displayName = name;
      }
    } catch {}

    // ステップ7: OTP生成・保存（10分）
    const otp = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

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
          { onConflict: 'email,type' }
        );
      if (otpSaveError) {
        logger.error('Failed to save password reset OTP:', otpSaveError);
        return { success: false, error: '認証コードの保存に失敗しました。' };
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
        subject: 'パスワード再設定のご案内',
        html: generateOtpEmailHtml(displayName, otp),
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
