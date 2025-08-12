'use client';

import { useState } from 'react';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { Input } from "@/components/admin/ui/input";
import { Checkbox } from "@/components/admin/ui/checkbox";

export default function CandidatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 候補者データのサンプル
  const candidateData = Array(25).fill(null).map((_, index) => ({
    id: index + 1,
    lastLoginDate: '2024/01/15',
    lastLoginTime: '14:30',
    userIdText: `USER${String(index + 1).padStart(6, '0')}`,
    userName: `候補者 太郎${index + 1}`,
    occupation: index % 3 === 0 ? 'エンジニア' : index % 3 === 1 ? 'デザイナー' : 'マーケター',
    gender: index % 2 === 0 ? '男性' : '女性',
    age: String(25 + (index % 20)),
    salary: `${800 + (index * 50)}〜${900 + (index * 50)}万`,
    phone: `080${String(10000000 + index).padStart(8, '0')}`,
    email: `candidate${index + 1}@example.com`,
    location: index % 2 === 0 ? '東京都渋谷区' : '大阪府大阪市'
  }));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidateData.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, id]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(cId => cId !== id));
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
    const totalPages = Math.ceil(candidateData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (candidateId: number) => {
    console.log('Edit candidate:', candidateId);
  };

  const handleDelete = (candidateId: number) => {
    if (confirm('この候補者を削除しますか？')) {
      console.log('Delete candidate:', candidateId);
    }
  };

  const columns = [
    { key: 'checkbox', label: '', sortable: false, width: 'w-[50px]' },
    { key: 'lastLogin', label: '最終ログイン', sortable: true, width: 'w-[140px]' },
    { key: 'userId', label: 'ユーザーID', sortable: true, width: 'w-[140px]' },
    { key: 'userName', label: 'ユーザー名', sortable: true, width: 'w-[150px]' },
    { key: 'occupation', label: '職種', sortable: true, width: 'w-[120px]' },
    { key: 'gender', label: '性別', sortable: false, width: 'w-[80px]' },
    { key: 'age', label: '年齢', sortable: true, width: 'w-[80px]' },
    { key: 'salary', label: '希望年収', sortable: true, width: 'w-[140px]' },
    { key: 'phone', label: '電話番号', sortable: false, width: 'w-[140px]' },
    { key: 'email', label: 'メール', sortable: false, width: 'w-[180px]' },
    { key: 'location', label: '所在地', sortable: false, width: 'w-[150px]' },
    { key: 'actions', label: 'アクション', sortable: false, width: 'w-[200px]' }
  ];

  // ページネーション
  const paginatedData = candidateData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(candidateData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="候補者名・ID・メールで検索"
            className="w-80 border border-gray-300"
          />
          <button className="px-4 py-2 bg-[#0F9058] text-white rounded-md hover:bg-[#0D7A4A] transition-colors">
            検索
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            絞り込み
          </button>
        </div>
        <div className="flex gap-3">
          <AdminButton
            onClick={() => console.log('Export CSV')}
            text="CSVエクスポート"
            variant="secondary"
            size="medium"
          />
          <AdminButton
            href="/admin/candidate/new"
            text="新規候補者追加"
          />
        </div>
      </div>

      {/* 選択中の候補者数 */}
      {selectedCandidates.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <span className="text-blue-700 font-medium">
            {selectedCandidates.length}件の候補者を選択中
          </span>
        </div>
      )}

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b-2 border-[#E5E5E5]">
          <div className="w-[50px] px-3">
            <Checkbox
              checked={selectedCandidates.length === paginatedData.length}
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

        {/* 候補者一覧 */}
        <div className="divide-y divide-gray-200">
          {paginatedData.map((candidate) => (
            <div key={candidate.id} className="flex items-center px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="w-[50px] px-3">
                <Checkbox
                  checked={selectedCandidates.includes(candidate.id)}
                  onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                />
              </div>
              <div className="w-[140px] px-3">
                <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {candidate.lastLoginDate}
                </div>
                <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {candidate.lastLoginTime}
                </div>
              </div>
              <div className="w-[140px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.userIdText}
                </p>
              </div>
              <div className="w-[150px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.userName}
                </p>
              </div>
              <div className="w-[120px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.occupation}
                </p>
              </div>
              <div className="w-[80px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {candidate.gender}
                </p>
              </div>
              <div className="w-[80px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {candidate.age}歳
                </p>
              </div>
              <div className="w-[140px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.salary}
                </p>
              </div>
              <div className="w-[140px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.phone}
                </p>
              </div>
              <div className="w-[180px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.email}
                </p>
              </div>
              <div className="w-[150px] px-3">
                <p className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] truncate">
                  {candidate.location}
                </p>
              </div>
              <div className="w-[200px] flex-shrink-0 flex items-center justify-end gap-3">
                <ActionButton
                  text="編集"
                  variant="edit"
                  onClick={() => handleEdit(candidate.id)}
                />
                <ActionButton
                  text="削除"
                  variant="delete"
                  onClick={() => handleDelete(candidate.id)}
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