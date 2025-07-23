import React, { useState } from 'react';
import { jobCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface JobTypeModalProps {
  selectedJobTypes: string[];
  setSelectedJobTypes: (jobTypes: string[]) => void;
}

export const JobTypeModal: React.FC<JobTypeModalProps> = ({
  selectedJobTypes,
  setSelectedJobTypes,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    jobCategories[0].name
  );
  const MAX_SELECTION = 3;

  const handleCheckboxChange = (job: string) => {
    if (selectedJobTypes.includes(job)) {
      // 既に選択されている場合は削除
      setSelectedJobTypes(selectedJobTypes.filter(j => j !== job));
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedJobTypes.length < MAX_SELECTION) {
        setSelectedJobTypes([...selectedJobTypes, job]);
      }
    }
  };

  const selectedCategoryData = jobCategories.find(
    category => category.name === selectedCategory
  )!;

  return (
    <div className='space-y-6'>
      {/* 全カテゴリータグ（複数行対応・境界線共有デザイン） */}
      <div className='mb-4'>
        <div className='flex flex-wrap items-center'>
          {jobCategories.map((category, index) => (
            <React.Fragment key={category.name}>
              <button
                className={`py-2 px-2 transition-colors ${
                  selectedCategory === category.name
                    ? 'text-[#0F9058] font-medium'
                    : 'text-[var(--3,#999)] hover:text-[#0F9058]'
                }`}
                style={{
                  fontFamily: '"Noto Sans JP"',
                  fontSize: '14px',
                  fontWeight: selectedCategory === category.name ? 600 : 500,
                  lineHeight: '160%',
                  letterSpacing: '1.4px',
                }}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </button>
              {index < jobCategories.length - 1 && (
                <div className='mx-2'>
                  <svg
                    width='2'
                    height='24'
                    viewBox='0 0 2 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 1V23'
                      stroke='var(--3,#999)'
                      strokeLinecap='round'
                      strokeWidth='1'
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 選択中のカテゴリー名 */}
      <div>
        <h3 className="w-full font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[0.05em] text-[#323232] border-b-2 border-[#E5E7EB] pb-3">
          {selectedCategoryData.name}
        </h3>

        {/* 制限メッセージ */}
        {selectedJobTypes.length >= MAX_SELECTION && (
          <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4'>
            <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
              最大{MAX_SELECTION}
              個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
            </p>
          </div>
        )}

        {/* 職種チェックボックスリスト（2列グリッド） */}
        <div className='grid grid-cols-2 gap-x-8 gap-y-4 mt-6'>
          {selectedCategoryData.jobs.map(job => {
            const isSelected = selectedJobTypes.includes(job);
            const isDisabled =
              !isSelected && selectedJobTypes.length >= MAX_SELECTION;

            return (
              <div key={job} className='flex items-center'>
                <Checkbox
                  label={job}
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(job)}
                  disabled={isDisabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
