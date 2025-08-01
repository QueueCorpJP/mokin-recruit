'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailFormField } from '@/components/ui/email-form-field';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { Button } from '@/components/ui/button';
import { useAuthRefresh } from '@/contexts/AuthContext';
import Link from 'next/link';

export function CandidateLoginForm() {
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
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            userType: 'candidate',
          }),
        });

        let data: any = null;
        let responseText = '';

        try {
          responseText = await response.text();
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `サーバーから無効なレスポンスが返されました (${response.status})`
          );
        }

        if (!response.ok) {
          let errorMessage = 'ログインに失敗しました';
          if (data?.message) {
            errorMessage = data.message;
          }
          throw new Error(errorMessage);
        }

        if (data?.success === true || (data?.token && data?.user)) {
          setSuccess('ログインに成功しました！');

          // 認証状態をリフレッシュ（クッキーに保存されたトークンを使用）
          await refreshAuth();

          setTimeout(() => {
            router.push('/candidate/dashboard');
          }, 1000);
        } else {
          const errorMessage = data?.message || 'ログインに失敗しました';
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
        setError(errorMessage);
      }
    });
  };

  return (
    <div className='w-full max-w-none md:min-w-auto flex flex-col justify-center items-center relative bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full mx-auto px-4 sm:px-6 md:px-20 py-6 md:py-20'>
        {/* 見出し */}
        <div className='flex flex-col gap-4 md:gap-6 items-center justify-start p-0 relative w-full'>
          <h1 className='text-[#0F9058] font-bold text-[24px] md:text-[32px] leading-[1.6] tracking-[2.4px] md:tracking-[3.2px] font-[family-name:var(--font-noto-sans-jp)] text-center w-full'>
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
                href='/candidate/auth/reset-password'
                className='text-[#323232] text-[14px] leading-[1.6] tracking-[1.2px] md:tracking-[1.4px] font-bold font-[family-name:var(--font-noto-sans-jp)] underline decoration-solid underline-offset-auto hover:text-[#17856F] transition-colors text-center'
              >
                パスワードをお忘れの方はこちら
              </Link>
            </div>
          </div>

          {/* ログインボタン */}
          <div className='flex flex-row items-center justify-center mt-8 md:mt-10'>
            <Button
              type='submit'
              disabled={!isFormValid || isPending}
              variant='green-gradient'
              className='px-10 py-6 md:py-8 text-[16px] leading-[1.6] tracking-[1.6px] rounded-[32px] w-full max-w-[280px] sm:max-w-[313px] md:max-w-[160px]'
            >
              {isPending ? 'ログイン中...' : 'ログイン'}
            </Button>
          </div>

          {/* SVG区切り線 */}
          <div className='flex items-center justify-center mt-8 md:mt-10 mb-8 md:mb-10'>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="100%" 
              height="2" 
              viewBox="0 0 640 2" 
              fill="none"
              className='w-full max-w-[280px] sm:max-w-[320px] md:max-w-[640px]'
              style={{ 
                height: '2px', 
                alignSelf: 'stretch',
                strokeWidth: '2px',
                stroke: '#E5E5E5'
              }}
            >
              <path d="M0 1H640" stroke="#E5E5E5" strokeWidth="1"/>
            </svg>
          </div>

          {/* 新規会員登録リンク */}
          <div className='flex flex-row items-center justify-center text-center gap-1 sm:gap-2'>
            <span className='text-[#323232] text-[14px] sm:text-[16px] leading-[1.6] tracking-[1.2px] md:tracking-[1.4px] font-bold font-[family-name:var(--font-noto-sans-jp)]'>
              会員登録がお済みでない方は
            </span>
            <Link
              href='/candidate/auth/register'
              className='text-[#0F9058] text-[14px] sm:text-[16px] leading-[1.6] tracking-[1.2px] md:tracking-[1.4px] font-bold font-[family-name:var(--font-noto-sans-jp)] underline decoration-solid underline-offset-auto hover:text-[#17856F] transition-colors'
            >
              こちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 