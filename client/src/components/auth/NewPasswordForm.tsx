'use client';

import { useState, useTransition } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/ui/password-input';

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 基本的なバリデーション
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = confirmPassword && password === confirmPassword;
  const isFormValid = isPasswordValid && isConfirmPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading || isPending) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await onSubmit(password, confirmPassword);
        setSuccess('パスワードが正常に更新されました。');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'パスワードの更新に失敗しました。'
        );
      }
    });
  };

  return (
    <div className='w-full max-w-md'>
      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* エラー表示 */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='whitespace-pre-line'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* 成功表示 */}
        {success && (
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* 新規パスワード */}
        <div className='space-y-3'>
          <Label 
            htmlFor='password' 
            className='text-[#323232] font-medium text-base leading-8 tracking-[0.1em]'
          >
            新規パスワード
          </Label>
          <PasswordInput
            id='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder='半角英数字・記号のみ、8文字以上'
            disabled={isLoading || isPending}
            required
            showToggle={true}
            className='h-[50px] border border-[#E0E0E0] rounded-[5px] px-4 text-base placeholder:text-[#999999] focus:border-[#0F9058] focus:ring-1 focus:ring-[#0F9058]'
          />
        </div>

        {/* 新規パスワード再入力 */}
        <div className='space-y-3'>
          <Label 
            htmlFor='confirmPassword' 
            className='text-[#323232] font-medium text-base leading-8 tracking-[0.1em]'
          >
            新規パスワード再入力
          </Label>
          <PasswordInput
            id='confirmPassword'
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
            placeholder='確認のためもう一度入力'
            disabled={isLoading || isPending}
            required
            showToggle={true}
            className='h-[50px] border border-[#E0E0E0] rounded-[5px] px-4 text-base placeholder:text-[#999999] focus:border-[#0F9058] focus:ring-1 focus:ring-[#0F9058]'
          />
        </div>

        {/* 設定するボタン */}
        <div className='pt-4'>
          <Button
            type='submit'
            className='w-full h-[50px] bg-[#0F9058] hover:bg-[#0D7A4A] text-white font-bold text-base rounded-[25px] transition-colors tracking-[0.1em]'
            disabled={!isFormValid || isLoading || isPending}
          >
            {isLoading || isPending ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                設定中...
              </div>
            ) : (
              '設定する'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
