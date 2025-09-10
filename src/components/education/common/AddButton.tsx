import React from 'react';

interface AddButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  icon?: 'plus'; // 今後拡張可能
  type?: 'button' | 'submit' | 'reset';
}

/**
 * [AddButton]
 * アイコン＋ラベルの追加ボタンを共通化。
 * - label: ボタンテキスト
 * - onClick: クリック時ハンドラ
 * - className: 追加クラス
 * - icon: アイコン種別（現状plusのみ）
 * - type: ボタンタイプ
 */
const AddButton: React.FC<AddButtonProps> = ({
  label,
  onClick,
  className = '',
  icon = 'plus',
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`border border-[#0f9058] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] px-6 py-2.5 rounded-[32px] flex items-center gap-2 ${className}`}
  >
    {icon === 'plus' && (
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8 3V13M3 8H13'
          stroke='#0f9058'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )}
    {label}
  </button>
);

export default AddButton;