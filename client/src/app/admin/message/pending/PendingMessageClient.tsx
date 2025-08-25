'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoomListItem } from '../page';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';

interface Props {
  messages: RoomListItem[];
}

const statusMap: Record<string, string> = {
  SENT: '書類提出',
  READ: '書類確認済み',
  RESPONDED: '面接調整中',
  REJECTED: '不採用',
};

export default function PendingMessageClient({ messages }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
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

  // 検索フィルタリング
  const filteredMessages = messages.filter(room => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const candidateName = room.candidates
        ? `${room.candidates.last_name}${room.candidates.first_name}`
        : '';
      const companyName = room.company_groups?.company_accounts?.company_name || '';
      const messageContent = room.latest_messages?.[0]?.content || '';
      
      return candidateName.toLowerCase().includes(searchLower) ||
             companyName.toLowerCase().includes(searchLower) ||
             messageContent.toLowerCase().includes(searchLower);
    }
    return true;
  });

  // ソート処理
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string;
    let bValue: string;
    
    switch (sortColumn) {
      case 'confirmation_requested_at':
        aValue = (a as any).confirmation_requested_at || '';
        bValue = (b as any).confirmation_requested_at || '';
        break;
      case 'company_accounts':
        aValue = a.company_groups?.company_accounts?.company_name || '';
        bValue = b.company_groups?.company_accounts?.company_name || '';
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
      case 'message':
        aValue = a.latest_messages?.[0]?.content || '';
        bValue = b.latest_messages?.[0]?.content || '';
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
    { key: 'confirmation_requested_at', label: '対応確認依頼日時', sortable: true, width: 'w-[180px]' },
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
      key: 'message',
      label: 'メッセージ',
      sortable: false,
      width: 'w-[300px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* ヘッダーと検索 */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>要確認メッセージ</h1>
        <SearchBar
          placeholder="企業名・候補者名・メッセージで検索"
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {/* テーブル */}
      <div className='bg-white rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-[1050px]'>
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
                  onClick={() => {
                    const messageId = room.latest_messages[0]?.id || room.id;
                    router.push(`/admin/message/pending/${messageId}`);
                  }}
                  columns={[
                    {
                      content: (
                        <div>
                          <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                            {(room as any).confirmation_requested_at
                              ? new Date((room as any).confirmation_requested_at).toLocaleDateString('ja-JP')
                              : ''}
                          </div>
                          <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                            {(room as any).confirmation_requested_at
                              ? new Date((room as any).confirmation_requested_at).toLocaleTimeString('ja-JP', {
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
                      content: (
                        <div className="truncate max-w-[280px]">
                          {room.latest_messages?.[0]?.content || '不明'}
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
    </div>
  );
}