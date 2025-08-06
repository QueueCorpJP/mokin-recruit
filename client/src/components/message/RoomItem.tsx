import React from 'react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
import { MessageGroupTag } from './MessageGroupTag';

export interface RoomItemProps {
  id: string;
  companyName: string;
  candidateName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isUnread?: boolean;
  jobTitle: string;
  groupName?: string;
  onClick?: (id: string) => void;
  className?: string;
  isCandidatePage?: boolean;
  selected?: boolean;
}

export function RoomItem({
  id,
  companyName,
  candidateName,
  lastMessage,
  lastMessageTime,
  isUnread = false,
  jobTitle,
  groupName = '',
  onClick,
  className,
  isCandidatePage = false,
  selected = false,
}: RoomItemProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={cn(
        selected ? 'bg-[#F0F9F3]' : 'bg-white',
        'px-6 py-4 border-t border-b border-[#efefef]',
        'flex flex-col gap-2 cursor-pointer',
        'hover:bg-gray-50 transition-colors duration-200',
        className
      )}
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* タイムスタンプと未読ステータス */}
      <div className='flex flex-row gap-6 items-center w-full'>
        <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[14px] text-[#999999] tracking-[1.4px] leading-[1.6]">
          {lastMessageTime || ''}
        </div>
        <StatusIndicator isUnread={isUnread} />
      </div>

      {/* candidate用: 画像＋テキスト横並び */}
      {isCandidatePage ? (
        <div className='flex flex-row items-center gap-4 w-full'>
          {/* 画像用ダミーdiv（円形） */}
          <div
            style={{
              width: 78,
              height: 78,
              background: '#e0e0e0',
              borderRadius: '50%',
            }}
            className='flex-shrink-0 flex items-center justify-center'
          >
            {/* ここに画像やアイコンを将来的に挿入 */}
            <span className='text-[#999] text-xs'>画像</span>
          </div>
          {/* テキスト部分 */}
          <div className='flex flex-col justify-center min-w-0'>
            <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[1.4px] leading-[1.6] truncate">
              {companyName}
            </div>
            <div
              className="font-['Noto_Sans_JP'] font-medium text-[14px] text-[#323232] tracking-[1.4px] leading-[1.6]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {lastMessage || 'まだメッセージがありません'}
            </div>
          </div>
        </div>
      ) : (
        // company用: 従来のレイアウト
        <div className='flex flex-col gap-0 w-full'>
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[1.4px] leading-[1.6] truncate">
            {companyName}
          </div>
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#0f9058] tracking-[1.6px] leading-[2]">
            {candidateName}
          </div>
        </div>
      )}

      {/* メッセージプレビュー（candidate用は非表示） */}
      {!isCandidatePage && lastMessage && (
        <div
          className={cn(
            'font-["Noto_Sans_JP"] font-medium text-[14px] text-[#323232]',
            'tracking-[1.4px] leading-[1.6] h-[38px]',
            'overflow-hidden text-ellipsis whitespace-nowrap',
            'flex items-center'
          )}
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {lastMessage}
        </div>
      )}

      {/* グループタグとジョブタイトル */}
      <div className='flex flex-row gap-2 items-center w-full min-w-0'>
        {!isCandidatePage && groupName && <MessageGroupTag>{groupName}</MessageGroupTag>}
        <div
          className={cn(
            'flex-1 font-["Noto_Sans_JP"] font-medium text-[14px] text-[#0f9058]',
            'tracking-[1.4px] leading-[1.6]',
            'overflow-hidden text-ellipsis whitespace-nowrap'
          )}
        >
          {jobTitle}
        </div>
      </div>
    </div>
  );
}