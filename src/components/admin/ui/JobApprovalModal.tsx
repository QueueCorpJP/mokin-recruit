'use client';

import React, { useState } from 'react';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';
import { AdminButton } from './AdminButton';

interface JobApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (reason: string, comment: string) => void;
  onReject: (reason: string, comment: string) => void;
  isProcessing?: boolean;
  jobTitle?: string;
}

const reasonOptions = [
  { value: '', label: '理由を選択してください' },
  {
    value: 'unclear_or_insufficient_info',
    label: '募集内容が不明確または情報不足',
  },
  {
    value: 'inappropriate_or_discriminatory',
    label: '不適切な表現や差別的な内容が含まれている',
  },
  { value: 'terms_violation', label: '利用規約に違反している' },
  { value: 'typos_or_unnatural', label: '誤字脱字や不自然な表現がある' },
  { value: 'duplicate_posting', label: '内容が重複している求人がある' },
  { value: 'other', label: 'その他' },
];

export function JobApprovalModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
  jobTitle = '求人',
}: JobApprovalModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove(selectedReason, comment);
    resetForm();
  };

  const handleReject = () => {
    onReject(selectedReason, comment);
    resetForm();
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedReason('');
    setComment('');
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={handleClose}
    >
      <div
        className='bg-white border border-[#323232] flex flex-col'
        style={{
          width: '604px',
          height: 'auto',
          borderRadius: '16px',
          padding: '40px 80px 40px 80px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* タイトル */}
        <div className='text-center mb-4'>
          <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
            求人の掲載を承認しますか？{' '}
          </h2>
        </div>

        {/* 説明文 */}
        <div className='text-center mb-6 '>
          <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6] mb-2">
            求人の承認をした場合、即時掲載がされます。
          </p>
          <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6]">
            非承認の場合は、求人企業に非承認通知が届きます。
          </p>
        </div>
        <div className='text-center mb-6 '>
          <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6] mb-2">
            非承認の場合は、理由を選択の上、詳細をお書きください。
          </p>
          <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6]">
            （承認の場合は、必要ありません）
          </p>
        </div>

        <div className='space-y-6'>
          {/* 理由選択 */}
          <div>
            <label className="block font-['Inter'] text-[16px] font-medium text-[#323232] mb-2">
              理由
            </label>
            <SelectInput
              options={reasonOptions}
              value={selectedReason}
              onChange={setSelectedReason}
              placeholder='理由を選択してください'
              className='w-[300px]'
              disabled={isProcessing}
            />
          </div>

          {/* コメント入力 */}
          <div>
            <label className="block font-['Inter'] text-[16px] font-medium text-[#323232] mb-2">
              コメント（任意）
            </label>
            <div className='border border-[#999999] rounded-[8px] p-1'>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='詳細なコメントがあれば入力してください...'
                className="w-full px-3 py-2 border-none rounded-none resize-none focus:outline-none font-['Inter'] text-[16px] leading-[1.6]"
                rows={4}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className='flex gap-4 justify-center mt-8'>
          <button
            onClick={handleReject}
            disabled={!selectedReason || isProcessing}
            className="w-[180px] bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-[32px] transition-colors font-['Inter']"
          >
            {isProcessing ? '処理中...' : '非承認にする'}
          </button>
          <Button
            variant='green-gradient'
            size='figma-default'
            onClick={handleApprove}
            disabled={!selectedReason || isProcessing}
            className='w-[180px]'
          >
            {isProcessing ? '処理中...' : '承認する'}
          </Button>
        </div>
      </div>
    </div>
  );
}
