'use client';

import { useState } from 'react';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { Input } from "@/components/admin/ui/input";

export default function MessagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // メッセージデータのサンプル
  const messageData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    date: '2024/01/15',
    time: '14:30',
    companyId: `CMP-${String(index + 1).padStart(4, '0')}`,
    companyName: `株式会社サンプル${index + 1}`,
    companyGroup: index % 2 === 0 ? 'グループA' : 'グループB',
    candidateName: `候補者 太郎${index + 1}`,
    status: index % 3 === 0 ? '書類提出' : index % 3 === 1 ? '面接調整中' : '選考中',
    jobTitle: `エンジニア職 - ポジション${index + 1}`,
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
    const totalPages = Math.ceil(messageData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDetail = (messageId: number) => {
    console.log('View detail:', messageId);
  };

  const columns = [
    { key: 'date', label: '日付', sortable: true, width: 'w-[180px]' },
    { key: 'companyId', label: '企業ID', sortable: true, width: 'w-[120px]' },
    { key: 'companyName', label: '企業名', sortable: true, width: 'w-[200px]' },
    { key: 'companyGroup', label: '企業グループ', sortable: true, width: 'w-[150px]' },
    { key: 'candidateName', label: '候補者名', sortable: true, width: 'w-[150px]' },
    { key: 'status', label: '選考状況', sortable: true, width: 'w-[120px]' },
    { key: 'jobTitle', label: '求人ページ', sortable: false, width: 'w-[250px]' }
  ];

  // ページネーション
  const paginatedData = messageData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(messageData.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '書類提出':
        return 'bg-[#0F9058] text-white';
      case '面接調整中':
        return 'bg-[#FFA500] text-white';
      case '選考中':
        return 'bg-[#3B82F6] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="企業名・候補者名・求人タイトルで検索"
            className="w-80 border border-gray-300"
          />
          <button className="px-4 py-2 bg-[#0F9058] text-white rounded-md hover:bg-[#0D7A4A] transition-colors">
            検索
          </button>
        </div>
        <div className="flex gap-3">
          <AdminButton
            href="/admin/message/confirm"
            text="要確認メッセージ"
          />
          <AdminButton
            href="/admin/message/ngword"
            text="NGワード設定"
          />
        </div>
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

        {/* メッセージ一覧 */}
        <div className="divide-y divide-gray-200">
          {paginatedData.map((message) => (
            <AdminTableRow
              key={message.id}
              columns={[
                {
                  content: (
                    <div className="flex items-center gap-3">
                      <ActionButton 
                        text="詳細" 
                        variant="primary" 
                        size="small"
                        onClick={() => handleDetail(message.id)} 
                      />
                      <div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {message.date}
                        </div>
                        <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ),
                  width: 'w-[180px]'
                },
                { content: message.companyId, width: 'w-[120px]' },
                { content: message.companyName, width: 'w-[200px]' },
                { content: message.companyGroup, width: 'w-[150px]' },
                { content: message.candidateName, width: 'w-[150px]' },
                {
                  content: (
                    <span className={`px-3 py-1 rounded-full text-[14px] font-bold ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  ),
                  width: 'w-[120px]'
                },
                { content: message.jobTitle, width: 'w-[250px]' }
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