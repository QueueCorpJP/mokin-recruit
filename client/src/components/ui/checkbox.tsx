import React from 'react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.(e.target.checked);

  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      {/* 視覚に出さない実際のチェックボックス */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
      />

      {/* 可視化用のボックス  */}
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-[4px] transition-colors duration-200 
          ${checked ? 'bg-[#0F9058]' : 'bg-[#DCDCDC]'}`}
      >
        {/* ✓ マークは常に描画し、色は白固定 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          fill="none"
        >
          <path
            d="M5 10L8.5 13.5L15 7"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {label && <span className="ml-2 select-none">{label}</span>}
    </label>
  );
};

export default Checkbox;
