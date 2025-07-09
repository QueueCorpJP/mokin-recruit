'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
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
  error?: string;
}

interface ForgotPasswordFormProps {
  userType?: 'candidate' | 'company' | 'admin';
}

export default function ForgotPasswordForm({
  userType = 'candidate',
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('メールアドレスは必須です');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ email: value });
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          userType,
        }),
      });

      const result: ForgotPasswordResponse = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setMessage(
          result.message ||
            'パスワードリセットリンクをメールで送信しました。メールをご確認ください。'
        );
      } else {
        setSubmitStatus('error');
        setMessage(
          result.error || 'パスワードリセット要求の送信に失敗しました。'
        );
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setSubmitStatus('error');
      setMessage(
        'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBackUrl = () => {
    switch (userType) {
      case 'candidate':
        return '/candidate/auth/login';
      case 'company':
        return '/company/auth/login';
      case 'admin':
        return '/admin/auth/login';
      default:
        return '/auth/login';
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'candidate':
        return '候補者';
      case 'company':
        return '企業';
      case 'admin':
        return '管理者';
      default:
        return '';
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader className='space-y-1'>
        <div className='flex items-center gap-2'>
          <Link
            href={getBackUrl()}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <CardTitle className='text-2xl'>パスワードリセット</CardTitle>
        </div>
        <CardDescription>
          {getUserTypeLabel()}アカウントのパスワードをリセットします
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <InputField
              label='メールアドレス'
              inputType='email'
              layout='vertical'
              required={true}
              errorMessage={emailError}
              inputProps={{
                value: formData.email,
                onChange: handleEmailChange,
                placeholder: 'example@email.com',
                error: !!emailError,
                disabled: isLoading,
              }}
            />
          </div>

          {submitStatus === 'success' && (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-800'>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className='border-red-200 bg-red-50'>
              <Mail className='h-4 w-4 text-red-600' />
              <AlertDescription className='text-red-800'>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || submitStatus === 'success'}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                送信中...
              </>
            ) : submitStatus === 'success' ? (
              '送信完了'
            ) : (
              'リセットリンクを送信'
            )}
          </Button>

          <div className='text-center text-sm'>
            <Link href={getBackUrl()} className='text-primary hover:underline'>
              ログインに戻る
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
