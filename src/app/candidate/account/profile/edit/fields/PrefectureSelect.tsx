import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export interface PrefectureOption {
  value: string;
  label: string;
}

interface PrefectureSelectProps {
  selectedPrefecture: string;
  options: PrefectureOption[];
  onChange?: (value: string) => void;
  register?: UseFormRegister<any>;
  errors?: {
    prefecture?: FieldError;
  };
}

/**
 * 都道府県選択用フィールド
 * @param selectedPrefecture 現在選択中の都道府県
 * @param options 都道府県選択肢リスト
 * @param onChange 選択時のコールバック
 * @param register react-hook-formのregister
 * @param errors バリデーションエラー
 */
const PrefectureSelect: React.FC<PrefectureSelectProps> = ({
  selectedPrefecture,
  options,
  onChange,
  register,
  errors,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          現在の住まい
        </label>
      </div>
      <div className='flex-1 py-6'>
        <div className='w-[400px] relative'>
          <select
            {...(register ? register('prefecture') : {})}
            value={selectedPrefecture}
            onChange={e => onChange && onChange(e.target.value)}
            className={`w-full px-[11px] py-[11px] bg-white border ${
              errors?.prefecture ? 'border-red-500' : 'border-[#999999]'
            } rounded-[5px] text-[16px] ${
              selectedPrefecture ? 'text-[#323232]' : 'text-[#323232]'
            } font-bold tracking-[1.6px] appearance-none cursor-pointer`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
            {/* ▼アイコンは親コンポーネントで共通化してもOK */}
            <svg width='14' height='10' viewBox='0 0 14 10' fill='none'>
              <path
                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                fill='#0F9058'
              />
            </svg>
          </div>
        </div>
        {errors?.prefecture && (
          <p className='text-red-500 text-sm mt-1'>
            {errors.prefecture.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrefectureSelect;
