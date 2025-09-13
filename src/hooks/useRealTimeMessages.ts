import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChatMessage } from '@/types/message';
import { sendMessage, getRoomMessages } from '@/lib/actions/message-actions';

export const useRealTimeMessages = (roomId: string | null, candidateId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<any>(null);

  // メッセージ状態の変化をログ
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log('Messages state changed:', messages);
  }, [messages]);

  // メッセージの初期読み込み
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        if (process.env.NODE_ENV === 'development') console.log('Loading messages for room:', roomId);
        const result = await getRoomMessages(roomId);
        if (process.env.NODE_ENV === 'development') console.log('getRoomMessages result:', result);
        if (result.messages) {
          if (process.env.NODE_ENV === 'development') console.log('Setting messages:', result.messages);
          setMessages(result.messages);
        } else if (result.error) {
          if (process.env.NODE_ENV === 'development') console.error('Error from getRoomMessages:', result.error);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [roomId]);

  // リアルタイム購読設定
  useEffect(() => {
    if (!roomId || !candidateId) return;

    const supabase = createClient();
    
    // リアルタイムチャンネルの設定
    const channel = supabase
      .channel(`messages-${roomId}`)
      .on(
        'postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (process.env.NODE_ENV === 'development') console.log('New message received:', newMessage);
          
          setMessages(prev => {
            // 重複チェック
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage;
          if (process.env.NODE_ENV === 'development') console.log('Message updated:', updatedMessage);
          
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id ? updatedMessage : msg
          ));
        }
      )
      .subscribe();

    channelRef.current = channel;

    // クリーンアップ
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId, candidateId]);

  // メッセージ送信（楽観的更新）
  const sendRealTimeMessage = async (content: string, subject?: string, fileUrls?: string[]) => {
    if (!roomId) throw new Error('Room ID is required');
    
    // 楽観的UIアップデート用の一時メッセージ
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_candidate_id: candidateId || null,
      sender_type: candidateId ? 'CANDIDATE' : 'COMPANY_USER',
      content,
      subject,
      message_type: 'GENERAL',
      file_urls: fileUrls,
      sent_at: new Date().toISOString(),
      status: 'SENT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // 楽観的更新: すぐにUIに反映
    setMessages(prev => [...prev, tempMessage]);
    
    // スクロールをトリガー（少し遅延を入れる）
    setTimeout(() => {
      const scrollableContainer = document.getElementById('message-detail-body');
      if (scrollableContainer) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }, 50);
    
    try {
      const result = await sendMessage({
        room_id: roomId,
        content,
        subject,
        message_type: 'GENERAL',
        file_urls: fileUrls,
      });

      if (result.error) {
        // エラー時は楽観的更新を元に戻す
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        throw new Error(result.error);
      }

      // 成功時は一時メッセージを実際のメッセージに置き換え
      if (result.message) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id ? result.message! : msg
        ));
      }

      return result.message;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error sending message:', error);
      // エラー時は楽観的更新を元に戻す
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    sendRealTimeMessage,
  };
};