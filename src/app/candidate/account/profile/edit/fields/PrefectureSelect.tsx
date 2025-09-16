import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { SelectInput } from '@/components/ui/select-input';

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
        <div className='w-[400px]'>
          <SelectInput
            options={options}
            value={selectedPrefecture}
            onChange={value => onChange && onChange(value)}
            placeholder='都道府県を選択してください'
            error={!!errors?.prefecture}
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
