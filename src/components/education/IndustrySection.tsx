import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { EXPERIENCE_YEAR_OPTIONS } from '../../app/candidate/account/education/edit/constants/education';
import { FormErrorMessage } from './common/FormErrorMessage';
import { SectionTitle } from './common/SectionTitle';
import { SectionDivider } from './common/SectionDivider';
import { RemoveButton } from './common/RemoveButton';

export type Industry = {
  id: string;
  name: string;
  experienceYears?: string;
};

/**
 * 業種選択・年数管理セクション（PC/SP両対応・variantで切り替え）
 * @template T - react-hook-formのFieldValues型
 */
interface IndustrySectionProps {
  /** 選択中の業種リスト */
  selectedIndustries: Industry[];
  /** バリデーションエラー（industriesフィールドのみ） */
  errors: FieldErrors | undefined;
  /** 業種選択モーダルを開くハンドラ */
  onSelect: () => void;
  /** 業種を削除するハンドラ */
  onRemove: (id: string) => void;
  /** 経験年数を変更するハンドラ */
  onExperienceChange: (id: string, years: string) => void;
  /** PC/SPレイアウト切り替え */
  variant: 'pc' | 'sp';
}

function IndustrySection({
  selectedIndustries,
  errors,
  onSelect,
  onRemove,
  onExperienceChange,
  variant = 'pc',
}: IndustrySectionProps) {
  if (variant === 'sp') {
    // SP用レイアウト
    return (
      <div className='flex flex-col gap-2'>
        <SectionTitle>業種</SectionTitle>
        <SectionDivider />
        <button
          type='button'
          onClick={onSelect}
          className='w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]'
        >
          業種を選択
        </button>
        {selectedIndustries && selectedIndustries.length > 0 ? (
          <div className='flex flex-col gap-0.5'>
            {selectedIndustries.map((industry: Industry) => (
              <div key={industry.id} className='flex flex-row gap-0.5'>
                <div className='flex-1 flex flex-col gap-0.5'>
                  <div className='bg-[#d2f1da] px-6 py-[10px] rounded-tl-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                    {industry.name}
                  </div>
                  <div className='bg-[#d2f1da] px-6 py-[10px] rounded-bl-[10px] flex items-center justify-between'>
                    <select
                      value={industry.experienceYears || ''}
                      onChange={e =>
                        onExperienceChange(industry.id, e.target.value)
                      }
                      className='bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none w-full'
                    >
                      <option value=''>経験年数：未選択</option>
                      {EXPERIENCE_YEAR_OPTIONS.map((year: string) => (
                        <option key={year} value={year}>
                          経験年数：{year}
                        </option>
                      ))}
                    </select>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='14'
                      height='10'
                      viewBox='0 0 14 10'
                      fill='none'
                    >
                      <path
                        d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                        fill='#0F9058'
                      />
                    </svg>
                  </div>
                </div>
                <RemoveButton
                  onClick={() => onRemove(industry.id)}
                  ariaLabel='業種を削除'
                />
              </div>
            ))}
          </div>
        ) : null}
        {errors && typeof errors.message === 'string' && (
          <FormErrorMessage message={errors.message} />
        )}
      </div>
    );
  }
  // PC用レイアウト
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-6'>
        <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
          <SectionTitle>業種</SectionTitle>
        </div>
        <SectionDivider />
        <div className='flex-1 py-6'>
          <div className='w-[400px]'>
            <button
              type='button'
              onClick={onSelect}
              className='w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-2'
            >
              業種を選択
            </button>
            <div className='flex flex-wrap gap-2'>
              {selectedIndustries.map(industry => (
                <div
                  key={industry.id}
                  className='inline-flex items-center gap-1'
                >
                  <span className='bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px]'>
                    {industry.name}
                  </span>
                  <div className='bg-[#d2f1da] h-[40px] flex items-center px-4 relative'>
                    <select
                      className='bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none'
                      value={industry.experienceYears || ''}
                      onChange={e =>
                        onExperienceChange(industry.id, e.target.value)
                      }
                    >
                      <option value=''>経験年数：未選択</option>
                      {EXPERIENCE_YEAR_OPTIONS.map((year: string) => (
                        <option key={year} value={year}>
                          経験年数：{year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <RemoveButton
                    onClick={() => onRemove(industry.id)}
                    ariaLabel='業種を削除'
                  />
                </div>
              ))}
            </div>
            {errors && typeof errors.message === 'string' && (
              <p className='text-red-500 text-sm mt-1'>{errors.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndustrySection;