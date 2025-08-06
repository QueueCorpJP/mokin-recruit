'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RoomItem } from './RoomItem';
import { type Room } from '@/lib/rooms';

export interface RoomListProps {
  rooms?: Room[];
  onRoomClick?: (roomId: string) => void;
  className?: string;
  isCandidatePage?: boolean;
  selectedRoomId?: string | null;
}

export function RoomList({
  rooms = [],
  onRoomClick,
  className,
  isCandidatePage = false,
  selectedRoomId,
}: RoomListProps) {
  return (
    <div className={cn('flex flex-col w-full h-full', className)}>
      <div className='relative flex flex-col h-full'>
        <div className='absolute right-[-0.5px] top-0 bottom-0 border-r border-[#efefef] pointer-events-none' />

        <div className='flex-1 flex flex-col overflow-y-auto min-h-0'>
          {rooms.map((room, index) => (
            <RoomItem
              key={room.id}
              {...room}
              onClick={onRoomClick}
              className={index === rooms.length - 1 ? 'mb-6' : ''}
              isCandidatePage={isCandidatePage}
              selected={selectedRoomId === room.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}