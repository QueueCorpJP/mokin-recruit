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
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      className={`${width} ${height} px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] resize-none outline-none ${className}`}
      style={{
        fontFamily: 'Noto Sans JP, sans-serif'
      }}
    />
  );
};