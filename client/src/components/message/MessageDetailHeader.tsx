'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { DeclineConfirmModal } from './DeclineConfirmModal';

export interface MessageDetailHeaderProps {
  candidateName: string;
  companyName?: string; // 追加
  jobTitle: string;
  onDetailClick?: () => void;
  className?: string;
  onBackClick?: () => void; // 追加
  isCandidatePage?: boolean;
}

export const MessageDetailHeader: React.FC<MessageDetailHeaderProps> = ({
  candidateName,
  companyName,
  jobTitle,
  onDetailClick,
  className,
  onBackClick,
  isCandidatePage = false,
}) => {
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const handleDeclineClick = () => {
    setIsDeclineModalOpen(true);
  };

  const handleDeclineConfirm = () => {
    // TODO: 辞退処理を実装
    console.log('辞退処理を実行');
    setIsDeclineModalOpen(false);
  };

  return (
    <>
    <div
      className={cn(
        'flex flex-row items-center gap-6 px-6 py-2',
        'bg-[#FFFBDC] border-b border-[#efefef]',
        'w-full',
        className
      )}
      style={{ minHeight: 56 }}
    >
      {/* モバイル時のみ左端に戻る矢印を表示 */}
      <ChevronLeft
        className='block md:hidden w-6 h-6 mr-2 flex-shrink-0 cursor-pointer text-[#0F9058]'
        style={{ minWidth: 24 }}
        onClick={onBackClick}
      />
      <div className='flex flex-col md:flex-row flex-1 min-w-0 items-start md:items-center gap-1 md:gap-6'>
        {companyName && (
          <div
            className='font-["Noto_Sans_JP"] font-bold text-[16px] text-[#323232] tracking-[0.1em] leading-[2] overflow-hidden text-ellipsis whitespace-nowrap md:max-w-[240px]'
            style={{ 
              height: 32,
              fontWeight: 700,
              maxWidth: 'calc(100vw - 48px - 32px - 140px - 30px)', // 全体padding - 矢印+margin - ボタン幅 - 余裕をもった間隔
            }}
          >
            {companyName}
          </div>
        )}
        {/* <div
          className='font-["Noto_Sans_JP"] font-bold text-[16px] text-[#323232] tracking-[0.1em] leading-[2] truncate whitespace-nowrap max-w-full w-full overflow-hidden'
          style={{ maxWidth: 240 }}
        >
          {candidateName}
        </div> */}
        <div
          className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#0F9058] tracking-[0.1em] leading-[1.6] underline underline-offset-2 overflow-hidden text-ellipsis whitespace-nowrap md:max-w-[544px]'
          style={{
            textDecorationColor: '#0F9058',
            maxWidth: 'calc(100vw - 48px - 32px - 140px - 30px)', // 全体padding - 矢印+margin - ボタン幅 - 余裕をもった間隔
          }}
        >
          {jobTitle}
        </div>
      </div>
      {isCandidatePage ? (
        <Button
          style={{
            borderColor: '#FF5B5B',
            color: '#FF5B5B',
          }}
          className='rounded-full px-6 py-2 h-auto text-[14px] font-bold min-w-[120px] border border-[#FF5B5B] bg-transparent hover:bg-[rgba(255,91,91,0.2)]'
          onClick={handleDeclineClick}
          type='button'
        >
          辞退する
        </Button>
      ) : (
        <Button
          variant='small-green-outline'
          className='rounded-full px-6 py-2 h-auto text-[14px] font-bold border-[#0F9058] text-[#0F9058] min-w-[120px] hover:bg-[rgba(15,144,88,0.2)]'
          onClick={onDetailClick}
          type='button'
        >
          候補者詳細
        </Button>
      )}
    </div>
    
    {/* 辞退確認モーダル */}
    <DeclineConfirmModal
      isOpen={isDeclineModalOpen}
      onClose={() => setIsDeclineModalOpen(false)}
      onConfirm={handleDeclineConfirm}
      companyName={companyName}
      jobTitle={jobTitle}
    />
    </>
  );
};
