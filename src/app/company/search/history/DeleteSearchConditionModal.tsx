'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

// Close Icon
const CloseIcon = () => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M0.415527 0.413818C0.966834 -0.137488 1.86031 -0.137488 2.41162 0.413818L11.9995 10.0017L21.5864 0.413818C22.1376 -0.13729 23.0312 -0.137058 23.5825 0.413818C24.1338 0.965166 24.1338 1.85954 23.5825 2.41089L13.9956 11.9978L23.5864 21.5876L23.6362 21.6404C24.1369 22.1946 24.1205 23.0506 23.5864 23.5847C23.0523 24.1188 22.1963 24.1352 21.6421 23.6345L21.5894 23.5847L11.9995 13.9949L2.40967 23.5867L2.35693 23.6375C1.8028 24.1379 0.947509 24.1207 0.413574 23.5867C-0.120258 23.0525 -0.13683 22.1974 0.36377 21.6433L0.413574 21.5906L10.0034 11.9978L0.415527 2.40991C-0.135772 1.85861 -0.135757 0.965127 0.415527 0.413818Z'
      fill='#999999'
    />
  </svg>
);

interface DeleteSearchConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  searchConditionName: string;
}

export const DeleteSearchConditionModal: React.FC<
  DeleteSearchConditionModalProps
> = ({ isOpen, onClose, onDelete, searchConditionName }) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/40'>
      <div className='bg-[#f9f9f9] rounded-[10px] overflow-hidden w-[800px]'>
        {/* Header */}
        <div className='bg-white relative flex items-center justify-between px-10 py-6 border-b border-[#efefef]'>
          <h2 className="font-['Noto_Sans_JP'] font-bold text-[24px] text-[#323232] tracking-[2.4px]">
            検索条件の削除
          </h2>
          <button
            onClick={onClose}
            className='w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity'
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className='px-0 py-10 flex flex-col items-center gap-6 bg-[#f9f9f9] min-h-60 justify-center'>
          {/* Confirmation Message */}
          <div className="font-['Noto_Sans_JP'] font-medium text-[18px] text-[#323232] tracking-[1.8px] text-center">
            こちらの検索条件を削除してよろしいですか？
          </div>

          {/* Search Condition Name */}
          <div className="font-['Noto_Sans_JP'] font-medium text-[18px] text-[#0f9058] tracking-[1.8px] text-center max-w-[640px] px-4">
            「{searchConditionName}」
          </div>
        </div>

        {/* Footer */}
        <div className='bg-white flex items-center justify-center gap-4 px-10 py-6 border-t border-[#efefef]'>
          <Button
            onClick={onClose}
            variant='green-outline'
            size='figma-outline'
            className='min-w-[160px]'
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDelete}
            variant='destructive'
            size='figma-default'
            className='min-w-[160px] font-bold'
          >
            削除
          </Button>
        </div>
      </div>
    </div>
  );
};
