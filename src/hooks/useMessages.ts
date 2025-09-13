import React, { useState, useEffect, useCallback } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import type { Message } from '@/components/message/MessageList';

// API functions - 実際のAPIエンドポイントを使用
const messageAPI = {
  // メッセージ一覧取得
  getMessages: async (userId?: string, userType?: string): Promise<Message[]> => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (userType) params.append('userType', userType);
      
      const response = await fetch(`/api/messages?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // メッセージ送信
  sendMessage: async (messageData: {
    content: string;
    conversationId: string;
    senderType: string;
    senderId: string;
  }): Promise<Message> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.message;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error sending message:', error);
      throw error;
    }
  },

  // メッセージを既読にマーク
  markAsRead: async (messageId: string, userId: string, userType: string): Promise<void> => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userType }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark message as read: ${response.statusText}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error marking message as read:', error);
      throw error;
    }
  },
};

export const useMessages = (userId?: string, userType?: string) => {
  const { setMessages, setLoading, setError } = useMessageStore();
  const [messages, setMessagesState] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  // メッセージ一覧取得
  const refetch = useCallback(async () => {
    if (!userId || !userType) return;
    
    setIsLoading(true);
    setErrorState(null);
    try {
      const data = await messageAPI.getMessages(userId, userType);
      setMessagesState(data);
      setMessages(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'メッセージの取得に失敗しました';
      setErrorState(err instanceof Error ? err : new Error(errorMessage));
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [userId, userType, setMessages, setLoading, setError]);

  useEffect(() => {
    if (userId && userType) {
      refetch();
    }
  }, [refetch, userId, userType]);

  // メッセージ送信
  const sendMessage = async (messageData: {
    content: string;
    conversationId: string;
    senderType: string;
    senderId: string;
  }) => {
    setIsSending(true);
    try {
      const newMessage = await messageAPI.sendMessage(messageData);
      const updatedMessages = [...messages, newMessage];
      setMessagesState(updatedMessages);
      setMessages(updatedMessages);
      // ストアも更新
      useMessageStore.getState().addMessage(newMessage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'メッセージの送信に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // メッセージ既読マーク
  const markAsRead = async (messageId: string) => {
    if (!userId || !userType) return;
    
    setIsMarkingAsRead(true);
    try {
      await messageAPI.markAsRead(messageId, userId, userType);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, isUnread: false } : msg
      );
      setMessagesState(updatedMessages);
      setMessages(updatedMessages);
      // ストアも更新
      useMessageStore.getState().markAsRead(messageId);
    } catch (err) {
      // エラーは無視（既読マークは重要度が低い）
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  return {
    // データ
    messages,
    isLoading,
    error,
    
    // 操作
    sendMessage,
    markAsRead,
    refetch,
    
    // 状態
    isSending,
    isMarkingAsRead,
  };
};