'use client';

import { useState, useTransition } from 'react';
import { PasswordFormField } from '@/components/ui/password-form-field';

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
    <div className={`relative size-full ${
      userType === 'candidate' 
        ? '' 
        : 'bg-[#ffffff] rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="flex flex-col items-center relative size-full mb-50">
        <form onSubmit={handleSubmit} className={`box-border content-stretch flex flex-col gap-6 md:gap-10 items-center justify-start relative size-full ${
          userType === 'candidate' ? 'p-0' : 'p-20'
        }`}>
          
          {/* 見出し+説明 */}
          <div className="box-border content-stretch flex flex-col gap-4 md:gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
            <div className="relative shrink-0 text-[#0f9058] text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px] w-full">
              <p className="block leading-[1.6] font-bold font-[var(--font-noto-sans-jp)]">パスワードの再設定</p>
            </div>
            <div className="relative shrink-0 text-[#323232] text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px] w-full">
                              <p className="block leading-[2] font-bold font-[var(--font-noto-sans-jp)]">
                半角英数字・記号のみ、8文字以上でパスワードを設定してください。
              </p>
            </div>
          </div>

          {/* フォームフィールド */}
          <div className="box-border content-stretch cursor-pointer flex flex-col gap-6 items-end justify-start p-0 relative shrink-0 w-full">
            
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
                <div className="flex justify-center md:justify-end">
                  <div className="w-full max-w-[400px] md:w-[400px] md:ml-[144px]">
                    <p className='text-sm text-red-600 text-center md:text-left'>
                      パスワードが一致しません
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 設定するボタン */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading || isPending}
            className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:min-w-40 px-6 sm:px-10 py-3 md:py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] hover:bg-[#0D7A4A] disabled:bg-[#999999] disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
              <p className="adjustLetterSpacing block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre">
                {isLoading || isPending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {userType === 'company' ? '設定中' : '変更中'}
                  </span>
                ) : (
                  userType === 'company' ? '設定する' : 'パスワードを変更する'
                )}
              </p>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
