import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export interface IncomeOption {
  value: string;
  label: string;
}

interface IncomeSelectProps {
  selectedIncome: string;
  options: IncomeOption[];
  onChange?: (value: string) => void;
  register?: UseFormRegister<any>;
  errors?: {
    currentIncome?: FieldError;
  };
}

/**
 * 年収選択用フィールド
 * @param selectedIncome 現在選択中の年収
 * @param options 年収選択肢リスト
 * @param onChange 選択時のコールバック
 * @param register react-hook-formのregister
 * @param errors バリデーションエラー
 */
const IncomeSelect: React.FC<IncomeSelectProps> = ({
  selectedIncome,
  options,
  onChange,
  register,
  errors,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          現在の年収
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='w-[400px] relative'>
          <select
            {...(register ? register('currentIncome') : {})}
            value={selectedIncome}
            onChange={e => onChange && onChange(e.target.value)}
            className={`w-full px-[11px] py-[11px] pr-10 bg-white border ${
              errors?.currentIncome ? 'border-red-500' : 'border-[#999999]'
            } rounded-[5px] text-[16px] ${selectedIncome ? 'text-[#323232]' : 'text-[#323232]'} font-bold tracking-[1.6px] appearance-none cursor-pointer`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
            <svg width='14' height='10' viewBox='0 0 14 10' fill='none'>
              <path
                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                fill='#0F9058'
              />
            </svg>
          </div>
        </div>
        {errors?.currentIncome && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.currentIncome.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default IncomeSelect;
