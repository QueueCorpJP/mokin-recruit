import React from 'react';
import { getRoomMessages } from '@/lib/actions';
import { RoomMessagesDisplay } from './RoomMessagesDisplay';

interface RoomMessagesServerProps {
  roomId: string;
  currentUserId?: string;
  currentUserType?: string;
  isMobile?: boolean;
}

export async function RoomMessagesServer({ 
  roomId, 
  currentUserId,
  currentUserType,
  isMobile = false 
}: RoomMessagesServerProps) {
  if (!roomId) {
    return (
      <RoomMessagesDisplay messages={[]} isMobile={isMobile} />
    );
  }

  try {
    const messages = await getRoomMessages(roomId, currentUserId, currentUserType);
    
    return (
      <RoomMessagesDisplay messages={messages} isMobile={isMobile} />
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching room messages:', error);
    return (
      <RoomMessagesDisplay messages={[]} isMobile={isMobile} />
    );
  }
}