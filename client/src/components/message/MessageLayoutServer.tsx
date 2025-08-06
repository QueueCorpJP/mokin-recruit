
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageList, type Message } from './MessageList';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageSearchFilterCandidate } from './MessageSearchFilterCandidate';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailBody } from './MessageDetailBody';
import { MessageInputBoxServer } from './MessageInputBoxServer';
import { useMessageStore } from '@/stores/messageStore';

export interface MessageLayoutServerProps {
  className?: string;
  messages: Message[];
  isCandidatePage?: boolean;
  userId?: string;
  userType?: string;
}

export function MessageLayoutServer({
  className,
  messages,
  isCandidatePage,
  userId,
  userType,
}: MessageLayoutServerProps) {
  // ストアから状態とアクションを取得
  const {
    selectedMessageId,
    setSelectedMessage,
    setMessages,
    statusFilter,
    groupFilter,
    keyword,
    companyFilter,
    setStatusFilter,
    setGroupFilter,
    setKeyword,
    setCompanyFilter,
    getFilteredMessages,
  } = useMessageStore();
  
  // サーバーから取得したメッセージをストアに初期化
  useEffect(() => {
    console.log('Setting messages in store:', messages.length, messages[0]);
    // ストアのメッセージを初期化（必要に応じて）
    setMessages(messages);
  }, [messages, setMessages]);

  // 自動選択用の別のuseEffect
  useEffect(() => {
    // 最初のメッセージを自動選択（メッセージが存在し、まだ選択されていない場合）
    if (messages.length > 0 && !selectedMessageId) {
      console.log('Auto-selecting first message:', messages[0].id);
      setSelectedMessage(messages[0].id);
    }
  }, [messages, selectedMessageId, setSelectedMessage]);
  
  // モバイル判定
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetailMode, setIsMobileDetailMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMessageClick = (messageId: string) => {
    setSelectedMessage(messageId);
    if (isMobile) setIsMobileDetailMode(true);
  };
  const handleBack = () => {
    setIsMobileDetailMode(false);
    setSelectedMessage(null);
  };

  // フィルタリングされたメッセージを取得
  const filteredMessages = getFilteredMessages(isCandidatePage);
  
  // TEMPORARY FIX: If no filtered messages, use raw messages
  const displayMessages = filteredMessages.length > 0 ? filteredMessages : messages;
  
  // 選択されたメッセージのroom_idを取得
  const selectedMessage = displayMessages.find(m => m.id === selectedMessageId);
  // メッセージが選択されていない場合は最初のメッセージのroomIdを使用
  const currentRoomId = selectedMessage?.roomId || displayMessages[0]?.roomId;
  
  // デバッグ用ログ
  console.log('MessageLayoutServer debug:', {
    selectedMessageId,
    selectedMessage,
    currentRoomId,
    filteredMessagesCount: filteredMessages.length,
    displayMessagesCount: displayMessages.length,
    firstMessage: displayMessages[0],
    isCandidatePage,
    rawMessagesCount: messages.length,
    rawFirstMessage: messages[0]
  });

  // モバイル: 詳細モード
  if (isMobile && isMobileDetailMode && selectedMessageId) {
    return (
      <div className={cn('flex flex-col h-full bg-[#F9F9F9]', className)}>
        <div className='flex-1 min-h-0 flex flex-col h-full'>
          <MessageDetailHeader
            candidateName={
              displayMessages.find(m => m.id === selectedMessageId)
                ?.candidateName || ''
            }
            jobTitle={
              displayMessages.find(m => m.id === selectedMessageId)
                ?.jobTitle || ''
            }
            onDetailClick={() => {
              // TODO: 詳細ボタンのクリック処理
            }}
            onBackClick={handleBack}
            isCandidatePage={isCandidatePage}
          />
          <div className='flex-1 overflow-y-auto'>
            <MessageDetailBody>
              {/* 企業名テキスト〜白背景ボックスまでを1つの要素でまとめる */}
              <div className='flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2'>
                <div
                  className='flex-1'
                  style={{ maxWidth: isMobile ? '100%' : 'calc(100% - 56px)' }}
                >
                  <div className='flex flex-row items-center w-full mb-2'>
                    {isMobile ? (
                      <>
                        <div className='flex flex-row items-center gap-2 flex-grow'>
                          <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mr-2'>
                            40×40
                          </div>
                          <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                            企業名テキストt
                          </span>
                        </div>
                        <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] ml-auto'>
                          yyyy/mm/dd hh:mm
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                          企業名テキストt
                        </span>
                        <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                          yyyy/mm/dd hh:mm
                        </span>
                      </>
                    )}
                  </div>
                  <div className='bg-white rounded-[5px] p-4'>
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
                      スカウト件名テキストが入ります。スカウト件名テキストが入ります。スカウト件名テキストが入ります。
                    </span>
                    <div
                      style={{
                        marginTop: 8,
                        width: '100%',
                        height: 1,
                        background: '#999999',
                      }}
                    />
                    <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line mt-2 max-w-full overflow-hidden'>
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        width: '100%',
                        height: 1,
                        background: '#999999',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 8,
                        width: '100%',
                      }}
                    >
                      <img
                        src='/images/Union.svg'
                        alt='Union Icon'
                        width={16}
                        height={16}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          marginLeft: 8,
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: '#29A8B9',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          maxWidth: 'calc(100% - 24px)',
                          textDecoration: 'underline',
                          textDecorationColor: '#29A8B9',
                        }}
                      >
                        サンプルファイル名のテキストが入ります
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 8,
                        width: '100%',
                      }}
                    >
                      <img
                        src='/images/Union.svg'
                        alt='Union Icon'
                        width={16}
                        height={16}
                        style={{ flexShrink: 0 }}
                      />
                      <span
                        style={{
                          marginLeft: 8,
                          fontWeight: 'bold',
                          fontSize: 14,
                          color: '#29A8B9',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          maxWidth: 'calc(100% - 24px)',
                          textDecoration: 'underline',
                          textDecorationColor: '#29A8B9',
                        }}
                      >
                        2つ目のサンプルファイル名のテキストが入ります
                      </span>
                    </div>
                  </div>
                </div>
                {!isMobile && (
                  <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                    40×40
                  </div>
                )}
              </div>
              <div className='bg-[#F9F9F9] w-full'>
                <div className='flex flex-row items-start justify-between w-full pr-0 pl-0 md:pr-12 md:pl-12 gap-2'>
                  <div
                    className='flex-1'
                    style={{
                      maxWidth: isMobile ? '100%' : 'calc(100% - 56px)',
                    }}
                  >
                    <div className='flex flex-row items-center w-full mb-2'>
                      {isMobile ? (
                        <>
                          <div className='flex flex-row items-center gap-2 flex-grow'>
                            <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mr-2'>
                              40×40
                            </div>
                            <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                              企業名テキストt
                            </span>
                          </div>
                          <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] ml-auto'>
                            yyyy/mm/dd hh:mm
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                            企業名テキストt
                          </span>
                          <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                            yyyy/mm/dd hh:mm
                          </span>
                        </>
                      )}
                    </div>
                    <div className='bg-[#D2F1DA] rounded-[5px] p-4'>
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
                        スカウト件名テキストが入ります。スカウト件名テキストが入ります。スカウト件名テキストが入ります。
                      </span>
                      <div
                        style={{
                          marginTop: 8,
                          width: '100%',
                          height: 1,
                          background: '#999999',
                        }}
                      />
                      <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line mt-2 max-w-full overflow-hidden'>
                        スカウト本文テキストが入ります。スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                        スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          width: '100%',
                          height: 1,
                          background: '#999999',
                        }}
                      />
                    </div>
                  </div>
                  {!isMobile && (
                    <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                      40×40
                    </div>
                  )}
                </div>
              </div>
            </MessageDetailBody>
          </div>
          <MessageInputBoxServer 
            isCandidatePage={isCandidatePage}
            userId={userId}
            userType={userType}
            roomId={currentRoomId}
          />
        </div>
      </div>
    );
  }

  // PCまたはモバイル一覧モード: 従来通り2ペイン
  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      <div
        className='w-[445px] flex-shrink-0 border-r border-[#efefef] flex flex-col hidden md:flex'
        style={{ background: '#fff', height: '100%' }}
      >
        {isCandidatePage ? (
          <MessageSearchFilterCandidate
            companyValue={companyFilter}
            keywordValue={keyword}
            onCompanyChange={setCompanyFilter}
            onKeywordChange={setKeyword}
            onSearch={() => {}}
          />
        ) : (
          <MessageSearchFilter
            statusValue={statusFilter}
            groupValue={groupFilter}
            keywordValue={keyword}
            onStatusChange={setStatusFilter}
            onGroupChange={setGroupFilter}
            onKeywordChange={setKeyword}
            onSearch={() => {}}
          />
        )}
        <div className='flex-1 min-h-0'>
          <MessageList
            messages={displayMessages}
            onMessageClick={handleMessageClick}
            isCandidatePage={isCandidatePage}
            selectedMessageId={selectedMessageId}
          />
        </div>
      </div>
      {isMobile && !isMobileDetailMode && (
        <div className='flex-1 min-w-0 flex flex-col h-full md:hidden'>
          {isCandidatePage ? (
            <MessageSearchFilterCandidate
              companyValue={companyFilter}
              keywordValue={keyword}
              onCompanyChange={setCompanyFilter}
              onKeywordChange={setKeyword}
              onSearch={() => {}}
            />
          ) : (
            <MessageSearchFilter
              statusValue={statusFilter}
              groupValue={groupFilter}
              keywordValue={keyword}
              onStatusChange={setStatusFilter}
              onGroupChange={setGroupFilter}
              onKeywordChange={setKeyword}
              onSearch={() => {}}
            />
          )}
          <div className='flex-1 min-h-0'>
            <MessageList
              messages={displayMessages}
              onMessageClick={handleMessageClick}
              isCandidatePage={isCandidatePage}
              selectedMessageId={selectedMessageId}
            />
          </div>
        </div>
      )}
      <div className='flex-1 min-w-0 flex flex-col h-full hidden md:flex'>
        {selectedMessageId ? (
          <>
            <MessageDetailHeader
              candidateName={
                displayMessages.find(m => m.id === selectedMessageId)
                  ?.candidateName || ''
              }
              jobTitle={
                displayMessages.find(m => m.id === selectedMessageId)
                  ?.jobTitle || ''
              }
              onDetailClick={() => {
                // TODO: 詳細ボタンのクリック処理
              }}
              onBackClick={handleBack}
              isCandidatePage={isCandidatePage}
            />
            <div className='flex-1 overflow-y-auto'>
              <MessageDetailBody>
                {currentRoomId && selectedMessage ? (
                  <div className="p-4">
                    <div className="mb-4 text-sm text-gray-600">
                      <div>ルーム: {currentRoomId}</div>
                      <div>選択されたメッセージ: {selectedMessage.id}</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">
                          {selectedMessage.candidateName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedMessage.timestamp}
                        </span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <p className="text-gray-800">
                          {selectedMessage.messagePreview}
                        </p>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        企業: {selectedMessage.companyName} | 
                        求人: {selectedMessage.jobTitle}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-8">
                    メッセージを選択してください
                  </div>
                )}
              </MessageDetailBody>
            </div>
            <MessageInputBoxServer 
              isCandidatePage={isCandidatePage}
              userId={userId}
              userType={userType}
              roomId={currentRoomId}
            />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}