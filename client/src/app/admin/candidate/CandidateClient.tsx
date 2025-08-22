'use client';

export type CandidateListItem = {
  id: string;
  last_login_at: string | null;
  last_name: string;
  first_name: string;
  current_position: string | null;
  gender: 'male' | 'female' | 'unspecified' | null;
  birth_date: string | null;
  desired_salary: string | null;
  phone_number: string | null;
  email: string;
  current_residence: string | null;
};

import React, { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';

interface Props {
  candidates: CandidateListItem[];
}

export default function CandidateClient({ candidates }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 検索・ソート・ページネーション
  const filtered = candidates.filter(
    c =>
      (c.last_name || '').includes(searchTerm) ||
      (c.first_name || '').includes(searchTerm) ||
      (c.email || '').includes(searchTerm) ||
      (c.current_position || '').includes(searchTerm) ||
      (c.phone_number || '').includes(searchTerm) ||
      (c.current_residence || '').includes(searchTerm)
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    {
      key: 'last_login_at',
      label: '最終ログイン',
      sortable: true,
      width: 'w-[180px]',
    },
    { key: 'id', label: 'ユーザーID', sortable: true, width: 'w-[180px]' },
    { key: 'name', label: 'ユーザー名', sortable: true, width: 'w-[200px]' },
    {
      key: 'current_position',
      label: '職種',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'gender', label: '性別', sortable: true, width: 'w-[100px]' },
    { key: 'age', label: '年齢', sortable: true, width: 'w-[80px]' },
    {
      key: 'desired_salary',
      label: '希望年収',
      sortable: true,
      width: 'w-[120px]',
    },
    {
      key: 'phone_number',
      label: '電話番号',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'email', label: 'メール', sortable: true, width: 'w-[200px]' },
    {
      key: 'current_residence',
      label: '所在地',
      sortable: true,
      width: 'w-[150px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='氏名・メール・電話番号・職種・所在地で検索'
          onSearch={() => {}}
        />
        <div className='flex gap-3'>
          <AdminButton href='/admin/candidate/new' text='新規候補者作成' />
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
          {paginated.map(c => (
            <AdminTableRow
              key={c.id}
              columns={[
                {
                  content: c.last_login_at
                    ? new Date(c.last_login_at).toLocaleString('ja-JP', {
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
                  content: c.id,
                  width: 'w-[180px]',
                },
                {
                  content: `${c.last_name || ''}${c.first_name || ''}`,
                  width: 'w-[200px]',
                },
                {
                  content: c.current_position || '',
                  width: 'w-[150px]',
                },
                {
                  content: c.gender || '',
                  width: 'w-[100px]',
                },
                {
                  content: '', // 年齢は後続で実装
                  width: 'w-[80px]',
                },
                {
                  content: c.desired_salary || '',
                  width: 'w-[120px]',
                },
                {
                  content: c.phone_number || '',
                  width: 'w-[150px]',
                },
                {
                  content: c.email || '',
                  width: 'w-[200px]',
                },
                {
                  content: c.current_residence || '',
                  width: 'w-[150px]',
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
