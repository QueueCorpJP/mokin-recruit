import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MessageDetailHeaderProps {
  candidateName: string;
  jobTitle: string;
  onDetailClick?: () => void;
  className?: string;
  onBackClick?: () => void; // 追加
  isCandidatePage?: boolean;
}

export const MessageDetailHeader: React.FC<MessageDetailHeaderProps> = ({
  candidateName,
  jobTitle,
  onDetailClick,
  className,
  onBackClick,
  isCandidatePage = false,
}) => {
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-6 px-6 py-2',
        'bg-[#FFFBDC] border-b border-[#efefef]',
        'w-full',
        className
      )}
      style={{ minHeight: 56 }}
    >
      {/* モバイル時のみ左端にarrow.svgを表示 */}
      <img
        src='/images/arrow.svg'
        alt='戻る'
        className='block md:hidden w-6 h-6 mr-2 flex-shrink-0 cursor-pointer'
        style={{ minWidth: 24 }}
        onClick={onBackClick}
      />
      <div className='flex flex-col md:flex-row flex-1 min-w-0 items-start md:items-center gap-1 md:gap-6'>
        <div
          className='font-["Noto_Sans_JP"] font-bold text-[16px] text-[#323232] tracking-[0.1em] leading-[2] truncate whitespace-nowrap max-w-full w-full overflow-hidden'
          style={{ maxWidth: 240 }}
        >
          {candidateName}
        </div>
        <div
          className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#0F9058] tracking-[0.1em] leading-[1.6] underline underline-offset-2 truncate whitespace-nowrap'
          style={{
            textDecorationColor: '#0F9058',
            maxWidth: '100%',
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
          onClick={onDetailClick}
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
  );
};
