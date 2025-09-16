import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { SelectInput } from '@/components/ui/select-input';

export interface Option {
  value: string;
  label: string;
}

interface BirthDateSelectorProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDay: string;
  yearOptions: Option[];
  monthOptions: Option[];
  dayOptions: Option[];
  onChange?: (
    field: 'birthYear' | 'birthMonth' | 'birthDay',
    value: string
  ) => void;
  register?: UseFormRegister<any>;
  errors?: {
    birthYear?: FieldError;
    birthMonth?: FieldError;
    birthDay?: FieldError;
  };
}

/**
 * 生年月日選択用フィールド
 * @param selectedYear 年
 * @param selectedMonth 月
 * @param selectedDay 日
 * @param yearOptions 年の選択肢
 * @param monthOptions 月の選択肢
 * @param dayOptions 日の選択肢
 * @param onChange 選択時のコールバック
 * @param register react-hook-formのregister
 * @param errors バリデーションエラー
 */
const BirthDateSelector: React.FC<BirthDateSelectorProps> = ({
  selectedYear,
  selectedMonth,
  selectedDay,
  yearOptions,
  monthOptions,
  dayOptions,
  onChange,
  register,
  errors,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          生年月日
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='flex gap-2 items-center w-[400px]'>
          <div className='flex-1'>
            <SelectInput
              options={yearOptions}
              value={selectedYear}
              onChange={value => onChange && onChange('birthYear', value)}
              placeholder='年を選択'
              error={
                !!(errors?.birthYear || errors?.birthMonth || errors?.birthDay)
              }
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
          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
            年
          </span>
          <div className='flex-1'>
            <SelectInput
              options={[{ value: '', label: '未選択' }, ...monthOptions]}
              value={selectedMonth}
              onChange={value => onChange && onChange('birthMonth', value)}
              placeholder='月を選択'
              error={
                !!(errors?.birthYear || errors?.birthMonth || errors?.birthDay)
              }
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
          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
            月
          </span>
          <div className='flex-1'>
            <SelectInput
              options={[{ value: '', label: '未選択' }, ...dayOptions]}
              value={selectedDay}
              onChange={value => onChange && onChange('birthDay', value)}
              placeholder='日を選択'
              error={
                !!(errors?.birthYear || errors?.birthMonth || errors?.birthDay)
              }
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
          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
            日
          </span>
        </div>
        {(errors?.birthYear || errors?.birthMonth || errors?.birthDay) && (
          <p className='text-red-500 text-sm mt-1'>
            {errors?.birthYear?.message ||
              errors?.birthMonth?.message ||
              errors?.birthDay?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default BirthDateSelector;
