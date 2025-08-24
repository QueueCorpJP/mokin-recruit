'use client';

import React, { useState, useEffect } from 'react';
import { JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { Modal } from '@/components/ui/mo-dal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Checkbox } from '@/components/ui/checkbox';

interface JobTypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedJobTypes: string[]) => void;
  initialSelected?: string[];
  maxSelections?: number;
}

export default function JobTypeSelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
  maxSelections = 3,
}: JobTypeSelectModalProps) {
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState(
    JOB_TYPE_GROUPS[0].name
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedJobTypes(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (jobTypeId: string) => {
    if (selectedJobTypes.includes(jobTypeId)) {
      // 既に選択されている場合は削除
      const newJobTypes = selectedJobTypes.filter(j => j !== jobTypeId);
      setSelectedJobTypes(newJobTypes);
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedJobTypes.length < maxSelections) {
        const newJobTypes = [...selectedJobTypes, jobTypeId];
        setSelectedJobTypes(newJobTypes);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedJobTypes);
    onClose();
  };

  const selectedCategoryData = JOB_TYPE_GROUPS.find(
    category => category.name === selectedCategory
  )!;

  return (
    <Modal
      title="職種を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedJobTypes.length}
      totalCount={maxSelections}
    >
      <div className='space-y-6'>
        {/* デスクトップ用カテゴリータグ */}
        {isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {JOB_TYPE_GROUPS.map((category, index) => (
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
                  {index < JOB_TYPE_GROUPS.length - 1 && (
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
        )}

        {/* モバイル用カテゴリー表示 */}
        {!isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {JOB_TYPE_GROUPS.slice(0, showAllCategories ? JOB_TYPE_GROUPS.length : 6).map((category, index) => (
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
                  {index < (showAllCategories ? JOB_TYPE_GROUPS.length - 1 : 5) && (
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
              {!showAllCategories && JOB_TYPE_GROUPS.length > 6 && (
                <>
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
                  <div className='w-full flex justify-center mt-2'>
                    <button
                      className='text-[#0F9058]'
                      style={{
                        fontFamily: '"Noto Sans JP"',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: '160%',
                        letterSpacing: '1.4px',
                      }}
                      onClick={() => setShowAllCategories(true)}
                    >
                      +もっと表示
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 選択中のカテゴリー名 */}
        <div>
          <h3 className="w-full font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[0.05em] text-[#323232] border-b-2 border-[#E5E7EB] pb-3">
            {selectedCategoryData.name}
          </h3>

          {/* 制限メッセージ */}
          {selectedJobTypes.length >= maxSelections && (
            <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4'>
              <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
                最大{maxSelections}
                個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
              </p>
            </div>
          )}

          {/* 職種チェックボックスリスト（2列グリッド） */}
          <div className='grid grid-cols-2 gap-x-8 gap-y-4 mt-6'>
            {selectedCategoryData.jobTypes.map(jobType => {
              const isSelected = selectedJobTypes.includes(jobType.id);
              const isDisabled =
                !isSelected && selectedJobTypes.length >= maxSelections;

              return (
                <div key={jobType.id} className='flex items-center'>
                  <Checkbox
                    label={jobType.name}
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(jobType.id)}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}