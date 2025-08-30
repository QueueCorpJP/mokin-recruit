import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmailInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  error?: boolean;
}

/**
 * Email Input Component (Atom)
 * Figma仕様に基づくメールアドレス専用入力フィールド (Tailwind CSS v4.0対応)
 */
function EmailInput({ className, error, ...props }: EmailInputProps) {
  return (
    <input
      type='email'
      data-slot='email-input'
      className={cn(
        // Figma仕様: 400px幅、11px padding、5px border-radius
        'flex w-[400px] min-w-0 rounded-[5px]',
        'bg-[color:var(--input-bg)]',
        'px-[11px] py-[11px]',
        // Figma仕様: Noto Sans JP, 500, 16px, line-height: 2em, letter-spacing: 10%
        'text-[color:var(--input-text-color)] placeholder:text-[color:var(--input-placeholder-color)]',
        'font-[family-name:var(--font-noto-sans-jp)] text-base font-medium leading-8 tracking-[0.1em]',
        'transition-all duration-200 ease-in-out outline-none',

        // Border styles - Tailwind CSS v4.0記法
        'border border-[color:var(--input-border-color)]',

        // Focus states - v4.0のring記法
        'focus:border-[color:var(--input-focus-border-color)]',
        'focus:ring-[3px] focus:ring-[color:var(--input-focus-ring-color)]',

        // Error states - v4.0のcolor記法
        error && [
          'border-[color:var(--input-error-border-color)]',
          'ring-[3px] ring-[color:var(--input-error-ring-color)]',
        ],

        // Disabled states
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',

        // Selection styles - v4.0のcolor記法
        'selection:bg-[color:var(--color-primary)] selection:text-[color:var(--color-primary-foreground)]',

        className
      )}
      placeholder='name@example.com'
      {...props}
    />
  );
}

export { EmailInput, type EmailInputProps };
