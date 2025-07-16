
import React from 'react';
import { Button } from '@/components/ui/button';

type Region = {
  name: string;
  prefectures: string[];
};

const regions: Region[] = [
  { name: '関東', prefectures: ['東京', '茨城', '栃木', '群馬', '埼玉', '千葉', '神奈川'] },
  { name: '北海道・東北', prefectures: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'] },
  { name: '北陸', prefectures: ['新潟', '富山', '石川', '福井'] },
  { name: '東海', prefectures: ['愛知', '岐阜', '三重', '静岡'] },
  { name: '関西', prefectures: ['大阪', '京都', '兵庫', '奈良', '和歌山', '滋賀'] },
  { name: '中国', prefectures: ['広島', '岡山', '山口', '鳥取', '島根'] },
  { name: '四国', prefectures: ['香川', '愛媛', '徳島', '高知'] },
  { name: '九州・沖縄', prefectures: ['福岡', '熊本', '鹿児島', '長崎', '大分', '宮崎', '佐賀', '沖縄'] },
];

const CustomCheckbox: React.FC<{ label: string; isChecked: boolean; onChange: () => void; }> = ({ label, isChecked, onChange }) => (
    <label className="flex items-center cursor-pointer text-sm text-gray-800">
        <input type="checkbox" className="hidden" checked={isChecked} onChange={onChange} />
        <div className={`w-5 h-5 flex items-center justify-center mr-3 rounded border flex-shrink-0 ${isChecked ? 'bg-white border-green-500' : 'bg-gray-100 border-gray-300'}`}>
            {isChecked && (
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L5 8L2 5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
        <span className="text-sm text-gray-800">{label}</span>
    </label>
);

type LocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
};

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose, selectedLocations, setSelectedLocations }) => {
  if (!isOpen) {
    return null;
  }

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold">勤務地を選択</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6 pb-4 border-b">
            <div className="flex items-center">
              <span className="font-semibold mr-8 text-gray-800">日本</span>
              <CustomCheckbox label="日本を全て選択" isChecked={isAllSelected} onChange={handleSelectAllJapan} />
            </div>
          </div>

          {regions.map((region) => (
            <div key={region.name} className="mb-6">
              <h3 className="font-semibold mb-4 text-gray-800">{region.name}</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {region.prefectures.map((prefecture) => (
                    <CustomCheckbox
                      key={prefecture}
                      label={prefecture}
                      isChecked={selectedLocations.includes(prefecture)}
                      onChange={() => handleCheckboxChange(prefecture)}
                    />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center p-6 border-t flex-shrink-0">
          <Button 
            onClick={onClose} 
            style={{
              borderRadius: '32px',
              background: 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
              boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              minWidth: '160px',
              padding: '10px 40px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            決定
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 