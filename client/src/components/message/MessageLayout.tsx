'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageList, type Message } from './MessageList';
import { EmptyMessageState } from './EmptyMessageState';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageDetailHeader } from './MessageDetailHeader';
import { MessageDetailBody } from './MessageDetailBody';
import PaperclipIcon from '@/components/svg/PaperclipIcon'; // 添付アイコン用（なければ後で新規作成）
import { MessageInputBox } from './MessageInputBox';

export interface MessageLayoutProps {
  className?: string;
  messages?: import('./MessageList').Message[];
}

export function MessageLayout({ className, messages }: MessageLayoutProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  // フィルタ状態をここで管理
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    console.log('選択されたメッセージID:', messageId);
    // 実際にはここでメッセージ詳細を表示する処理を実装
  };

  // フィルタ処理
  const filteredMessages = (messages || []).filter(message => {
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

  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      {/* 左ペイン: メッセージ一覧（固定幅） */}
      <div className='w-[445px] flex-shrink-0 border-r border-[#efefef] flex flex-col'>
        {/* フィルターUIを最上部に配置 */}
        <MessageSearchFilter
          statusValue={statusFilter}
          groupValue={groupFilter}
          keywordValue={keyword}
          onStatusChange={setStatusFilter}
          onGroupChange={setGroupFilter}
          onKeywordChange={setKeyword}
          onSearch={() => {}}
        />
        <div className='flex-1 min-h-0'>
          <MessageList
            messages={filteredMessages}
            onMessageClick={handleMessageClick}
          />
        </div>
      </div>

      {/* 右ペイン: メッセージ詳細または空の状態（優先幅） */}
      <div className='flex-1 min-w-0'>
        {selectedMessageId ? (
          <div className='h-full flex flex-col bg-[#f9f9f9]'>
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
            />
            <MessageDetailBody>
              {/* 企業名テキスト〜白背景ボックスまでを1つの要素でまとめる */}
              <div className='flex flex-row items-start justify-between w-full pl-12 pr-12 gap-2'>
                <div
                  className='flex-1'
                  style={{ maxWidth: 'calc(100% - 56px)' }}
                >
                  <div className='flex flex-row items-center justify-between w-full mb-2'>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                      企業名テキストt
                    </span>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                      yyyy/mm/dd hh:mm
                    </span>
                  </div>
                  <div className='bg-white border border-[#EFEFEF] rounded-[5px] p-4'>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[18px] text-[#323232] tracking-[0.1em] leading-[1.6] truncate block max-w-full overflow-hidden'>
                      スカウト件名テキストが入ります。スカウト件名テキストが入ります。スカウト件名テキストが入ります。
                    </span>
                    <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line mt-2 max-w-full overflow-hidden'>
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                    </div>
                  </div>
                </div>
                <div className='w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-xs text-[#999999] flex-shrink-0 mt-[27px]'>
                  40×40
                </div>
              </div>
              {/* 新しい要素: 左にアイコン、右に内容（ボックスはbg-[#F0F9F3]） */}
              <div className='flex flex-row items-start justify-between w-full pr-12 pl-12 gap-2'>
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
                      企業名テキストt
                    </span>
                    <span className='font-["Noto_Sans_JP"] font-medium text-[14px] text-[#999999] tracking-[0.1em] leading-[1.6]'>
                      yyyy/mm/dd hh:mm
                    </span>
                  </div>
                  <div className='bg-[#F0F9F3] border border-[#EFEFEF] rounded-[5px] p-4'>
                    <span className='font-["Noto_Sans_JP"] font-bold text-[18px] text-[#323232] tracking-[0.1em] leading-[1.6] truncate block max-w-full overflow-hidden'>
                      スカウト件名テキストが入ります。スカウト件名テキストが入ります。スカウト件名テキストが入ります。
                    </span>
                    <div className='font-["Noto_Sans_JP"] font-medium text-[16px] text-[#323232] tracking-[0.1em] leading-[2] whitespace-pre-line mt-2 max-w-full overflow-hidden'>
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                      スカウト本文テキストが入ります。スカウト本文テキストが入ります。
                    </div>
                  </div>
                </div>
              </div>
            </MessageDetailBody>
            {/* メッセージ入力欄を下部に追加 */}
            <MessageInputBox />
          </div>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
}
