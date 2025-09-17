import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChatMessage } from '@/types/message';
import { sendMessage, getRoomMessages } from '@/lib/actions';

export const useRealTimeMessages = (
  roomId: string | null,
  candidateId?: string
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<any>(null);

  // メッセージ状態の変化をログ
  useEffect(() => {
    console.log('Messages state changed:', messages);
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
        console.log('Loading messages for room:', roomId);
        const result = await getRoomMessages(roomId);
        console.log('getRoomMessages result:', result);
        if (Array.isArray(result)) {
          // getRoomMessages from actions.ts returns an array directly
          // Convert the simple message format to ChatMessage format
          const convertedMessages: ChatMessage[] = result.map((msg: any) => ({
            id: msg.id || '',
            room_id: roomId,
            content: msg.content || '',
            sender_type: msg.senderType || 'CANDIDATE',
            receiver_type:
              msg.senderType === 'CANDIDATE' ? 'COMPANY_USER' : 'CANDIDATE',
            sender_candidate_id:
              msg.senderType === 'CANDIDATE' ? candidateId : null,
            sender_company_user_id:
              msg.senderType === 'COMPANY_USER' ? msg.senderId : null,
            message_type: 'GENERAL',
            subject: msg.subject,
            status: 'SENT',
            sent_at: msg.createdAt,
            created_at: msg.createdAt || new Date().toISOString(),
            updated_at: msg.createdAt || new Date().toISOString(),
            file_urls: [],
          }));
          console.log('Setting converted messages:', convertedMessages);
          setMessages(convertedMessages);
        } else {
          console.error('No messages returned or unexpected format');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
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
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        payload => {
          const newMessage = payload.new as ChatMessage;
          console.log('New message received:', newMessage);

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
        payload => {
          const updatedMessage = payload.new as ChatMessage;
          console.log('Message updated:', updatedMessage);

          setMessages(prev =>
            prev.map(msg =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
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
  const sendRealTimeMessage = async (
    content: string,
    subject?: string,
    fileUrls?: string[]
  ) => {
    if (!roomId) throw new Error('Room ID is required');

    // 楽観的UIアップデート用の一時メッセージ
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_candidate_id: candidateId || null,
      sender_type: candidateId ? 'CANDIDATE' : 'COMPANY_USER',
      receiver_type: candidateId ? 'COMPANY_USER' : 'CANDIDATE',
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
      const scrollableContainer = document.getElementById(
        'message-detail-body'
      );
      if (scrollableContainer) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }, 50);

    try {
      const result = await sendMessage(
        roomId,
        content,
        'candidate',
        candidateId || '',
        subject,
        fileUrls
      );

      if (result.error) {
        // エラー時は楽観的更新を元に戻す
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        throw new Error(result.error);
      }

      // 成功時は一時メッセージを実際のメッセージに置き換え
      if (result.message) {
        setMessages(prev =>
          prev.map(msg => (msg.id === tempMessage.id ? result.message! : msg))
        );
      }

      return result.message;
    } catch (error) {
      console.error('Error sending message:', error);
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
