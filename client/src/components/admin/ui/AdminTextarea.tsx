'use client';

import React from 'react';

interface AdminTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
  value = '',
  onChange,
  placeholder = '',
  width = 'w-full',
  height = 'h-32',
  disabled = false,
  required = false,
  rows = 4,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div
      className={`bg-white box-border content-stretch flex flex-row gap-2.5 items-start justify-start p-[11px] relative rounded-[5px] ${width} ${height} ${className}`}
    >
      <div className="absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]" />
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`basis-0 font-['Noto_Sans_JP'] grow min-h-px min-w-px resize-none outline-none bg-transparent text-[#323232] text-[16px] text-left tracking-[1.6px] leading-[2] placeholder:text-[#999999] w-full h-full`}
        style={{
          fontWeight: 500,
          fontFamily: 'Noto Sans JP, sans-serif'
        }}
      />
    </div>
  );
};