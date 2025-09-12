'use client';

import { useEffect } from 'react';
import { ChatMessage } from '@/types/message';
import {
  getRoomMessages,
  markRoomMessagesAsRead,
} from '@/lib/actions/messages';
import { markCandidateRoomMessagesAsRead } from '@/lib/actions';

export interface UseLoadRoomMessagesOptions {
  selectedRoomId: string | null;
  isCandidatePage: boolean;
  setRoomMessages: (messages: ChatMessage[]) => void;
  setRooms: (updater: (prev: any[]) => any[]) => void;
}

export function useLoadRoomMessages({
  selectedRoomId,
  isCandidatePage,
  setRoomMessages,
  setRooms,
}: UseLoadRoomMessagesOptions) {
  useEffect(() => {
    if (!selectedRoomId) {
      setRoomMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const messages = await getRoomMessages(selectedRoomId);
        setRoomMessages(messages);

        let markAsReadResult;
        if (isCandidatePage) {
          markAsReadResult = await markCandidateRoomMessagesAsRead(
            selectedRoomId
          );
        } else {
          markAsReadResult = await markRoomMessagesAsRead(selectedRoomId);
        }

        if (markAsReadResult.success) {
          setRooms(prevRooms =>
            prevRooms.map(room =>
              room.id === selectedRoomId
                ? { ...room, unreadCount: 0, isUnread: false }
                : room
            )
          );
        } else {
          console.warn(
            'Failed to mark messages as read:',
            markAsReadResult.error
          );
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setRoomMessages([]);
      }
    };

    loadMessages();
  }, [selectedRoomId, isCandidatePage, setRoomMessages, setRooms]);
}
