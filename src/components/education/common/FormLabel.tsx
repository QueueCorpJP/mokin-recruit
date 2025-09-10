import React from 'react';

interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  className,
}) => (
  <label
    htmlFor={htmlFor}
    className={
      className || 'text-[#323232] text-[16px] font-bold tracking-[1.6px]'
    }
  >
    {children}
  </label>
);
