'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageList, type Message } from './MessageList';
import { EmptyMessageState } from './EmptyMessageState';

export interface MessageLayoutProps {
  className?: string;
}

export function MessageLayout({ className }: MessageLayoutProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    console.log('選択されたメッセージID:', messageId);
    // 実際にはここでメッセージ詳細を表示する処理を実装
  };



  return (
    <div className={cn('flex h-full bg-white overflow-hidden', className)}>
      {/* 左ペイン: メッセージ一覧（固定幅） */}
      <div className="w-[445px] flex-shrink-0 border-r border-[#efefef]">
        <MessageList onMessageClick={handleMessageClick} />
      </div>

      {/* 右ペイン: メッセージ詳細または空の状態（優先幅） */}
      <div className="flex-1 min-w-0">
        {selectedMessageId ? (
          // TODO: 選択されたメッセージの詳細表示コンポーネント
          <div className="h-full flex items-center justify-center bg-[#f9f9f9]">
            <div className="text-[#323232] font-['Noto_Sans_JP'] font-medium">
              メッセージ詳細画面（未実装）
              <br />
              選択されたID: {selectedMessageId}
            </div>
          </div>
        ) : (
          <EmptyMessageState />
        )}
      </div>
    </div>
  );
} 