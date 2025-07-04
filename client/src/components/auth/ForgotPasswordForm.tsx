'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ForgotPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'パスワードリセットの要求に失敗しました'
        );
      }

      if (result.success) {
        setIsSuccess(true);
      } else {
        throw new Error(
          result.message || 'パスワードリセットの要求に失敗しました'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'パスワードリセットの要求に失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  if (isSuccess) {
    return (
      <div className='text-center space-y-6'>
        <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
          <CheckCircle className='w-6 h-6 text-green-600' />
        </div>
        <div>
          <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] text-center mb-6'>
            メールを送信しました
          </h1>
          <p className='text-[#323232] font-bold text-base leading-8 text-center'>
            {formData.email} にパスワードリセット用のリンクを送信しました。
            <br />
            メールをご確認ください。
          </p>
        </div>

        <div className='space-y-4'>
          <div className='bg-gray-50 p-4 rounded-md'>
            <p className='text-sm text-gray-600'>
              メールが届かない場合は、迷惑メールフォルダもご確認ください。
              <br />
              リンクの有効期限は1時間です。
            </p>
          </div>

          <div className='text-center'>
            <Button
              variant='link'
              asChild
              className='text-[#0F9058] hover:text-[#0F9058]'
            >
              <Link href='/auth/login'>
                <ArrowLeft className='w-4 h-4 mr-1' />
                ログインページに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      {/* ヘッダー */}
      <div className='text-center space-y-6'>
        <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] text-center'>
          パスワードの再設定
        </h1>
        <p className='text-[#323232] font-bold text-base leading-8 text-center'>
          サービスに登録されているメールアドレスを入力してください。
          <br />
          パスワード再設定のご案内のメールをお送りいたします。
        </p>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className='space-y-10'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* メールアドレス入力 */}
        <div className='flex justify-center'>
          <div className='w-[400px] space-y-4'>
            <div className='bg-white border border-[#999999] rounded-[5px] p-[11px]'>
              <input
                id='email'
                type='email'
                placeholder={
                  process.env.NODE_ENV === 'development'
                    ? 'test-candidate@example.com (開発用)'
                    : 'メールアドレスを入力'
                }
                value={formData.email}
                onChange={handleEmailChange}
                className='w-full text-[#999999] font-medium text-base leading-8 outline-none placeholder-[#999999]'
                required
                disabled={isLoading}
              />
            </div>

            {/* 開発環境でのテストユーザー自動入力ボタン */}
            {process.env.NODE_ENV === 'development' && (
              <div className='flex gap-2 justify-center'>
                <button
                  type='button'
                  onClick={() =>
                    setFormData({ email: 'test-candidate@example.com' })
                  }
                  className='text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition-colors'
                  disabled={isLoading}
                >
                  候補者用メール
                </button>
                <button
                  type='button'
                  onClick={() =>
                    setFormData({ email: 'test-company@example.com' })
                  }
                  className='text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded transition-colors'
                  disabled={isLoading}
                >
                  企業用メール
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 送信ボタン */}
        <div className='flex justify-center'>
          <Button
            type='submit'
            variant='green-gradient'
            size='figma-default'
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                送信中...
              </>
            ) : (
              '送信する'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
