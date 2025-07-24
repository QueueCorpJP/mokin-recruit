'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface LoginFormProps {
  userType?: 'candidate' | 'company' | 'admin';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // フォームバリデーション
  const isEmailValid = email.includes('@') && email.length > 0;
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  // ユーザータイプに応じたリダイレクト先を決定
  const getRedirectPath = () => {
    switch (userType) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  // ユーザータイプに応じたパスワードリセットリンクを決定
  const getPasswordResetPath = () => {
    switch (userType) {
      case 'candidate':
        return '/candidate/auth/reset-password';
      case 'company':
        return '/company/auth/reset-password';
      case 'admin':
        return '/admin/auth/reset-password';
      default:
        return '/auth/reset-password';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('正しいメールアドレスと8文字以上のパスワードを入力してください');
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        // クライアントサイドでのみログ出力
        if (typeof window !== 'undefined') {
          console.log('🚀 Attempting login for:', email, 'userType:', userType);
        }

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            userType, // ユーザータイプを送信
          }),
        });

        let data: any = null;
        let responseText = '';

        try {
          responseText = await response.text();
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse response JSON:', {
            status: response.status,
            statusText: response.statusText,
            responseText: responseText.substring(0, 500), // 最初の500文字のみ
            parseError:
              parseError instanceof Error
                ? {
                    name: parseError.name,
                    message: parseError.message,
                    stack: parseError.stack,
                  }
                : parseError,
          });
          throw new Error(
            `サーバーから無効なレスポンスが返されました (${response.status})`
          );
        }

        if (typeof window !== 'undefined') {
          console.log('📝 API Response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: {
              contentType: response.headers.get('content-type'),
              contentLength: response.headers.get('content-length'),
            },
            data: {
              ...data,
              token: data?.token ? '[TOKEN_PRESENT]' : '[NO_TOKEN]',
            },
          });
        }

        if (!response.ok) {
          // 詳細なエラーメッセージを表示
          let errorMessage = 'ログインに失敗しました';

          if (data?.message) {
            errorMessage = data.message;
          } else if (data?.error) {
            errorMessage = data.error;
          } else if (response.status === 404) {
            errorMessage = 'ログインAPIが見つかりません';
          } else if (response.status === 500) {
            errorMessage = 'サーバーエラーが発生しました';
          } else if (response.status >= 400) {
            errorMessage = `ログインエラー (${response.status})`;
          }

          // 開発環境では詳細情報も表示
          if (process.env.NODE_ENV === 'development' && data?.details) {
            console.error('❌ Login API error details:', data.details);
          }

          if (typeof window !== 'undefined') {
            console.error('❌ Login API error:', {
              status: response.status,
              statusText: response.statusText,
              message: errorMessage,
              code: data?.code,
              details: data?.details,
              originalData: data,
            });
          }

          throw new Error(errorMessage);
        }

        // 成功判定の改善
        if (data?.success === true || (data?.token && data?.user)) {
          if (typeof window !== 'undefined') {
            console.log('✅ Login successful for user:', data?.user?.email);
          }

          setSuccess('ログインに成功しました！');

          // トークンをlocalStorageに保存（必要に応じて）
          if (data?.token) {
            try {
              localStorage.setItem('auth_token', data.token);
              console.log('💾 Token saved to localStorage');
            } catch (storageError) {
              console.warn(
                '⚠️ Failed to save token to localStorage:',
                storageError
              );
            }
          }

          // ユーザー情報をlocalStorageに保存
          if (data?.user) {
            try {
              localStorage.setItem('user_info', JSON.stringify(data.user));
              console.log('💾 User info saved to localStorage:', {
                id: data.user.id,
                email: data.user.email,
                type: data.user.type
              });
            } catch (storageError) {
              console.warn(
                '⚠️ Failed to save user info to localStorage:',
                storageError
              );
            }
          }

          // 成功時は適切なダッシュボードにリダイレクト
          setTimeout(() => {
            router.push(getRedirectPath());
          }, 1000);
        } else {
          // 予期しないレスポンス形式
          const errorMessage = data?.message || 'ログインに失敗しました';
          console.error('❌ Unexpected response format:', data);
          throw new Error(errorMessage);
        }
      } catch (err) {
        // エラーオブジェクトの詳細な情報を取得
        const errorInfo = {
          name: err instanceof Error ? err.name : 'Unknown',
          message:
            err instanceof Error ? err.message : 'ログインに失敗しました',
          stack: err instanceof Error ? err.stack : undefined,
          cause: err instanceof Error ? err.cause : undefined,
          originalError: err,
        };

        const errorMessage = errorInfo.message;
        setError(errorMessage);

        if (typeof window !== 'undefined') {
          console.error('❌ Login error:', errorInfo);

          // ネットワークエラーの詳細診断
          if (err instanceof TypeError && err.message.includes('fetch')) {
            console.error('🌐 Network error detected:', {
              message: 'ネットワーク接続に問題があります',
              suggestion: 'サーバーが起動しているか確認してください',
              url: '/api/auth/login',
            });
          }
        }
      }
    });
  };

  return (
    <div className='flex flex-col items-center relative w-full'>
      <div className='flex flex-col gap-10 items-center justify-start p-0 relative w-full'>
        {/* 見出し */}
        <div className='flex flex-col gap-6 items-center justify-start p-0 relative w-[592px]'>
          <h1 className='text-[#0F9058] font-bold text-[32px] leading-[1.6] tracking-[3.2px] font-[family-name:var(--font-noto-sans-jp)] text-center w-full'>
            ログイン
          </h1>
        </div>

        <form onSubmit={handleSubmit} className='w-full max-w-[592px]'>
          {/* エラー表示 */}
          {error && (
            <Alert variant='destructive' className='mb-6'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 成功表示 */}
          {success && (
            <Alert className='border-green-200 bg-green-50 mb-6'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-800'>
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* フォームフィールド */}
          <div className='flex flex-col gap-6 items-center'>
            {/* メールアドレス入力 */}
            <div className='flex flex-row gap-4 items-start'>
              <div className='flex flex-row items-center justify-end pt-[11px] pb-0 w-[140px]'>
                <label 
                  htmlFor='email'
                  className='text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] text-nowrap whitespace-pre'
                >
                  メールアドレス
                </label>
              </div>
              <div className='w-[400px] flex flex-col gap-2'>
                <div className='relative'>
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='name@example.com'
                    className='w-full h-auto bg-white border border-[#999999] border-solid rounded-[5px] px-[11px] py-[11px] text-[#323232] text-[16px] leading-[2] tracking-[1.6px] font-medium font-[family-name:var(--font-noto-sans-jp)] placeholder:text-[#999999] placeholder:font-medium placeholder:leading-[2] focus:outline-none focus:border-[#0F9058] focus:ring-2 focus:ring-[#0F9058]/20 transition-colors'
                  />
                </div>
                {email && !isEmailValid && (
                  <p className='text-sm text-red-600'>
                    有効なメールアドレスを入力してください
                  </p>
                )}
              </div>
            </div>

            {/* パスワード入力 */}
            <div className='flex flex-row gap-4 items-start'>
              <div className='flex flex-row items-center justify-end pt-[11px] pb-0 w-[140px]'>
                <label 
                  htmlFor='password'
                  className='text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] text-nowrap whitespace-pre'
                >
                  パスワード
                </label>
              </div>
              <div className='w-[400px] flex flex-col gap-2'>
                <div className='relative'>
                  <div className='bg-white h-[50px] relative rounded-[5px] w-full'>
                    <div className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]' />
                    <div className='flex flex-row items-center relative h-full'>
                      <div className='flex flex-row h-[50px] items-center justify-between p-[11px] relative w-full'>
                        <input
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder='半角英数字・記号のみ、8文字以上'
                          className='flex-1 bg-transparent text-[#323232] text-[16px] leading-[2] tracking-[1.6px] font-medium font-[family-name:var(--font-noto-sans-jp)] placeholder:text-[#999999] placeholder:font-medium placeholder:leading-[2] placeholder:tracking-[1.6px] placeholder:whitespace-pre border-none outline-none'
                        />
                        <button
                          type='button'
                          className='flex items-center justify-center h-full aspect-square text-[#0F9058] hover:text-[#0d7a4a] transition-colors'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <svg
                            width="28"
                            height="23"
                            viewBox="0 0 28 23"
                            fill="none"
                            className="w-[28px] h-[23px]"
                          >
                            {showPassword ? (
                              // パスワード表示中（目のアイコン）
                              <path
                                d="M14 4.90609C17.4781 4.90609 20.2999 7.73132 20.2999 11.2136C20.2999 14.6959 17.4781 17.5211 14 17.5211C10.5219 17.5211 7.70011 14.6959 7.70011 11.2136C7.70011 7.73132 10.5219 4.90609 14 4.90609ZM14 1.40191C17.5349 1.40191 20.3655 3.01383 22.4217 4.93237C24.4692 6.83338 25.8385 9.11109 26.4904 10.6748C26.6348 11.0209 26.6348 11.4063 26.4904 11.7524C25.8385 13.3161 24.4692 15.5938 22.4217 17.4948C20.3655 19.4134 17.5349 21.0253 14 21.0253C10.4651 21.0253 7.63449 19.4134 5.57827 17.4948C3.53081 15.5938 2.16146 13.3161 1.50959 11.7524C1.36522 11.4063 1.36522 11.0209 1.50959 10.6748C2.16146 9.11109 3.53081 6.83338 5.57827 4.93237C7.63449 3.01383 10.4651 1.40191 14 1.40191ZM14 8.41464C15.5481 8.41464 16.8044 9.67288 16.8044 11.2136C16.8044 12.7543 15.5481 14.0126 14 14.0126C12.4519 14.0126 11.1956 12.7543 11.1956 11.2136C11.1956 9.67288 12.4519 8.41464 14 8.41464Z"
                                fill="currentColor"
                              />
                            ) : (
                              // パスワード非表示中（目を閉じたアイコン）
                              <path
                                d="M1.69772 0.223637C1.24272 -0.13554 0.582111 -0.0523163 0.223367 0.403226C-0.135377 0.858768 -0.0522531 1.52018 0.402739 1.87936L26.3023 22.2035C26.7573 22.5627 27.4179 22.4795 27.7766 22.024C28.1354 21.5684 28.0523 20.907 27.5973 20.5478L22.9948 16.9385C24.7273 15.1602 25.8998 13.1672 26.4904 11.7524C26.6348 11.4063 26.6348 11.0209 26.4904 10.6748C25.8385 9.11109 24.4692 6.83338 22.4217 4.93237C20.3655 3.01383 17.5349 1.40191 14 1.40191C11.0163 1.40191 8.53135 2.55391 6.59325 4.06508L1.69772 0.223637ZM9.7607 6.54867C10.8763 5.52808 12.3682 4.90609 14 4.90609C17.4781 4.90609 20.2999 7.73132 20.2999 11.2136C20.2999 12.3043 20.0243 13.3292 19.5387 14.2228L17.8499 12.9C18.2174 12.0546 18.3137 11.0866 18.0599 10.1273C17.5743 8.30951 15.9687 7.08743 14.1837 7.01297C13.93 7.00421 13.7813 7.28016 13.86 7.52545C13.9519 7.80579 14.0044 8.10364 14.0044 8.41464C14.0044 8.86142 13.8994 9.28192 13.7156 9.65424L9.76507 6.55305L9.7607 6.54867ZM16.3187 17.0787C15.6012 17.3634 14.8181 17.5211 14 17.5211C10.5219 17.5211 7.70011 14.6959 7.70011 11.2136C7.70011 10.9114 7.72198 10.6179 7.76136 10.3288L3.63581 7.07429C2.63832 8.37521 1.92521 9.67176 1.50959 10.6748C1.36522 11.0209 1.36522 11.4063 1.50959 11.7524C2.16146 13.3161 3.53081 15.5938 5.57827 17.4948C7.63449 19.4134 10.4651 21.0253 14 21.0253C16.0912 21.0253 17.9331 20.4602 19.5212 19.6017L16.3187 17.0787Z"
                                fill="currentColor"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {password && !isPasswordValid && (
                  <p className='text-sm text-red-600'>
                    パスワードは8文字以上で入力してください
                  </p>
                )}
              </div>
            </div>

            {/* パスワードを忘れた場合 */}
            <div className='flex flex-row items-center justify-center w-full'>
              <Link
                href={getPasswordResetPath()}
                className='text-[#323232] text-[14px] leading-[1.6] tracking-[1.4px] font-bold font-[family-name:var(--font-noto-sans-jp)] underline decoration-solid underline-offset-auto hover:text-[#0F9058] transition-colors whitespace-pre'
              >
                パスワードをお忘れの方はこちら
              </Link>
            </div>
          </div>

          {/* ログインボタン */}
          <div className='flex flex-row items-center justify-center mt-10'>
            <button
              type='submit'
              disabled={!isFormValid || isPending}
              className='flex items-center justify-center min-w-40 px-10 py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#17856F] to-[#229A4E] text-white font-bold text-[16px] leading-[1.6] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] whitespace-pre border-none outline-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
            >
              {isPending ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>


      </div>
    </div>
  );
}
