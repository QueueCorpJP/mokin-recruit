import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MessageDetailHeaderProps {
  candidateName: string;
  jobTitle: string;
  onDetailClick?: () => void;
  className?: string;
}

export const MessageDetailHeader: React.FC<MessageDetailHeaderProps> = ({
  candidateName,
  jobTitle,
  onDetailClick,
  className,
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
      <div className='flex flex-row flex-1 min-w-0 items-center gap-6'>
        <div className='font-["Noto_Sans_JP"] font-bold text-[16px] text-[#323232] tracking-[0.1em] leading-[2] truncate whitespace-nowrap'>
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
      <Button
        variant='small-green-outline'
        className='rounded-full px-6 py-2 h-auto text-[14px] font-bold border-[#0F9058] text-[#0F9058] min-w-[120px]'
        onClick={onDetailClick}
        type='button'
      >
        候補者詳細
      </Button>
    </div>
  );
};
