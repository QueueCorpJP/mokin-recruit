import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      console.error('Error fetching messages:', error);
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
      console.error('Error sending message:', error);
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
      console.error('Error marking message as read:', error);
      throw error;
    }
  },
};

export const useMessages = (userId?: string, userType?: string) => {
  const queryClient = useQueryClient();
  const { setMessages, setLoading, setError } = useMessageStore();

  // メッセージ一覧取得
  const messagesQuery = useQuery({
    queryKey: ['messages', userId, userType],
    queryFn: () => messageAPI.getMessages(userId, userType),
    enabled: !!(userId && userType), // userIdとuserTypeがある場合のみクエリを実行
  });

  // React Queryの状態変更時にストアを更新
  React.useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
    setLoading(messagesQuery.isLoading);
    if (messagesQuery.error) {
      setError(messagesQuery.error instanceof Error ? messagesQuery.error.message : 'メッセージの取得に失敗しました');
    } else {
      setError(null);
    }
  }, [messagesQuery.data, messagesQuery.isLoading, messagesQuery.error, setMessages, setLoading, setError]);

  // メッセージ送信
  const sendMessageMutation = useMutation({
    mutationFn: messageAPI.sendMessage,
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', userId, userType], (oldData: Message[] | undefined) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });
      // ストアも更新
      useMessageStore.getState().addMessage(newMessage);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'メッセージの送信に失敗しました');
    },
  });

  // メッセージ既読マーク
  const markAsReadMutation = useMutation({
    mutationFn: ({ messageId, userId, userType }: { messageId: string; userId: string; userType: string }) =>
      messageAPI.markAsRead(messageId, userId, userType),
    onSuccess: (_, { messageId }) => {
      queryClient.setQueryData(['messages', userId, userType], (oldData: Message[] | undefined) => {
        return oldData?.map(msg => 
          msg.id === messageId ? { ...msg, isUnread: false } : msg
        );
      });
      // ストアも更新
      useMessageStore.getState().markAsRead(messageId);
    },
  });

  return {
    // データ
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    
    // 操作
    sendMessage: sendMessageMutation.mutate,
    markAsRead: (messageId: string) => 
      markAsReadMutation.mutate({ messageId, userId: userId!, userType: userType! }),
    refetch: messagesQuery.refetch,
    
    // 状態
    isSending: sendMessageMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
};