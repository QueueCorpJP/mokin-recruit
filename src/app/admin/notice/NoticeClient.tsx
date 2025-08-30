'use client';
import { useState } from 'react';
import type { FC } from 'react';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';
export type NoticeItem = {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'PUBLISHED' | 'DRAFT';
  created_at: string;
  updated_at: string;
};

interface NoticeClientProps {
  notices: NoticeItem[];
}

const NoticeClient: FC<NoticeClientProps> = ({ notices: initialNotices }) => {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusBadge = (status: string) => {
    const statusClass =
      status === '公開中'
        ? 'bg-[#0F9058] text-white'
        : 'bg-gray-500 text-white';
    return (
      <span
        className={`inline-block px-3 py-1 rounded-[5px] font-['Inter'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] ${statusClass}`}
      >
        {status}
      </span>
    );
  };

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

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(notices.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (_: string) => {
    // 編集処理（今後実装）
  };

  const handleDelete = (noticeId: string) => {
    if (confirm('このお知らせを削除しますか？')) {
      setNotices(notices.filter(n => n.id !== noticeId));
    }
  };

  const columns = [
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    {
      key: 'datetime',
      label: '最終更新日時',
      sortable: true,
      width: 'w-[180px]',
    },
    {
      key: 'title',
      label: 'お知らせタイトル',
      sortable: true,
      width: 'flex-1',
    },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[200px]',
    },
  ];

  // ソート・検索・ページネーション処理
  let filtered = notices;
  if (searchTerm) {
    filtered = filtered.filter(n => n.title.includes(searchTerm));
  }
  let sorted = filtered;
  if (sortColumn && sortDirection) {
    sorted = [...filtered].sort((a, b) => {
      let aValue = '';
      let bValue = '';
      switch (sortColumn) {
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'datetime':
          aValue = a.updated_at;
          bValue = b.updated_at;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        default:
          return 0;
      }
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 上部の機能エリア */}
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='お知らせタイトルで検索'
          onSearch={() => {}}
        />
        <AdminButton href='/admin/notice/new' text='新規お知らせ追加' />
      </div>
      {/* テーブルコンテナ */}
      <div className=''>
        {/* テーブルヘッダー */}
        <MediaTableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        {/* お知らせ一覧 */}
        <div className='mt-2 space-y-2'>
          {paginated.map(notice => {
            const date = new Date(notice.updated_at);
            const dateStr = date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            const timeStr = date.toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            return (
              <AdminTableRow
                key={notice.id}
                columns={[
                  {
                    content: getStatusBadge(notice.status),
                    width: 'w-[120px]',
                  },
                  {
                    content: (
                      <div>
                        <div className="font-['Inter'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {dateStr}
                        </div>
                        <div className="font-['Inter'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {timeStr}
                        </div>
                      </div>
                    ),
                    width: 'w-[180px]',
                  },
                  { content: notice.title, width: 'flex-1' },
                ]}
                actions={[
                  <ActionButton
                    key='edit'
                    text='編集'
                    variant='edit'
                    onClick={() => handleEdit(notice.id)}
                  />,
                  <ActionButton
                    key='delete'
                    text='削除'
                    variant='delete'
                    onClick={() => handleDelete(notice.id)}
                  />,
                ]}
              />
            );
          })}
        </div>
      </div>
      {/* ページネーション */}
      <div className='flex justify-center mt-8'>
        <PaginationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          previousDisabled={currentPage === 1}
          nextDisabled={currentPage === totalPages || totalPages === 0}
        />
      </div>
    </div>
  );
};

export default NoticeClient;
