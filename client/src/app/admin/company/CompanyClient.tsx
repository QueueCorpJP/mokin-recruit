'use client';

export type CompanyListItem = {
  id: string;
  company_name: string;
  plan: 'standard' | 'basic';
  created_at: string;
  company_users: {
    id: string;
    full_name: string;
    email: string;
    last_login_at: string | null;
  }[];
  company_groups: {
    group_name: string;
    created_at: string;
  }[];
};

import React, { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';

interface Props {
  companies: CompanyListItem[];
}

export default function CompanyClient({ companies }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 集約・整形処理
  const processed = companies.map(company => {
    // 最終ログインユーザー
    const sortedUsers = [...(company.company_users || [])].sort(
      (a, b) =>
        new Date(b.last_login_at || 0).getTime() -
        new Date(a.last_login_at || 0).getTime()
    );
    const lastLoginUser = sortedUsers[0] || {};
    // 企業グループ名
    const sortedGroups = [...(company.company_groups || [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const groupNames = sortedGroups.map(g => g.group_name).join('、');
    return {
      ...company,
      last_login: (lastLoginUser as any).last_login_at || null,
      last_login_user_name: (lastLoginUser as any).full_name || '',
      last_login_user_email: (lastLoginUser as any).email || '',
      group_names: groupNames,
    };
  });

  // 検索・ソート・ページネーション
  const filtered = processed.filter(
    c =>
      c.company_name.includes(searchTerm) ||
      c.last_login_user_name.includes(searchTerm) ||
      c.last_login_user_email.includes(searchTerm) ||
      c.group_names.includes(searchTerm)
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    {
      key: 'last_login',
      label: '最終ログイン',
      sortable: true,
      width: 'w-[180px]',
    },
    { key: 'id', label: '企業ID', sortable: true, width: 'w-[180px]' },
    {
      key: 'company_name',
      label: '企業名',
      sortable: true,
      width: 'w-[200px]',
    },
    { key: 'plan', label: 'プラン名', sortable: true, width: 'w-[120px]' },
    {
      key: 'last_login_user_name',
      label: '最終ログインユーザー',
      sortable: true,
      width: 'w-[150px]',
    },
    {
      key: 'last_login_user_email',
      label: 'ユーザーID',
      sortable: true,
      width: 'w-[200px]',
    },
    {
      key: 'group_names',
      label: '企業グループ',
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
          placeholder='企業名・ユーザー名・グループ名で検索'
          onSearch={() => {}}
        />
        <div className='flex gap-3'>
          <AdminButton href='/admin/company/new' text='新規企業作成' />
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
                  content: c.last_login
                    ? new Date(c.last_login).toLocaleString('ja-JP', {
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
                  content: c.company_name,
                  width: 'w-[200px]',
                },
                {
                  content:
                    c.plan === 'standard' ? 'スタンダード' : 'ベーシック',
                  width: 'w-[120px]',
                },
                {
                  content: c.last_login_user_name,
                  width: 'w-[150px]',
                },
                {
                  content: c.last_login_user_email,
                  width: 'w-[200px]',
                },
                {
                  content: c.group_names,
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
