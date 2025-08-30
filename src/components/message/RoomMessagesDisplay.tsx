'use client';

import React from 'react';
import { MessageDetailBody } from './MessageDetailBody';

interface RoomMessage {
  id: string;
  senderType: 'CANDIDATE' | 'COMPANY_USER';
  senderName: string;
  subject: any;
  content: string;
  createdAt: string;
}

interface RoomMessagesDisplayProps {
  messages: RoomMessage[];
  isMobile?: boolean;
}

export function RoomMessagesDisplay({ messages, isMobile = false }: RoomMessagesDisplayProps) {
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
            className={`flex w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2 ${
              index > 0 ? 'mt-6' : ''
            } ${isCompany ? 'justify-end' : 'justify-start'}`}
          >
            {!isCompany && !isMobile && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                40×40
              </div>
            )}
            
            <div
              className={`flex flex-col ${isCompany ? 'items-end' : 'items-start'}`}
              style={{ 
                maxWidth: isMobile ? '80%' : '70%',
                minWidth: '200px'
              }}
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
              
              <div className={`rounded-[5px] w-fit ${isCompany ? 'bg-white' : 'bg-[#D2F1DA]'}`} style={{padding: '8px 16px 16px 16px'}}>
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