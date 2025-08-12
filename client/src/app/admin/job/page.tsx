'use client';

import React, { useState } from "react";
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { Input } from "@/components/admin/ui/input";
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
        <div className="flex items-center gap-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="企業名・求人タイトル・職種で検索"
            className="w-96 border border-gray-300"
          />
          <button className="px-4 py-2 bg-[#0F9058] text-white rounded-md hover:bg-[#0D7A4A] transition-colors">
            検索
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            絞り込み
          </button>
        </div>
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
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b-2 border-[#E5E5E5]">
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
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" 
                      className={`${sortColumn === column.key && sortDirection === 'asc' ? 'opacity-100' : 'opacity-30'}`}>
                      <path d="M4 0L7.5 5H0.5L4 0Z" fill="#0F9058" />
                    </svg>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none"
                      className={`${sortColumn === column.key && sortDirection === 'desc' ? 'opacity-100' : 'opacity-30'}`}>
                      <path d="M4 5L0.5 0H7.5L4 5Z" fill="#0F9058" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 求人一覧 */}
        <div className="divide-y divide-gray-200">
          {paginatedData.map((job) => (
            <div key={job.id} className="flex items-center px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-[50px] px-3">
                <Checkbox
                  checked={selectedJobs.includes(job.id)}
                  onCheckedChange={(checked) => handleSelectJob(job.id, checked as boolean)}
                />
              </div>
              <div className="w-[150px] px-3">
                <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {job.updateDate}
                </div>
                <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {job.updateTime}
                </div>
              </div>
              <div className="w-[120px] px-3">
                {getStatusBadge(job.status)}
              </div>
              <div className="w-[120px] px-3">
                {getPeriodBadge(job.publicPeriod)}
              </div>
              <div className="w-[200px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {job.company}
                </p>
              </div>
              <div className="w-[150px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {job.position}
                </p>
              </div>
              <div className="w-[180px] px-3">
                <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {job.jobId}
                </div>
                <div className="font-['Noto_Sans_JP'] text-[12px] font-medium text-gray-500 leading-[1.4] tracking-[1.2px]">
                  {job.companyId}
                </div>
              </div>
              <div className="flex-1 px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {job.title}
                </p>
              </div>
              <div className="w-[250px] flex-shrink-0 flex items-center justify-end gap-2">
                {job.status === '承認待ち' && (
                  <ActionButton
                    text="承認"
                    variant="approve"
                    onClick={() => handleApprove(job.id)}
                    size="small"
                  />
                )}
                <ActionButton
                  text="編集"
                  variant="edit"
                  onClick={() => handleEdit(job.id)}
                  size="small"
                />
                <ActionButton
                  text="削除"
                  variant="delete"
                  onClick={() => handleDelete(job.id)}
                  size="small"
                />
              </div>
            </div>
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