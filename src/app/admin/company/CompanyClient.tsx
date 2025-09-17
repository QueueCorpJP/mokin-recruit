'use client';

export type CompanyListItem = {
  id: string;
  company_name: string;
  plan: string;
  headquarters_address: string | null;
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
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SelectInput } from '@/components/ui/select-input';

interface Props {
  companies: CompanyListItem[];
}

export default function CompanyClient({ companies }: Props) {
  const [searchField, setSearchField] = useState('company_name');
  const [searchValue, setSearchValue] = useState('');

  const [sortColumn, setSortColumn] = useState<string>('last_login');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const processed = companies.map(company => {
    const sortedUsers = [...(company.company_users || [])].sort(
      (a, b) =>
        new Date(b.last_login_at || 0).getTime() -
        new Date(a.last_login_at || 0).getTime()
    );
    const lastLoginUser = sortedUsers[0];

    const sortedGroups = [...(company.company_groups || [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const groupNames = sortedGroups.map(g => g.group_name).join('、');

    return {
      ...company,
      last_login: lastLoginUser?.last_login_at || null,
      last_login_user: lastLoginUser
        ? `${lastLoginUser.full_name} (ID:${lastLoginUser.id})`
        : '',
      group_names: groupNames,
    };
  });

  const filtered = processed.filter(c => {
    if (!searchValue) return true;

    const targetValue = c[searchField as keyof typeof c];
    if (typeof targetValue === 'string') {
      return targetValue.toLowerCase().includes(searchValue.toLowerCase());
    }
    return false;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleCsvDownload = () => {
    // CSVヘッダー
    const headers = [
      '企業ID',
      '企業名',
      'プラン',
      '所在地',
      '最終ログイン日時',
      '最新ログイン者',
      '企業グループ',
      '作成日時',
    ];

    // CSVデータを生成
    const csvData = paginated.map(company => [
      company.id,
      company.company_name,
      company.plan || 'プラン加入なし',
      company.headquarters_address || 'N/A',
      company.last_login
        ? new Date(company.last_login)
            .toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
            // .replace(/\//g, '/') (removed: no-op)
        : 'N/A',
      company.last_login_user || 'N/A',
      company.group_names || 'N/A',
      new Date(company.created_at)
        .toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
        // .replace(/\//g, '/') (removed: no-op)
    ]);

    // CSV形式に変換
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        row
          .map(cell => {
            // カンマやダブルクォートを含む場合はダブルクォートで囲む
            if (
              cell.includes(',') ||
              cell.includes('"') ||
              cell.includes('\n')
            ) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          })
          .join(',')
      ),
    ].join('\n');

    // BOMを追加してExcelで正しく表示されるようにする
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // ダウンロード
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `企業アカウント一覧_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // メモリ解放
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'last_login',
      label: '最終ログイン日時',
      sortable: true,
      width: 'w-[180px]',
    },
    { key: 'id', label: '企業ID', sortable: true, width: 'w-[180px]' },
    {
      key: 'company_name',
      label: '企業名',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'plan', label: 'プラン', sortable: true, width: 'w-[120px]' },
    {
      key: 'last_login_user',
      label: '最新ログイン者',
      sortable: true,
      width: 'w-[200px]',
    },
    {
      key: 'group_names',
      label: '企業グループ',
      sortable: true,
      width: 'w-[150px]',
    },
    {
      key: 'headquarters_address',
      label: '所在地',
      sortable: true,
      width: 'w-[150px]',
    },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[200px]',
    },
  ];

  const searchCategoryOptions = [
    { value: 'id', label: '企業ID' },
    { value: 'company_name', label: '企業名' },
    { value: 'group_names', label: '企業グループ' },
    { value: 'headquarters_address', label: '所在地' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <div className='flex gap-2 items-center flex-shrink-0'>
          <SelectInput
            options={searchCategoryOptions}
            value={searchField}
            onChange={setSearchField}
            className='h-10 w-[150px]'
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 2,
              letterSpacing: '1.6px',
            }}
          />
          <div className='flex items-center gap-2'>
            <input
              type='text'
              placeholder='企業名・企業ID・グループ・所在地で検索'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className='bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid h-10 w-[300px]'
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 2,
                letterSpacing: '1.6px',
                color: '#999999',
              }}
            />
            <button
              className='bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-[32px] whitespace-nowrap'
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: '1.4px',
                color: '#ffffff',
              }}
            >
              検索
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <AdminButton href='/admin/company/new' text='新規企業追加' />
          <AdminButton
            onClick={handleCsvDownload}
            text='CSVダウンロード'
            variant='green-outline'
          />
        </div>
      </div>

      <div className='bg-white rounded-lg overflow-x-auto'>
        <div className='min-w-max'>
          <MediaTableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className='mt-2 space-y-2'>
            {paginated.map(c => (
              <AdminTableRow
                key={c.id}
                columns={[
                  {
                    content: (
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {c.last_login
                            ? new Date(c.last_login)
                                .toLocaleString('ja-JP', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                            : 'N/A'}
                        </div>
                      </div>
                    ),
                    width: 'w-[180px]',
                  },
                  {
                    content: c.id,
                    width: 'w-[180px]',
                  },
                  {
                    content: c.company_name,
                    width: 'w-[150px]',
                  },
                  {
                    content: (
                      <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {c.plan || 'プラン加入なし'}
                      </span>
                    ),
                    width: 'w-[120px]',
                  },
                  {
                    content: c.last_login_user,
                    width: 'w-[200px]',
                  },
                  {
                    content: c.group_names,
                    width: 'w-[150px]',
                  },
                  {
                    content: c.headquarters_address || 'N/A',
                    width: 'w-[150px]',
                  },
                ]}
                actions={[
                  <ActionButton
                    key='detail'
                    text='詳細'
                    variant='primary'
                    onClick={() =>
                      (window.location.href = `/admin/company/${c.id}`)
                    }
                    size='small'
                  />,
                  <ActionButton
                    key='edit'
                    text='編集'
                    variant='edit'
                    onClick={() =>
                      (window.location.href = `/admin/company/${c.id}/edit`)
                    }
                    size='small'
                  />,
                ]}
              />
            ))}
          </div>
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
