import React, { forwardRef } from 'react';

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: React.HTMLInputTypeAttribute;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ type = 'text', error = false, className = '', style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot='base-input'
        className={`
          flex min-w-0 rounded-[5px]
          bg-[color:var(--input-background-color)]
          text-[color:var(--input-text-color)] placeholder:text-[color:var(--input-placeholder-color)]
          font-[family-name:var(--font-noto-sans-jp)] font-medium text-[16px] leading-[2em] tracking-[0.1em]
          border border-[color:var(--input-border-color)]
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[color:var(--input-focus-border-color)] focus:border-[color:var(--input-focus-border-color)]
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-[color:var(--error-color)] focus:ring-[color:var(--error-color)] focus:border-[color:var(--error-color)]' : ''}
          ${className}
        `}
        style={{
          width: style?.width || '100%',
          padding: style?.padding || '11px',
          alignItems: style?.alignItems || 'center',
          gap: style?.gap,
          ...style
        }}
        {...props}
      />
    );
  }
);

BaseInput.displayName = 'BaseInput';
