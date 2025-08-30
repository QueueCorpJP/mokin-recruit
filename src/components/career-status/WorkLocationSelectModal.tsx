'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Checkbox } from '@/components/ui/checkbox';

const regions = [
  {
    name: '北海道・東北',
    prefectures: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'],
  },
  {
    name: '関東',
    prefectures: ['東京', '神奈川', '千葉', '埼玉', '茨城', '栃木', '群馬'],
  },
  {
    name: '中部',
    prefectures: ['山梨', '長野', '新潟', '富山', '石川', '福井', '静岡', '愛知', '岐阜'],
  },
  {
    name: '近畿',
    prefectures: ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山'],
  },
  {
    name: '中国',
    prefectures: ['鳥取', '島根', '岡山', '広島', '山口'],
  },
  {
    name: '四国',
    prefectures: ['香川', '愛媛', '徳島', '高知'],
  },
  {
    name: '九州・沖縄',
    prefectures: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'],
  },
  {
    name: '海外',
    prefectures: ['海外'],
  },
];

interface Prefecture {
  id: string;
  name: string;
}

interface WorkLocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedLocations: Prefecture[]) => void;
  initialSelected?: Prefecture[];
}

export default function WorkLocationSelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
}: WorkLocationSelectModalProps) {
  const [selectedLocations, setSelectedLocations] = useState<Prefecture[]>(initialSelected);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const MAX_SELECTION = 47;

  useEffect(() => {
    setSelectedLocations(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (locationName: string) => {
    const location: Prefecture = { id: locationName.toLowerCase().replace(/[^a-z0-9]/g, ''), name: locationName };
    const isSelected = selectedLocations.some(l => l.name === locationName);
    
    if (isSelected) {
      setSelectedLocations(selectedLocations.filter(l => l.name !== locationName));
    } else {
      if (selectedLocations.length < MAX_SELECTION) {
        setSelectedLocations([...selectedLocations, location]);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedLocations);
    onClose();
  };

  const allPrefectures = regions.flatMap(r => r.prefectures);
  const isAllSelected = selectedLocations.length === allPrefectures.length && allPrefectures.length > 0;

  const handleSelectAllJapan = () => {
    if (isAllSelected) {
      setSelectedLocations([]);
    } else {
      const allPrefectureObjects = allPrefectures.slice(0, MAX_SELECTION).map(name => ({
        id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name
      }));
      setSelectedLocations(allPrefectureObjects);
    }
  };

  return (
    <Modal
      title="勤務地を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedLocations.length}
      totalCount={MAX_SELECTION}
    >
      <div className="space-y-8">
        <div className="pb-6 border-b-2 border-[#D1D5DB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232] mr-8">
                日本
              </span>
              <Checkbox
                label="日本を全て選択"
                checked={isAllSelected}
                onChange={handleSelectAllJapan}
                disabled={!isAllSelected && selectedLocations.length >= MAX_SELECTION}
              />
            </div>
          </div>
        </div>

        {regions.map(region => (
          <div key={region.name} className="space-y-4">
            <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] text-[#323232]">
              {region.name}
            </h3>
            <div className="flex flex-wrap gap-6">
              {region.prefectures.map(prefecture => {
                const isSelected = selectedLocations.some(l => l.name === prefecture);
                const isDisabled = !isSelected && selectedLocations.length >= MAX_SELECTION;

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
    </Modal>
  );
}