'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageSearchFilter } from './MessageSearchFilter';
import { MessageItem } from './MessageItem';

export interface Message {
  id: string;
  timestamp: string;
  isUnread?: boolean;
  companyName: string;
  candidateName: string;
  messagePreview: string;
  groupName: string;
  jobTitle: string;
}

export interface MessageListProps {
  messages?: Message[];
  onMessageClick?: (messageId: string) => void;
  className?: string;
}

// サンプルデータ
const defaultMessages: Message[] = [
  {
    id: '1',
    timestamp: '2024/01/15 14:30',
    isUnread: true,
    companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
    candidateName: '候補者名（もしくはID）テキスト',
    messagePreview: 'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTitle: '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
  },
  {
    id: '2',
    timestamp: '2024/01/15 13:45',
    isUnread: true,
    companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
    candidateName: '候補者名（もしくはID）テキスト',
    messagePreview: 'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTitle: '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
  },
  {
    id: '3',
    timestamp: '2024/01/15 12:20',
    isUnread: false,
    companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
    candidateName: '候補者名（もしくはID）テキスト',
    messagePreview: 'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
    groupName: 'グループ名テキストグループ名テキスト',
    jobTitle: '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
  },
];

export function MessageList({ 
  messages = defaultMessages, 
  onMessageClick,
  className 
}: MessageListProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    // 検索ロジックを実装
    console.log('検索実行:', { statusFilter, groupFilter, keyword });
  };

  const filteredMessages = messages.filter(message => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'unread' && !message.isUnread) return false;
      if (statusFilter === 'read' && message.isUnread) return false;
    }
    
    if (keyword) {
      const searchText = `${message.companyName} ${message.candidateName} ${message.messagePreview} ${message.jobTitle}`.toLowerCase();
      if (!searchText.includes(keyword.toLowerCase())) return false;
    }
    
    return true;
  });

  return (
    <div className={cn('flex flex-col w-full', className)}>
      {/* 右ボーダー */}
      <div className="relative">
        <div className="absolute right-[-0.5px] top-0 bottom-0 border-r border-[#efefef] pointer-events-none" />
        
        {/* 検索フィルター */}
        <MessageSearchFilter
          statusValue={statusFilter}
          groupValue={groupFilter}
          keywordValue={keyword}
          onStatusChange={setStatusFilter}
          onGroupChange={setGroupFilter}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
        />

        {/* メッセージリスト */}
        <div className="flex flex-col">
          {filteredMessages.map((message) => (
            <MessageItem
              key={message.id}
              {...message}
              onClick={onMessageClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 