'use client';

import React, { useState, useEffect } from 'react';
import { INDUSTRY_GROUPS } from '@/constants/industry-data';
import { Modal } from '@/components/ui/mo-dal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustrySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedIndustries: string[]) => void;
  initialSelected?: string[];
  maxSelections?: number;
}

export default function IndustrySelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
  maxSelections = 3,
}: IndustrySelectModalProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState(
    INDUSTRY_GROUPS[0].name
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedIndustries(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (industryName: string) => {
    if (selectedIndustries.includes(industryName)) {
      // 既に選択されている場合は削除
      const newIndustries = selectedIndustries.filter(i => i !== industryName);
      setSelectedIndustries(newIndustries);
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedIndustries.length < maxSelections) {
        const newIndustries = [...selectedIndustries, industryName];
        setSelectedIndustries(newIndustries);
      }
    }
  };

  const handleConfirm = () => {
    console.log('IndustrySelectModal: Confirming with selected industries:', selectedIndustries);
    onConfirm(selectedIndustries);
    onClose();
  };

  const selectedCategoryData = INDUSTRY_GROUPS.find(
    category => category.name === selectedCategory
  )!;

  return (
    <Modal
      title="業種を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedIndustries.length}
      totalCount={maxSelections}
    >
      <div className='space-y-6'>
        {/* デスクトップ用カテゴリータグ */}
        {isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {INDUSTRY_GROUPS.map((category, index) => (
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
                  {index < INDUSTRY_GROUPS.length - 1 && (
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
              {INDUSTRY_GROUPS.slice(0, showAllCategories ? INDUSTRY_GROUPS.length : 6).map((category, index) => (
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
                  {index < (showAllCategories ? INDUSTRY_GROUPS.length - 1 : 5) && (
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
              {!showAllCategories && INDUSTRY_GROUPS.length > 6 && (
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
          {selectedIndustries.length >= maxSelections && (
            <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4'>
              <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
                最大{maxSelections}
                個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
              </p>
            </div>
          )}

          {/* 業種チェックボックスリスト（2列グリッド） */}
          <div className='grid grid-cols-2 gap-x-8 gap-y-4 mt-6'>
            {selectedCategoryData.industries.map(industry => {
              const isSelected = selectedIndustries.includes(industry.name);
              const isDisabled =
                !isSelected && selectedIndustries.length >= maxSelections;

              return (
                <div key={industry.id} className='flex items-center'>
                  <Checkbox
                    label={industry.name}
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(industry.name)}
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