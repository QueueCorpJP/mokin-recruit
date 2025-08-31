'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

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
      <Button
        onClick={onPrevious}
        disabled={previousDisabled}
        aria-label="前のページ"
        variant="green-gradient"
        size="figma-default"
        className="rounded-full"
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
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        前へ
      </Button>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="次のページ"
        variant="green-gradient"
        size="figma-default"
        className="rounded-full"
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
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
};