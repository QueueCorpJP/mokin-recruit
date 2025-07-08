'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // フォームバリデーション
  const isEmailValid = email.includes('@') && email.length > 0;
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

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
          console.log('🚀 Attempting login for:', email);
        }

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
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

          // 成功時はダッシュボードにリダイレクト
          setTimeout(() => {
            router.push('/dashboard');
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
    <div className='w-full max-w-[592px] mx-auto'>
      {/* 見出し */}
      <div className='text-center mb-10'>
        <h1 className='text-[#0F9058] font-bold text-[32px] leading-[1.6em] tracking-[0.1em] text-center font-[family-name:var(--font-noto-sans-jp)]'>
          ログイン
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* エラー表示 */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='whitespace-pre-line'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* 成功表示 */}
        {success && (
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* フォーム要素コンテナ */}
        <div className='w-full max-w-[538px] mx-auto'>
          <div className='flex flex-col items-center space-y-[24px]'>
            {/* メールアドレス */}
            <div className='w-full'>
              <InputField
                inputType='email'
                label='メールアドレス'
                layout='horizontal'
                required={false}
                inputProps={{
                  value: email,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setError(null);
                  },
                  placeholder: 'name@example.com',
                  disabled: isPending,
                }}
              />
            </div>

            {/* パスワード */}
            <div className='w-full'>
              <InputField
                inputType='password'
                label='パスワード'
                layout='horizontal'
                required={false}
                showToggle={true}
                inputProps={{
                  value: password,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setError(null);
                  },
                  placeholder: '半角英数字・記号のみ、8文字以上',
                  disabled: isPending,
                }}
              />
            </div>

            {/* パスワード忘れリンク */}
            <div className='w-full flex justify-center'>
              <Link
                href='/auth/reset-password'
                className='text-[color:var(--input-label-color)] font-bold text-[14px] leading-[1.6em] tracking-[0.1em] underline hover-always:text-[color:var(--input-focus-border-color)] transition-all duration-200 text-center'
              >
                パスワードをお忘れの方はこちら
              </Link>
            </div>
          </div>
        </div>

        {/* ログインボタン */}
        <div className='flex justify-center pt-4'>
          <Button
            type='submit'
            variant='green-gradient'
            size='figma-default'
            disabled={!isFormValid || isPending}
          >
            {isPending ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ログイン中...
              </div>
            ) : (
              'ログイン'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
