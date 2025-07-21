
import React from 'react';
import { industryCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustryModalProps {
  selectedIndustries: string[];
  setSelectedIndustries: (industries: string[]) => void;
}

export const IndustryModal: React.FC<IndustryModalProps> = ({ selectedIndustries, setSelectedIndustries }) => {
  const handleCheckboxChange = (industry: string) => {
    setSelectedIndustries(
      selectedIndustries.includes(industry)
        ? selectedIndustries.filter((i) => i !== industry)
        : [...selectedIndustries, industry]
    );
  };

  // すべての業種を1つの配列にフラット化
  const allIndustries = industryCategories.flatMap(category => category.industries);

  return (
    <div className="space-y-6">
      {/* 業種カテゴリーテキスト */}
      <h3 className="font-['Noto_Sans_JP'] text-[20px] font-bold leading-[160%] tracking-[2px] text-[#323232] border-b border-[#E5E7EB] pb-2">
        業種カテゴリーテキスト
      </h3>

      {/* 業種チェックボックスリスト（2列グリッド） */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {allIndustries.map((industry) => (
          <div key={industry} className="flex items-center">
            <Checkbox 
              label={industry} 
              checked={selectedIndustries.includes(industry)} 
              onChange={() => handleCheckboxChange(industry)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 