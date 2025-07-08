import React, { forwardRef } from 'react';
import { BaseInput, BaseInputProps } from './base-input';
import { PasswordInput, PasswordInputProps } from './password-input';
import { cn } from '@/lib/utils';

// InputField layout types
type InputFieldLayout = 'horizontal' | 'vertical';
type InputType = 'text' | 'email' | 'password';

// Base InputField props
interface BaseInputFieldProps {
  label?: string;
  id?: string;
  layout?: InputFieldLayout;
  required?: boolean;
  className?: string;
  errorMessage?: string;
  description?: string;
  inputType?: InputType;
  showToggle?: boolean;
}

// Generic InputField props with input props
export interface InputFieldProps<T extends BaseInputProps = BaseInputProps>
  extends BaseInputFieldProps {
  inputProps?: Omit<T, 'id' | 'className'>;
}

// Email-specific props
export interface EmailInputFieldProps extends BaseInputFieldProps {
  inputProps?: Omit<BaseInputProps, 'id' | 'className' | 'type'>;
}

// Password-specific props
export interface PasswordInputFieldProps extends BaseInputFieldProps {
  inputProps?: Omit<PasswordInputProps, 'id' | 'className' | 'showToggle'>;
}

// Text-specific props
export interface TextInputFieldProps extends BaseInputFieldProps {
  inputProps?: Omit<BaseInputProps, 'id' | 'className' | 'type'>;
}

// Type-specific InputField props
export type TypedInputFieldProps =
  | (EmailInputFieldProps & { inputProps?: { type: 'email' } })
  | (PasswordInputFieldProps & { inputProps?: { type: 'password' } })
  | (TextInputFieldProps & { inputProps?: { type?: 'text' } });

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label = 'ラベル',
      id,
      layout = 'horizontal',
      required = false,
      className = '',
      errorMessage,
      description,
      inputType = 'text',
      showToggle = false,
      inputProps = {},
      ...props
    },
    ref
  ) => {
    const fieldId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!(errorMessage || inputProps?.error);

    // inputTypeに基づいてデフォルトラベルを設定
    const defaultLabel =
      inputType === 'email'
        ? 'メールアドレス'
        : inputType === 'password'
          ? 'パスワード'
          : 'ラベル';
    const finalLabel = label || defaultLabel;

    // 適切な入力コンポーネントを選択
    const renderInput = () => {
      if (inputType === 'password') {
        return (
          <PasswordInput
            id={fieldId}
            ref={ref}
            showToggle={showToggle}
            className='w-full'
            {...inputProps}
            {...props}
          />
        );
      }

      return (
        <BaseInput
          id={fieldId}
          ref={ref}
          type={inputType}
          className='w-full'
          {...inputProps}
          {...props}
        />
      );
    };

    if (layout === 'vertical') {
      return (
        <div className={`flex flex-col gap-1 ${className}`}>
          <label
            htmlFor={fieldId}
            className={cn(
              'text-[color:var(--input-label-color)] font-bold',
              'text-[16px] leading-[var(--input-label-line-height)]',
              'tracking-[var(--input-label-letter-spacing)]',
              'font-[family-name:var(--font-noto-sans-jp)]',
              'text-left select-none',
              hasError && 'text-[color:var(--error-color)]'
            )}
          >
            {finalLabel}
            {required && (
              <span className='text-[color:var(--error-color)] ml-1'>*</span>
            )}
          </label>
          <div className='w-full'>{renderInput()}</div>
          {description && (
            <span className='text-[color:var(--input-description-color)] text-[var(--input-description-font-size)] leading-[var(--input-description-line-height)] tracking-[var(--input-description-letter-spacing)]'>
              {description}
            </span>
          )}
          {errorMessage && (
            <span className='text-[color:var(--error-color)] text-sm'>
              {errorMessage}
            </span>
          )}
        </div>
      );
    }

    // Horizontal layout (improved with fixed-width right-aligned label and flexible input)
    return (
      <div className={`flex items-start gap-4 ${className}`}>
        {/* Fixed width, right-aligned label */}
        <label
          htmlFor={fieldId}
          className={cn(
            'w-[140px] text-right flex-shrink-0',
            'text-[color:var(--input-label-color)] font-bold',
            'text-[16px] leading-[var(--input-label-line-height)]',
            'tracking-[var(--input-label-letter-spacing)]',
            'font-[family-name:var(--font-noto-sans-jp)]',
            'select-none pt-[11px]', // Align with input padding for better visual alignment
            hasError && 'text-[color:var(--error-color)]'
          )}
        >
          {finalLabel}
          {required && (
            <span className='text-[color:var(--error-color)] ml-1'>*</span>
          )}
        </label>

        {/* Flexible input container that grows to fill remaining space */}
        <div className='flex-1 flex flex-col min-w-0'>
          {renderInput()}
          {description && (
            <span className='text-[color:var(--input-description-color)] text-[var(--input-description-font-size)] leading-[var(--input-description-line-height)] tracking-[var(--input-description-letter-spacing)] mt-1'>
              {description}
            </span>
          )}
          {errorMessage && (
            <span className='text-[color:var(--error-color)] text-sm mt-1'>
              {errorMessage}
            </span>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
