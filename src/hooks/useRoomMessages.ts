'use client';

import { useState, useEffect } from 'react';
import type { Message } from '@/components/message/MessageList';

export function useRoomMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/message/rooms/${roomId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }

        const data = await response.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error fetching room messages:', err);
        setError(err instanceof Error ? err.message : 'メッセージの取得に失敗しました');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  return { messages, loading, error, refetch: () => {
    if (roomId) {
      // Re-trigger the effect
      setMessages([]);
    }
  }};
}