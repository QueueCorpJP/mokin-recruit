import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { SelectInput } from '@/components/ui/select-input';

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
        <div className='w-[400px]'>
          <SelectInput
            options={options}
            value={selectedIncome}
            onChange={value => onChange && onChange(value)}
            placeholder='年収を選択してください'
            error={!!errors?.currentIncome}
            radius={5}
            className='w-full'
            style={{
              padding: '11px',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1.6px',
              color: '#323232',
            }}
          />
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
