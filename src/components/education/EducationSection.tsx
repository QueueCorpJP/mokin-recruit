import React from 'react';
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  FieldValues,
} from 'react-hook-form';
import { FormLabel } from './common/FormLabel';
import { FormInput } from './common/FormInput';
import { FormSelect } from './common/FormSelect';

export type EducationSectionProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
  yearOptions: string[];
  monthOptions: string[];
  variant?: 'pc' | 'sp'; // 追加
};

/**
 * 学歴入力セクション（PC/SP両対応・variantで切り替え）
 */
function EducationSection<T extends FieldValues>({
  register,
  // errors: _errors,
  // watch: _watch,
  yearOptions,
  monthOptions,
  variant = 'pc',
}: EducationSectionProps<T>) {
  if (variant === 'sp') {
    // SP用レイアウト（既存SP版UIを忠実に移植）
    return (
      <div className='flex flex-col gap-6'>
        {/* 最終学歴 */}
        <div className='flex flex-col gap-2'>
          <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2'>
            <FormLabel htmlFor='finalEducation'>最終学歴</FormLabel>
          </div>
          <div className='relative'>
            <FormSelect id='finalEducation' {...register('finalEducation')}>
              <option value=''>未選択</option>
              {/* educationOptionsは親でmapして渡す想定 */}
            </FormSelect>
          </div>
        </div>
        {/* 学校名 */}
        <div className='flex flex-col gap-2'>
          <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2'>
            <FormLabel htmlFor='schoolName'>学校名</FormLabel>
          </div>
          <FormInput
            id='schoolName'
            type='text'
            placeholder='学校名を入力'
            {...register('schoolName')}
          />
        </div>
        {/* 学部学科専攻 */}
        <div className='flex flex-col gap-2'>
          <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2'>
            <FormLabel htmlFor='department'>学部学科専攻</FormLabel>
          </div>
          <FormInput
            id='department'
            type='text'
            placeholder='学部学科専攻を入力'
            {...register('department')}
          />
        </div>
        {/* 卒業年月 */}
        <div className='flex flex-col gap-2'>
          <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2'>
            <FormLabel>卒業年月</FormLabel>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='relative flex-1'>
              <FormSelect id='graduationYear' {...register('graduationYear')}>
                <option value=''>未選択</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FormSelect>
            </div>
            <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              年
            </span>
            <div className='relative flex-1'>
              <FormSelect id='graduationMonth' {...register('graduationMonth')}>
                <option value=''>未選択</option>
                {monthOptions.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </FormSelect>
            </div>
            <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              月
            </span>
          </div>
        </div>
      </div>
    );
  }
  // PC用レイアウト（従来通り）
  return (
    <div className='flex flex-col gap-2'>
      {/* 最終学歴 */}
      <div className='flex gap-6'>
        <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
          <FormLabel htmlFor='finalEducation'>最終学歴</FormLabel>
        </div>
        <div className='flex-1 py-6'>
          <div className='w-[400px] relative'>
            <FormSelect id='finalEducation' {...register('finalEducation')}>
              <option value=''>未選択</option>
              {/* educationOptionsは親でmapして渡す想定 */}
            </FormSelect>
          </div>
        </div>
      </div>
      {/* 学校名 */}
      <div className='flex gap-6'>
        <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
          <FormLabel htmlFor='schoolName'>学校名</FormLabel>
        </div>
        <div className='flex-1 py-6'>
          <div className='w-[400px]'>
            <FormInput
              id='schoolName'
              type='text'
              placeholder='学校名を入力'
              {...register('schoolName')}
            />
          </div>
        </div>
      </div>
      {/* 学部学科専攻 */}
      <div className='flex gap-6'>
        <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
          <FormLabel htmlFor='department'>学部学科専攻</FormLabel>
        </div>
        <div className='flex-1 py-6'>
          <div className='w-[400px]'>
            <FormInput
              id='department'
              type='text'
              placeholder='学部学科専攻を入力'
              {...register('department')}
            />
          </div>
        </div>
      </div>
      {/* 卒業年月 */}
      <div className='flex gap-6'>
        <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
          <FormLabel>卒業年月</FormLabel>
        </div>
        <div className='flex-1 py-6'>
          <div className='flex gap-2 items-center w-[400px]'>
            <div className='relative flex-1'>
              <FormSelect id='graduationYear' {...register('graduationYear')}>
                <option value=''>未選択</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </FormSelect>
            </div>
            <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              年
            </span>
            <div className='relative flex-1'>
              <FormSelect id='graduationMonth' {...register('graduationMonth')}>
                <option value=''>未選択</option>
                {monthOptions.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </FormSelect>
            </div>
            <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              月
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationSection;