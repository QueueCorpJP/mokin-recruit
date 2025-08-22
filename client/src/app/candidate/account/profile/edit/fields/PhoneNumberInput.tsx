import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface PhoneNumberInputProps {
  phoneNumber: string;
  onChange?: (value: string) => void;
  register?: UseFormRegister<any>;
  errors?: {
    phoneNumber?: FieldError;
  };
}

/**
 * 電話番号入力用フィールド
 * @param phoneNumber 電話番号
 * @param onChange 入力時のコールバック
 * @param register react-hook-formのregister
 * @param errors バリデーションエラー
 */
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  onChange,
  register,
  errors,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          連絡先電話番号
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='w-[400px]'>
          <input
            type='tel'
            placeholder='08011112222'
            value={phoneNumber}
            onChange={e => onChange && onChange(e.target.value)}
            {...(register ? register('phoneNumber') : {})}
            className={`w-full px-[11px] py-[11px] bg-white border ${
              errors?.phoneNumber ? 'border-red-500' : 'border-[#999999]'
            } rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]`}
          />
          {errors?.phoneNumber && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberInput;
