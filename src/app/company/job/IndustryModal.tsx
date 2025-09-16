import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { industryCategories } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface IndustryModalProps {
  selectedIndustries: string[];
  onIndustriesChange: (industries: string[]) => void;
  onClose: () => void;
}

export const IndustryModal = forwardRef<
  { handleConfirm: () => void },
  IndustryModalProps
>(({ selectedIndustries, onIndustriesChange }, ref) => {
  const MAX_SELECTION = 3;
  const [tempSelectedIndustries, setTempSelectedIndustries] =
    useState<string[]>(selectedIndustries);

  // 初期値を設定
  useEffect(() => {
    setTempSelectedIndustries(selectedIndustries);
  }, [selectedIndustries]);

  const handleCheckboxChange = (industry: string) => {
    if (tempSelectedIndustries.includes(industry)) {
      // 既に選択されている場合は削除
      setTempSelectedIndustries(
        tempSelectedIndustries.filter(i => i !== industry)
      );
    } else {
      // 新規選択の場合は制限をチェック
      if (tempSelectedIndustries.length < MAX_SELECTION) {
        setTempSelectedIndustries([...tempSelectedIndustries, industry]);
      }
    }
  };

  // 決定ボタンが押された時に実際の値を更新
  const handleConfirm = () => {
    onIndustriesChange(tempSelectedIndustries);
  };

  // ref経由でhandleConfirmを公開
  useImperativeHandle(ref, () => ({
    handleConfirm,
  }));

  // すべての業種を1つの配列にフラット化（カテゴリ情報付きで一意のキーを生成）
  const allIndustries = industryCategories.flatMap(category =>
    category.industries.map(industry => ({
      key: `${category.name}-${industry}`, // 一意のキー
      value: industry, // 実際の値
      category: category.name,
    }))
  );

  return (
    <div className='space-y-6'>
      {/* 制限メッセージ */}
      {tempSelectedIndustries.length >= MAX_SELECTION && (
        <div className='p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md'>
          <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
            最大{MAX_SELECTION}
            個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
          </p>
        </div>
      )}

      {/* 業種カテゴリーごとに表示 */}
      {industryCategories.map(category => (
        <div key={category.name} className='space-y-4'>
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">
            {category.name}
          </h3>
          <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
            {category.industries.map(industry => {
              const isSelected = tempSelectedIndustries.includes(industry);
              const isDisabled =
                !isSelected && tempSelectedIndustries.length >= MAX_SELECTION;

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
      ))}
    </div>
  );
});
