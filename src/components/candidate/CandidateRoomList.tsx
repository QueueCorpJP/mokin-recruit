'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CandidateRoom } from '@/types/candidate-message';
import { StatusIndicator } from '@/components/message/StatusIndicator';

interface CandidateRoomListProps {
  rooms: CandidateRoom[];
  onRoomClick?: (roomId: string) => void;
  className?: string;
  selectedRoomId?: string | null;
}

export function CandidateRoomList({
  rooms,
  onRoomClick,
  className,
  selectedRoomId,
}: CandidateRoomListProps) {
  return (
    <div className={cn('flex flex-col w-full h-full', className)}>
      <div className='relative flex flex-col h-full'>
        <div className='absolute right-[-0.5px] top-0 bottom-0 border-r border-[#efefef] pointer-events-none' />

        <div className='flex-1 flex flex-col overflow-y-auto min-h-0'>
          {rooms.map((room, index) => (
            <CandidateRoomItem
              key={room.id}
              room={room}
              onClick={onRoomClick}
              className={index === rooms.length - 1 ? 'mb-6' : ''}
              selected={selectedRoomId === room.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface CandidateRoomItemProps {
  room: CandidateRoom;
  onClick?: (roomId: string) => void;
  className?: string;
  selected?: boolean;
}

function CandidateRoomItem({
  room,
  onClick,
  className,
  selected = false,
}: CandidateRoomItemProps) {
  const handleClick = () => {
    onClick?.(room.id);
  };

  return (
    <div
      className={cn(
        'flex flex-col p-4 border-b border-[#efefef] cursor-pointer hover:bg-gray-50 transition-colors',
        selected && 'bg-[#f0f9ff]',
        className
      )}
      onClick={handleClick}
    >
      {/* ヘッダー部分：企業名と時間 */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          {/* 企業アイコン（仮） */}
          <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0'>
            企業
          </div>
          <div className='flex flex-col'>
            <span className='font-["Noto_Sans_JP"] font-bold text-[16px] text-[#323232] tracking-[0.1em] leading-[1.6]'>
              {room.companyName}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {room.lastMessageTime && (
            <span className='font-["Noto_Sans_JP"] font-medium text-[12px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
              {room.lastMessageTime}
            </span>
          )}
          <StatusIndicator isUnread={room.unreadCount > 0} />
        </div>
      </div>

      {/* 求人タイトル */}
      <div className='mb-2'>
        <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#666666] tracking-[0.1em] leading-[1.6]'>
          {room.jobTitle}
        </span>
      </div>

      {/* 最新メッセージプレビュー */}
      {room.lastMessage && (
        <div className='text-ellipsis overflow-hidden whitespace-nowrap'>
          <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
            {room.lastMessage}
          </span>
        </div>
      )}
    </div>
  );
}