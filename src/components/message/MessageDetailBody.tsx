import React from 'react';
import { cn } from '@/lib/utils';

export interface MessageDetailBodyProps {
  children: React.ReactNode;
  className?: string;
  isCandidatePage?: boolean;
}

export const MessageDetailBody: React.FC<MessageDetailBodyProps> = ({
  children,
  className,
  isCandidatePage = false,
}) => {
  return (
    <div
      id='message-detail-body'
      className={cn(
        'flex flex-col gap-6 p-4',
        isCandidatePage ? 'bg-[#F9F9F9]' : 'bg-[#EFEFEF]', // 候補者画面は#F9F9F9、企業画面は#EFEFEF
        className
      )}
      style={{
        minHeight: '100%', // 親要素の高さいっぱいまで背景色を表示
      }}
    >
      {children}
    </div>
  );
};
