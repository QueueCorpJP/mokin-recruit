import * as React from 'react';
import { cn } from '@/lib/utils';
import { EmailInput, type EmailInputProps } from './email-input';

interface EmailFormFieldProps extends EmailInputProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  layout?: 'horizontal' | 'vertical';
  required?: boolean;
}

/**
 * Email Form Field Component (Molecule)
 * ラベル付きメールアドレス入力フィールド
 * Figma仕様: 横並びレイアウト対応 (Tailwind CSS v4.0対応)
 */
function EmailFormField({
  label = 'メールアドレス',
  description,
  errorMessage,
  layout = 'horizontal',
  required = false,
  className,
  error,
  id,
  ...inputProps
}: EmailFormFieldProps) {
  const fieldId = id || React.useId();
  const hasError = !!(error || errorMessage);

  if (layout === 'horizontal') {
    return (
      <div
        className={cn(
          // Figma仕様: 横並びレイアウト、gap: 16px
          'flex items-start gap-4',
          className
        )}
        data-slot='email-form-field'
      >
        {/* Label - Figma仕様準拠 */}
        <div className='flex items-center pt-[11px] min-w-[140px]'>
          <label
            htmlFor={fieldId}
            className={cn(
              // Figma仕様: Noto Sans JP, 700, 16px, line-height: 2em, letter-spacing: 10%
              'text-[color:var(--input-label-color)] font-bold',
              'text-base leading-8 tracking-[0.1em]',
              'font-[family-name:var(--font-noto-sans-jp)]',
              'whitespace-nowrap select-none text-right w-[140px]',
              hasError && 'text-[color:var(--input-error-border-color)]'
            )}
          >
            {label}
            {required && (
              <span className='text-[color:var(--input-error-border-color)] ml-1'>
                *
              </span>
            )}
          </label>
        </div>

        {/* Input Field Container - Figma仕様: 400px幅 */}
        <div className='flex flex-col gap-2 w-[400px]'>
          <EmailInput
            id={fieldId}
            error={hasError}
            aria-invalid={hasError}
            aria-describedby={
              description || errorMessage
                ? `${fieldId}-description ${fieldId}-error`.trim()
                : undefined
            }
            {...inputProps}
          />

          {/* Description */}
          {description && (
            <p
              id={`${fieldId}-description`}
              className='text-sm text-[color:var(--input-description-color)] leading-[1.4] tracking-[0.025em]'
            >
              {description}
            </p>
          )}

          {/* Error Message */}
          {errorMessage && (
            <p
              id={`${fieldId}-error`}
              className='text-sm text-[color:var(--input-error-border-color)] leading-[1.4]'
              role='alert'
            >
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Vertical Layout
  return (
    <div
      className={cn('flex flex-col gap-2 w-[400px]', className)}
      data-slot='email-form-field'
    >
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={cn(
          'text-[color:var(--input-label-color)] font-bold',
          'text-base leading-8 tracking-[0.1em]',
          'font-[family-name:var(--font-noto-sans-jp)]',
          'select-none',
          hasError && 'text-[color:var(--input-error-border-color)]'
        )}
      >
        {label}
        {required && (
          <span className='text-[color:var(--input-error-border-color)] ml-1'>
            *
          </span>
        )}
      </label>

      {/* Input Field */}
      <EmailInput
        id={fieldId}
        error={hasError}
        aria-invalid={hasError}
        aria-describedby={
          description || errorMessage
            ? `${fieldId}-description ${fieldId}-error`.trim()
            : undefined
        }
        {...inputProps}
      />

      {/* Description */}
      {description && (
        <p
          id={`${fieldId}-description`}
          className='text-sm text-[color:var(--input-description-color)] leading-[1.4] tracking-[0.025em]'
        >
          {description}
        </p>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p
          id={`${fieldId}-error`}
          className='text-sm text-[color:var(--input-error-border-color)] leading-[1.4]'
          role='alert'
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export { EmailFormField, type EmailFormFieldProps };
