
import React from 'react';
import { regions } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface LocationModalProps {
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ selectedLocations, setSelectedLocations }) => {
  const handleCheckboxChange = (location: string) => {
    setSelectedLocations(
      selectedLocations.includes(location)
        ? selectedLocations.filter((l) => l !== location)
        : [...selectedLocations, location]
    );
  };

  const allPrefectures = regions.flatMap(r => r.prefectures);
  const isAllSelected = selectedLocations.length === allPrefectures.length && allPrefectures.length > 0;

  const handleSelectAllJapan = () => {
    setSelectedLocations(isAllSelected ? [] : allPrefectures);
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b-2 border-[#D1D5DB]">
        <div className="flex items-center">
          <span className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232] mr-8">日本</span>
          <Checkbox 
            label="日本を全て選択" 
            checked={isAllSelected} 
            onChange={handleSelectAllJapan} 
          />
        </div>
      </div>

      {regions.map((region) => (
        <div key={region.name} className="space-y-4">
          <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">{region.name}</h3>
          <div className="flex flex-wrap gap-6">
            {region.prefectures.map((prefecture) => (
              <div key={prefecture} className="min-w-[80px]">
                <Checkbox
                  label={prefecture}
                  checked={selectedLocations.includes(prefecture)}
                  onChange={() => handleCheckboxChange(prefecture)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 