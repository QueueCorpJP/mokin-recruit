'use client';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Prefecture {
  id: string;
  name: string;
}

interface PrefectureGroup {
  id: string;
  name: string;
  prefectures: Prefecture[];
}

const PREFECTURE_GROUPS: PrefectureGroup[] = [
  {
    id: 'hokkaido-tohoku',
    name: '北海道・東北',
    prefectures: [
      { id: 'hokkaido', name: '北海道' },
      { id: 'aomori', name: '青森' },
      { id: 'iwate', name: '岩手' },
      { id: 'miyagi', name: '宮城' },
      { id: 'akita', name: '秋田' },
      { id: 'yamagata', name: '山形' },
      { id: 'fukushima', name: '福島' },
    ],
  },
  {
    id: 'kanto',
    name: '関東',
    prefectures: [
      { id: 'tokyo', name: '東京' },
      { id: 'kanagawa', name: '神奈川' },
      { id: 'chiba', name: '千葉' },
      { id: 'saitama', name: '埼玉' },
      { id: 'ibaraki', name: '茨城' },
      { id: 'tochigi', name: '栃木' },
      { id: 'gunma', name: '群馬' },
    ],
  },
  {
    id: 'chubu',
    name: '中部',
    prefectures: [
      { id: 'yamanashi', name: '山梨' },
      { id: 'nagano', name: '長野' },
      { id: 'niigata', name: '新潟' },
      { id: 'toyama', name: '富山' },
      { id: 'ishikawa', name: '石川' },
      { id: 'fukui', name: '福井' },
      { id: 'shizuoka', name: '静岡' },
      { id: 'aichi', name: '愛知' },
      { id: 'gifu', name: '岐阜' },
    ],
  },
  {
    id: 'kinki',
    name: '近畿',
    prefectures: [
      { id: 'mie', name: '三重' },
      { id: 'shiga', name: '滋賀' },
      { id: 'kyoto', name: '京都' },
      { id: 'osaka', name: '大阪' },
      { id: 'hyogo', name: '兵庫' },
      { id: 'nara', name: '奈良' },
      { id: 'wakayama', name: '和歌山' },
    ],
  },
  {
    id: 'chugoku',
    name: '中国',
    prefectures: [
      { id: 'tottori', name: '鳥取' },
      { id: 'shimane', name: '島根' },
      { id: 'okayama', name: '岡山' },
      { id: 'hiroshima', name: '広島' },
      { id: 'yamaguchi', name: '山口' },
    ],
  },
  {
    id: 'shikoku',
    name: '四国',
    prefectures: [
      { id: 'kagawa', name: '香川' },
      { id: 'ehime', name: '愛媛' },
      { id: 'tokushima', name: '徳島' },
      { id: 'kochi', name: '高知' },
    ],
  },
  {
    id: 'kyushu-okinawa',
    name: '九州・沖縄',
    prefectures: [
      { id: 'fukuoka', name: '福岡' },
      { id: 'saga', name: '佐賀' },
      { id: 'nagasaki', name: '長崎' },
      { id: 'kumamoto', name: '熊本' },
      { id: 'oita', name: '大分' },
      { id: 'miyazaki', name: '宮崎' },
      { id: 'kagoshima', name: '鹿児島' },
      { id: 'okinawa', name: '沖縄' },
    ],
  },
];

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
  const [selectedLocations, setSelectedLocations] =
    useState<Prefecture[]>(initialSelected);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Get all prefectures
  const getAllPrefectures = () => {
    const allPrefs: Prefecture[] = [];
    PREFECTURE_GROUPS.forEach((group) => {
      allPrefs.push(...group.prefectures);
    });
    return allPrefs;
  };

  useEffect(() => {
    setSelectedLocations(initialSelected);
  }, [initialSelected]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      };
    }
    return undefined;
  }, [isOpen]);

  const handleLocationClick = (location: Prefecture) => {
    setSelectedLocations((prev) => {
      const isSelected = prev.some((s) => s.id === location.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== location.id);
      } else {
        return [...prev, location];
      }
    });
  };

  const handleSelectAllJapan = () => {
    const allPrefs = getAllPrefectures();
    const allSelected = allPrefs.every((pref) =>
      selectedLocations.some((s) => s.id === pref.id),
    );

    if (allSelected) {
      // Deselect all
      setSelectedLocations([]);
    } else {
      // Select all
      setSelectedLocations(allPrefs);
    }
  };

  const isAllJapanSelected = () => {
    const allPrefs = getAllPrefectures();
    return allPrefs.every((pref) =>
      selectedLocations.some((s) => s.id === pref.id),
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedLocations);
    onClose();
  };

  if (!isOpen) return null;

  if (isDesktop) {
    return (
      <>
        <div
          className="fixed inset-0 bg-[#323232] opacity-50 z-40"
          onClick={onClose}
        />

        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] w-[800px] h-[680px] flex flex-col">
            <div className="flex items-center justify-between px-10 py-6 border-b border-[#DCDCDC]">
              <h2 className="text-[24px] font-bold text-[#323232] tracking-[2.4px]">
                勤務地を選択
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-10 py-10 bg-[#F9F9F9]">
              {/* 日本セクション - 日本と日本を全て選択を同じ行に */}
              <div className="mb-10">
                <div className="flex items-center gap-6 pb-2 mb-4 border-b-2 border-[#DCDCDC]">
                  <h3 className="text-[20px] font-bold text-[#323232] tracking-[1.6px]">
                    日本
                  </h3>
                  <button
                    onClick={handleSelectAllJapan}
                    className="flex items-center gap-2 text-left cursor-pointer"
                  >
                    <div className="w-5 h-5 flex-shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                          fill={isAllJapanSelected() ? '#0F9058' : '#DCDCDC'}
                        />
                      </svg>
                    </div>
                    <span
                      className={`text-[14px] font-bold tracking-[1.4px] ${
                        isAllJapanSelected()
                          ? 'text-[#0F9058]'
                          : 'text-[#323232]'
                      }`}
                    >
                      日本を全て選択
                    </span>
                  </button>
                </div>
              </div>

              {/* 地域セクション */}
              <div className="space-y-10">
                {PREFECTURE_GROUPS.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-[20px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-4 border-b-2 border-[#DCDCDC]">
                      {group.name}
                    </h3>
                    <div className="flex gap-x-6 gap-y-4 flex-wrap">
                      {group.prefectures.map((location) => {
                        const isSelected = selectedLocations.some(
                          (s) => s.id === location.id,
                        );
                        return (
                          <button
                            key={location.id}
                            onClick={() => handleLocationClick(location)}
                            className="flex items-center gap-2 text-left cursor-pointer"
                          >
                            <div className="w-5 h-5 flex-shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <path
                                  d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                                  fill={isSelected ? '#0F9058' : '#DCDCDC'}
                                />
                              </svg>
                            </div>
                            <span
                              className={`text-[14px] font-bold tracking-[1.4px] ${
                                isSelected ? 'text-[#0F9058]' : 'text-[#323232]'
                              }`}
                            >
                              {location.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center px-10 py-4 border-t border-[#DCDCDC]">
              <button
                onClick={handleConfirm}
                className="px-[60px] py-3 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white text-[16px] font-bold tracking-[1.6px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:from-[#1e8544] hover:to-[#147362] transition-all"
              >
                決定
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mobile version
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-white rounded-t-[24px] max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-5 border-b border-[#EFEFEF]">
            <h2 className="text-[18px] font-bold text-[#323232] tracking-[1.8px]">
              勤務地を選択
            </h2>
            <button
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F9F9F9] px-4 py-6">
            {/* 日本セクション - 日本と日本を全て選択を同じ行に */}
            <div className="mb-5">
              <div className="flex items-center gap-4 pb-2 mb-3 border-b border-[#DCDCDC]">
                <h3 className="text-[18px] font-bold text-[#323232] tracking-[1.6px]">
                  日本
                </h3>
                <button
                  onClick={handleSelectAllJapan}
                  className="flex items-center gap-2 text-left"
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2.28571 0C0.99999 0 0 1 0 2.28571V13.7143C0 15 0.99999 16 2.28571 16H13.7143C15 16 16 15 16 13.7143V2.28571C16 1 15 0 13.7143 0H2.28571ZM12.0357 6.32143L7.46429 10.8929C7.12857 11.2286 6.58571 11.2286 6.25357 10.8929L3.96786 8.60714C3.63214 8.27143 3.63214 7.72857 3.96786 7.39643C4.30357 7.06429 4.84643 7.06071 5.17857 7.39643L6.85714 9.075L10.8214 5.10714C11.1571 4.77143 11.7 4.77143 12.0321 5.10714C12.3643 5.44286 12.3679 5.98571 12.0321 6.31786L12.0357 6.32143Z"
                        fill={isAllJapanSelected() ? '#0F9058' : '#DCDCDC'}
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-[14px] tracking-[1.2px] ${
                      isAllJapanSelected()
                        ? 'text-[#0F9058] font-bold'
                        : 'text-[#323232] font-normal'
                    }`}
                  >
                    日本を全て選択
                  </span>
                </button>
              </div>
            </div>

            {/* 地域セクション */}
            <div className="space-y-5">
              {PREFECTURE_GROUPS.map((group) => (
                <div key={group.id}>
                  <h3 className="text-[18px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-3 border-b border-[#DCDCDC]">
                    {group.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-4">
                    {group.prefectures.map((location) => {
                      const isSelected = selectedLocations.some(
                        (s) => s.id === location.id,
                      );
                      return (
                        <button
                          key={location.id}
                          onClick={() => handleLocationClick(location)}
                          className="flex items-center gap-2 text-left"
                        >
                          <div className="w-4 h-4 flex-shrink-0">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M2.28571 0C0.99999 0 0 1 0 2.28571V13.7143C0 15 0.99999 16 2.28571 16H13.7143C15 16 16 15 16 13.7143V2.28571C16 1 15 0 13.7143 0H2.28571ZM12.0357 6.32143L7.46429 10.8929C7.12857 11.2286 6.58571 11.2286 6.25357 10.8929L3.96786 8.60714C3.63214 8.27143 3.63214 7.72857 3.96786 7.39643C4.30357 7.06429 4.84643 7.06071 5.17857 7.39643L6.85714 9.075L10.8214 5.10714C11.1571 4.77143 11.7 4.77143 12.0321 5.10714C12.3643 5.44286 12.3679 5.98571 12.0321 6.31786L12.0357 6.32143Z"
                                fill={isSelected ? '#0F9058' : '#DCDCDC'}
                              />
                            </svg>
                          </div>
                          <span
                            className={`text-[14px] tracking-[1.2px] ${
                              isSelected
                                ? 'text-[#0F9058] font-bold'
                                : 'text-[#323232] font-normal'
                            }`}
                          >
                            {location.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white px-4 py-4 border-t border-[#EFEFEF]">
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-full text-white text-[16px] font-bold tracking-[1.4px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)]"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
