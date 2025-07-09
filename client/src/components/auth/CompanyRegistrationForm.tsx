'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

// MVPスキーマ対応の企業ユーザー登録フォームデータ
interface CompanyRegistrationFormData {
  // 企業アカウント情報
  companyName: string;
  industry: string;
  headquartersAddress?: string;
  representativeName?: string;
  companyOverview?: string;

  // 企業ユーザー情報
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  positionTitle?: string;
}

interface CompanyRegistrationFormProps {
  onSubmit?: (data: CompanyRegistrationFormData) => Promise<void>;
}

export default function CompanyRegistrationForm({
  onSubmit,
}: CompanyRegistrationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CompanyRegistrationFormData>({
    companyName: '',
    industry: '',
    headquartersAddress: '',
    representativeName: '',
    companyOverview: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    positionTitle: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (field: keyof CompanyRegistrationFormData) => {
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

    // 企業情報の検証
    if (!formData.companyName) {
      newErrors.companyName = '企業名は必須です';
    }

    if (!formData.industry) {
      newErrors.industry = '業界は必須です';
    }

    // 企業ユーザー情報の検証
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

    if (!formData.fullName) {
      newErrors.fullName = '担当者名は必須です';
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
          const response = await fetch('/api/auth/register/company', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // 企業アカウント情報
              companyName: formData.companyName,
              industry: formData.industry,
              headquartersAddress: formData.headquartersAddress || undefined,
              representativeName: formData.representativeName || undefined,
              companyOverview: formData.companyOverview || undefined,

              // 企業ユーザー情報
              email: formData.email,
              password: formData.password,
              fullName: formData.fullName,
              positionTitle: formData.positionTitle || undefined,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || '登録に失敗しました');
          }

          setSubmitStatus('success');
          setSubmitMessage('企業アカウント登録が完了しました');

          // 成功時にログインページにリダイレクト
          setTimeout(() => {
            router.push('/company/auth/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Company registration error:', error);
        setSubmitStatus('error');
        setSubmitMessage(
          error instanceof Error ? error.message : '登録に失敗しました'
        );
      }
    });
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* 企業情報セクション */}
        <div className='space-y-6'>
          <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
            企業情報
          </h2>

          {/* 企業名 */}
          <InputField
            label='企業名'
            inputType='text'
            layout='vertical'
            required={true}
            errorMessage={errors.companyName}
            inputProps={{
              value: formData.companyName,
              onChange: handleInputChange('companyName'),
              placeholder: '株式会社サンプル',
              error: !!errors.companyName,
            }}
          />

          {/* 業界 */}
          <InputField
            label='業界'
            inputType='text'
            layout='vertical'
            required={true}
            errorMessage={errors.industry}
            inputProps={{
              value: formData.industry,
              onChange: handleInputChange('industry'),
              placeholder: 'IT・ソフトウェア',
              error: !!errors.industry,
            }}
          />

          {/* 本社所在地（任意） */}
          <InputField
            label='本社所在地（任意）'
            inputType='text'
            layout='vertical'
            errorMessage={errors.headquartersAddress}
            inputProps={{
              value: formData.headquartersAddress,
              onChange: handleInputChange('headquartersAddress'),
              placeholder: '東京都渋谷区...',
              error: !!errors.headquartersAddress,
            }}
          />

          {/* 代表者名（任意） */}
          <InputField
            label='代表者名（任意）'
            inputType='text'
            layout='vertical'
            errorMessage={errors.representativeName}
            inputProps={{
              value: formData.representativeName,
              onChange: handleInputChange('representativeName'),
              placeholder: '田中 太郎',
              error: !!errors.representativeName,
            }}
          />

          {/* 企業概要（任意） */}
          <InputField
            label='企業概要（任意）'
            inputType='text'
            layout='vertical'
            errorMessage={errors.companyOverview}
            inputProps={{
              value: formData.companyOverview,
              onChange: handleInputChange('companyOverview'),
              placeholder: '弊社は...',
              error: !!errors.companyOverview,
            }}
          />
        </div>

        {/* 担当者情報セクション */}
        <div className='space-y-6'>
          <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
            担当者情報
          </h2>

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
              placeholder: 'tanaka@company.com',
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

          {/* 担当者名 */}
          <InputField
            label='担当者名'
            inputType='text'
            layout='vertical'
            required={true}
            errorMessage={errors.fullName}
            inputProps={{
              value: formData.fullName,
              onChange: handleInputChange('fullName'),
              placeholder: '田中 太郎',
              error: !!errors.fullName,
            }}
          />

          {/* 役職（任意） */}
          <InputField
            label='役職（任意）'
            inputType='text'
            layout='vertical'
            errorMessage={errors.positionTitle}
            inputProps={{
              value: formData.positionTitle,
              onChange: handleInputChange('positionTitle'),
              placeholder: '人事部長',
              error: !!errors.positionTitle,
            }}
          />
        </div>

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
          {isPending ? '登録中...' : '企業アカウントとして登録'}
        </Button>

        {/* ログインリンク */}
        <div className='text-center text-sm'>
          <span className='text-gray-600'>すでにアカウントをお持ちの方は </span>
          <Link
            href='/company/auth/login'
            className='text-primary hover:underline font-medium'
          >
            ログイン
          </Link>
        </div>
      </form>
    </div>
  );
}
