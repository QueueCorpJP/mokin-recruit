'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

// MVPスキーマ対応の候補者登録フォームデータ
interface CandidateRegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  lastName: string;
  firstName: string;
  phoneNumber?: string;
  currentResidence?: string;
}

interface CandidateRegistrationFormProps {
  onSubmit?: (data: CandidateRegistrationFormData) => Promise<void>;
}

export default function CandidateRegistrationForm({
  onSubmit,
}: CandidateRegistrationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CandidateRegistrationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    lastName: '',
    firstName: '',
    phoneNumber: '',
    currentResidence: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (field: keyof CandidateRegistrationFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必須フィールドの検証
    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認は必須です';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    if (!formData.lastName) {
      newErrors.lastName = '姓は必須です';
    }

    if (!formData.firstName) {
      newErrors.firstName = '名は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        if (onSubmit) {
          await onSubmit(formData);
        } else {
          // デフォルトのAPI呼び出し
          const response = await fetch('/api/auth/register/candidate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              lastName: formData.lastName,
              firstName: formData.firstName,
              phoneNumber: formData.phoneNumber || undefined,
              currentResidence: formData.currentResidence || undefined,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || '登録に失敗しました');
          }

          setSubmitStatus('success');
          setSubmitMessage('候補者登録が完了しました');

          // 成功時にログインページにリダイレクト
          setTimeout(() => {
            router.push('/candidate/auth/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        setSubmitStatus('error');
        setSubmitMessage(
          error instanceof Error ? error.message : '登録に失敗しました'
        );
      }
    });
  };

  return (
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[592px] mx-auto px-20 py-20'>
        <form onSubmit={handleSubmit} className='space-y-6 w-full'>
        {/* メールアドレス */}
        <InputField
          label='メールアドレス'
          inputType='email'
          layout='vertical'
          required={true}
          errorMessage={errors.email}
          inputProps={{
            value: formData.email,
            onChange: handleInputChange('email'),
            placeholder: 'example@email.com',
            error: !!errors.email,
          }}
        />

        {/* パスワード */}
        <InputField
          label='パスワード'
          inputType='password'
          layout='vertical'
          required={true}
          errorMessage={errors.password}
          inputProps={{
            value: formData.password,
            onChange: handleInputChange('password'),
            placeholder: '8文字以上で入力してください',
            error: !!errors.password,
          }}
        />

        {/* パスワード確認 */}
        <InputField
          label='パスワード確認'
          inputType='password'
          layout='vertical'
          required={true}
          errorMessage={errors.confirmPassword}
          inputProps={{
            value: formData.confirmPassword,
            onChange: handleInputChange('confirmPassword'),
            placeholder: 'パスワードを再入力してください',
            error: !!errors.confirmPassword,
          }}
        />

        {/* 姓 */}
        <InputField
          label='姓'
          inputType='text'
          layout='vertical'
          required={true}
          errorMessage={errors.lastName}
          inputProps={{
            value: formData.lastName,
            onChange: handleInputChange('lastName'),
            placeholder: '田中',
            error: !!errors.lastName,
          }}
        />

        {/* 名 */}
        <InputField
          label='名'
          inputType='text'
          layout='vertical'
          required={true}
          errorMessage={errors.firstName}
          inputProps={{
            value: formData.firstName,
            onChange: handleInputChange('firstName'),
            placeholder: '太郎',
            error: !!errors.firstName,
          }}
        />

        {/* 電話番号（任意） */}
        <InputField
          label='電話番号（任意）'
          inputType='text'
          layout='vertical'
          errorMessage={errors.phoneNumber}
          inputProps={{
            value: formData.phoneNumber,
            onChange: handleInputChange('phoneNumber'),
            placeholder: '090-1234-5678',
            error: !!errors.phoneNumber,
          }}
        />

        {/* 現在の居住地（任意） */}
        <InputField
          label='現在の居住地（任意）'
          inputType='text'
          layout='vertical'
          errorMessage={errors.currentResidence}
          inputProps={{
            value: formData.currentResidence,
            onChange: handleInputChange('currentResidence'),
            placeholder: '東京都渋谷区',
            error: !!errors.currentResidence,
          }}
        />

        {/* ステータスメッセージ */}
        {submitStatus === 'success' && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className='border-red-200 bg-red-50'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* 送信ボタン */}
        <Button type='submit' className='w-full' disabled={isPending} size='lg'>
          {isPending ? '登録中...' : '候補者として登録'}
        </Button>

        {/* ログインリンク */}
        <div className='text-center text-sm'>
          <span className='text-gray-600'>すでにアカウントをお持ちの方は </span>
          <Link
            href='/candidate/auth/login'
            className='text-primary hover:underline font-medium'
          >
            ログイン
          </Link>
        </div>
        </form>
      </div>
    </div>
  );
}
