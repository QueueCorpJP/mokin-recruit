'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailFormField } from '@/components/ui/email-form-field';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import type { UserType } from '@/types';

interface LoginFormProps {
  userType?: 'candidate' | 'company' | 'admin';
}

export function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
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
        const result = await signIn({
          email: email.trim(),
          password,
          userType: userType as UserType,
        });

        if (result.error) {
          setError(result.error || 'ログインに失敗しました');
        } else {
          setSuccess('ログインに成功しました！');
          setTimeout(() => {
            router.push(getRedirectPath());
          }, 1000);
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('ネットワークエラーが発生しました');
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
              onChange={e => setEmail(e.target.value)}
            />

            {/* パスワード入力 */}
            <PasswordFormField
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
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
