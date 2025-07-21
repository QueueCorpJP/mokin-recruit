import React from 'react';
import { regions } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface LocationModalProps {
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ selectedLocations, setSelectedLocations }) => {
  const MAX_SELECTION_JAPAN = 47;

  const handleCheckboxChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      // 既に選択されている場合は削除
      setSelectedLocations(selectedLocations.filter((l) => l !== location));
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedLocations.length < MAX_SELECTION_JAPAN) {
        setSelectedLocations([...selectedLocations, location]);
      }
    }
  };

  const allPrefectures = regions.flatMap(r => r.prefectures);
  const isAllSelected = selectedLocations.length === allPrefectures.length && allPrefectures.length > 0;

  const handleSelectAllJapan = () => {
    if (isAllSelected) {
      setSelectedLocations([]);
    } else {
      // 全選択の場合は制限を無視（または制限内で選択）
      // 制限を適用する場合は以下のようにします：
      setSelectedLocations(allPrefectures.slice(0, MAX_SELECTION_JAPAN));
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b-2 border-[#D1D5DB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232] mr-8">日本</span>
            <Checkbox 
              label="日本を全て選択" 
              checked={isAllSelected} 
              onChange={handleSelectAllJapan}
              disabled={!isAllSelected && selectedLocations.length >= MAX_SELECTION_JAPAN}
            />
          </div>
        </div>
      </div>

      {/* 制限メッセージ */}
      {selectedLocations.length >= MAX_SELECTION_JAPAN && (
        <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md">
          <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
            最大{MAX_SELECTION_JAPAN}個まで選択できます。他の地域を選択する場合は、既存の選択を解除してください。
          </p>
        </div>
      )}

      {regions.map((region) => (
        <div key={region.name} className="space-y-4">
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">{region.name}</h3>
          <div className="flex flex-wrap gap-6">
            {region.prefectures.map((prefecture) => {
              const isSelected = selectedLocations.includes(prefecture);
              const isDisabled = !isSelected && selectedLocations.length >= MAX_SELECTION_JAPAN;
              
              return (
                <div key={prefecture} className="min-w-[80px]">
                  <Checkbox
                    label={prefecture}
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(prefecture)}
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