import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useMessageStore } from '@/stores/messageStore';
import { useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/components/message/MessageList';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'placeholder-url',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export const useRealTimeMessages = (userId: string, userType: string) => {
  const { addMessage, updateMessage } = useMessageStore();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !userType) return;

    // リアルタイムチャンネルの設定
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;
          console.log('New message received:', newMessage);
          
          // ユーザーが参加しているルームのメッセージかチェック
          const { data: participantData } = await supabase
            .from('room_participants')
            .select('room_id')
            .eq(
              userType === 'candidate' ? 'candidate_id' : 'company_user_id',
              userId
            )
            .eq('participant_type', userType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER');

          const userRoomIds = participantData?.map(p => p.room_id) || [];
          
          if (userRoomIds.includes(newMessage.room_id)) {
            // メッセージの詳細情報を取得
            const { data: messageDetail } = await supabase
              .from('messages')
              .select(`
                id,
                room_id,
                sender_type,
                sender_candidate_id,
                sender_company_user_id,
                subject,
                content,
                status,
                created_at,
                candidates:sender_candidate_id (
                  first_name,
                  last_name,
                  email
                ),
                company_users:sender_company_user_id (
                  full_name,
                  email
                ),
                rooms:room_id (
                  job_postings:related_job_posting_id (
                    title,
                    company_groups:company_group_id (
                      group_name,
                      company_accounts:company_account_id (
                        company_name
                      )
                    )
                  )
                )
              `)
              .eq('id', newMessage.id)
              .single();

            if (messageDetail) {
              const msg = messageDetail;
              const senderName = msg.sender_type === 'CANDIDATE' 
                ? (msg.candidates ? `${msg.candidates.first_name} ${msg.candidates.last_name}` : '候補者')
                : msg.company_users?.full_name || '企業担当者';

              const formattedMessage: Message = {
                id: String(msg.id),
                roomId: String(msg.room_id),
                timestamp: String(new Date(msg.created_at).toLocaleString('ja-JP')),
                isUnread: Boolean(msg.status !== 'READ'),
                companyName: String(msg.rooms?.job_postings?.company_groups?.company_accounts?.company_name || '企業名'),
                candidateName: String(msg.sender_type === 'CANDIDATE' ? senderName : '候補者名'),
                messagePreview: String(msg.content || msg.subject || 'メッセージ'),
                groupName: String(msg.rooms?.job_postings?.company_groups?.group_name || 'グループ'),
                jobTitle: String(msg.rooms?.job_postings?.title || '求人タイトル'),
              };
              
              addMessage(formattedMessage);
              
              // React Queryキャッシュも更新
              queryClient.setQueryData(['messages', userId, userType], (oldData: Message[] | undefined) => {
                return oldData ? [...oldData, formattedMessage] : [formattedMessage];
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const updatedMessage = payload.new as any;
          console.log('Message updated:', updatedMessage);
          
          // ユーザーが参加しているルームのメッセージかチェック
          const { data: participantData } = await supabase
            .from('room_participants')
            .select('room_id')
            .eq(
              userType === 'candidate' ? 'candidate_id' : 'company_user_id',
              userId
            )
            .eq('participant_type', userType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER');

          const userRoomIds = participantData?.map(p => p.room_id) || [];
          
          if (userRoomIds.includes(updatedMessage.room_id)) {
            updateMessage(updatedMessage.id, {
              isUnread: updatedMessage.status !== 'READ',
            });
            
            // React Queryキャッシュも更新
            queryClient.setQueryData(['messages', userId, userType], (oldData: Message[] | undefined) => {
              return oldData?.map(msg => 
                msg.id === updatedMessage.id 
                  ? { ...msg, isUnread: updatedMessage.status !== 'READ' }
                  : msg
              );
            });
          }
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
  }, [userId, userType, addMessage, updateMessage, queryClient]);

  // メッセージ送信（リアルタイム通信も含む）
  const sendRealTimeMessage = async (content: string, roomId: string) => {
    try {
      // サーバーアクション経由で送信
      const { sendMessage } = await import('@/lib/actions');
      
      const senderType = userType === 'candidate' ? 'candidate' : 'company';
      const result = await sendMessage(roomId, content, senderType, userId);

      if (!result.success) {
        throw new Error(result.error || 'メッセージの送信に失敗しました');
      }

      return result.message;
    } catch (error) {
      console.error('Error sending real-time message:', error);
      throw error;
    }
  };

  return {
    sendRealTimeMessage,
  };
};