'use client';

import React from 'react';

interface JobApprovalCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'approve' | 'reject';
  count?: number;
}

export default function JobApprovalCompleteModal({
  isOpen,
  onClose,
  action,
  count = 1,
}: JobApprovalCompleteModalProps) {
  if (!isOpen) return null;

  const title =
    action === 'approve' ? '承認が完了しました' : '非承認が完了しました';
  const description =
    action === 'approve'
      ? `${count}件の求人を承認しました。`
      : `${count}件の求人を非承認にしました。`;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div
        className='bg-white border border-[#323232] rounded-2xl w-[604px] h-auto'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex flex-col items-center justify-center w-full px-8 py-10'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold' style={{ color: '#323232' }}>
              {title}
            </h2>
            <p
              className='text-base font-bold mt-4'
              style={{ color: '#323232' }}
            >
              {description}
            </p>
          </div>

          <div className='flex gap-4 w-full max-w-[420px] justify-center'>
            <button
              onClick={onClose}
              className='flex-1 h-[51px] bg-white border border-[#323232] rounded-[35px] text-base font-bold hover:bg-gray-50 transition-colors'
              style={{ color: '#323232' }}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
