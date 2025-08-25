'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoomListItem } from './page';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';

interface Props {
  messages: RoomListItem[];
}

const statusMap: Record<string, string> = {
  SENT: '書類提出',
  READ: '書類確認済み',
  RESPONDED: '面接調整中',
  REJECTED: '不採用',
};

export default function MessageListClient({ messages }: Props) {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn('');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // ソート処理
  const sortedMessages = [...messages].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string;
    let bValue: string;
    
    switch (sortColumn) {
      case 'updated_at':
        aValue = a.updated_at || '';
        bValue = b.updated_at || '';
        break;
      case 'company_id':
        aValue = a.company_groups?.company_accounts?.id || '';
        bValue = b.company_groups?.company_accounts?.id || '';
        break;
      case 'company_accounts':
        aValue = a.company_groups?.company_accounts?.company_name || '';
        bValue = b.company_groups?.company_accounts?.company_name || '';
        break;
      case 'company_groups':
        aValue = a.company_groups?.group_name || '';
        bValue = b.company_groups?.group_name || '';
        break;
      case 'candidates':
        aValue = a.candidates 
          ? `${a.candidates.last_name}${a.candidates.first_name}`
          : '';
        bValue = b.candidates 
          ? `${b.candidates.last_name}${b.candidates.first_name}`
          : '';
        break;
      case 'status':
        aValue = statusMap[a.application?.status ?? ''] || '';
        bValue = statusMap[b.application?.status ?? ''] || '';
        break;
      case 'job_postings':
        aValue = a.job_postings?.title || '';
        bValue = b.job_postings?.title || '';
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, 'ja');
    } else {
      return bValue.localeCompare(aValue, 'ja');
    }
  });

  // ページネーション
  const paginatedMessages = sortedMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedMessages.length / itemsPerPage);

  const columns = [
    { key: 'updated_at', label: '更新日時', sortable: true, width: 'w-[180px]' },
    { key: 'company_id', label: '企業ID', sortable: true, width: 'w-[150px]' },
    {
      key: 'company_accounts',
      label: '企業名',
      sortable: true,
      width: 'w-[200px]',
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
      width: 'w-[200px]',
    },
    {
      key: 'latest_messages',
      label: '最新メッセージ',
      sortable: false,
      width: 'w-[300px]',
    },
  ];

  return (
    <div className='bg-white rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <div className='min-w-[1500px]'>
          <MediaTableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className='mt-2 space-y-2'>
            {paginatedMessages.map(room => (
              <AdminTableRow
                key={room.id}
                onClick={() => router.push(`/admin/message/${room.latest_messages[0]?.id || room.id}`)}
                columns={[
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {room.updated_at
                            ? new Date(room.updated_at).toLocaleDateString('ja-JP')
                            : ''}
                        </div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {room.updated_at
                            ? new Date(room.updated_at).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            : ''}
                        </div>
                      </div>
                    ),
                    width: 'w-[180px]',
                  },
                  {
                    content: room.company_groups?.company_accounts?.id || '不明',
                    width: 'w-[150px]',
                  },
                  {
                    content: room.company_groups?.company_accounts?.company_name || '不明',
                    width: 'w-[200px]',
                  },
                  {
                    content: room.candidates
                      ? `${room.candidates.last_name}${room.candidates.first_name}`
                      : '不明',
                    width: 'w-[150px]',
                  },
                  {
                    content: (
                      <span
                        className={`px-3 py-1 rounded-full text-[14px] font-bold bg-gray-500 text-white`}
                      >
                        {statusMap[room.application?.status ?? ''] ?? '不明'}
                      </span>
                    ),
                    width: 'w-[120px]',
                  },
                  {
                    content: room.job_postings?.title || '不明',
                    width: 'w-[200px]',
                  },
                  {
                    content: (
                      <div className="max-h-20 overflow-y-auto">
                        {room.latest_messages.slice(0, 3).map((message, index) => (
                          <div key={message.id} className="text-xs text-gray-600 mb-1">
                            <span className="font-semibold text-gray-800">
                              {message.sender_type === 'COMPANY' ? '企業' : '候補者'}:
                            </span>
                            <span className="ml-1">
                              {message.content.length > 30 
                                ? `${message.content.substring(0, 30)}...` 
                                : message.content}
                            </span>
                            <div className="text-[10px] text-gray-400">
                              {new Date(message.sent_at).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ))}
                        {room.latest_messages.length > 3 && (
                          <div className="text-[10px] text-gray-400">
                            他{room.latest_messages.length - 3}件のメッセージ
                          </div>
                        )}
                      </div>
                    ),
                    width: 'w-[300px]',
                  },
                ]}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* ページネーション */}
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