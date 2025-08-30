'use client';

import React from 'react';

interface PaginationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label="前のページ"
        className={`px-6 py-3 rounded-full border-2 flex items-center gap-2 transition-all font-['Noto_Sans_JP'] text-[14px] font-medium ${
          previousDisabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400'
            : 'border-[#0F9058] bg-white hover:bg-[#F0FAF4] hover:shadow-md text-[#0F9058]'
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={previousDisabled ? 'opacity-30' : ''}
        >
          <path
            d="M15 18L9 12L15 6"
            stroke={previousDisabled ? '#999999' : '#0F9058'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        前へ
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="次のページ"
        className={`px-6 py-3 rounded-full border-2 flex items-center gap-2 transition-all font-['Noto_Sans_JP'] text-[14px] font-medium ${
          nextDisabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed text-gray-400'
            : 'border-[#0F9058] bg-white hover:bg-[#F0FAF4] hover:shadow-md text-[#0F9058]'
        }`}
      >
        次へ
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={nextDisabled ? 'opacity-30' : ''}
        >
          <path
            d="M9 18L15 12L9 6"
            stroke={nextDisabled ? '#999999' : '#0F9058'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};