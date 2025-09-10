import React from 'react';

interface FormRowProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * [FormRow]
 * ラベル＋入力欄＋エラーメッセージのセットを共通化するコンポーネント。
 * - label: ラベルテキスト
 * - htmlFor: ラベルのfor属性
 * - error: エラーメッセージ（省略可）
 * - children: 入力欄
 * - className: ラッパーの追加クラス
 */
const FormRow: React.FC<FormRowProps> = ({
  label,
  htmlFor,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col lg:flex-row lg:gap-6 ${className}`}>
      <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
        <label
          className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'
          htmlFor={htmlFor}
        >
          {label}
        </label>
      </div>
      <div className='flex-1 lg:py-6'>
        {children}
        {error && <div className='mt-1 text-red-500 text-sm'>{error}</div>}
      </div>
    </div>
  );
};

export default FormRow;