'use client';

import React, { useState, useEffect } from 'react';
import { MessageDetailBody } from './MessageDetailBody';
import { MessageLoading } from '@/components/ui/Loading';

interface RoomMessage {
  id: string;
  senderType: string;
  senderId: string;
  senderName: string;
  messageType: string;
  subject: string;
  content: string;
  status: string;
  sentAt: string;
  readAt?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOwnMessage: boolean;
}

interface RoomMessagesClientProps {
  roomId: string;
  isMobile?: boolean;
}

export function RoomMessagesClient({ roomId, isMobile = false }: RoomMessagesClientProps) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/message/rooms/${roomId}/messages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setMessages(data.messages || []);
        } else {
          throw new Error(data.error || 'メッセージの取得に失敗しました');
        }
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

  if (loading) {
    return (
      <MessageDetailBody>
        <MessageLoading />
      </MessageDetailBody>
    );
  }

  if (error) {
    return (
      <MessageDetailBody>
        <div className="text-center text-red-500 p-8">
          エラー: {error}
        </div>
      </MessageDetailBody>
    );
  }

  if (messages.length === 0) {
    return (
      <MessageDetailBody>
        <div className="text-center text-gray-500 p-8">
          このルームにはまだメッセージがありません
        </div>
      </MessageDetailBody>
    );
  }

  return (
    <MessageDetailBody>
      {messages.map((message, index) => {
        const isCompany = message.senderType === 'COMPANY_USER';
        
        return (
          <div 
            key={message.id} 
            className={`flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2 ${
              index > 0 ? 'mt-6' : ''
            }`}
          >
            {!isCompany && !isMobile && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                40×40
              </div>
            )}
            
            <div
              className='flex-1'
              style={{ maxWidth: isMobile ? '100%' : isCompany ? 'calc(100% - 56px)' : '100%' }}
            >
              <div className='flex flex-row items-center w-full mb-2'>
                {isMobile ? (
                  <>
                    <div className='flex flex-row items-center gap-2 flex-grow'>
                      {!isCompany && (
                        <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mr-2'>
                          40×40
                        </div>
                      )}
                      <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                        {message.senderName}
                      </span>
                    </div>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] ml-auto'>
                      {new Date(message.sentAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] flex-1'>
                      {message.senderName}
                    </span>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] text-right'>
                      {new Date(message.sentAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </>
                )}
              </div>
              
              <div className={`rounded-[5px] p-4 ${isCompany ? 'bg-white' : 'bg-[#D2F1DA]'}`}>
                {/* 件名がある場合は表示 */}
                {message.subject && (
                  <>
                    <span
                      className='font-["Noto_Sans_JP"] font-bold text-[18px] text-[#323232] tracking-[0.1em] leading-[1.6] block max-w-full overflow-hidden'
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                      }}
                    >
                      {message.subject}
                    </span>
                    <div
                      style={{
                        marginTop: 8,
                        width: '100%',
                        height: 1,
                        background: '#999999',
                      }}
                    />
                  </>
                )}
                
                {/* メッセージ本文は常に表示 */}
                <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line mt-2 max-w-full overflow-hidden'>
                  {message.content}
                </div>
              </div>
            </div>
            
            {isCompany && !isMobile && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                40×40
              </div>
            )}
          </div>
        );
      })}
    </MessageDetailBody>
  );
}