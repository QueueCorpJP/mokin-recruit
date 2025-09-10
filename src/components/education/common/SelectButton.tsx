import React from 'react';

interface SelectButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  onClick,
  className = '',
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-[14px] bg-white border border-[#999999] rounded-[100px] text-[14px] text-[#323232] font-bold tracking-[1.4px] w-full lg:w-[170px] ${className}`}
  >
    {label}
  </button>
);

export default SelectButton;
