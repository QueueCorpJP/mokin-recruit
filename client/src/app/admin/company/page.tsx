'use client';

import { useState } from 'react';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { Input } from "@/components/admin/ui/input";

export default function CompanyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 企業データのサンプル
  const companyData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    lastLoginDate: '2024/01/15',
    lastLoginTime: '14:30',
    companyId: `【追加 2024/01/${String(index + 1).padStart(2, '0')}】`,
    companyName: `株式会社サンプル${index + 1}`,
    planName: index % 3 === 0 ? 'ベーシックプラン' : index % 3 === 1 ? 'スタンダードプラン' : 'プレミアムプラン',
    loginUser: `user${index + 1}@example.com`,
    companyGroup: index % 2 === 0 ? 'グループA' : 'グループB',
    location: index % 2 === 0 ? '東京都渋谷区' : '大阪府大阪市'
  }));

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
    const totalPages = Math.ceil(companyData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (companyId: number) => {
    console.log('Edit company:', companyId);
  };

  const handleDelete = (companyId: number) => {
    if (confirm('この企業を削除しますか？')) {
      console.log('Delete company:', companyId);
    }
  };

  const columns = [
    { key: 'lastLogin', label: '最終ログイン', sortable: true, width: 'w-[150px]' },
    { key: 'companyId', label: '企業ID', sortable: true, width: 'w-[180px]' },
    { key: 'companyName', label: '企業名', sortable: true, width: 'w-[200px]' },
    { key: 'planName', label: 'プラン名', sortable: true, width: 'w-[150px]' },
    { key: 'loginUser', label: 'ログインユーザー', sortable: false, width: 'w-[200px]' },
    { key: 'companyGroup', label: '企業グループ', sortable: true, width: 'w-[150px]' },
    { key: 'location', label: '所在地', sortable: false, width: 'w-[150px]' },
    { key: 'actions', label: 'アクション', sortable: false, width: 'w-[200px]' }
  ];

  // ページネーション
  const paginatedData = companyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(companyData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="企業名・ID・グループで検索"
            className="w-80 border border-gray-300"
          />
          <button className="px-4 py-2 bg-[#0F9058] text-white rounded-md hover:bg-[#0D7A4A] transition-colors">
            検索
          </button>
        </div>
        <AdminButton
          href="/admin/company/new"
          text="新規企業追加"
        />
      </div>

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* テーブルヘッダー */}
        <MediaTableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* 企業一覧 */}
        <div className="divide-y divide-gray-200">
          {paginatedData.map((company) => (
            <AdminTableRow
              key={company.id}
              columns={[
                {
                  content: (
                    <div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {company.lastLoginDate}
                      </div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {company.lastLoginTime}
                      </div>
                    </div>
                  ),
                  width: 'w-[150px]'
                },
                { content: company.companyId, width: 'w-[180px]' },
                { content: company.companyName, width: 'w-[200px]' },
                { content: company.planName, width: 'w-[150px]' },
                { content: company.loginUser, width: 'w-[200px]' },
                { content: company.companyGroup, width: 'w-[150px]' },
                { content: company.location, width: 'w-[150px]' }
              ]}
              actions={[
                <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(company.id)} />,
                <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(company.id)} />
              ]}
            />
          ))}
        </div>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center mt-8">
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