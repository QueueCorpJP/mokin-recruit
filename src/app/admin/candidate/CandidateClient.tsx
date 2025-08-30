'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CandidateListItem } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { SelectInput } from '@/components/ui/select-input';

interface Props {
  candidates: CandidateListItem[];
}

export default function CandidateClient({ candidates }: Props) {
  const router = useRouter();
  const [searchCategory, setSearchCategory] = useState<string>('氏名');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const searchCategoryOptions = [
    { value: '氏名', label: '氏名' },
    { value: 'メールアドレス', label: 'メールアドレス' },
    { value: '電話番号', label: '電話番号' },
    { value: '在籍企業', label: '在籍企業' },
    { value: 'ユーザーID', label: 'ユーザーID' }
  ];

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

  const handleCsvDownload = useCallback(() => {
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
  }, [candidates]);

  // 検索フィルタリング
  const filtered = candidates.filter(c => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      switch (searchCategory) {
        case '氏名':
          return (c.last_name || '').toLowerCase().includes(searchLower) ||
                 (c.first_name || '').toLowerCase().includes(searchLower);
        case 'メールアドレス':
          return (c.email || '').toLowerCase().includes(searchLower);
        case '電話番号':
          return (c.phone_number || '').includes(searchTerm);
        case '在籍企業':
          return (c.recent_job_company_name || '').toLowerCase().includes(searchLower);
        case 'ユーザーID':
          return c.id.toLowerCase().includes(searchLower);
        default:
          return false;
      }
    }
    return true;
  });

  // ソート処理
  const sortedCandidates = [...filtered].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortColumn) {
      case 'last_login_at':
        aValue = a.last_login_at || '';
        bValue = b.last_login_at || '';
        break;
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'gender':
        aValue = a.gender === 'male' ? '男性' : a.gender === 'female' ? '女性' : (a.gender || '');
        bValue = b.gender === 'male' ? '男性' : b.gender === 'female' ? '女性' : (b.gender || '');
        break;
      case 'age':
        aValue = a.birth_date ? new Date().getFullYear() - new Date(a.birth_date).getFullYear() : 0;
        bValue = b.birth_date ? new Date().getFullYear() - new Date(b.birth_date).getFullYear() : 0;
        break;
      case 'current_income':
        aValue = a.current_income || '';
        bValue = b.current_income || '';
        break;
      case 'phone_number':
        aValue = a.phone_number || '';
        bValue = b.phone_number || '';
        break;
      case 'email':
        aValue = a.email || '';
        bValue = b.email || '';
        break;
      case 'recent_job_company_name':
        aValue = a.recent_job_company_name || '';
        bValue = b.recent_job_company_name || '';
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue, 'ja');
      } else {
        return bValue.localeCompare(aValue, 'ja');
      }
    } else {
      if (sortDirection === 'asc') {
        return (aValue as number) - (bValue as number);
      } else {
        return (bValue as number) - (aValue as number);
      }
    }
  });

  // ページネーション
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = sortedCandidates.slice(start, end);
  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);

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

  // 年齢計算を事前に実行
  const paginatedWithAge = paginated.map(c => ({
    ...c,
    age: c.birth_date 
      ? new Date().getFullYear() - new Date(c.birth_date).getFullYear()
      : null
  }));

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <div className='flex gap-2 items-center flex-shrink-0'>
          <SelectInput
            options={searchCategoryOptions}
            value={searchCategory}
            onChange={setSearchCategory}
            className="h-10 w-[150px]"
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 2,
              letterSpacing: '1.6px'
            }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder='氏名・メール・電話番号・在籍企業で検索'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid h-10 w-[250px]"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 2,
                letterSpacing: '1.6px',
                color: '#999999'
              }}
            />
            <button 
              className="bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-[32px] whitespace-nowrap"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: '1.4px',
                color: '#ffffff'
              }}
            >
              検索
            </button>
          </div>
        </div>
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
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <div className='mt-2 space-y-2'>
            {paginatedWithAge.map(c => {
              return (
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
                      content: c.age ? `${c.age}歳` : '',
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
                  onClick={() => router.push(`/admin/candidate/${c.id}`)}
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
