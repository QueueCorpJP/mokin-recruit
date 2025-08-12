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
        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
          previousDisabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-[#0F9058] bg-white hover:bg-[#F0FAF4] hover:shadow-md'
        }`}
      >
        <svg
          width="24"
          height="24"
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
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="次のページ"
        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
          nextDisabled
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-[#0F9058] bg-white hover:bg-[#F0FAF4] hover:shadow-md'
        }`}
      >
        <svg
          width="24"
          height="24"
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