'use client';

import React, { useState } from "react";
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { Checkbox } from "@/components/admin/ui/checkbox";

export default function Job() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 求人データのサンプル
  const jobData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    updateDate: '2024/01/15',
    updateTime: '14:30',
    status: index % 3 === 0 ? '承認待ち' : index % 3 === 1 ? '公開中' : '下書き',
    publicPeriod: index % 2 === 0 ? '期間限定' : '常時募集',
    company: `株式会社サンプル${index + 1}`,
    position: ['エンジニア', 'デザイナー', 'マーケター'][index % 3],
    jobId: `JOB${String(index + 1).padStart(6, '0')}`,
    companyId: `【会社 2024/01/${String(index + 1).padStart(2, '0')}】`,
    title: `【${index % 2 === 0 ? 'フロントエンド' : 'バックエンド'}エンジニア募集】${index % 3 === 0 ? '急募' : ''}経験者優遇`
  }));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(jobData.map(j => j.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedJobs([...selectedJobs, id]);
    } else {
      setSelectedJobs(selectedJobs.filter(jId => jId !== id));
    }
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
    const totalPages = Math.ceil(jobData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (jobId: number) => {
    console.log('Edit job:', jobId);
    // 編集画面への遷移処理
  };

  const handleDelete = (jobId: number) => {
    if (confirm('この求人を削除しますか？')) {
      console.log('Delete job:', jobId);
    }
  };

  const handleApprove = (jobId: number) => {
    console.log('Approve job:', jobId);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      '承認待ち': 'bg-[#FFA500] text-white',
      '公開中': 'bg-[#0F9058] text-white',
      '下書き': 'bg-gray-500 text-white'
    };
    
    return (
      <span className={`inline-block px-3 py-1 rounded-[5px] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-400 text-white'}`}>
        {status}
      </span>
    );
  };

  const getPeriodBadge = (period: string) => {
    return (
      <span className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]">
        {period}
      </span>
    );
  };

  const columns = [
    { key: 'checkbox', label: '', sortable: false, width: 'w-[50px]' },
    { key: 'updateDate', label: '更新日時', sortable: true, width: 'w-[150px]' },
    { key: 'status', label: 'ステータス', sortable: true, width: 'w-[120px]' },
    { key: 'publicPeriod', label: '公開期間', sortable: true, width: 'w-[120px]' },
    { key: 'company', label: '企業名', sortable: true, width: 'w-[200px]' },
    { key: 'position', label: '職種', sortable: true, width: 'w-[150px]' },
    { key: 'jobId', label: '求人ID', sortable: true, width: 'w-[180px]' },
    { key: 'title', label: '求人タイトル', sortable: true, width: 'flex-1' },
    { key: 'actions', label: 'アクション', sortable: false, width: 'w-[250px]' }
  ];

  // ページネーション
  const paginatedData = jobData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(jobData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="企業名・求人タイトル・職種で検索"
          onSearch={() => console.log('Search:', searchTerm)}
          onFilter={() => console.log('Filter')}
        />
        <AdminButton
          href="/admin/job/new"
          text="新規求人作成"
        />
      </div>

      {/* 選択中の求人数 */}
      {selectedJobs.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
          <span className="text-blue-700 font-medium">
            {selectedJobs.length}件の求人を選択中
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => console.log('Bulk approve')}
              className="px-4 py-2 bg-[#0F9058] text-white rounded-md hover:bg-[#0D7A4A] transition-colors text-sm"
            >
              一括承認
            </button>
            <button 
              onClick={() => console.log('Bulk delete')}
              className="px-4 py-2 bg-[#FF5B5B] text-white rounded-md hover:bg-[#E54545] transition-colors text-sm"
            >
              一括削除
            </button>
          </div>
        </div>
      )}

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
          <div className="w-[50px] px-3">
            <Checkbox
              checked={selectedJobs.length === paginatedData.length && paginatedData.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </div>
          {columns.slice(1).map((column) => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-2">
                <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {column.label}
                </span>
                {column.sortable && (
                  <div className="flex flex-col gap-0.5">
                    <ArrowIcon
                      direction="up"
                      size={8}
                      color="#0F9058"
                    />
                    <ArrowIcon
                      direction="down"
                      size={8}
                      color="#0F9058"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 求人一覧 */}
        <div className="mt-2 space-y-2">
          {paginatedData.map((job) => (
            <AdminTableRow
              key={job.id}
              columns={[
                {
                  content: (
                    <Checkbox
                      checked={selectedJobs.includes(job.id)}
                      onCheckedChange={(checked) => handleSelectJob(job.id, checked as boolean)}
                    />
                  ),
                  width: 'w-[50px]'
                },
                {
                  content: (
                    <div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {job.updateDate}
                      </div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {job.updateTime}
                      </div>
                    </div>
                  ),
                  width: 'w-[150px]'
                },
                { content: getStatusBadge(job.status), width: 'w-[120px]' },
                { content: getPeriodBadge(job.publicPeriod), width: 'w-[120px]' },
                { content: job.company, width: 'w-[200px]' },
                { content: job.position, width: 'w-[150px]' },
                {
                  content: (
                    <div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {job.jobId}
                      </div>
                      <div className="font-['Noto_Sans_JP'] text-[12px] font-medium text-gray-500 leading-[1.4] tracking-[1.2px]">
                        {job.companyId}
                      </div>
                    </div>
                  ),
                  width: 'w-[180px]'
                },
                { content: job.title, width: 'flex-1' }
              ]}
              actions={[
                ...(job.status === '承認待ち' ? [
                  <ActionButton key="approve" text="承認" variant="approve" onClick={() => handleApprove(job.id)} size="small" />
                ] : []),
                <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(job.id)} size="small" />,
                <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(job.id)} size="small" />
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