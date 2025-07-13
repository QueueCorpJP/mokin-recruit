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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 成功表示 */}
        {success && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* メールアドレス入力 */}
        <div className='space-y-2'>
          <InputField
            id='email'
            inputType='email'
            label='メールアドレス'
            layout='vertical'
            required={true}
            className={`${
              email && !isEmailValid
                ? 'border-red-300 focus:border-red-500'
                : ''
            }`}
            inputProps={{
              value: email,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value),
              placeholder: 'example@domain.com',
            }}
          />
          {email && !isEmailValid && (
            <p className='text-sm text-red-600'>
              有効なメールアドレスを入力してください
            </p>
          )}
        </div>

        {/* パスワード入力 */}
        <div className='space-y-2'>
          <InputField
            id='password'
            inputType='password'
            label='パスワード'
            layout='vertical'
            required={true}
            showToggle={true}
            className={`${
              password && !isPasswordValid
                ? 'border-red-300 focus:border-red-500'
                : ''
            }`}
            inputProps={{
              value: password,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value),
              placeholder: '8文字以上のパスワード',
            }}
          />
          {password && !isPasswordValid && (
            <p className='text-sm text-red-600'>
              パスワードは8文字以上で入力してください
            </p>
          )}
        </div>

        {/* パスワードを忘れた場合 */}
        <div className='text-center'>
          <Link
            href={getPasswordResetPath()}
            className='text-sm text-[#0F9058] hover:text-[#0d7a4a] font-medium'
          >
            パスワードをお忘れですか？
          </Link>
        </div>

        {/* ログインボタン */}
        <Button
          type='submit'
          disabled={!isFormValid || isPending}
          className='w-full bg-[#0F9058] hover:bg-[#0d7a4a] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isPending ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>

      {/* デバッグ情報（開発環境のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div className='mt-8 p-4 bg-gray-100 rounded-lg text-sm'>
          <h3 className='font-medium text-gray-800 mb-2'>
            🔧 開発者情報（本番環境では非表示）
          </h3>
          <div className='space-y-1 text-gray-600'>
            <p>
              <strong>API URL:</strong>{' '}
              <code className='bg-gray-200 px-1 rounded'>
                /api/auth/login
              </code>
            </p>
            <p>
              <strong>User Type:</strong> {userType || 'default'}
            </p>
            <p>
              <strong>Redirect Path:</strong> {getRedirectPath()}
            </p>
            <p>
              <strong>フォーム状態:</strong> Email: {isEmailValid ? '✅' : '❌'}
              , Password: {isPasswordValid ? '✅' : '❌'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
