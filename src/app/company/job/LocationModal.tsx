import React from 'react';
import { regions } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface LocationModalProps {
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  selectedLocations,
  setSelectedLocations,
}) => {
  const MAX_SELECTION_JAPAN = 47;

  const handleCheckboxChange = (location: string) => {
    if (selectedLocations.includes(location)) {
      // 既に選択されている場合は削除
      setSelectedLocations(selectedLocations.filter(l => l !== location));
    } else {
      // 新規選択の場合は制限をチェック
      if (selectedLocations.length < MAX_SELECTION_JAPAN) {
        setSelectedLocations([...selectedLocations, location]);
      }
    }
  };

  // 日本の都道府県のみを対象（海外を除く）
  const japanPrefectures = regions
    .filter(r => !r.name.includes('海外') && !r.name.includes('アジア'))
    .flatMap(r => r.prefectures);
  
  const isAllJapanSelected = 
    japanPrefectures.length > 0 &&
    japanPrefectures.every(prefecture => selectedLocations.includes(prefecture));

  const handleSelectAllJapan = () => {
    if (isAllJapanSelected) {
      // 日本の都道府県のみを削除（海外は残す）
      const overseasLocations = selectedLocations.filter(location => 
        !japanPrefectures.includes(location)
      );
      setSelectedLocations(overseasLocations);
    } else {
      // 現在の海外選択を保持しつつ、日本の都道府県を全て追加
      const overseasLocations = selectedLocations.filter(location => 
        !japanPrefectures.includes(location)
      );
      setSelectedLocations([...overseasLocations, ...japanPrefectures]);
    }
  };

  return (
    <div className='space-y-8'>
      <div className='pb-6 border-b-2 border-[#D1D5DB]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <span className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232] mr-8">
              日本
            </span>
            <Checkbox
              label='日本を全て選択'
              checked={isAllJapanSelected}
              onChange={handleSelectAllJapan}
              disabled={false}
            />
          </div>
          {/* 選択数カウンターの表示を削除 */}
        </div>
      </div>

      {regions.map(region => (
        <div key={region.name} className='space-y-4'>
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">
            {region.name}
          </h3>
          <div className='flex flex-wrap gap-6'>
            {region.prefectures.map(prefecture => {
              const isSelected = selectedLocations.includes(prefecture);
              const isDisabled =
                !isSelected && selectedLocations.length >= MAX_SELECTION_JAPAN;

              return (
                <div key={prefecture} className='min-w-[80px]'>
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