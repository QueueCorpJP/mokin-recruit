'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailFormField } from '@/components/ui/email-form-field';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { useAuthRefresh } from '@/contexts/AuthContext';
import Link from 'next/link';

interface LoginFormProps {
  userType?: 'candidate' | 'company' | 'admin';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const refreshAuth = useAuthRefresh();
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

          // 認証状態をリフレッシュ（クッキーに保存されたトークンを使用）
          await refreshAuth();

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
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[800px] mx-auto px-20 py-20'>
        {/* 見出し */}
        <div className='flex flex-col gap-6 items-center justify-start p-0 relative w-full'>
          <h1 className='text-[#0F9058] font-bold text-[32px] leading-[1.6] tracking-[3.2px] font-[family-name:var(--font-noto-sans-jp)] text-center w-full'>
            ログイン
          </h1>
        </div>

        <form onSubmit={handleSubmit} className='w-full h-auto'>
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
            <EmailFormField
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* パスワード入力 */}
            <PasswordFormField
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
