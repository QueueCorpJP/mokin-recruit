import React from 'react';
import { FormErrorMessage } from './FormErrorMessage';
import { describedByIdFor } from '../utils/a11y';

/**
 * 共通Field部品
 * - label: ラベルテキスト
 * - htmlFor: input/textareaのidと対応
 * - children: inputやtextareaなどのフィールド本体
 * - error: バリデーションエラー（string | string[] | null）
 * - hideLabel: trueならlabelを画面上に表示せず、アクセシビリティのみ担保（デフォルトfalse）
 *
 * アクセシビリティ属性（htmlFor, id, aria-describedby）も考慮
 */
export function FormField({
  label,
  htmlFor,
  children,
  error,
  hideLabel = false,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string | string[] | null;
  hideLabel?: boolean;
}) {
  const descId = describedByIdFor(htmlFor);
  return (
    <div className='mb-4'>
      <label
        htmlFor={htmlFor}
        className={
          hideLabel
            ? 'sr-only'
            : 'block text-[#323232] text-[16px] font-bold tracking-[1.6px] mb-1'
        }
      >
        {label}
      </label>
      {children}
      <FormErrorMessage error={error ?? null} id={descId} />
    </div>
  );
}

export default FormField;
