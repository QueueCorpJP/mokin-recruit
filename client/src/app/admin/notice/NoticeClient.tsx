'use client';
import { useState } from 'react';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';

export default function NoticeClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 運営お知らせデータのサンプル
  const noticeData = Array(30)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      status: index % 2 === 0 ? '公開中' : '下書き',
      updateDate: 'yyyy/mm/dd',
      updateTime: 'hh:mm',
      title: 'お知らせタイトルが入ります。お知らせタイトルが入ります。',
    }));

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
    const totalPages = Math.ceil(noticeData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (noticeId: number) => {
    console.log('Edit notice:', noticeId);
  };

  const handleDelete = (noticeId: number) => {
    if (confirm('このお知らせを削除しますか？')) {
      console.log('Delete notice:', noticeId);
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

  // ページネーション
  const paginatedData = noticeData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(noticeData.length / itemsPerPage);

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      {/* 上部の機能エリア */}
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='お知らせタイトルで検索'
          onSearch={() => console.log('Search:', searchTerm)}
        />
        <AdminButton href='/admin/notice/new' text='新規お知らせ追加' />
      </div>

      {/* テーブルコンテナ */}
      <div className='bg-white rounded-lg'>
        {/* テーブルヘッダー */}
        <MediaTableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* お知らせ一覧 */}
        <div className='mt-2 space-y-2'>
          {paginatedData.map(notice => (
            <AdminTableRow
              key={notice.id}
              columns={[
                { content: getStatusBadge(notice.status), width: 'w-[120px]' },
                {
                  content: (
                    <div>
                      <div className="font-['Inter'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {notice.updateDate}
                      </div>
                      <div className="font-['Inter'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {notice.updateTime}
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
          ))}
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
}
