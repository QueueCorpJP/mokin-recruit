'use client';

import React from 'react';
import { ChatMessage } from '@/types/message';
import { MessageDetailBody } from './MessageDetailBody';

interface MessageDetailContentProps {
  messages: ChatMessage[];
  isCandidatePage?: boolean;
  candidateId?: string;
  candidateName?: string; // 候補者の名前を追加
  companyName?: string;
  isMobile?: boolean;
}

export function MessageDetailContent({
  messages,
  isCandidatePage,
  candidateId,
  candidateName,
  companyName,
  isMobile = false,
}: MessageDetailContentProps) {
  console.log('MessageDetailContent received messages:', messages);
  console.log('Messages count:', messages.length);
  
  if (messages.length === 0) {
    return (
      <MessageDetailBody>
        <div className="p-4 text-center text-gray-500">
          メッセージがありません
        </div>
      </MessageDetailBody>
    );
  }

  return (
    <MessageDetailBody>
      {messages.map((message) => {
        const isMyMessage = isCandidatePage 
          ? message.sender_type === 'CANDIDATE' 
          : message.sender_type === 'COMPANY_USER';
        
        // メッセージごとの企業名を取得
        const messageCompanyName = message.sender_company_group?.company_account?.company_name || companyName || '企業名';
        const messageCandidateName = message.sender_candidate 
          ? `${message.sender_candidate.last_name} ${message.sender_candidate.first_name}`.trim()
          : candidateName || '候補者';
        
        const messageTime = message.sent_at 
          ? new Date(message.sent_at).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          : new Date().toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });

        return (
          <div key={message.id} className='flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2'>
            {/* 相手のメッセージの場合、左端に円形アイコン */}
            {!isMyMessage && !isMobile && (
              <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                40×40
              </div>
            )}
            
            <div
              className='flex-1'
              style={{
                maxWidth: isMobile ? '100%' : 'calc(100% - 56px)',
              }}
            >
              <div className='flex flex-row items-center w-full mb-2'>
                {isMobile && !isMyMessage ? (
                  <>
                    <div className='flex flex-row items-center gap-2 flex-grow'>
                      <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mr-2'>
                        40×40
                      </div>
                      <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                        {messageCompanyName}
                      </span>
                    </div>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] ml-auto'>
                      {messageTime}
                    </span>
                  </>
                ) : (
                  <>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] flex-1'>
                      {isMyMessage ? messageCandidateName : messageCompanyName}
                    </span>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] text-right'>
                      {messageTime}
                    </span>
                  </>
                )}
              </div>
              
              {/* メッセージ本体 - 自分は白、相手は緑 */}
              <div className={isMyMessage ? 'bg-white rounded-[5px] p-4' : 'bg-[#F0F9F3] rounded-[5px] p-4'}>
                {/* 件名がある場合は表示 */}
                {message.subject && (
                  <>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[18px] text-[#323232] tracking-[0.1em] leading-[1.6] block max-w-full overflow-hidden'>
                      {message.subject}
                    </span>
                    <div style={{ marginTop: 8, width: '100%', height: 1, background: '#999999' }} />
                  </>
                )}
                
                {/* メッセージ内容 */}
                <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line max-w-full overflow-hidden mt-2'>
                  {message.content}
                </div>
                
                {/* 添付ファイルがある場合は表示 */}
                {message.file_urls && message.file_urls.length > 0 && (
                  <>
                    <div style={{ marginTop: 8, width: '100%', height: 1, background: '#999999' }} />
                    {message.file_urls.map((fileUrl, index) => {
                      // URLからファイル名を抽出
                      const fileName = fileUrl.split('/').pop()?.split('_').slice(1).join('_') || 'ファイル';
                      
                      return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 8, width: '100%' }}>
                          <img
                            src={isCandidatePage ? (isMyMessage ? '/images/Union.svg' : '/images/Unionwhite.svg') : '/images/Unionblue.svg'}
                            alt='File Icon'
                            width={16}
                            height={16}
                            style={{ flexShrink: 0 }}
                          />
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginLeft: 8,
                              fontWeight: 'bold',
                              fontSize: 14,
                              color: isCandidatePage ? (isMyMessage ? '#0F9058' : '#999999') : '#29A8B9',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'inline-block',
                              maxWidth: 'calc(100% - 24px)',
                              textDecoration: 'underline',
                              textDecorationColor: isCandidatePage ? (isMyMessage ? '#0F9058' : '#999999') : '#29A8B9',
                            }}
                          >
                            {fileName}
                          </a>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            
            {/* 自分のメッセージの場合、右端に円形アイコン */}
            {isMyMessage && !isMobile && (
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