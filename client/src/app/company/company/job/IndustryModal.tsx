import React from 'react';
import { industryCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustryModalProps {
  selectedIndustries: string[];
  onIndustriesChange: (industries: string[]) => void;
  onClose: () => void;
}

export const IndustryModal: React.FC<IndustryModalProps> = ({ selectedIndustries, onIndustriesChange }) => {
  const MAX_SELECTION = 3;

  const handleCheckboxChange = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      // 既に選択されている場合は削除
      onIndustriesChange(selectedIndustries.filter((i) => i !== industry));
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedIndustries.length < MAX_SELECTION) {
        onIndustriesChange([...selectedIndustries, industry]);
      }
    }
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
    <div className="space-y-6">
      {/* 制限メッセージ */}
      {selectedIndustries.length >= MAX_SELECTION && (
        <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md">
          <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
            最大{MAX_SELECTION}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
          </p>
        </div>
      )}

      {/* 業種カテゴリーごとに表示 */}
      {industryCategories.map(category => (
        <div key={category.name} className="space-y-4">
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">
            {category.name}
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {category.industries.map((industry) => {
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
      ))}
    </div>
  );
}; 