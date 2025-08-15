'use client';

import { useState } from 'react';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { SearchBar } from '@/components/admin/ui/SearchBar';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
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
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="候補者名・ID・メールで検索"
          onSearch={() => console.log('Search:', searchTerm)}
          onFilter={() => console.log('Filter')}
        />
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
      <div className="bg-white rounded-lg overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
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

        {/* 候補者一覧 */}
        <div className="mt-2 space-y-2">
          {paginatedData.map((candidate) => (
            <AdminTableRow
              key={candidate.id}
              columns={[
                {
                  content: (
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                    />
                  ),
                  width: 'w-[50px]'
                },
                {
                  content: (
                    <div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {candidate.lastLoginDate}
                      </div>
                      <div className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                        {candidate.lastLoginTime}
                      </div>
                    </div>
                  ),
                  width: 'w-[140px]'
                },
                { content: candidate.userIdText, width: 'w-[140px]' },
                { content: candidate.userName, width: 'w-[150px]' },
                { content: candidate.occupation, width: 'w-[120px]' },
                { content: candidate.gender, width: 'w-[80px]' },
                { content: `${candidate.age}歳`, width: 'w-[80px]' },
                { content: candidate.salary, width: 'w-[140px]' },
                { content: candidate.phone, width: 'w-[140px]' },
                { content: candidate.email, width: 'w-[180px]' },
                { content: candidate.location, width: 'w-[150px]' }
              ]}
              actions={[
                <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(candidate.id)} />,
                <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(candidate.id)} />
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