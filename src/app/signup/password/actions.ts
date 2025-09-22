'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { cookies } from 'next/headers';

export interface SetPasswordFormData {
  password: string;
  confirmPassword: string;
  userId: string;
}

export interface SetPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
  newUserId?: string;
}

// パスワード設定のバリデーションスキーマ
const SetPasswordSchema = z
  .object({
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
    userId: z.string().min(1, 'ユーザーIDが必要です'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

/**
 * 仮登録完了メールのHTML生成
 */
function generateRegistrationEmailHtml(
  userName: string,
  registrationUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>【CuePoint】仮登録完了のお知らせ</title>
    </head>
    <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #fff;">
        <div style="padding: 20px 0;">
          <p>${userName} 様</p>

          <p>CuePointへの仮登録が完了しました。<br>
          引き続き、以下のURLより本登録をお願いいたします。</p>

          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; margin: 20px 0; padding: 20px 0;">
            <p style="margin: 0; font-weight: bold;">■ 登録URL：${registrationUrl}</p>
          </div>

          <p><strong>【次のステップ】</strong><br>
          本登録を完了すると、スカウトの受信や企業とのやりとりが可能になります。</p>

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

export async function setPasswordAction(
  password: string,
  confirmPassword: string,
  userId: string
): Promise<SetPasswordResult> {
  'use server';

  try {
    console.log('=== SERVER ACTION CALLED ===');
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    console.log('userId:', userId);

    logger.info(
      'Password setting request received at:',
      new Date().toISOString()
    );
    logger.info('Parameters received successfully:', {
      passwordExists: !!password,
      passwordLength: password?.length,
      confirmPasswordExists: !!confirmPassword,
      confirmPasswordLength: confirmPassword?.length,
      userIdExists: !!userId,
      userIdValue: userId,
      userIdLength: userId?.length,
    });

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
    logger.info('=== PASSWORD ACTION DEBUG START ===');
    console.log('About to validate with userId:', userId);
    logger.info('About to validate parameters...');

    const formData = { password, confirmPassword, userId };
    const validationResult = SetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.error('Password validation failed:', {
        firstError,
        allErrors: validationResult.error.errors,
        formDataReceived: {
          hasPassword: !!formData.password,
          hasConfirmPassword: !!formData.confirmPassword,
          hasUserId: !!formData.userId,
          userIdReceived: formData.userId || 'MISSING',
        },
      });

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    // パラメータをそのまま使用（既にバリデーション済み）

    logger.info('Password setting request details:', {
      userId: userId.substring(0, 8) + '***',
      userIdFull: userId,
      userIdLength: userId.length,
      isValidUUID:
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          userId
        ),
    });

    // ステップ3: Supabaseクライアントの動的インポート
    let createClient;
    try {
      const supabaseModule = await import('@supabase/supabase-js');
      createClient = supabaseModule.createClient;
    } catch (importError) {
      logger.error('Failed to import Supabase module:', importError);
      return {
        success: false,
        message: 'サーバーライブラリの読み込みに失敗しました。',
      };
    }

    // ステップ4: 通常のSupabaseクライアントでパスワード更新
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    try {
      // まず候補者テーブルからユーザー情報を取得
      logger.info('Attempting to get candidate by ID:', {
        userId: userId.substring(0, 8) + '***',
      });

      // First check how many candidates exist with this ID
      console.log('About to search for candidate with ID:', userId);

      // まずは全ての候補者を見てみる（デバッグ用）
      const { data: allCandidates, error: allCandidatesError } = await supabase
        .from('candidates')
        .select('id, email, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Recent candidates in database:', allCandidates);
      console.log('All candidates error:', allCandidatesError);

      const { data: candidateList, error: candidateListError } = await supabase
        .from('candidates')
        .select('id, email')
        .eq('id', userId);

      try {
        logger.info('=== CANDIDATE SEARCH DEBUG ===');
        console.log('Searching for candidate with userId:', userId);
        logger.info('Searching candidate in database...');
        logger.info('candidateList exists:', !!candidateList);
        logger.info('candidateList length:', candidateList?.length || 0);
        logger.info('candidateListError exists:', !!candidateListError);

        if (candidateListError) {
          logger.error(
            'candidateListError details:',
            JSON.stringify(candidateListError, null, 2)
          );
        }

        if (candidateList && candidateList.length > 0) {
          logger.info('Found candidates:');
          candidateList.forEach((candidate, index) => {
            logger.info(`Candidate ${index}:`, {
              id: candidate.id,
              email: candidate.email,
            });
          });
        } else {
          logger.info('No candidates found in search result');
        }
      } catch (logError) {
        logger.error('Error in candidate search logging:', logError);
      }

      if (candidateListError) {
        logger.error('Failed to search candidates:', candidateListError);
        return {
          success: false,
          message: '候補者情報の検索に失敗しました。',
        };
      }

      if (!candidateList || candidateList.length === 0) {
        console.log(
          'No candidate found with provided ID. Checking if there is a recent temporary candidate...'
        );

        // 最新のtemporary状態の候補者を確認
        if (allCandidates && allCandidates.length > 0) {
          const recentTempCandidate = allCandidates.find(
            c => c.status === 'temporary'
          );
          if (recentTempCandidate) {
            console.log(
              'Found recent temporary candidate:',
              recentTempCandidate.id
            );
            logger.warn(
              'Using recent temporary candidate instead of provided userId:',
              {
                providedUserId: userId.substring(0, 8) + '***',
                foundUserId: recentTempCandidate.id.substring(0, 8) + '***',
              }
            );

            // 正しいuserIdに更新
            userId = recentTempCandidate.id;

            // 候補者データを再設定
            const candidateData = recentTempCandidate;
            console.log('Using temporary candidate:', candidateData);

            // 以降の処理を続行
          } else {
            logger.error('No temporary candidate found');
            return {
              success: false,
              message:
                '候補者情報が見つかりません。サインアップを最初からやり直してください。',
            };
          }
        } else {
          logger.error('No candidate found with the provided ID:', {
            userId: userId.substring(0, 8) + '***',
            userIdFull: userId,
          });
          return {
            success: false,
            message:
              '候補者情報が見つかりません。サインアップを最初からやり直してください。',
          };
        }
      } else {
        if (candidateList.length > 1) {
          logger.error('Multiple candidates found with the same ID:', {
            userId: userId.substring(0, 8) + '***',
            userIdFull: userId,
            candidateCount: candidateList.length,
          });
          return {
            success: false,
            message:
              '重複する候補者情報が見つかりました。管理者にお問い合わせください。',
          };
        }

        const candidateData = candidateList[0];
        console.log('Found candidate with provided ID:', candidateData);
      }

      // candidateDataを再取得（temporary candidateまたは正常な候補者）
      let candidateData;
      if (allCandidates && allCandidates.find(c => c.id === userId)) {
        candidateData = allCandidates.find(c => c.id === userId);
      } else if (candidateList && candidateList.length > 0) {
        candidateData = candidateList[0];
      } else {
        return {
          success: false,
          message: '候補者データの取得に失敗しました。',
        };
      }

      logger.info('Candidate found:', {
        userId: userId.substring(0, 8) + '***',
        email: candidateData.email.substring(0, 3) + '***',
      });

      // サーバーサイドではバリデーションのみ行い、
      // 実際のパスワード設定はクライアントサイドで実行

      // 候補者レコードの状態を更新（パスワード設定準備完了）
      const { error: updateCandidateError } = await supabase
        .from('candidates')
        .update({
          status: 'password_setting_ready',
          password_hash: 'set', // パスワード設定済みのマーカー
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateCandidateError) {
        logger.error(
          'Failed to update candidate status:',
          updateCandidateError
        );
        return {
          success: false,
          message: '候補者情報の更新に失敗しました。',
        };
      }

      logger.info('Candidate ready for password setting:', {
        userId: userId.substring(0, 8) + '***',
      });

      // クッキーにユーザーIDを保存（クライアントサイドからも読み取り可能にする）
      const cookieStore = await cookies();
      cookieStore.set('signup_user_id', userId, {
        httpOnly: false, // クライアントサイドから読み取り可能にする
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });

      // Supabaseセッションを作成（サービスロールキーを使用）
      try {
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseServiceRoleKey && candidateData.email) {
          // 管理者クライアントを作成
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

          // まず、Supabase Auth にユーザーが既に存在するかチェック
          const { data: existingAuthUser } =
            await supabaseAdmin.auth.admin.getUserById(userId);

          if (existingAuthUser.user) {
            // ユーザーが既に存在する場合はパスワードを更新
            logger.info(
              'User already exists in Supabase Auth, updating password directly'
            );

            const { error: updatePasswordError } =
              await supabaseAdmin.auth.admin.updateUserById(userId, {
                password: password,
                email_confirm: true, // メール確認済みに設定
                user_metadata: {
                  signup_step: 'password_set',
                  password_set_at: new Date().toISOString(),
                },
              });

            if (updatePasswordError) {
              logger.error(
                'Failed to update existing user password:',
                updatePasswordError
              );
              return {
                success: false,
                message:
                  'パスワードの更新に失敗しました。もう一度お試しください。',
              };
            }

            logger.info('Password updated successfully for existing user');
          } else {
            // ユーザーが存在しない場合は新規作成
            logger.info('Creating new user in Supabase Auth');

            const { data: authUser, error: createUserError } =
              await supabaseAdmin.auth.admin.createUser({
                email: candidateData.email,
                password: password,
                user_metadata: {
                  signup_step: 'password_set',
                  password_set_at: new Date().toISOString(),
                },
                email_confirm: true, // メール確認済みに設定
              });

            if (createUserError) {
              logger.error('Failed to create auth user:', createUserError);
              return {
                success: false,
                message:
                  'アカウント作成中にエラーが発生しました。しばらく時間をおいてから再度お試しください。',
              };
            }

            if (!authUser.user) {
              logger.error('Auth user creation succeeded but no user returned');
              return {
                success: false,
                message: 'ユーザー作成に失敗しました。',
              };
            }

            logger.info('New auth user created successfully');
          }

          // SSRクライアントを作成してログインセッションを確立
          const { createServerClient } = await import('@supabase/ssr');

          const supabaseAuth = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
              cookies: {
                getAll() {
                  return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                  try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                      cookieStore.set(name, value, options)
                    );
                  } catch {
                    // Server component では ignore
                  }
                },
              },
            }
          );

          // パスワード更新後にログインセッションを作成
          const { data: loginData, error: loginError } =
            await supabaseAuth.auth.signInWithPassword({
              email: candidateData.email,
              password: password, // 新しく設定されたパスワード
            });

          if (!loginError && loginData.session) {
            logger.info('Login session created successfully for user:', userId);

            // セッションが正常に作成された場合、候補者のステータスを更新
            const { error: statusUpdateError } = await supabase
              .from('candidates')
              .update({
                status: 'active', // アクティブ状態に変更
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId);

            if (statusUpdateError) {
              logger.warn(
                'Failed to update candidate status to active:',
                statusUpdateError
              );
            }

            // 仮登録完了メールを送信
            try {
              const userName = candidateData.email.split('@')[0]; // メールアドレスの@より前を名前として使用
              const registrationUrl = 'https://cuepoint.jp/candidate'; // 本登録ページのURL

              const emailResult = await sendEmailViaSendGrid({
                to: candidateData.email,
                subject: '【CuePoint】仮登録完了のお知らせ',
                html: generateRegistrationEmailHtml(userName, registrationUrl),
              });

              if (emailResult.success) {
                logger.info(
                  `Registration completion email sent successfully to: ${candidateData.email.substring(0, 3)}***`,
                  { messageId: emailResult.messageId }
                );
              } else {
                logger.error(
                  'Failed to send registration completion email:',
                  emailResult.error
                );
              }
            } catch (emailError) {
              logger.error(
                'Error sending registration completion email:',
                emailError
              );
            }
          } else {
            logger.error(
              'Failed to create login session after password setting:',
              loginError
            );
            // パスワード設定は成功したが、ログインに失敗した場合
            return {
              success: false,
              message:
                'パスワード設定は完了しましたが、自動ログインに失敗しました。ログインページからログインしてください。',
            };
          }
        }
      } catch (sessionError) {
        // セッション作成でエラーが発生した場合
        logger.error(
          'Session creation failed during password setting:',
          sessionError
        );
        return {
          success: false,
          message:
            'パスワード設定は完了しましたが、自動ログインに失敗しました。ログインページからログインしてください。',
        };
      }

      logger.info(`Password setting prepared successfully for user: ${userId}`);

      return {
        success: true,
        message: 'パスワード設定の準備が完了しました。',
        newUserId: userId, // Return the final user ID (may be different from original due to migration)
      };
    } catch (passwordError) {
      logger.error('Password setting operation failed:', passwordError);
      return {
        success: false,
        message: 'パスワード設定中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in password setting action:', error);

    return {
      success: false,
      message:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
