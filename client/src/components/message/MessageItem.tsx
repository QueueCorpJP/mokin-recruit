import React from 'react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
import { MessageGroupTag } from './MessageGroupTag';

export interface MessageItemProps {
  id: string;
  timestamp: string;
  isUnread?: boolean;
  companyName: string;
  candidateName: string;
  messagePreview: string;
  groupName: string;
  jobTitle: string;
  onClick?: (id: string) => void;
  className?: string;
}

export function MessageItem({
  id,
  timestamp,
  isUnread = false,
  companyName,
  candidateName,
  messagePreview,
  groupName,
  jobTitle,
  onClick,
  className
}: MessageItemProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={cn(
        'bg-white px-6 py-4 border-t border-b border-[#efefef]',
        'flex flex-col gap-2 cursor-pointer',
        'hover:bg-gray-50 transition-colors duration-200',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* タイムスタンプと未読ステータス */}
      <div className="flex flex-row gap-6 items-center w-full">
        <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[14px] text-[#999999] tracking-[1.4px] leading-[1.6]">
          {timestamp}
        </div>
        <StatusIndicator isUnread={isUnread} />
      </div>

      {/* 企業名と候補者名 */}
      <div className="flex flex-col gap-0 w-full">
        <div className="font-['Noto_Sans_JP'] font-bold text-[14px] text-[#323232] tracking-[1.4px] leading-[1.6] truncate">
          {companyName}
        </div>
        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#0f9058] tracking-[1.6px] leading-[2]">
          {candidateName}
        </div>
      </div>

      {/* メッセージプレビュー */}
      <div 
        className={cn(
          'font-["Noto_Sans_JP"] font-medium text-[14px] text-[#323232]',
          'tracking-[1.4px] leading-[1.6] h-[38px]',
          'overflow-hidden'
        )}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          textOverflow: 'ellipsis'
        }}
      >
        {messagePreview}
      </div>

      {/* グループタグとジョブタイトル */}
      <div className="flex flex-row gap-2 items-center w-full">
        <MessageGroupTag>
          {groupName}
        </MessageGroupTag>
        <div className={cn(
          'flex-1 font-["Noto_Sans_JP"] font-medium text-[14px] text-[#0f9058]',
          'tracking-[1.4px] leading-[1.6]',
          'overflow-hidden text-ellipsis whitespace-nowrap'
        )}>
          {jobTitle}
        </div>
      </div>
    </div>
  );
} 