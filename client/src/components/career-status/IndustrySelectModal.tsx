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
    onConfirm(selectedIndustries);
    onClose();
  };

  // カテゴリごとに業種を整理
  const allIndustries = INDUSTRY_GROUPS.flatMap(group => 
    group.industries.map(industry => ({
      key: `${group.name}-${industry.id}`, // 一意のキー
      id: industry.id, // 業種ID
      name: industry.name, // 表示用の名前
      category: group.name
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
      customHeader={{
        title: "業種カテゴリテキスト",
        description: ""
      }}
    >
      <div>
        <div className="space-y-6">
          {/* 制限メッセージ */}
          {selectedIndustries.length >= maxSelections && (
            <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md">
              <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
                最大{maxSelections}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
              </p>
            </div>
          )}

          {/* 業種チェックボックスリスト（2列グリッド） */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {allIndustries.map((industryItem) => {
              const isSelected = selectedIndustries.includes(industryItem.name);
              const isDisabled = !isSelected && selectedIndustries.length >= maxSelections;
              
              return (
                <div key={industryItem.key} className="flex items-center">
                  <Checkbox 
                    label={industryItem.name} 
                    checked={isSelected} 
                    onChange={() => handleCheckboxChange(industryItem.name)}
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