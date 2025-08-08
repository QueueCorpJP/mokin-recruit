'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MessageList, type Message } from './MessageList';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageSearchFilterCandidate } from './MessageSearchFilterCandidate';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailBody } from './MessageDetailBody';
import { MessageDetailContent } from './MessageDetailContent';
// import PaperclipIcon from '@/components/svg/PaperclipIcon'; // 添付アイコン用（なければ後で新規作成）
import { MessageInputBox } from './MessageInputBox';
import { ChatMessage } from '@/types/message';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
import { MessageLoading } from '@/components/ui/Loading';

export interface MessageLayoutProps {
  className?: string;
  messages?: import('./MessageList').Message[];
  isCandidatePage?: boolean;
  candidateId?: string;
  candidateName?: string;
}

export function MessageLayout({
  className,
  messages,
  isCandidatePage,
  candidateId,
  candidateName,
}: MessageLayoutProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  // フィルタ状態をここで管理
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  // candidate用フィルターstate
  const [companyFilter, setCompanyFilter] = useState('all');
  // モバイル判定
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDetailMode, setIsMobileDetailMode] = useState(false);
  
  // リアルタイムメッセージ機能
  const { messages: chatMessages, isLoading, sendRealTimeMessage } = useRealTimeMessages(
    selectedMessageId,
    candidateId
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    if (isMobile) setIsMobileDetailMode(true);
  };
  const handleBack = () => {
    setIsMobileDetailMode(false);
    setSelectedMessageId(null);
  };

  // メッセージ送信処理
  const handleSendMessage = async (content: string, fileUrls?: string[]) => {
    if (!selectedMessageId) return;
    
    try {
      await sendRealTimeMessage(content, undefined, fileUrls);
    } catch (error) {
      console.error('Failed to send message:', error);
      // エラーハンドリング（必要に応じてユーザーに通知）
    }
  };

  // フィルタ処理
  const filteredMessages = (messages || []).filter(message => {
    if (isCandidatePage) {
      // 特定のroomが選択されている場合
      if (companyFilter !== 'all' && message.id !== companyFilter)
        return false;
      // キーワード検索：企業名と記事タイトルで検索
      if (
        keyword &&
        !`${message.companyName} ${message.jobTitle}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
        return false;
      return true;
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'unread' && !message.isUnread) return false;
      if (statusFilter === 'read' && message.isUnread) return false;
    }
    if (groupFilter !== 'all' && message.groupName !== groupFilter)
      return false;
    if (keyword) {
      const searchText =
        `${message.companyName} ${message.candidateName} ${message.messagePreview} ${message.jobTitle}`.toLowerCase();
      if (!searchText.includes(keyword.toLowerCase())) return false;
    }
    return true;
  });

  // フィルタ後のメッセージをソート（企業名＋記事タイトルの組み合わせでソート）
  const sortedFilteredMessages = filteredMessages.sort((a, b) => {
    const aKey = `${a.companyName} - ${a.jobTitle}`;
    const bKey = `${b.companyName} - ${b.jobTitle}`;
    return aKey.localeCompare(bKey, 'ja');
  });

  // モバイル: 詳細モード
  if (isMobile && isMobileDetailMode && selectedMessageId) {
    return (
      <div className={cn('flex flex-col h-full bg-[#F9F9F9]', className)}>
        {/* 戻るボタン削除済み */}
        <div className='flex-1 min-h-0 flex flex-col h-full'>
          <MessageDetailHeader
            candidateName={
              sortedFilteredMessages.find(m => m.id === selectedMessageId)
                ?.candidateName || ''
            }
            companyName={
              sortedFilteredMessages.find(m => m.id === selectedMessageId)
                ?.companyName || ''
            }
            jobTitle={
              sortedFilteredMessages.find(m => m.id === selectedMessageId)
                ?.jobTitle || ''
            }
            onDetailClick={() => {
              // TODO: 詳細ボタンのクリック処理
            }}
            onBackClick={handleBack}
            isCandidatePage={isCandidatePage}
          />
          <div className='flex-1 overflow-y-auto scrollbar-hide'>
            {isLoading ? (
              <MessageLoading />
            ) : (() => {
              console.log('MessageLayout debug:', {
                selectedMessageId,
                chatMessagesLength: chatMessages?.length || 0,
                chatMessages: chatMessages,
                isLoading
              });
              return selectedMessageId && chatMessages && chatMessages.length > 0;
            })() ? (
              <MessageDetailContent
                messages={chatMessages}
                isCandidatePage={isCandidatePage}
                candidateId={candidateId}
                candidateName={candidateName}
                companyName={sortedFilteredMessages.find(m => m.id === selectedMessageId)?.companyName}
                isMobile={isMobile}
              />
            ) : (
            <MessageDetailBody isCandidatePage={isCandidatePage}>
              {/* 企業名テキスト〜白背景ボックスまでを1つの要素でまとめる */}
              <div className='flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2'>
                {/* ここで左端の円形だけのdiv（isMobile && ... 40×40）は削除 */}
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
                      <Image
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
                      <Image
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
                {/* 左端：円形アイコン */}
                {!isMobile && (
                  <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                    40×40
                  </div>
                )}
              </div>
              {/* 新しい要素: 左にアイコン、右に内容（ボックスはbg-[#F0F9F3]） */}
              <div className='bg-[#F9F9F9] w-full'>
                <div className='flex flex-row items-start justify-between w-full pr-0 pl-0 md:pr-12 md:pl-12 gap-2'>
                  {/* モバイル時は左端の円形アイコン＋企業名をgap-2で横並び、日付は右端 */}
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
                  {/* PC時のみ左端の円形アイコン */}
                  {!isMobile && (
                    <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                      40×40
                    </div>
                  )}
                </div>
              </div>
            </MessageDetailBody>
            )}
          </div>
          {/* 入力欄（下部固定） */}
          <MessageInputBox 
            isCandidatePage={isCandidatePage} 
            onSendMessage={handleSendMessage}
            candidateId={candidateId}
          />
        </div>
      </div>
    );
  }

  // PCまたはモバイル一覧モード: 従来通り2ペイン
  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      {/* 左ペイン: メッセージ一覧（固定幅） */}
      <div
        className='w-[445px] flex-shrink-0 border-r border-[#efefef] flex flex-col hidden md:flex'
        style={{ background: '#fff', height: '100%' }}
      >
        {/* フィルターUIを最上部に配置 */}
        {isCandidatePage ? (
          <MessageSearchFilterCandidate
            companyValue={companyFilter}
            keywordValue={keyword}
            messages={messages}
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
            messages={sortedFilteredMessages}
            onMessageClick={handleMessageClick}
            isCandidatePage={isCandidatePage}
            selectedMessageId={selectedMessageId}
          />
        </div>
      </div>
      {/* モバイル時は一覧のみ表示 */}
      {isMobile && !isMobileDetailMode && (
        <div className='flex-1 min-w-0 flex flex-col h-full md:hidden'>
          {isCandidatePage ? (
            <MessageSearchFilterCandidate
              companyValue={companyFilter}
              keywordValue={keyword}
              messages={messages}
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
              messages={filteredMessages}
              onMessageClick={handleMessageClick}
              isCandidatePage={isCandidatePage}
              selectedMessageId={selectedMessageId}
            />
          </div>
        </div>
      )}
      {/* 右ペイン: メッセージ詳細または空の状態（優先幅） */}
      <div className='flex-1 min-w-0 flex flex-col h-full hidden md:flex'>
        {selectedMessageId ? (
          <>
            <MessageDetailHeader
              candidateName={
                sortedFilteredMessages.find(m => m.id === selectedMessageId)
                  ?.candidateName || ''
              }
              companyName={
                sortedFilteredMessages.find(m => m.id === selectedMessageId)
                  ?.companyName || ''
              }
              jobTitle={
                sortedFilteredMessages.find(m => m.id === selectedMessageId)
                  ?.jobTitle || ''
              }
              onDetailClick={() => {
                // TODO: 詳細ボタンのクリック処理
              }}
              onBackClick={handleBack}
              isCandidatePage={isCandidatePage}
            />
            <div className='flex-1 overflow-y-auto scrollbar-hide'>
              {isLoading ? (
                <MessageLoading />
              ) : (() => {
                console.log('PC MessageLayout debug:', {
                  selectedMessageId,
                  chatMessagesLength: chatMessages?.length || 0,
                  chatMessages: chatMessages,
                  isLoading
                });
                return selectedMessageId && chatMessages && chatMessages.length > 0;
              })() ? (
                <MessageDetailContent
                  messages={chatMessages}
                  isCandidatePage={isCandidatePage}
                  candidateId={candidateId}
                  candidateName={candidateName}
                  companyName={sortedFilteredMessages.find(m => m.id === selectedMessageId)?.companyName}
                  isMobile={isMobile}
                />
              ) : (
              <MessageDetailBody isCandidatePage={isCandidatePage}>
                {/* 企業名テキスト〜白背景ボックスまでを1つの要素でまとめる */}
                <div className='flex flex-row items-start justify-between w-full pl-0 pr-0 md:pl-12 md:pr-12 gap-2'>
                  {/* モバイル時のみ左端に40px円形アイコン */}
                  {isMobile && (
                    <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[0px] mr-2'>
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
                      <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] flex-1'>
                        企業名テキスト
                      </span>
                      <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6] text-right'>
                        yyyy/mm/dd hh:mm
                      </span>
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
                        <Image
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
                        <Image
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
                  {/* 左端：円形アイコン */}
                  {!isMobile && (
                    <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                      40×40
                    </div>
                  )}
                </div>
                {/* 新しい要素: 左にアイコン、右に内容（ボックスはbg-[#F0F9F3]） */}
                <div className='flex flex-row items-start justify-between w-full pr-0 pl-0 md:pr-12 md:pl-12 gap-2'>
                  {/* 左端：円形アイコン */}
                  <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                    40×40
                  </div>
                  {/* 右側：企業名・日付・カラーボックス */}
                  <div
                    className='flex-1'
                    style={{ maxWidth: 'calc(100% - 56px)' }}
                  >
                    <div className='flex flex-row items-center justify-between w-full mb-2'>
                      <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                        企業名テキスト
                      </span>
                      <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                        yyyy/mm/dd hh:mm
                      </span>
                    </div>
                    <div className='bg-[#D2F1DA] rounded-[5px] p-4'>
                      <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line max-w-full overflow-hidden'>
                        スカウト本文テキストが入ります。スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                        スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                      </div>
                    </div>
                  </div>
                </div>
              </MessageDetailBody>
              )}
            </div>
            {/* 入力欄（下部固定） */}
            <MessageInputBox 
              isCandidatePage={isCandidatePage} 
              onSendMessage={handleSendMessage}
              candidateId={candidateId}
            />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}
