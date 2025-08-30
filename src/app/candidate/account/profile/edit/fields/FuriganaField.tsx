import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface FuriganaFieldProps {
  lastNameKana: string;
  firstNameKana: string;
  readOnly?: boolean;
  register?: UseFormRegister<any>;
  errors?: {
    lastNameKana?: FieldError;
    firstNameKana?: FieldError;
  };
}

/**
 * フリガナ（姓・名）表示専用フィールド
 */
const FuriganaField: React.FC<FuriganaFieldProps> = ({
  lastNameKana,
  firstNameKana,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          フリガナ
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='flex gap-2'>
          <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
            {lastNameKana || 'セイテキスト'}
          </span>
          <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
            {firstNameKana || 'メイテキスト'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FuriganaField;
