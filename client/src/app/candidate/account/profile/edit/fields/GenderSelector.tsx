import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export interface GenderOption {
  value: string;
  label: string;
}

interface GenderSelectorProps {
  selectedGender: string;
  options: GenderOption[];
  onSelect?: (value: string) => void;
  register?: UseFormRegister<any>;
  errors?: {
    gender?: FieldError;
  };
}

/**
 * 性別選択用フィールド
 * @param selectedGender 現在選択中の性別
 * @param options 性別選択肢リスト
 * @param onSelect 性別選択時のコールバック
 * @param register react-hook-formのregister
 * @param errors バリデーションエラー
 */
const GenderSelector: React.FC<GenderSelectorProps> = ({
  selectedGender,
  options,
  onSelect,
  register,
  errors,
}) => {
  return (
    <div className='flex gap-6'>
      <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
        <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
          性別
        </label>
      </div>
      <div className='flex-1 py-6'>
        <input type='hidden' {...(register ? register('gender') : {})} />
        <div className='flex gap-2 w-[400px]'>
          {options.map(option => (
            <button
              key={option.value}
              type='button'
              onClick={() => onSelect && onSelect(option.value)}
              className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                selectedGender === option.value
                  ? 'bg-[#0f9058] border-[#0f9058] text-white'
                  : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors?.gender && (
          <p className='text-red-500 text-sm mt-1'>{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
};

export default GenderSelector;
