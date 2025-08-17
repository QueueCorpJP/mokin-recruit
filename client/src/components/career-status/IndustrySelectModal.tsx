'use client';

import React, { useState, useEffect } from 'react';
import { INDUSTRY_GROUPS, type Industry } from '@/constants/industry-data';
import { Modal } from '@/components/ui/mo-dal';
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
                  selectedCategory === group.id
                    ? 'text-[#0F9058] font-bold'
                    : 'text-[#999999] font-bold'
                }`}
              >
                {group.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Selected category industries */}
        <div>
          <h3 className="text-[20px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-4 border-b-2 border-[#DCDCDC]">
            {selectedCategoryData.name}
          </h3>
          <div className="flex gap-x-6 gap-y-4 flex-wrap">
            {selectedCategoryData.industries.map((industry) => {
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
        
        {/* Selection count (visible in footer) */}
        <div className="mt-6 text-center text-[14px] font-medium text-[#323232] tracking-[1.4px]">
          {selectedIndustries.length}/{maxSelections} 選択中
        </div>
      </div>
    </Modal>
  );
}