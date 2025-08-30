'use client';

import { useState, useTransition } from 'react';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { ButtonLoading } from '@/components/ui/Loading';

interface NewPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
  userType?: 'candidate' | 'company';
}

export function NewPasswordForm({
  onSubmit,
  isLoading = false,
  userType,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  // 基本的なバリデーション
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = confirmPassword && password === confirmPassword;
  const isFormValid = isPasswordValid && isConfirmPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading || isPending) return;

    startTransition(async () => {
      try {
        await onSubmit(password, confirmPassword);
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        // エラーハンドリングは上位コンポーネントで行う
        console.error('Password reset error:', error);
      }
    });
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col items-center relative w-full">
        <form onSubmit={handleSubmit} className="box-border content-stretch flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full">
          
          {/* 見出し+説明 */}
          <div className="box-border content-stretch flex flex-col gap-4 md:gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
            <div className="relative shrink-0 text-[#0f9058] text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px] w-full">
              <p className="block leading-[1.6] font-bold font-[family-name:var(--font-noto-sans-jp)]">パスワードの再設定</p>
            </div>
            <div className="relative shrink-0 text-[#323232] text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px] w-full">
              <p className="block leading-[2] font-bold font-[family-name:var(--font-noto-sans-jp)]">
                半角英数字・記号のみ、8文字以上でパスワードを設定してください。
              </p>
            </div>
          </div>

          {/* フォームフィールド */}
          <div className='flex flex-col gap-6 items-center w-full max-w-[400px]'>
            {/* 新規パスワード */}
            <PasswordFormField
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="新規パスワード"
              placeholder="半角英数字・記号のみ、8文字以上"
              showValidation={true}
              minLength={8}
            />

            {/* 新規パスワード再入力 */}
            <div className="w-full flex flex-col gap-2">
              <PasswordFormField
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                label="新規パスワード再入力"
                placeholder="確認のためもう一度入力"
                showValidation={false}
                minLength={8}
              />
              {confirmPassword && !isConfirmPasswordValid && (
                <div className="w-full">
                  <p className='text-sm text-red-600 text-center'>
                    パスワードが一致しません
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 設定するボタン */}
          <div className='flex justify-center w-full'>
            <button
              type='submit'
              disabled={!isFormValid || isLoading || isPending}
              className='flex items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:max-w-[170px] px-6 sm:px-10 py-3 md:py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#0f9058] to-[#229a4e] text-white font-bold text-[14px] md:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0px_8px_15px_0px_rgba(0,0,0,0.2)] transition-all duration-200 gap-2.5'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                lineHeight: '1.6',
                letterSpacing: '1.4px',
              }}
            >
              {isLoading || isPending ? (
                <>
                  <ButtonLoading />
                  設定中
                </>
              ) : (
                <p className='block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre md:tracking-[1.6px]'>
                  設定する
                </p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
