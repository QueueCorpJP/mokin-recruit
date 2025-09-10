import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ className, ...rest }) => (
  <input
    className={
      className ||
      'w-full px-[11px] py-[11px] bg-white border rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
    }
    {...rest}
  />
);