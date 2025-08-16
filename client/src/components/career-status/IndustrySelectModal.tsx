'use client';

import React, { useState, useEffect, useRef } from 'react';
import { INDUSTRY_GROUPS, type Industry } from '@/constants/industry-data';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface IndustrySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedIndustries: Industry[]) => void;
  initialSelected?: Industry[];
  maxSelections?: number;
}

export default function IndustrySelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
  maxSelections = 3,
}: IndustrySelectModalProps) {
  const [selectedIndustries, setSelectedIndustries] =
    useState<Industry[]>(initialSelected);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const contentRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setSelectedIndustries(initialSelected);
  }, [initialSelected]);

  // スクロール検出でアクティブアンカーを更新
  useEffect(() => {
    if (!isDesktop || !contentRef.current) return;

    const handleScroll = () => {
      const scrollTop = contentRef.current?.scrollTop || 0;

      // 各グループの位置を確認してアクティブアンカーを更新
      for (const group of INDUSTRY_GROUPS) {
        const element = groupRefs.current[group.id];
        if (element) {
          const offsetTop =
            element.offsetTop - (contentRef.current?.offsetTop || 0);
          if (scrollTop >= offsetTop - 50) {
            setActiveAnchor(group.id);
          }
        }
      }
    };

    const scrollElement = contentRef.current;
    scrollElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [isDesktop]);

  // モーダル表示中はスクロールを禁止
  useEffect(() => {
    if (isOpen) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      // bodyにスタイルを適用
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // クリーンアップ時にスタイルを元に戻す
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // スクロール位置を復元
        window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      };
    }
    return undefined;
  }, [isOpen]);

  // グループ内のすべての業種が選択されているかチェック
  const isGroupFullySelected = (groupId: string) => {
    const group = INDUSTRY_GROUPS.find((g) => g.id === groupId);
    if (!group) return false;
    return group.industries.every((industry) =>
      selectedIndustries.some((s) => s.id === industry.id),
    );
  };

  // グループ内の一部の業種が選択されているかチェック
  const isGroupPartiallySelected = (groupId: string) => {
    const group = INDUSTRY_GROUPS.find((g) => g.id === groupId);
    if (!group) return false;
    const selectedCount = group.industries.filter((industry) =>
      selectedIndustries.some((s) => s.id === industry.id),
    ).length;
    return selectedCount > 0 && selectedCount < group.industries.length;
  };

  // グループクリック時の処理（アンカーリンクとして動作）
  const handleGroupClick = (groupId: string) => {
    // PC・モバイル両方でアンカーリンクとして動作
    setActiveAnchor(groupId);

    // 対象グループまでスクロール
    const targetGroup = document.getElementById(`industry-group-${groupId}`);
    if (targetGroup) {
      targetGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 個別の業種クリック時の処理
  const handleIndustryClick = (industry: Industry) => {
    setSelectedIndustries((prev) => {
      const isSelected = prev.some((s) => s.id === industry.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== industry.id);
      } else {
        // 最大選択数に達している場合は追加しない
        if (prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, industry];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedIndustries);
    onClose();
  };

  if (!isOpen) return null;

  // デスクトップ版
  if (isDesktop) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#323232] opacity-50 z-40"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] w-[800px] h-[680px] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-10 py-6 border-b border-[#DCDCDC]">
              <h2 className="text-[24px] font-bold text-[#323232] tracking-[2.4px]">
                業種を選択
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

            {/* Content - Scrollable */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-10 py-10 bg-[#F9F9F9]"
            >
              {/* Group titles row - Anchor Links */}
              <div className="flex flex-wrap items-center gap-x-0 gap-y-4 mb-10">
                {INDUSTRY_GROUPS.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {index > 0 && (
                      <span className="mx-2 text-[#DCDCDC] text-[14px] font-bold">
                        ｜
                      </span>
                    )}
                    <button
                      onClick={() => handleGroupClick(group.id)}
                      className={`text-[14px] tracking-[1.4px] hover:text-[#0F9058] transition-colors ${
                        activeAnchor === group.id
                          ? 'text-[#0F9058] font-bold'
                          : 'text-[#999999] font-bold'
                      }`}
                    >
                      {group.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Industry groups and items */}
              <div className="space-y-10">
                {INDUSTRY_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    id={`industry-group-${group.id}`}
                    ref={(el) => {
                      groupRefs.current[group.id] = el;
                    }}
                  >
                    <h3 className="text-[20px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-4 border-b-2 border-[#DCDCDC]">
                      {group.name}
                    </h3>
                    <div className="flex gap-x-6 gap-y-4 flex-wrap">
                      {group.industries.map((industry) => {
                        const isSelected = selectedIndustries.some(
                          (s) => s.id === industry.id,
                        );
                        const isDisabled =
                          !isSelected &&
                          selectedIndustries.length >= maxSelections;
                        return (
                          <button
                            key={industry.id}
                            onClick={() => handleIndustryClick(industry)}
                            disabled={isDisabled}
                            className={`flex items-center gap-2 text-left ${
                              isDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            <div className="w-5 h-5 flex-shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                                  fill={isSelected ? '#0F9058' : '#DCDCDC'}
                                />
                              </svg>
                            </div>
                            <span
                              className={`text-[14px] font-bold tracking-[1.4px] ${
                                isSelected
                                  ? 'text-[#0F9058]'
                                  : isDisabled
                                    ? 'text-[#999999]'
                                    : 'text-[#323232]'
                              }`}
                            >
                              {industry.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="relative px-10 py-4 border-t border-[#DCDCDC]">
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[16px] font-medium text-[#323232] tracking-[1.4px]">
                {selectedIndustries.length}/{maxSelections} 選択中
              </span>
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="px-[60px] py-3 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white text-[16px] font-bold tracking-[1.6px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:from-[#1e8544] hover:to-[#147362] transition-all"
                >
                  決定
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // モバイル版
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal - Bottom Sheet Style */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-white rounded-t-[24px] max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-[#EFEFEF]">
            <h2 className="text-[18px] font-bold text-[#323232] tracking-[1.8px]">
              業種を選択
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

          {/* Content - Scrollable */}
          <div
            className="flex-1 overflow-y-auto bg-[#F9F9F9] px-4 py-6"
            ref={contentRef}
          >
            {/* Group titles */}
            <div className="flex flex-wrap items-center gap-x-0 gap-y-3 mb-4">
              {INDUSTRY_GROUPS.slice(0, showAllCategories ? undefined : 6).map(
                (group, index) => (
                  <React.Fragment key={group.id}>
                    {index > 0 && (
                      <span className="mx-2 text-[#DCDCDC] text-[14px] font-bold">
                        ｜
                      </span>
                    )}
                    <button
                      onClick={() => handleGroupClick(group.id)}
                      className={`text-[14px] tracking-[1.2px] ${
                        isGroupFullySelected(group.id)
                          ? 'text-[#0F9058] font-bold'
                          : isGroupPartiallySelected(group.id)
                            ? 'text-[#0F9058] font-bold'
                            : 'text-[#999999] font-bold'
                      }`}
                    >
                      {group.name}
                    </button>
                  </React.Fragment>
                ),
              )}
            </div>

            {/* Show more/less button */}
            {INDUSTRY_GROUPS.length > 6 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="flex items-center justify-center gap-1 w-full py-2 mb-6"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d={showAllCategories ? 'M1 5H9' : 'M5 1V9M1 5H9'}
                    stroke="#0F9058"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[12px] font-bold text-[#0F9058] tracking-[1.2px]">
                  {showAllCategories ? '少なく表示' : 'もっと表示'}
                </span>
              </button>
            )}

            {/* Industry groups and items */}
            <div className="space-y-5">
              {(showAllCategories
                ? INDUSTRY_GROUPS
                : INDUSTRY_GROUPS.slice(0, 6)
              ).map((group) => (
                <div key={group.id} id={`industry-group-${group.id}`}>
                  <h3 className="text-[18px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-3 border-b border-[#DCDCDC]">
                    {group.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-4">
                    {group.industries.map((industry) => {
                      const isSelected = selectedIndustries.some(
                        (s) => s.id === industry.id,
                      );
                      const isDisabled =
                        !isSelected &&
                        selectedIndustries.length >= maxSelections;
                      return (
                        <button
                          key={industry.id}
                          onClick={() => handleIndustryClick(industry)}
                          disabled={isDisabled}
                          className={`flex items-center gap-2 text-left ${
                            isDisabled ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="w-4 h-4 flex-shrink-0">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
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
                                : isDisabled
                                  ? 'text-[#999999] font-normal'
                                  : 'text-[#323232] font-normal'
                            }`}
                          >
                            {industry.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-4 py-4 border-t border-[#EFEFEF]">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[14px] font-medium text-[#323232] tracking-[1.4px]">
                {selectedIndustries.length}/{maxSelections} 選択中
              </span>
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-full text-white text-[16px] font-bold tracking-[1.4px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)]"
              >
                決定
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
