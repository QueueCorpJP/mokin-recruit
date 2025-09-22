'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { verifyOtp } from '@/lib/auth/otp';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
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

      // ステップ5: 通常のSupabase Authサインアップを使用（一時パスワードで）
      logger.info(
        'Creating Supabase Auth user with temporary password for email:',
        email.substring(0, 3) + '***'
      );

      // 一時的なランダムパスワードを生成（後でユーザーが設定）
      const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'; // 複雑性要件を満たす

      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: email.trim(),
          password: tempPassword,
          options: {
            data: {
              signup_step: 'password_setting_required',
              email_verified_at: new Date().toISOString(),
              temp_password_used: true,
            },
          },
        }
      );

      if (signUpError) {
        // 既にユーザーが存在する場合の処理
        if (signUpError.message.includes('User already registered')) {
          logger.info('User already exists, proceeding with existing account');

          // 既存ユーザーの場合、まずAuth userを取得してそのIDを使用
          const { data: authUser, error: getAuthUserError } =
            await supabase.auth.signInWithPassword({
              email: email.trim(),
              password: tempPassword, // 一時パスワードでログインを試行
            });

          let authUserId = null;
          if (authUser?.user?.id) {
            authUserId = authUser.user.id;
            logger.info('Found existing Auth user:', {
              authUserId: authUserId.substring(0, 8) + '***',
            });
          } else {
            // 一時パスワードでのログインが失敗した場合、Admin APIでユーザーを取得
            try {
              const supabaseServiceRoleKey =
                process.env.SUPABASE_SERVICE_ROLE_KEY;
              if (supabaseServiceRoleKey) {
                const supabaseAdmin = createClient(
                  supabaseUrl,
                  supabaseServiceRoleKey,
                  {
                    auth: {
                      autoRefreshToken: false,
                      persistSession: false,
                    },
                  }
                );

                const { data: adminUserData } =
                  await supabaseAdmin.auth.admin.listUsers();
                const existingAuthUser = adminUserData.users?.find(
                  user => user.email === email.trim()
                );

                if (existingAuthUser) {
                  authUserId = existingAuthUser.id;
                  logger.info('Found existing Auth user via admin API:', {
                    authUserId: authUserId.substring(0, 8) + '***',
                  });
                }
              }
            } catch (adminError) {
              logger.warn(
                'Could not fetch auth user via admin API:',
                adminError
              );
            }
          }

          // 候補者テーブルから情報を取得
          const { data: existingCandidate, error: candidateError } =
            await supabase
              .from('candidates')
              .select('id, email')
              .eq('email', email.trim())
              .maybeSingle();

          if (candidateError) {
            logger.error('Failed to find existing candidate:', candidateError);
            return {
              success: false,
              message: '既存ユーザー情報の取得に失敗しました。',
            };
          }

          logger.info('Existing user processing results:', {
            authUserId: authUserId?.substring(0, 8) + '***' || 'NOT_FOUND',
            candidateId:
              existingCandidate?.id?.substring(0, 8) + '***' || 'NOT_FOUND',
            candidateEmail:
              existingCandidate?.email?.substring(0, 3) + '***' || 'NOT_FOUND',
            idsMatch: authUserId === existingCandidate?.id,
          });

          if (existingCandidate) {
            // Auth user IDを優先して使用（利用可能な場合）
            const finalUserId = authUserId || existingCandidate.id;

            // 既存ユーザーの場合もクッキーにユーザーIDとメールアドレスを保存
            const cookieStore = await cookies();
            cookieStore.set('signup_user_id', finalUserId, {
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7日間
            });
            cookieStore.set('signup_email', email.trim(), {
              httpOnly: false,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7日間
            });

            return {
              success: true,
              message: '認証が完了しました。パスワード設定ページに進みます。',
              userId: finalUserId,
            };
          } else {
            return {
              success: false,
              message: '既存ユーザーの情報が見つかりません。',
            };
          }
        } else {
          logger.error('Failed to create Supabase Auth user:', signUpError);
          return {
            success: false,
            message: 'ユーザー作成中にエラーが発生しました。',
          };
        }
      }

      if (!authData.user) {
        logger.error('Auth signup succeeded but no user returned');
        return {
          success: false,
          message: 'ユーザー作成に失敗しました。',
        };
      }

      const userId = authData.user.id;
      logger.info('New Supabase Auth user created:', {
        userId: userId.substring(0, 8) + '***',
      });

      // 候補者テーブルにレコードを作成
      logger.info('Attempting to create candidate record:', {
        userId: userId.substring(0, 8) + '***',
        userIdFull: userId,
        email: email.substring(0, 3) + '***',
        isValidUUID:
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            userId
          ),
      });

      const { error: createCandidateError } = await supabase
        .from('candidates')
        .insert({
          id: userId, // Supabase AuthのUUIDを使用
          email: email.trim(),
          status: 'temporary', // 仮登録状態
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (createCandidateError) {
        logger.error(
          'Failed to create candidate record:',
          createCandidateError
        );
        return {
          success: false,
          message: '候補者レコード作成中にエラーが発生しました。',
        };
      }

      // 作成後、実際にレコードが存在するか確認
      const { data: verifyCandidate, error: verifyError } = await supabase
        .from('candidates')
        .select('id, email, status')
        .eq('id', userId)
        .single();

      if (verifyError || !verifyCandidate) {
        logger.error('Failed to verify created candidate record:', {
          userId: userId.substring(0, 8) + '***',
          userIdFull: userId,
          verifyError,
        });
      } else {
        logger.info('Candidate record verified successfully:', {
          userId: userId.substring(0, 8) + '***',
          userIdFull: userId,
          email: verifyCandidate.email.substring(0, 3) + '***',
          status: verifyCandidate.status,
        });
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

      // クッキーにユーザーIDとメールアドレスを保存（OTP認証完了済みユーザーとして記録）
      const cookieStore = await cookies();
      cookieStore.set('signup_user_id', userId, {
        httpOnly: false, // クライアントサイドから読み取り可能にする
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });
      cookieStore.set('signup_email', email.trim(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });

      logger.info(
        `OTP verification completed successfully for user: ${userId}, cookie saved`
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
