'use client';

import React, { useState, useEffect } from 'react';
import { industryCategories } from '@/app/company/job/types';
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
  console.log('[DEBUG] IndustrySelectModal render:', {
    isOpen,
    industryCategoriesLength: industryCategories.length,
    firstCategory: industryCategories[0],
    initialSelected,
  });
  const [selectedIndustries, setSelectedIndustries] =
    useState<string[]>(initialSelected);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [selectedCategory, setSelectedCategory] = useState(
    industryCategories[0]?.name || ''
  );
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    // モーダルが開いた時に初期化（タグ削除との同期のため）
    if (isOpen) {
      setSelectedIndustries([...initialSelected]);
    }
  }, [isOpen, initialSelected]);

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
    onConfirm(selectedIndustries);
    // モーダルを閉じるのは親コンポーネントに任せる
  };

  // カテゴリごとに業種を整理
  const allIndustries = industryCategories.flatMap(group =>
    group.industries.map(industry => ({
      key: `${group.name}-${industry}`, // 一意のキー
      id: industry, // 業種ID
      name: industry, // 表示用の名前
      category: group.name,
    }))
  );

  const selectedCategoryData = industryCategories.find(
    group => group.name === selectedCategory
  );

  return (
    <Modal
      title='業種を選択'
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText='決定'
      onPrimaryAction={handleConfirm}
      width={isDesktop ? '800px' : '100%'}
      height={isDesktop ? '680px' : '90vh'}
      selectedCount={selectedIndustries.length}
      totalCount={maxSelections}
    >
      <div className='space-y-6'>
        {/* カテゴリアンカーリンク（デスクトップ） */}
        {isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {industryCategories.map((category, index) => (
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
                  {index < industryCategories.length - 1 && (
                    <div className='mx-2'>
                      <svg width='2' height='24' viewBox='0 0 2 24' fill='none'>
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
        {/* カテゴリアンカーリンク（モバイル） */}
        {!isDesktop && (
          <div className='mb-4'>
            <div className='flex flex-wrap items-center'>
              {industryCategories
                .slice(0, showAllCategories ? industryCategories.length : 6)
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
                      (showAllCategories
                        ? industryCategories.length - 1
                        : 5) && (
                      <div className='mx-2'>
                        <svg
                          width='2'
                          height='24'
                          viewBox='0 0 2 24'
                          fill='none'
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
              {!showAllCategories && industryCategories.length > 6 && (
                <>
                  <div className='mx-2'>
                    <svg width='2' height='24' viewBox='0 0 2 24' fill='none'>
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
        {/* 業種カテゴリテキスト（見出し）をアンカーリンクの下に移動 */}
        <div className='font-bold text-[20px] text-[#323232] mb-2 border-b-2 border-[#efefef] pb-2'>
          {selectedCategory}
        </div>
        {/* 選択数制限メッセージ */}
        {selectedIndustries.length >= maxSelections && (
          <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md'>
            <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
              最大{maxSelections}
              個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
            </p>
          </div>
        )}
        {/* 業種リスト（カテゴリごとに切り替え） */}
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {selectedCategoryData &&
            selectedCategoryData.industries.map(industry => {
              const isSelected = selectedIndustries.includes(industry);
              const isDisabled =
                !isSelected && selectedIndustries.length >= maxSelections;
              return (
                <div key={industry} className='flex items-center'>
                  <Checkbox
                    label={industry}
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(industry)}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
