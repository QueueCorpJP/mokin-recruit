'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jobCategories } from '@/app/company/job/types';
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
  const [selectedJobTypes, setSelectedJobTypes] =
    useState<string[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState(
    jobCategories[0].name
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const selectedJobTypesRef = useRef<string[]>(initialSelected);

  // モーダルが開いた時に初期化（タグ削除との同期のため）
  useEffect(() => {
    if (isOpen) {
      setSelectedJobTypes([...initialSelected]);
      selectedJobTypesRef.current = [...initialSelected];
    }
  }, [isOpen, initialSelected]);

  const handleCheckboxChange = (jobTypeName: string) => {
    let newJobTypes: string[];
    if (selectedJobTypes.includes(jobTypeName)) {
      newJobTypes = selectedJobTypes.filter(j => j !== jobTypeName);
    } else {
      if (selectedJobTypes.length < maxSelections) {
        newJobTypes = [...selectedJobTypes, jobTypeName];
      } else {
        return;
      }
    }

    setSelectedJobTypes(newJobTypes);
    selectedJobTypesRef.current = newJobTypes;
  };

  const handleConfirm = () => {
    const currentSelected = selectedJobTypesRef.current;
    const copyToSend = [...currentSelected];
    onConfirm(copyToSend);
  };

  const selectedCategoryData = jobCategories.find(
    category => category.name === selectedCategory
  )!;

  return (
    <Modal
      title='職種を選択'
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText='決定'
      onPrimaryAction={handleConfirm}
      width={isDesktop ? '800px' : '100%'}
      height={isDesktop ? '680px' : '90vh'}
      selectedCount={selectedJobTypes.length}
      totalCount={maxSelections}
    >
      <div className='space-y-6'>
        {/* デスクトップ用カテゴリータグ */}
        {isDesktop && (
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
                      fontWeight:
                        selectedCategory === category.name ? 600 : 500,
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
        )}

        {/* モバイル用カテゴリー表示 */}
        {!isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {jobCategories
                .slice(0, showAllCategories ? jobCategories.length : 6)
                .map((category, index) => (
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
                        fontWeight:
                          selectedCategory === category.name ? 600 : 500,
                        lineHeight: '160%',
                        letterSpacing: '1.4px',
                      }}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </button>
                    {index <
                      (showAllCategories ? jobCategories.length - 1 : 5) && (
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
              {!showAllCategories && jobCategories.length > 6 && (
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
            {selectedCategoryData.jobs.map(job => {
              const isSelected = selectedJobTypes.includes(job);
              const isDisabled =
                !isSelected && selectedJobTypes.length >= maxSelections;

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
    </Modal>
  );
}
