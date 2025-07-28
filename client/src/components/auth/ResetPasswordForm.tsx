'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

interface PasswordStrengthResult {
  isValid: boolean;
  errors: string[];
}

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrengthResult>({
      isValid: false,
      errors: [],
    });

  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (!accessToken) {
      setError(
        '無効なリセットリンクです。再度パスワードリセットを要求してください。'
      );
    }
  }, [accessToken]);

  const validatePasswordStrength = (
    password: string
  ): PasswordStrengthResult => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('8文字以上で入力してください');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を1つ以上含めてください');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('小文字を1つ以上含めてください');
    }

    if (!/\d/.test(password)) {
      errors.push('数字を1つ以上含めてください');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('特殊文字を1つ以上含めてください');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData(prev => ({ ...prev, password: newPassword }));
    setPasswordStrength(validatePasswordStrength(newPassword));
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // バリデーション
    if (!passwordStrength.isValid) {
      setError('パスワードが要件を満たしていません');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    if (!accessToken) {
      setError('無効なリセットリンクです');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          newPassword: formData.password,
        }),
      });

      const result: ResetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'パスワードのリセットに失敗しました');
      }

      if (result.success) {
        setIsSuccess(true);
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        throw new Error(result.message || 'パスワードのリセットに失敗しました');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'パスワードのリセットに失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    passwordStrength.isValid &&
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;

  if (isSuccess) {
    return (
      <div className='text-center space-y-6'>
        <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
          <CheckCircle className='w-6 h-6 text-green-600' />
        </div>
        <div>
          <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] text-center mb-6'>
            パスワードをリセットしました
          </h1>
          <p className='text-[#323232] font-bold text-base leading-8 text-center'>
            新しいパスワードが設定されました。
            <br />
            3秒後にログインページに移動します。
          </p>
        </div>

        <div className='text-center'>
          <Button variant='green-gradient' size='figma-default' asChild>
            <Link href='/auth/login'>今すぐログインページに移動</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
             <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[800px] mx-auto px-20 py-20'>
        {/* ヘッダー */}
        <div className='text-center space-y-6'>
        <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] text-center'>
          新しいパスワードを設定
        </h1>
        <p className='text-[#323232] font-bold text-base leading-8 text-center'>
          セキュリティを保つため、強力なパスワードを設定してください
        </p>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className='space-y-10'>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* パスワード入力 */}
        <div className='flex justify-center'>
          <div className='w-[400px] space-y-2'>
            <div className='bg-white border border-[#999999] rounded-[5px] p-[11px] relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='新しいパスワードを入力'
                value={formData.password}
                onChange={handlePasswordChange}
                className='w-full text-[#999999] font-medium text-base leading-8 outline-none placeholder-[#999999] pr-8'
                required
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3 h-4 w-4 text-[#999999] hover:text-[#323232]'
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* パスワード強度インジケーター */}
            {formData.password && (
              <div className='space-y-1'>
                <div className='text-xs text-gray-600'>パスワード要件:</div>
                {passwordStrength.errors.map((error, index) => (
                  <div
                    key={index}
                    className='text-xs text-red-500 flex items-center'
                  >
                    <AlertCircle className='w-3 h-3 mr-1' />
                    {error}
                  </div>
                ))}
                {passwordStrength.isValid && (
                  <div className='text-xs text-green-600 flex items-center'>
                    <CheckCircle className='w-3 h-3 mr-1' />
                    パスワード要件を満たしています
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* パスワード確認入力 */}
        <div className='flex justify-center'>
          <div className='w-[400px] space-y-2'>
            <div className='bg-white border border-[#999999] rounded-[5px] p-[11px] relative'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='パスワードを再入力'
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className='w-full text-[#999999] font-medium text-base leading-8 outline-none placeholder-[#999999] pr-8'
                required
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-3 h-4 w-4 text-[#999999] hover:text-[#323232]'
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* パスワード一致確認 */}
            {formData.confirmPassword && (
              <div className='mt-1'>
                {formData.password === formData.confirmPassword ? (
                  <div className='text-xs text-green-600 flex items-center'>
                    <CheckCircle className='w-3 h-3 mr-1' />
                    パスワードが一致しています
                  </div>
                ) : (
                  <div className='text-xs text-red-500 flex items-center'>
                    <AlertCircle className='w-3 h-3 mr-1' />
                    パスワードが一致しません
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* リセットボタン */}
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
                パスワードをリセット中...
              </>
            ) : (
              'パスワードをリセット'
            )}
          </Button>
        </div>

        <div className='text-center'>
          <Button
            variant='link'
            asChild
            className='text-[#0F9058] hover:text-[#0F9058] text-sm'
          >
            <Link href='/auth/login'>ログインページに戻る</Link>
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}
