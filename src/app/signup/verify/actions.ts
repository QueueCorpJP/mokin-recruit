'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { verifyOtp } from '@/lib/auth/otp';
import { createClient } from '@supabase/supabase-js';

export interface VerifyFormData {
  verificationCode: string;
  email?: string;
}

export interface VerifyResult {
  success: boolean;
  error?: string;
  message?: string;
  userId?: string;
}

// リクエストボディのバリデーションスキーマ
const VerifySchema = z.object({
  verificationCode: z.string().min(6, '認証コードは6桁で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください').optional(),
});

export async function signupVerifyAction(
  formData: VerifyFormData
): Promise<VerifyResult> {
  try {
    logger.info(
      'Signup verification request received at:',
      new Date().toISOString()
    );

    // ステップ1: 環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
      });
      return {
        success: false,
        message: 'サーバー設定エラーが発生しました。',
      };
    }

    // ステップ2: バリデーション
    const validationResult = VerifySchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Verification validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { verificationCode, email } = validationResult.data;
    if (!email) {
      return {
        success: false,
        error: 'メールアドレスが必要です。',
      };
    }

    logger.info('Verification request details:', {
      email: email.substring(0, 3) + '***',
      codeLength: verificationCode.length,
    });

    // ステップ3: Supabaseクライアントの作成
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
        message: 'データベース接続の初期化に失敗しました。',
      };
    }

    // ステップ4: データベースからOTPコードを取得して検証
    try {
      const { data: otpData, error: otpError } = await supabase
        .from('signup_verification_codes')
        .select('verification_code, expires_at')
        .eq('email', email.trim())
        .maybeSingle();

      if (otpError) {
        logger.error('Failed to fetch OTP from database:', otpError);
        return {
          success: false,
          error: '認証コードの確認中にエラーが発生しました。',
        };
      }

      if (!otpData) {
        logger.warn('No OTP found for email:', email.substring(0, 3) + '***');
        return {
          success: false,
          error: '認証コードが見つかりません。新しいコードを取得してください。',
        };
      }

      // OTPコードの検証
      const verificationResult = verifyOtp(
        verificationCode,
        otpData.verification_code,
        new Date(otpData.expires_at)
      );

      if (!verificationResult.success) {
        logger.warn('OTP verification failed:', {
          email: email.substring(0, 3) + '***',
          error: verificationResult.error,
        });
        return {
          success: false,
          error:
            verificationResult.error ||
            '認証コードが正しくないか、期限切れです。',
        };
      }

      // ステップ5: 候補者アカウントの作成または更新
      const { data: existingAccount, error: checkError } = await supabase
        .from('candidates')
        .select('id, email')
        .eq('email', email.trim())
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        logger.error('Failed to check existing account:', checkError);
        return {
          success: false,
          message: 'アカウント確認中にエラーが発生しました。',
        };
      }

      let userId: string;

      if (existingAccount) {
        // 既存候補者の更新
        const { data: updatedAccount, error: updateError } = await supabase
          .from('candidates')
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('email', email.trim())
          .select('id')
          .single();

        if (updateError) {
          logger.error('Failed to update existing candidate:', updateError);
          return {
            success: false,
            message: '候補者情報更新中にエラーが発生しました。',
          };
        }

        userId = updatedAccount.id;
      } else {
        // 新規候補者の作成
        const { data: newCandidate, error: createError } = await supabase
          .from('candidates')
          .insert({
            email: email.trim(),
            status: 'temporary', // 仮登録状態
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (createError) {
          logger.error('Failed to create new candidate:', createError);
          return {
            success: false,
            message: '候補者作成中にエラーが発生しました。',
          };
        }

        userId = newCandidate.id;
      }

      // ステップ6: 使用済みOTPコードを削除
      const { error: deleteOtpError } = await supabase
        .from('signup_verification_codes')
        .delete()
        .eq('email', email.trim());

      if (deleteOtpError) {
        logger.warn('Failed to delete used OTP:', deleteOtpError);
        // エラーは記録するが、成功レスポンスは返す
      }

      logger.info(
        `OTP verification completed successfully for user: ${userId}`
      );

      return {
        success: true,
        message: '認証が完了しました。パスワード設定ページに進みます。',
        userId: userId,
      };
    } catch (verificationError) {
      logger.error('Verification operation failed:', verificationError);
      return {
        success: false,
        message: '認証処理中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in verification action:', error);

    return {
      success: false,
      message:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}

/**
 * OTP認証メールのHTML生成（再送信用）
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

export async function resendVerificationCodeAction(
  email: string
): Promise<VerifyResult> {
  try {
    logger.info(
      'Resend verification code request received for:',
      email?.substring(0, 3) + '***'
    );

    // ステップ1: SendGrid環境変数の確認
    if (!process.env.SENDGRID_API_KEY) {
      logger.error('Missing SENDGRID_API_KEY environment variable');
      return {
        success: false,
        message: 'メール送信設定が正しくありません。',
      };
    }

    // ステップ2: Supabase環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables');
      return {
        success: false,
        message: 'データベース設定エラーが発生しました。',
      };
    }

    // ステップ3: バリデーション
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: '有効なメールアドレスを入力してください。',
      };
    }

    // ステップ4: Supabaseクライアントの作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });

    // ステップ5: 既存のOTPコードがあるかチェック
    const { data: existingOtp } = await supabase
      .from('signup_verification_codes')
      .select('created_at')
      .eq('email', email.trim())
      .maybeSingle();

    // レート制限チェック（1分以内の再送信を防ぐ）
    if (existingOtp) {
      const lastSent = new Date(existingOtp.created_at);
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastSent.getTime()) / 1000;

      if (diffInSeconds < 60) {
        return {
          success: false,
          message: `認証コードの再送信は ${Math.ceil(60 - diffInSeconds)} 秒後に可能です。`,
        };
      }
    }

    // ステップ6: 新しいOTPコード生成
    const otp = generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10分後

    // ステップ7: OTPをデータベースに保存（既存のものを更新）
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
      logger.error('Failed to save resend OTP:', otpSaveError);
      return {
        success: false,
        message: '認証コードの保存に失敗しました。',
      };
    }

    // ステップ8: SendGridでOTPメール送信
    const emailResult = await sendEmailViaSendGrid({
      to: email.trim(),
      subject: '【CuePoint】認証コードのお知らせ',
      html: generateOtpEmailHtml(otp, email),
    });

    if (!emailResult.success) {
      logger.error('Failed to resend OTP email:', emailResult.error);
      return {
        success: false,
        message:
          'メールの再送信に失敗しました。しばらくしてから再度お試しください。',
      };
    }

    logger.info(
      `Verification code resent successfully for email: ${email.substring(0, 3)}***`,
      {
        messageId: emailResult.messageId,
      }
    );

    return {
      success: true,
      message: '新しい認証コードをメールで送信しました。',
    };
  } catch (error) {
    logger.error('Critical error in resend verification action:', error);
    return {
      success: false,
      message: 'サーバーエラーが発生しました。',
    };
  }
}
