'use client';

import React, { useState, useEffect } from 'react';
import { JOB_TYPE_GROUPS, type JobType } from '@/constants/job-type-data';
import { Modal } from '@/components/ui/mo-dal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Checkbox } from '@/components/ui/checkbox';

interface JobTypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedJobTypes: JobType[]) => void;
  initialSelected?: JobType[];
  maxSelections?: number;
}

export default function JobTypeSelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
  maxSelections = 3,
}: JobTypeSelectModalProps) {
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>(initialSelected);
  const [selectedCategory, setSelectedCategory] = useState<string>(JOB_TYPE_GROUPS[0]?.id || '');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedJobTypes(initialSelected);
  }, [initialSelected]);

  const handleJobTypeClick = (jobType: JobType) => {
    setSelectedJobTypes((prev) => {
      const isSelected = prev.some((s) => s.id === jobType.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== jobType.id);
      } else {
        if (prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, jobType];
      }
    });
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedCategory(groupId);
  };

  const handleConfirm = () => {
    onConfirm(selectedJobTypes);
    onClose();
  };

  const selectedCategoryData = JOB_TYPE_GROUPS.find(
    group => group.id === selectedCategory
  )!;

  return (
    <Modal
      title="職種を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedJobTypes.length}
      totalCount={maxSelections}
    >
      <div className="w-full">
        {/* Group titles row - Anchor Links */}
        <div className="flex flex-wrap items-center gap-x-0 gap-y-4 mb-10">
          {JOB_TYPE_GROUPS.map((group, index) => (
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

        {/* Selected category job types */}
        <div>
          <h3 className="text-[20px] font-bold text-[#323232] tracking-[1.6px] pb-2 mb-4 border-b-2 border-[#DCDCDC]">
            {selectedCategoryData.name}
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            {selectedCategoryData.jobTypes.map((jobType) => {
              const isSelected = selectedJobTypes.some(
                (s) => s.id === jobType.id,
              );
              const isDisabled =
                !isSelected &&
                selectedJobTypes.length >= maxSelections;
              return (
                <div key={jobType.id} className="flex items-center">
                  <Checkbox
                    label={jobType.name}
                    checked={isSelected}
                    onChange={() => handleJobTypeClick(jobType)}
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