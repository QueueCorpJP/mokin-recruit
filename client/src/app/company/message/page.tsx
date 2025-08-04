'use client';

import { useState } from 'react';
import { MessageLayout } from '@/components/message/MessageLayout';
import { Message } from '@/components/message/MessageList';

export default function MessagePage() {
  // ダミーメッセージデータ
  const dummyMessages: Message[] = [
    {
      id: '1',
      timestamp: '2024/01/15 14:30',
      isUnread: true,
      companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
      candidateName: '候補者名（もしくはID）テキスト',
      messagePreview:
        'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
      groupName: 'グループ名テキストグループ名テキスト',
      jobTitle:
        '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
    },
    {
      id: '2',
      timestamp: '2024/01/15 13:45',
      isUnread: true,
      companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
      candidateName: '候補者名（もしくはID）テキスト',
      messagePreview:
        'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
      groupName: 'グループ名テキストグループ名テキスト',
      jobTitle:
        '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
    },
    {
      id: '3',
      timestamp: '2024/01/15 12:20',
      isUnread: false,
      companyName: '現職企業名テキスト現職企業名テキスト現職企業名テキスト',
      candidateName: '候補者名（もしくはID）テキスト',
      messagePreview:
        'メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。メッセージ本文テキストが入ります。',
      groupName: 'グループ名テキストグループ名テキスト',
      jobTitle:
        '求人名タイトルテキストが入ります。求人名タイトルテキストが入ります。',
    },
  ];

  return (
    <div className='min-h-screen bg-[#f9f9f9] flex flex-col'>
      <MessageLayout messages={dummyMessages} />
    </div>
  );
}
