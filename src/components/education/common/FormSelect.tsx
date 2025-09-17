import React from 'react';

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  className,
  children,
  ...rest
}) => (
  <select
    className={
      className ||
      'w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]'
    }
    {...rest}
  >
    {children}
  </select>
);
