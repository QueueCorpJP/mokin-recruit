import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

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
          <div className='relative flex-1'>
            <select
              {...(register ? register('birthYear') : {})}
              value={selectedYear}
              onChange={e => onChange && onChange('birthYear', e.target.value)}
              className={`w-full px-[11px] py-[11px] bg-white border ${
                errors?.birthYear || errors?.birthMonth || errors?.birthDay
                  ? 'border-red-500'
                  : 'border-[#999999]'
              } rounded-[5px] text-[16px] ${selectedYear ? 'text-[#323232]' : 'text-[#323232]'} font-bold tracking-[1.6px] appearance-none cursor-pointer`}
            >
              {yearOptions.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
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
          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
            年
          </span>
          <div className='relative flex-1'>
            <select
              {...(register ? register('birthMonth') : {})}
              value={selectedMonth}
              onChange={e => onChange && onChange('birthMonth', e.target.value)}
              className={`w-full px-[11px] py-[11px] bg-white border ${
                errors?.birthYear || errors?.birthMonth || errors?.birthDay
                  ? 'border-red-500'
                  : 'border-[#999999]'
              } rounded-[5px] text-[16px] ${selectedMonth ? 'text-[#323232]' : 'text-[#323232]'} font-bold tracking-[1.6px] appearance-none cursor-pointer`}
            >
              <option value=''>未選択</option>
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
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
          <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
            月
          </span>
          <div className='relative flex-1'>
            <select
              {...(register ? register('birthDay') : {})}
              value={selectedDay}
              onChange={e => onChange && onChange('birthDay', e.target.value)}
              className={`w-full px-[11px] py-[11px] bg-white border ${
                errors?.birthYear || errors?.birthMonth || errors?.birthDay
                  ? 'border-red-500'
                  : 'border-[#999999]'
              } rounded-[5px] text-[16px] ${selectedDay ? 'text-[#323232]' : 'text-[#323232]'} font-bold tracking-[1.6px] appearance-none cursor-pointer`}
            >
              <option value=''>未選択</option>
              {dayOptions.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
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
