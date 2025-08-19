'use client';

import React, { useState, useEffect } from 'react';
import { industryCategories } from '@/app/company/company/job/types';
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
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedIndustries(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      // 既に選択されている場合は削除
      const newIndustries = selectedIndustries.filter(i => i !== industry);
      setSelectedIndustries(newIndustries);
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedIndustries.length < maxSelections) {
        const newIndustries = [...selectedIndustries, industry];
        setSelectedIndustries(newIndustries);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedIndustries);
    onClose();
  };

  // カテゴリごとに業種を整理
  const allIndustries = industryCategories.flatMap(category => 
    category.industries.map(industry => ({
      key: `${category.name}-${industry}`, // 一意のキー
      value: industry, // 実際の値
      category: category.name
    }))
  );

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
        {/* 制限メッセージ */}
        {selectedIndustries.length >= maxSelections && (
          <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4'>
            <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
              最大{maxSelections}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
            </p>
          </div>
        )}

        {/* カテゴリごとの業種表示 */}
        {industryCategories.map((category, index) => (
          <div key={category.name} className='mb-6'>
            <div className="relative mb-4">
              <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[0.05em] text-[#323232] pb-4">
                {category.name}
              </h3>
              <div className="absolute bottom-0 left-[3px] -right-32 h-[2px] bg-[#E5E7EB] rounded-full"></div>
            </div>
            
            {/* カテゴリ内の業種チェックボックスリスト（2列グリッド） */}
            <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
              {category.industries.map((industry) => {
                const isSelected = selectedIndustries.includes(industry);
                const isDisabled = !isSelected && selectedIndustries.length >= maxSelections;
                
                return (
                  <div key={`${category.name}-${industry}`} className='flex items-center'>
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
            
            {/* カテゴリ間の区切り線 */}
            {index < industryCategories.length - 1 && (
              <div className="mt-6 border-b border-[#dcdcdc]"></div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}