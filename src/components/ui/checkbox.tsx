import React from 'react';

interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  onCheckedChange,
  className = '',
  disabled = false,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      const value = e.target.checked;
      onChange?.(value);
      onCheckedChange?.(value);
    }
  };

  return (
    <label
      className={`inline-flex items-center ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      {/* 視覚に出さない実際のチェックボックス */}
      <input
        type='checkbox'
        className='sr-only'
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* 可視化用のボックス  */}
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-[4px] transition-colors duration-200 
          ${checked ? 'bg-[#0F9058]' : 'bg-[#DCDCDC]'}`}
      >
        {/* ✓ マークは常に表示、色を変更 */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          width='16'
          height='16'
          fill='none'
        >
          <path
            d='M5 10L8.5 13.5L15 7'
            stroke={checked ? '#FFFFFF' : '#FFF'}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      {label && (
        <span className={`ml-2 select-none ${disabled ? 'text-gray-400' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
