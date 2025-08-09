client/src/components/message/MessageLayout.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageList, type Message } from './MessageList';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageSearchFilterCandidate } from './MessageSearchFilterCandidate';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailBody } from './MessageDetailBody';
// import PaperclipIcon from '@/components/svg/PaperclipIcon'; // 添付アイコン用（なければ後で新規作成）
import { MessageInputBox } from './MessageInputBox';

export interface MessageLayoutProps {
  className?: string;
  messages?: import('./MessageList').Message[];
  isCandidatePage?: boolean;
}

export function MessageLayout({
  className,
  messages,
  isCandidatePage,
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

  // フィルタ処理
  const filteredMessages = (messages || []).filter(message => {
    if (isCandidatePage) {
      if (companyFilter !== 'all' && message.companyName !== companyFilter)
        return false;
      if (
        keyword &&
        !`${message.companyName} ${message.candidateName} ${message.messagePreview} ${message.jobTitle}`
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

  // モバイル: 詳細モード
  if (isMobile && isMobileDetailMode && selectedMessageId) {
    return (
      <div className={cn('flex flex-col h-full bg-[#F9F9F9]', className)}>
        {/* 戻るボタン削除済み */}
        <div className='flex-1 min-h-0 flex flex-col h-full'>
          <MessageDetailHeader
            candidateName={
              filteredMessages.find(m => m.id === selectedMessageId)
                ?.candidateName || ''
            }
            jobTitle={
              filteredMessages.find(m => m.id === selectedMessageId)
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
          </div>
          {/* 入力欄（下部固定） */}
          <MessageInputBox isCandidatePage={isCandidatePage} />
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
      {/* モバイル時は一覧のみ表示 */}
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
                filteredMessages.find(m => m.id === selectedMessageId)
                  ?.candidateName || ''
              }
              jobTitle={
                filteredMessages.find(m => m.id === selectedMessageId)
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
            </div>
            {/* 入力欄（下部固定） */}
            <MessageInputBox isCandidatePage={isCandidatePage} />
          </>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}



client/src/components/message/MessageItem.tsx

import React from 'react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './StatusIndicator';
import { MessageGroupTag } from './MessageGroupTag';

export interface MessageItemProps {
  id: string;
  timestamp: string;
  isUnread?: boolean;
  companyName: string;
  candidateName: string;
  messagePreview: string;
  groupName: string;
  jobTitle: string;
  onClick?: (id: string) => void;
  className?: string;
  isCandidatePage?: boolean;
  selected?: boolean;
}

export function MessageItem({
  id,
  timestamp,
  isUnread = false,
  companyName,
  candidateName,
  messagePreview,
  groupName,
  jobTitle,
  onClick,
  className,
  isCandidatePage = false,
  selected = false,
}: MessageItemProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={cn(
        selected ? 'bg-[#F0F9F3]' : 'bg-white',
        'px-6 py-4 border-t border-b border-[#efefef]',
        'flex flex-col gap-2 cursor-pointer',
        'hover:bg-gray-50 transition-colors duration-200',
        className
      )}
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* タイムスタンプと未読ステータス */}
      <div className='flex flex-row gap-6 items-center w-full'>
        <div className="flex-1 font-['Noto_Sans_JP'] font-medium text-[14px] text-[#999999] tracking-[1.4px] leading-[1.6]">
          {timestamp}
        </div>
        <StatusIndicator isUnread={isUnread} />
      </div>

      {/* candidate用: 画像＋テキスト横並び */}
      {isCandidatePage ? (
        <div className='flex flex-row items-center gap-4 w-full'>
          {/* 画像用ダミーdiv（円形） */}
          <div
            style={{
              width: 78,
              height: 78,
              background: '#e0e0e0',
              borderRadius: '50%',
            }}
            className='flex-shrink-0 flex items-center justify-center'
          >
            {/* ここに画像やアイコンを将来的に挿入 */}
            <span className='text-[#999] text-xs'>画像</span>
          </div>
          {/* テキスト部分 */}
          <div className='flex flex-col justify-center min-w-0'>
            <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[1.4px] leading-[1.6] truncate">
              {companyName}
            </div>
            <div
              className="font-['Noto_Sans_JP'] font-medium text-[14px] text-[#323232] tracking-[1.4px] leading-[1.6]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }}
            >
              {messagePreview}
            </div>
          </div>
        </div>
      ) : (
        // 従来のレイアウト
        <div className='flex flex-col gap-0 w-full'>
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[1.4px] leading-[1.6] truncate">
            {companyName}
          </div>
          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#0f9058] tracking-[1.6px] leading-[2]">
            {candidateName}
          </div>
        </div>
      )}

      {/* メッセージプレビュー（candidate用は非表示） */}
      {!isCandidatePage && (
        <div
          className={cn(
            'font-["Noto_Sans_JP"] font-medium text-[14px] text-[#323232]',
            'tracking-[1.4px] leading-[1.6] h-[38px]',
            'overflow-hidden text-ellipsis whitespace-nowrap',
            'flex items-center'
          )}
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {messagePreview}
        </div>
      )}

      {/* グループタグとジョブタイトル */}
      <div className='flex flex-row gap-2 items-center w-full min-w-0'>
        {!isCandidatePage && <MessageGroupTag>{groupName}</MessageGroupTag>}
        <div
          className={cn(
            'flex-1 font-["Noto_Sans_JP"] font-medium text-[14px] text-[#0f9058]',
            'tracking-[1.4px] leading-[1.6]',
            'overflow-hidden text-ellipsis whitespace-nowrap'
          )}
        >
          {jobTitle}
        </div>
      </div>
    </div>
  );
}