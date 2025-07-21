import React from 'react';
import { industryCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustryModalProps {
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
}

export const IndustryModal: React.FC<IndustryModalProps> = ({ selectedIndustries, setSelectedIndustries }) => {
  const MAX_SELECTION = 3;

  const handleCheckboxChange = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      // 既に選択されている場合は削除
      setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedIndustries.length < MAX_SELECTION) {
        setSelectedIndustries([...selectedIndustries, industry]);
      }
    }
  };

  // すべての業種を1つの配列にフラット化
  const allIndustries = industryCategories.flatMap(category => category.industries);

  return (
    <div className="space-y-6">
      {/* 業種カテゴリーテキスト */}
      <div className="flex items-center justify-between">
        <h3 className="font-['Noto_Sans_JP'] text-[20px] font-bold leading-[160%] tracking-[2px] text-[#323232] border-b border-[#E5E7EB] pb-2">
          業種カテゴリーテキスト
        </h3>
        <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#666]">
          {selectedIndustries.length}/{MAX_SELECTION}個選択
        </span>
      </div>

      {/* 制限メッセージ */}
      {selectedIndustries.length >= MAX_SELECTION && (
        <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md">
          <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
            最大{MAX_SELECTION}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
          </p>
        </div>
      )}

      {/* 業種チェックボックスリスト（2列グリッド） */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {allIndustries.map((industry) => {
          const isSelected = selectedIndustries.includes(industry);
          const isDisabled = !isSelected && selectedIndustries.length >= MAX_SELECTION;
          
          return (
            <div key={industry} className="flex items-center">
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
  );
}; 