'use client';

import React from 'react';

interface EmailFormFieldProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showValidation?: boolean;
  isValid?: boolean;
  className?: string;
}

export function EmailFormField({
  id = 'email',
  value,
  onChange,
  placeholder = 'name@example.com',
  showValidation = true,
  isValid = true,
  className = '',
}: EmailFormFieldProps) {
  const isEmailValid = value.includes('@') && value.length > 0;

  return (
    <div
      className={`flex flex-col md:flex-row gap-2 md:gap-4 items-start w-full ${className}`}
    >
      <div className='flex flex-row items-center justify-start md:justify-end pt-0 md:pt-[11px] pb-0 w-full md:w-[140px]'>
        <label
          htmlFor={id}
          className='text-[#323232] font-bold text-[16px] leading-[2] tracking-[1.4px] md:tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)] text-nowrap whitespace-pre'
        >
          メールアドレス
        </label>
      </div>
      <div className='w-full md:w-[400px] flex flex-col gap-2'>
        <div className='relative'>
          <input
            id={id}
            type='email'
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className='w-full h-auto bg-white !border !border-[#999999] !border-solid rounded-[5px] px-[11px] py-[11px] text-[#323232] text-[14px] md:text-[16px] leading-[2] tracking-[1.4px] md:tracking-[1.6px] font-bold font-[family-name:var(--font-noto-sans-jp)] placeholder:text-[#999999] placeholder:font-bold placeholder:leading-[2] placeholder:text-[12px] md:placeholder:text-[14px] focus:outline-none focus:!border-[#0F9058] focus:!ring-2 focus:!ring-[#0F9058]/20 transition-colors'
          />
        </div>
        {showValidation && value && !isEmailValid && (
          <p className='text-xs md:text-sm text-red-600'>
            有効なメールアドレスを入力してください
          </p>
        )}
      </div>
    </div>
  );
}
