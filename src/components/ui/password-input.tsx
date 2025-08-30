import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BaseInput, BaseInputProps } from './base-input';

export interface PasswordInputProps extends Omit<BaseInputProps, 'type'> {
  showToggle?: boolean;
  type?: React.HTMLInputTypeAttribute;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, className = '', type = 'password', ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

    if (!showToggle) {
      return (
        <BaseInput ref={ref} type={type} className={className} {...props} />
      );
    }

    return (
      <div className='relative w-full'>
        <BaseInput
          ref={ref}
          type={isVisible ? 'text' : type}
          className={`pr-12 ${className}`}
          {...props}
        />
        <button
          type='button'
          onClick={toggleVisibility}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--password-toggle-icon-color)] hover:text-[color:var(--input-focus-border-color)] transition-colors'
          aria-label={isVisible ? 'パスワードを隠す' : 'パスワードを表示'}
        >
          {isVisible ? <EyeOff size={28} /> : <Eye size={28} />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
