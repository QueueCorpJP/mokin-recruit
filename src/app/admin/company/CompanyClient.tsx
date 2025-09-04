'use client';

export type CompanyListItem = {
  id: string;
  company_name: string;
  plan: 'standard' | 'basic';
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
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';

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
      '作成日時'
    ];

    // CSVデータを生成
    const csvData = paginated.map(company => [
      company.id,
      company.company_name,
      company.plan === 'standard' ? 'スタンダード' : 'ベーシック',
      company.headquarters_address || 'N/A',
      company.last_login
        ? new Date(company.last_login).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(/\//g, '/')
        : 'N/A',
      company.last_login_user || 'N/A',
      company.group_names || 'N/A',
      new Date(company.created_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\//g, '/')
    ]);

    // CSV形式に変換
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        row.map(cell => {
          // カンマやダブルクォートを含む場合はダブルクォートで囲む
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // BOMを追加してExcelで正しく表示されるようにする
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // ダウンロード
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `企業アカウント一覧_${new Date().toISOString().split('T')[0]}.csv`);
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
    },
    { key: 'id', label: '企業ID' },
    {
      key: 'company_name',
      label: '企業名',
    },
    { key: 'plan', label: 'プラン' },
    {
      key: 'last_login_user',
      label: '最新ログイン者',
    },
    {
      key: 'group_names',
      label: '企業グループ',
    },
    { key: 'headquarters_address', label: '所在地' },
    { key: 'actions', label: '操作' },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-4xl">
            <label htmlFor="search-field" className="sr-only">検索項目</label>
            <select
              id="search-field"
              value={searchField}
              onChange={e => setSearchField(e.target.value)}
              className="px-3 py-2 bg-white border border-black rounded-none text-sm font-medium min-w-[200px]"
            >
              <option value="id">企業ID</option>
              <option value="company_name">企業名</option>
              <option value="group_names">企業グループ</option>
              <option value="headquarters_address">所在地</option>
            </select>
            <label htmlFor="search-value" className="sr-only">検索値</label>
            <input
              type="text"
              id="search-value"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-black rounded-none text-sm placeholder-gray-400"
              placeholder="部分一致で検索"
            />
            <button className="px-6 py-2 bg-black text-white rounded-3xl text-sm font-medium hover:bg-gray-800 transition-colors">
              検索
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => window.location.href = '/admin/company/new'}
              className="px-6 py-3 bg-black text-white rounded-3xl text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              新規企業追加
            </button>
            <button
              onClick={handleCsvDownload}
              className="px-6 py-3 bg-white text-black border border-black rounded-3xl text-sm font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              CSVダウンロード
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortColumn === col.key && (
                    <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.last_login
                    ? new Date(c.last_login).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).replace(/\//g, '/')
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.company_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.plan === 'standard' ? 'スタンダード' : 'ベーシック'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.last_login_user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.group_names}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.headquarters_address || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/admin/company/${c.id}`}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 transition-colors text-xs"
                    >
                      詳細
                    </button>
                    <button
                      onClick={() => window.location.href = `/admin/company/${c.id}/edit`}
                      className="px-3 py-1 bg-white text-black border border-black rounded hover:bg-gray-50 transition-colors text-xs"
                    >
                      編集
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center mt-8 space-x-4'>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-8 py-3 bg-black text-white rounded-3xl text-sm font-bold disabled:bg-gray-400 hover:bg-gray-800 transition-colors disabled:hover:bg-gray-400"
        >
          前へ
        </button>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-8 py-3 bg-black text-white rounded-3xl text-sm font-bold disabled:bg-gray-400 hover:bg-gray-800 transition-colors disabled:hover:bg-gray-400"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
