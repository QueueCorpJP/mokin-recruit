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
      'w-full px-[11px] py-[11px] pr-10 bg-white border rounded-[5px] text-[16px] font-bold tracking-[1.6px] appearance-none'
    }
    {...rest}
  >
    {children}
  </select>
);
