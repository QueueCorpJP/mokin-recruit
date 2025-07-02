'use client';

import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
}

export function NewPasswordForm({
  onSubmit,
  isLoading = false,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isPending, startTransition] = useTransition();

  // パスワード強度チェック
  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return '8文字以上で入力してください';
    }
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(pwd)) {
      return '半角英数字・記号のみ使用できます';
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(pwd)) {
      return '英数字を含めてください';
    }
    return null;
  };

  // リアルタイムバリデーション
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error || undefined }));

    // 確認パスワードもチェック
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'パスワードが一致しません',
      }));
    } else if (confirmPassword && value === confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'パスワードが一致しません',
      }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    const passwordError = validatePassword(password);
    const confirmError =
      password !== confirmPassword ? 'パスワードが一致しません' : null;

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError || undefined,
        confirmPassword: confirmError || undefined,
      });
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        await onSubmit(password, confirmPassword);
      } catch (error) {
        setErrors({
          general:
            error instanceof Error ? error.message : 'エラーが発生しました',
        });
      }
    });
  };

  const isFormValid =
    password && confirmPassword && !errors.password && !errors.confirmPassword;
  const loading = isLoading || isPending;

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-6'>
      {/* 新規パスワード */}
      <div className='space-y-4'>
        <div className='space-y-4'>
          <label className='block text-[#323232] font-bold text-base leading-8 tracking-[0.1em]'>
            新規パスワード
          </label>
          <div className='relative w-[400px]'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
              placeholder='半角英数字・記号のみ、8文字以上'
              className={`w-full px-3 py-3 bg-white border rounded-[5px] text-base leading-8 tracking-[0.1em] placeholder:text-[#999999] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0F9058] focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-[#999999]'
              }`}
              disabled={loading}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#0F9058] hover:text-[#0d7a4a] transition-colors'
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className='text-red-500 text-sm font-medium'>
              {errors.password}
            </p>
          )}
        </div>

        {/* 新規パスワード再入力 */}
        <div className='space-y-4'>
          <label className='block text-[#323232] font-bold text-base leading-8 tracking-[0.1em]'>
            新規パスワード再入力
          </label>
          <div className='relative w-[400px]'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => handleConfirmPasswordChange(e.target.value)}
              placeholder='確認のためもう一度入力'
              className={`w-full px-3 py-3 bg-white border rounded-[5px] text-base leading-8 tracking-[0.1em] placeholder:text-[#999999] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#0F9058] focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#999999]'
              }`}
              disabled={loading}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#0F9058] hover:text-[#0d7a4a] transition-colors'
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm font-medium'>
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* エラーメッセージ */}
      {errors.general && (
        <div className='text-red-500 text-sm font-medium text-center'>
          {errors.general}
        </div>
      )}

      {/* 設定するボタン */}
      <div className='flex justify-end'>
        <Button
          type='submit'
          variant='green-gradient'
          size='figma-default'
          disabled={!isFormValid || loading}
          className='min-w-[120px]'
        >
          {loading ? '設定中...' : '設定する'}
        </Button>
      </div>
    </form>
  );
}
