'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageListItem } from './page';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';

interface Props {
  messages: MessageListItem[];
}

const statusMap: Record<string, string> = {
  SENT: '書類提出',
  READ: '書類確認済み',
  RESPONDED: '面接調整中',
  REJECTED: '不採用',
};

export default function PendingMessageClient({ messages }: Props) {
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
      case 'sent_at':
        aValue = a.sent_at || '';
        bValue = b.sent_at || '';
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
        aValue = a.rooms?.candidates 
          ? `${a.rooms.candidates.last_name}${a.rooms.candidates.first_name}`
          : '';
        bValue = b.rooms?.candidates 
          ? `${b.rooms.candidates.last_name}${b.rooms.candidates.first_name}`
          : '';
        break;
      case 'status':
        aValue = statusMap[a.application?.status ?? ''] || '';
        bValue = statusMap[b.application?.status ?? ''] || '';
        break;
      case 'ng_keywords':
        aValue = (a.detected_ng_keywords || []).join(', ');
        bValue = (b.detected_ng_keywords || []).join(', ');
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
    { key: 'sent_at', label: '日付', sortable: true, width: 'w-[180px]' },
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
    { key: 'ng_keywords', label: 'NGキーワード', sortable: true, width: 'w-[200px]' },
    {
      key: 'job_postings',
      label: 'メッセージ',
      sortable: false,
      width: 'w-[250px]',
    },
  ];

  return (
    <div className='bg-white rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <div className='min-w-[1400px]'>
          <MediaTableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className='mt-2 space-y-2'>
            {paginatedMessages.map(m => (
              <AdminTableRow
                key={m.id}
                onClick={() => router.push(`/admin/message/${m.id}`)}
                columns={[
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {m.sent_at
                            ? new Date(m.sent_at).toLocaleDateString('ja-JP')
                            : ''}
                        </div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {m.sent_at
                            ? new Date(m.sent_at).toLocaleTimeString('ja-JP', {
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
                    content: m.company_groups?.company_accounts?.id || '不明',
                    width: 'w-[150px]',
                  },
                  {
                    content:
                      m.company_groups?.company_accounts?.company_name || '不明',
                    width: 'w-[200px]',
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
                    content: (
                      <div className="flex flex-wrap gap-1">
                        {(m.detected_ng_keywords || []).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded border border-red-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    ),
                    width: 'w-[200px]',
                  },
                  {
                    content: (
                      <div className="text-sm text-gray-600 truncate">
                        {m.subject && (
                          <div className="font-bold mb-1 truncate">件名: {m.subject}</div>
                        )}
                        <div className="truncate">
                          {(m as any).content || 'メッセージ内容なし'}
                        </div>
                      </div>
                    ),
                    width: 'w-[250px]',
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