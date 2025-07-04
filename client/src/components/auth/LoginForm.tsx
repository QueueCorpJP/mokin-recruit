'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export function LoginForm() {
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
        <h1 className='text-[#0F9058] font-bold text-2xl md:text-[32px] leading-tight md:leading-[51.2px] tracking-[0.1em]'>
          ログイン
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* 開発環境でのテストユーザー情報表示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
            <h3 className='text-sm font-medium text-blue-900 mb-2'>
              🧪 開発環境 - テストユーザー情報
            </h3>
            <div className='text-xs text-blue-800 space-y-1'>
              <p>
                <strong>候補者:</strong> test-candidate@example.com /
                TestPassword123!
              </p>
              <p>
                <strong>企業:</strong> test-company@example.com /
                TestPassword123!
              </p>
            </div>
            <div className='mt-2 flex gap-2'>
              <button
                type='button'
                onClick={() => {
                  setEmail('test-candidate@example.com');
                  setPassword('TestPassword123!');
                }}
                className='text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors'
              >
                候補者でテスト
              </button>
              <button
                type='button'
                onClick={() => {
                  setEmail('test-company@example.com');
                  setPassword('TestPassword123!');
                }}
                className='text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded transition-colors'
              >
                企業でテスト
              </button>
            </div>
          </div>
        )}

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

        <div className='flex flex-col items-center space-y-6'>
          {/* メールアドレス */}
          <div className='w-full max-w-[416px]'>
            <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
              <Label
                htmlFor='email'
                className='text-[#323232] font-bold text-base leading-8 tracking-[0.1em] whitespace-nowrap md:min-w-[140px]'
              >
                メールアドレス
              </Label>
              <div className='flex-1 max-w-[400px]'>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className='w-full px-3 py-3 bg-white border border-[#999999] rounded-[5px] text-base leading-8 tracking-[0.1em] placeholder:text-[#999999] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0F9058] focus:border-transparent'
                  placeholder={
                    process.env.NODE_ENV === 'development'
                      ? 'test-candidate@example.com'
                      : 'name@example.com'
                  }
                  disabled={isPending}
                  required
                />
              </div>
            </div>
          </div>

          {/* パスワード */}
          <div className='w-full max-w-[416px]'>
            <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
              <Label
                htmlFor='password'
                className='text-[#323232] font-bold text-base leading-8 tracking-[0.1em] whitespace-nowrap md:min-w-[140px]'
              >
                パスワード
              </Label>
              <div className='flex-1 max-w-[400px]'>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className='w-full px-3 py-3 bg-white border border-[#999999] rounded-[5px] text-base leading-8 tracking-[0.1em] placeholder:text-[#999999] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0F9058] focus:border-transparent pr-12'
                    placeholder={
                      process.env.NODE_ENV === 'development'
                        ? 'TestPassword123! (開発用)'
                        : '半角英数字・記号のみ、8文字以上'
                    }
                    disabled={isPending}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[#0F9058] hover:text-[#0d7a4a] transition-colors'
                    disabled={isPending}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* パスワード忘れリンク */}
          <div className='w-full max-w-[416px] flex justify-center'>
            <Link
              href='/auth/reset-password'
              className='text-[#323232] font-bold text-sm leading-[22.4px] tracking-[0.1em] hover:text-[#0F9058] transition-colors'
            >
              パスワードをお忘れの方はこちら
            </Link>
          </div>
        </div>

        {/* ログインボタン */}
        <div className='flex justify-center pt-4'>
          <Button
            type='submit'
            className='bg-gradient-to-r from-[#198D76] to-[#1CA74F] hover:from-[#17856F] hover:to-[#229A4E] text-white font-bold text-base leading-8 tracking-[0.1em] px-8 md:px-10 py-3 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
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

        {/* 新規登録リンク */}
        <div className='text-center pt-4'>
          <p className='text-[#323232] text-sm'>
            アカウントをお持ちでない方は{' '}
            <Link
              href='/auth/register'
              className='text-[#0F9058] font-bold hover:underline transition-colors'
            >
              新規登録
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
