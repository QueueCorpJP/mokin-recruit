'use client';

import React, { useState, useEffect } from 'react';
import { INDUSTRY_GROUPS, type Industry } from '@/constants/industry-data';
import { Modal } from '@/components/ui/mo-dal';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState<string>(INDUSTRY_GROUPS[0]?.id || '');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedIndustries(initialSelected);
  }, [initialSelected]);

  const handleIndustryClick = (industry: Industry) => {
    setSelectedIndustries((prev) => {
      const isSelected = prev.some((s) => s.id === industry.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== industry.id);
      } else {
        if (prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, industry];
      }
    });
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedCategory(groupId);
  };

  const handleConfirm = () => {
    onConfirm(selectedIndustries);
    onClose();
  };

  const selectedCategoryData = INDUSTRY_GROUPS.find(
    group => group.id === selectedCategory
  )!;

  return (
    <Modal
      title="業種を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedIndustries.length}
      totalCount={maxSelections}
    >
      <div className="w-full">
        {/* Group titles row - Anchor Links */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center">
            {INDUSTRY_GROUPS.map((group, index) => (
              <React.Fragment key={group.id}>
                <button
                  className={`py-2 px-2 transition-colors ${
                    selectedCategory === group.id
                      ? 'text-[#0F9058] font-medium'
                      : 'text-[var(--3,#999)] hover:text-[#0F9058]'
                  }`}
                  style={{
                    fontFamily: '"Noto Sans JP"',
                    fontSize: '14px',
                    fontWeight: selectedCategory === group.id ? 600 : 500,
                    lineHeight: '160%',
                    letterSpacing: '1.4px',
                  }}
                  onClick={() => handleGroupClick(group.id)}
                >
                  {group.name}
                </button>
                {index < INDUSTRY_GROUPS.length - 1 && (
                  <div className="mx-2">
                    <svg
                      width="2"
                      height="24"
                      viewBox="0 0 2 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1V23"
                        stroke="var(--3,#999)"
                        strokeLinecap="round"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Selected category industries */}
        <div>
          <h3 className="w-full font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[0.05em] text-[#323232] border-b-2 border-[#E5E7EB] pb-3">
            {selectedCategoryData.name}
          </h3>

          {/* 制限メッセージ */}
          {selectedIndustries.length >= maxSelections && (
            <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md mb-4">
              <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
                最大{maxSelections}
                個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
              </p>
            </div>
          )}

          {/* 業種チェックボックスリスト（2列グリッド） */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            {selectedCategoryData.industries.map((industry) => {
              const isSelected = selectedIndustries.some(
                (s) => s.id === industry.id,
              );
              const isDisabled =
                !isSelected &&
                selectedIndustries.length >= maxSelections;
              return (
                <div key={industry.id} className="flex items-center">
                  <Checkbox
                    label={industry.name}
                    checked={isSelected}
                    onChange={() => handleIndustryClick(industry)}
                    disabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}