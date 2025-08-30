'use client';

import React, { useState } from 'react';
import { CandidateListItem } from './page';
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

  const handleCsvDownload = () => {
    // CSVヘッダー
    const headers = [
      '最終ログイン日時',
      'ユーザーID',
      '姓',
      '名',
      '性別',
      '年齢',
      '現在年収',
      '電話番号',
      'メールアドレス',
      '直近の在籍企業'
    ];

    // CSVデータ作成
    const csvData = candidates.map(c => {
      const age = c.birth_date 
        ? new Date().getFullYear() - new Date(c.birth_date).getFullYear()
        : '';
      
      const lastLogin = c.last_login_at
        ? new Date(c.last_login_at).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : '未ログイン';

      const genderText = c.gender === 'male' ? '男性' : c.gender === 'female' ? '女性' : (c.gender || '');

      return [
        lastLogin,
        c.id,
        c.last_name || '',
        c.first_name || '',
        genderText,
        age ? `${age}歳` : '',
        c.current_income || '',
        c.phone_number || '',
        c.email || '',
        c.recent_job_company_name || ''
      ];
    });

    // CSV文字列作成
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // BOMを追加してExcelで文字化けを防ぐ
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

    // ダウンロード実行
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `候補者一覧_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 検索・ソート・ページネーション
  const filtered = candidates.filter(
    c =>
      (c.last_name || '').includes(searchTerm) ||
      (c.first_name || '').includes(searchTerm) ||
      (c.email || '').includes(searchTerm) ||
      (c.current_position || '').includes(searchTerm) ||
      (c.phone_number || '').includes(searchTerm) ||
      (c.recent_job_company_name || '').includes(searchTerm)
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    {
      key: 'last_login_at',
      label: '最終ログイン日時',
      sortable: true,
      width: 'w-[180px]',
    },
    { key: 'id', label: 'ユーザーID', sortable: true, width: 'w-[180px]' },
    { key: 'gender', label: '性別', sortable: true, width: 'w-[100px]' },
    { key: 'age', label: '年齢', sortable: true, width: 'w-[80px]' },
    {
      key: 'current_income',
      label: '現在年収',
      sortable: true,
      width: 'w-[120px]',
    },
    {
      key: 'phone_number',
      label: '電話番号',
      sortable: true,
      width: 'w-[150px]',
    },
    { key: 'email', label: 'メールアドレス', sortable: true, width: 'w-[200px]' },
    {
      key: 'recent_job_company_name',
      label: '直近の在籍企業',
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
          placeholder='氏名・メール・電話番号・職種・在籍企業で検索'
          onSearch={() => {}}
        />
        <div className='flex flex-col gap-3'>
          <AdminButton href='/admin/candidate/new' text='新規追加' />
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
            sortDirection={null}
            onSort={setSortColumn}
          />
          <div className='mt-2 space-y-2'>
            {paginated.map(c => {
              // 年齢計算
              const age = c.birth_date 
                ? new Date().getFullYear() - new Date(c.birth_date).getFullYear()
                : null;
              
              return (
                <AdminTableRow
                  key={c.id}
                  onClick={() => window.location.href = `/admin/candidate/${c.id}`}
                  className="cursor-pointer hover:bg-gray-50"
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
                        : '未ログイン',
                      width: 'w-[180px]',
                    },
                    {
                      content: c.id,
                      width: 'w-[180px]',
                    },
                    {
                      content: c.gender === 'male' ? '男性' : c.gender === 'female' ? '女性' : (c.gender || ''),
                      width: 'w-[100px]',
                    },
                    {
                      content: age ? `${age}歳` : '',
                      width: 'w-[80px]',
                    },
                    {
                      content: c.current_income || '',
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
                      content: c.recent_job_company_name || '',
                      width: 'w-[150px]',
                    },
                  ]}
                />
              );
            })}
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
