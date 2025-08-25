import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface NameFieldProps {
  lastName: string;
  firstName: string;
  readOnly?: boolean;
  register?: UseFormRegister<any>;
  errors?: {
    lastName?: FieldError;
    firstName?: FieldError;
  };
}

/**
 * 氏名（姓・名）表示専用フィールド
 */
const NameField: React.FC<NameFieldProps> = ({ lastName, firstName }) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          氏名
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='flex gap-2'>
          <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
            {lastName || '姓テキスト'}
          </span>
          <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
            {firstName || '名テキスト'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NameField;
