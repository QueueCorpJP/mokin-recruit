'use client';
import React, { useState } from 'react';
import { RoomListItem } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { SelectInput } from '@/components/ui/select-input';
import MessageListClient from './MessageListClient';

interface Props {
  messages: RoomListItem[];
}

const statusMap: Record<string, string> = {
  SENT: '書類提出',
  READ: '書類確認済み',
  RESPONDED: '面接調整中',
  REJECTED: '不採用',
};

export default function MessageClient({ messages }: Props) {
  const [searchCategory, setSearchCategory] = useState<string>('候補者名');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const searchCategoryOptions = [
    { value: '候補者名', label: '候補者名' },
    { value: '企業ID', label: '企業ID' },
    { value: '企業名', label: '企業名' },
    { value: '選考状況', label: '選考状況' },
    { value: '求人タイトル', label: '求人タイトル' }
  ];

  // 検索フィルタリング
  const filteredMessages = messages.filter(room => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      switch (searchCategory) {
        case '候補者名':
          const candidateName = room.candidates
            ? `${room.candidates.last_name}${room.candidates.first_name}`
            : '';
          return candidateName.toLowerCase().includes(searchLower);
        case '企業ID':
          return (room.company_groups?.company_accounts?.id || '').toLowerCase().includes(searchLower);
        case '企業名':
          return (room.company_groups?.company_accounts?.company_name || '').toLowerCase().includes(searchLower);
        case '選考状況':
          const statusText = statusMap[room.application?.status ?? ''] || '';
          return statusText.toLowerCase().includes(searchLower);
        case '求人タイトル':
          return (room.job_postings?.title || '').toLowerCase().includes(searchLower);
        default:
          return false;
      }
    }
    return true;
  });

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex flex-wrap items-center gap-4 max-w-full'>
        <div className='flex gap-2 items-center flex-shrink-0'>
          <SelectInput
            options={searchCategoryOptions}
            value={searchCategory}
            onChange={setSearchCategory}
            className="h-10 w-[150px]"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 2,
              letterSpacing: '1.6px'
            }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder='候補者名・企業ID・企業名・選考状況で検索'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid h-10 w-[300px]"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 2,
                letterSpacing: '1.6px',
                color: '#999999'
              }}
            />
            <button 
              className="bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-[32px] whitespace-nowrap"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: '1.4px',
                color: '#ffffff'
              }}
            >
              検索
            </button>
          </div>
        </div>
       
      </div>
      
      <MessageListClient messages={filteredMessages} />
    </div>
  );
}
