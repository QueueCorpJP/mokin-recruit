'use client';
import React, { useState } from 'react';
import { MessageListItem } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';

interface Props {
  messages: MessageListItem[];
}

const statusMap: Record<string, string> = {
  SENT: '書類提出',
  READ: '書類確認済み',
  RESPONDED: '面接調整中',
  REJECTED: '不採用',
};

export default function MessageClient({ messages }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 検索・ソート・ページネーションロジック
  const filtered = messages.filter(
    m =>
      (m.company_groups?.company_accounts?.company_name || '').includes(
        searchTerm
      ) ||
      (m.rooms?.candidates
        ? m.rooms.candidates.last_name + m.rooms.candidates.first_name
        : ''
      ).includes(searchTerm) ||
      (m.rooms?.job_postings?.title || '').includes(searchTerm)
  );
  // ソートロジック（sortDirectionは未使用のため省略）
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    { key: 'sent_at', label: '日付', sortable: true, width: 'w-[180px]' },
    {
      key: 'company_accounts',
      label: '企業名',
      sortable: true,
      width: 'w-[200px]',
    },
    {
      key: 'company_groups',
      label: '企業グループ',
      sortable: true,
      width: 'w-[150px]',
    },
    {
      key: 'candidates',
      label: '候補者名',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'status', label: '選考状況', sortable: true, width: 'w-[120px]' },
    {
      key: 'job_postings',
      label: '求人ページ',
      sortable: false,
      width: 'w-[250px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='企業名・候補者名・求人タイトルで検索'
          onSearch={() => {}}
        />
        <div className='flex gap-3'>
          <AdminButton href='/admin/message/confirm' text='要確認メッセージ' />
          <AdminButton href='/admin/message/ngword' text='NGワード設定' />
        </div>
      </div>
      <div className='bg-white rounded-lg'>
        <MediaTableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={null}
          onSort={setSortColumn}
        />
        <div className='mt-2 space-y-2'>
          {paginated.map(m => (
            <AdminTableRow
              key={m.id}
              columns={[
                {
                  content: (
                    <div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {m.sent_at
                          ? new Date(m.sent_at).toLocaleDateString('ja-JP')
                          : ''}
                      </div>
                    </div>
                  ),
                  width: 'w-[180px]',
                },
                {
                  content:
                    m.company_groups?.company_accounts?.company_name || '不明',
                  width: 'w-[200px]',
                },
                {
                  content: m.company_groups?.group_name || '不明',
                  width: 'w-[150px]',
                },
                {
                  content: m.rooms?.candidates
                    ? `${m.rooms.candidates.last_name}${m.rooms.candidates.first_name}`
                    : '不明',
                  width: 'w-[150px]',
                },
                {
                  content: (
                    <span
                      className={`px-3 py-1 rounded-full text-[14px] font-bold bg-gray-500 text-white`}
                    >
                      {statusMap[m.application?.status ?? ''] ?? '不明'}
                    </span>
                  ),
                  width: 'w-[120px]',
                },
                {
                  content: m.rooms?.job_postings?.title || '不明',
                  width: 'w-[250px]',
                },
              ]}
            />
          ))}
        </div>
      </div>
      <div className='flex justify-center mt-8'>
        <PaginationButtons
          onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          previousDisabled={currentPage === 1}
          nextDisabled={currentPage === totalPages || totalPages === 0}
        />
      </div>
    </div>
  );
}
