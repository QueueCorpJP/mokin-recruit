'use client';

export type ArticleListItem = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
  category_names: string[];
};

import React, { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';

interface Props {
  articles: ArticleListItem[];
}

export default function ArticleClient({ articles }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 検索・ソート・ページネーション
  const filtered = articles.filter(
    a =>
      (a.title || '').includes(searchTerm) ||
      (a.status || '').includes(searchTerm) ||
      (a.category_names.join('、') || '').includes(searchTerm)
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    {
      key: 'status',
      label: 'ステータス',
      sortable: true,
      width: 'w-[120px]',
    },
    {
      key: 'updated_at',
      label: '最終更新日付',
      sortable: true,
      width: 'w-[180px]',
    },
    {
      key: 'category_names',
      label: 'カテゴリ',
      sortable: false,
      width: 'w-[200px]',
    },
    {
      key: 'title',
      label: '記事タイトル',
      sortable: true,
      width: 'flex-1',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='タイトル・カテゴリ・ステータスで検索'
          onSearch={() => {}}
        />
        <div className='flex gap-3'>
          <AdminButton href='/admin/article/new' text='新規記事作成' />
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
          {paginated.map(a => (
            <AdminTableRow
              key={a.id}
              columns={[
                {
                  content: a.status,
                  width: 'w-[120px]',
                },
                {
                  content: a.updated_at
                    ? new Date(a.updated_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    : '',
                  width: 'w-[180px]',
                },
                {
                  content: a.category_names.join('、'),
                  width: 'w-[200px]',
                },
                {
                  content: a.title,
                  width: 'flex-1',
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
