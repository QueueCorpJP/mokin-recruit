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

  // すべての業種を1つの配列にフラット化（カテゴリ情報付きで一意のキーを生成）
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
        {/* 業種カテゴリーテキスト */}
        <div>
          <h3 className="w-full font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[0.05em] text-[#323232] border-b-2 border-[#E5E7EB] pb-3">
            業種カテゴリーテキスト
          </h3>

          {/* 制限メッセージ */}
          {selectedIndustries.length >= maxSelections && (
            <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4'>
              <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
                最大{maxSelections}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
              </p>
            </div>
          )}

          {/* 業種チェックボックスリスト（2列グリッド） */}
          <div className='grid grid-cols-2 gap-x-8 gap-y-4 mt-6'>
            {allIndustries.map((industryItem) => {
              const isSelected = selectedIndustries.includes(industryItem.value);
              const isDisabled = !isSelected && selectedIndustries.length >= maxSelections;
              
              return (
                <div key={industryItem.key} className='flex items-center'>
                  <Checkbox 
                    label={industryItem.value} 
                    checked={isSelected} 
                    onChange={() => handleCheckboxChange(industryItem.value)}
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