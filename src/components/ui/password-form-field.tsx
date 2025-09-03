'use client';

import React, { useState } from 'react';

interface PasswordFormFieldProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  showValidation?: boolean;
  minLength?: number;
  className?: string;
  inputWidth?: string;
  confirmTarget?: string;
  isConfirmField?: boolean;
  hideLabel?: boolean; // 追加: ラベルを非表示にするかどうか
}

export function PasswordFormField({
  id = 'password',
  value,
  onChange,
  label = 'パスワード',
  placeholder = '半角英数字・記号のみ、8文字以上',
  showValidation = true,
  minLength = 8,
  className = '',
  inputWidth = 'md:w-[400px]',
  confirmTarget = '',
  isConfirmField = false,
  hideLabel = false, // 追加: デフォルトはfalse
}: PasswordFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string) => {
    // 長さチェック
    if (password.length < minLength) return false;
    // 半角英数字・記号のみチェック（全角文字を除外）
    const validCharRegex = /^[\x20-\x7E]*$/;
    if (!validCharRegex.test(password)) return false;
    return true;
  };

  const isPasswordValid = validatePassword(value);

  const getValidationMessage = () => {
    if (!value) return '';

    // 確認フィールドの場合はパスワード一致チェック
    if (isConfirmField) {
      if (value !== confirmTarget) {
        return 'パスワードが一致しません';
      }
      return '';
    }

    // 通常のパスワードフィールドの場合
    if (value.length < minLength) {
      return `パスワードは${minLength}文字以上で入力してください`;
    }
    const validCharRegex = /^[\x20-\x7E]*$/;
    if (!validCharRegex.test(value)) {
      return '半角英数字・記号のみで入力してください';
    }
    return '';
  };

  return (
    <div
      className={`flex flex-col md:flex-row gap-2 items-start w-full ${className}`}
    >
      {/* ラベル部分: hideLabelがfalseのときのみ表示 */}
      {!hideLabel && (
        <div className='flex flex-row items-start justify-start pt-0 md:pt-[11px] pb-0 w-full md:w-[200px] md:flex-shrink-0'>
          <label
            htmlFor={id}
            className='text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.4px] md:tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] whitespace-nowrap'
          >
            {label}
          </label>
        </div>
      )}
      <div className={`w-full ${inputWidth} flex flex-col gap-2`}>
        <div className='relative'>
          <div className='bg-white h-[44px] md:h-[50px] relative rounded-[5px] w-full'>
            <div className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]' />
            <div className='flex flex-row items-center relative h-full'>
              <div className='flex flex-row h-[44px] md:h-[50px] items-center justify-between p-[11px] relative w-full'>
                <input
                  id={id}
                  type={showPassword ? 'text' : 'password'}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  className='flex-1 bg-transparent text-[#323232] text-[14px] md:text-[16px] leading-[2] tracking-[1.4px] md:tracking-[1.6px] font-medium font-[family-name:var(--font-noto-sans-jp)] placeholder:text-[#999999] placeholder:font-medium placeholder:leading-[2] placeholder:tracking-[1.2px] md:placeholder:tracking-[1.6px] placeholder:whitespace-pre placeholder:text-[11px] md:placeholder:text-[14px] border-none outline-none focus:outline-none [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden'
                />
                <button
                  type='button'
                  className={`flex items-center justify-center h-full aspect-square transition-colors ${
                    showPassword
                      ? 'text-[#999999] hover:text-[#777777]'
                      : 'text-[#0F9058] hover:text-[#0d7a4a]'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    viewBox='0 0 28 23'
                    fill='none'
                    className='w-[24px] h-[20px] md:w-[28px] md:h-[23px]'
                  >
                    {/* 常に閉じた目のアイコン */}
                    <path
                      d='M1.69772 0.223637C1.24272 -0.13554 0.582111 -0.0523163 0.223367 0.403226C-0.135377 0.858768 -0.0522531 1.52018 0.402739 1.87936L26.3023 22.2035C26.7573 22.5627 27.4179 22.4795 27.7766 22.024C28.1354 21.5684 28.0523 20.907 27.5973 20.5478L22.9948 16.9385C24.7273 15.1602 25.8998 13.1672 26.4904 11.7524C26.6348 11.4063 26.6348 11.0209 26.4904 10.6748C25.8385 9.11109 24.4692 6.83338 22.4217 4.93237C20.3655 3.01383 17.5349 1.40191 14 1.40191C11.0163 1.40191 8.53135 2.55391 6.59325 4.06508L1.69772 0.223637ZM9.7607 6.54867C10.8763 5.52808 12.3682 4.90609 14 4.90609C17.4781 4.90609 20.2999 7.73132 20.2999 11.2136C20.2999 12.3043 20.0243 13.3292 19.5387 14.2228L17.8499 12.9C18.2174 12.0546 18.3137 11.0866 18.0599 10.1273C17.5743 8.30951 15.9687 7.08743 14.1837 7.01297C13.93 7.00421 13.7813 7.28016 13.86 7.52545C13.9519 7.80579 14.0044 8.10364 14.0044 8.41464C14.0044 8.86142 13.8994 9.28192 13.7156 9.65424L9.76507 6.55305L9.7607 6.54867ZM16.3187 17.0787C15.6012 17.3634 14.8181 17.5211 14 17.5211C10.5219 17.5211 7.70011 14.6959 7.70011 11.2136C7.70011 10.9114 7.72198 10.6179 7.76136 10.3288L3.63581 7.07429C2.63832 8.37521 1.92521 9.67176 1.50959 10.6748C1.36522 11.0209 1.36522 11.4063 1.50959 11.7524C2.16146 13.3161 3.53081 15.5938 5.57827 17.4948C7.63449 19.4134 10.4651 21.0253 14 21.0253C16.0912 21.0253 17.9331 20.4602 19.5212 19.6017L16.3187 17.0787Z'
                      fill='currentColor'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {showValidation && getValidationMessage() && (
          <p className='text-xs md:text-sm text-red-600'>
            {getValidationMessage()}
          </p>
        )}
      </div>
    </div>
  );
}
