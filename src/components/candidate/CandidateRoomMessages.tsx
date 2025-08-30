'use client';

import React, { useState, useEffect } from 'react';
import { getCandidateRoomMessages } from '@/lib/candidate-message';
import { CandidateMessage } from '@/types/candidate-message';
import { MessageDetailBody } from '@/components/message/MessageDetailBody';
import { MessageLoading } from '@/components/ui/Loading';

interface CandidateRoomMessagesProps {
  roomId: string;
  candidateId: string;
  isMobile?: boolean;
}

export function CandidateRoomMessages({ 
  roomId, 
  candidateId, 
  isMobile = false 
}: CandidateRoomMessagesProps) {
  const [messages, setMessages] = useState<CandidateMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const roomMessages = await getCandidateRoomMessages(roomId, candidateId);
        setMessages(roomMessages);
      } catch (error) {
        console.error('Failed to fetch candidate messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (roomId && candidateId) {
      fetchMessages();
    }
  }, [roomId, candidateId]);

  // メッセージが送信された後に再読み込みする関数
  const refreshMessages = async () => {
    const roomMessages = await getCandidateRoomMessages(roomId, candidateId);
    setMessages(roomMessages);
  };

  if (loading) {
    return (
      <MessageDetailBody>
        <MessageLoading />
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
        // 色分けロジック：候補者の場合
        // - 自分のメッセージ（候補者）: 淡い緑背景 bg-[#D2F1DA]
        // - 相手のメッセージ（企業）: 白背景 bg-white
        const isOwnMessage = message.isOwnMessage;
        
        return (
          <div 
            key={message.id} 
            className={`flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2 ${
              index > 0 ? 'mt-6' : ''
            }`}
          >
            {/* 左側のアバター：相手（企業）のメッセージの時のみ表示 */}
            {!isOwnMessage && !isMobile && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                企業
              </div>
            )}
            
            <div
              className='flex-1'
              style={{ 
                maxWidth: isMobile 
                  ? '100%' 
                  : isOwnMessage 
                    ? 'calc(100% - 56px)' // 自分のメッセージは右寄せのため
                    : '100%' 
              }}
            >
              <div className='flex flex-row items-center w-full mb-2'>
                {isMobile ? (
                  <>
                    <div className='flex flex-row items-center gap-2 flex-grow'>
                      {!isOwnMessage && (
                        <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mr-2'>
                          企業
                        </div>
                      )}
                      <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                        {message.senderName}
                      </span>
                    </div>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] ml-auto'>
                      {message.createdAt}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] flex-1'>
                      {message.senderName}
                    </span>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] text-right'>
                      {message.createdAt}
                    </span>
                  </>
                )}
              </div>
              
              {/* メッセージボックス：既存のデザインを完全保持、色分けのみ変更 */}
              <div className={`rounded-[5px] p-4 ${
                isOwnMessage 
                  ? 'bg-[#D2F1DA]' // 自分（候補者）のメッセージ：淡い緑背景
                  : 'bg-white'     // 相手（企業）のメッセージ：白背景
              }`}>
                {/* メッセージ本文 */}
                <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line max-w-full overflow-hidden'>
                  {message.content}
                </div>
              </div>
            </div>
            
            {/* 右側のアバター：自分（候補者）のメッセージの時のみ表示 */}
            {isOwnMessage && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                自分
              </div>
            )}
          </div>
        );
      })}
    </MessageDetailBody>
  );
}