'use client';

import React, { ChangeEvent, useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteSearchConditionModal } from './DeleteSearchConditionModal';
import { EditSearchConditionModal } from './EditSearchConditionModal';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { 
  updateSearchHistorySavedStatus, 
  deleteSearchHistory,
  updateSearchHistoryTitle,
  type SearchHistoryItem as ServerSearchHistoryItem 
} from '@/lib/actions/search-history';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from    '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';      
// Icons
const SearchIcon = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M14.5 25C20.299 25 25 20.299 25 14.5C25 8.70101 20.299 4 14.5 4C8.70101 4 4 8.70101 4 14.5C4 20.299 8.70101 25 14.5 25Z'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M21.925 21.925L28 28'
      stroke='white'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='24'
    viewBox='0 0 18 24'
    fill='none'
  >
    <path
      d='M0 2.25V22.8609C0 23.4891 0.510937 24 1.13906 24C1.37344 24 1.60312 23.9297 1.79531 23.7938L9 18.75L16.2047 23.7938C16.3969 23.9297 16.6266 24 16.8609 24C17.4891 24 18 23.4891 18 22.8609V2.25C18 1.00781 16.9922 0 15.75 0H2.25C1.00781 0 0 1.00781 0 2.25Z'
      fill={filled ? '#FFDA5F' : '#DCDCDC'}
    />
  </svg>
);

const DotsMenuIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='8'
    viewBox='0 0 24 8'
    fill='none'
  >
    <path
      d='M0 3.99997C0 3.17485 0.327777 2.38353 0.911223 1.80008C1.49467 1.21663 2.28599 0.888855 3.11111 0.888855C3.93623 0.888855 4.72755 1.21663 5.311 1.80008C5.89445 2.38353 6.22222 3.17485 6.22222 3.99997C6.22222 4.82508 5.89445 5.61641 5.311 6.19985C4.72755 6.7833 3.93623 7.11108 3.11111 7.11108C2.28599 7.11108 1.49467 6.7833 0.911223 6.19985C0.327777 5.61641 0 4.82508 0 3.99997ZM8.88889 3.99997C8.88889 3.17485 9.21667 2.38353 9.80011 1.80008C10.3836 1.21663 11.1749 0.888855 12 0.888855C12.8251 0.888855 13.6164 1.21663 14.1999 1.80008C14.7833 2.38353 15.1111 3.17485 15.1111 3.99997C15.1111 4.82508 14.7833 5.61641 14.1999 6.19985C13.6164 6.7833 12.8251 7.11108 12 7.11108C11.1749 7.11108 10.3836 6.7833 9.80011 6.19985C9.21667 5.61641 8.88889 4.82508 8.88889 3.99997ZM20.8889 0.888855C21.714 0.888855 22.5053 1.21663 23.0888 1.80008C23.6722 2.38353 24 3.17485 24 3.99997C24 4.82508 23.6722 5.61641 23.0888 6.19985C22.5053 6.7833 21.714 7.11108 20.8889 7.11108C20.0638 7.11108 19.2724 6.7833 18.689 6.19985C18.1056 5.61641 17.7778 4.82508 17.7778 3.99997C17.7778 3.17485 18.1056 2.38353 18.689 1.80008C19.2724 1.21663 20.0638 0.888855 20.8889 0.888855Z'
      fill='#DCDCDC'
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='10'
    height='16'
    viewBox='0 0 10 16'
    fill='none'
  >
    <path
      d='M0.763927 7.19313C0.317649 7.63941 0.317649 8.36416 0.763927 8.81044L7.61878 15.6653C8.06506 16.1116 8.78981 16.1116 9.23609 15.6653C9.68237 15.219 9.68237 14.4943 9.23609 14.048L3.18812 8L9.23252 1.95202C9.6788 1.50575 9.6788 0.780988 9.23252 0.334709C8.78624 -0.11157 8.06148 -0.11157 7.61521 0.334709L0.760357 7.18956L0.763927 7.19313Z'
      fill='#0F9058'
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='10'
    height='16'
    viewBox='0 0 10 16'
    fill='none'
  >
    <path
      d='M9.23607 7.19313C9.68235 7.63941 9.68235 8.36416 9.23607 8.81044L2.38122 15.6653C1.93494 16.1116 1.21019 16.1116 0.763909 15.6653C0.317629 15.219 0.317629 14.4943 0.763909 14.048L6.81188 8L0.767479 1.95202C0.3212 1.50575 0.3212 0.780988 0.767479 0.334709C1.21376 -0.11157 1.93852 -0.11157 2.38479 0.334709L9.23964 7.18956L9.23607 7.19313Z'
      fill='#0F9058'
    />
  </svg>
);

interface SearchHistoryItem {
  id: string;
  saved: boolean;
  group: string; // group_id for filtering
  groupName: string; // group_name for display
  searchCondition: string;
  searcher: string;
  date: string;
  isMenuOpen?: boolean;
}

interface SearchHistoryClientProps {
  initialSearchHistory: ServerSearchHistoryItem[];
  initialError: string | null;
  companyUserId: string;
}

export function SearchHistoryClient({ initialSearchHistory, initialError, companyUserId }: SearchHistoryClientProps) {
  const { user, accessToken, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SearchHistoryItem | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<SearchHistoryItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // ServerSearchHistoryItemをクライアント用のSearchHistoryItemに変換
  const transformSearchHistory = (items: ServerSearchHistoryItem[]): SearchHistoryItem[] => {
    return items.map(item => ({
      id: item.id,
      saved: item.is_saved,
      group: item.group_id, // group_idを使用してフィルタリングと統一
      groupName: item.group_name, // 表示用のgroup_name
      searchCondition: item.search_title,
      searcher: item.searcher_name,
      date: new Date(item.searched_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isMenuOpen: false,
    }));
  };

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(
    transformSearchHistory(initialSearchHistory)
  );

  const toggleMenu = (id: string) => {
    setSearchHistory((prev: SearchHistoryItem[]) =>
      prev.map((item: SearchHistoryItem) =>
        item.id === id
          ? { ...item, isMenuOpen: !item.isMenuOpen }
          : { ...item, isMenuOpen: false }
      )
    );
  };

  const toggleBookmark = (id: string) => {
    const item = searchHistory.find(h => h.id === id);
    if (!item) return;

    startTransition(async () => {
      const result = await updateSearchHistorySavedStatus(id, !item.saved);
      if (result.success) {
        setSearchHistory((prev: SearchHistoryItem[]) =>
          prev.map((prevItem: SearchHistoryItem) =>
            prevItem.id === id ? { ...prevItem, saved: !prevItem.saved } : prevItem
          )
        );
      }
    });
  };

  const handleEdit = (item: SearchHistoryItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
    // Close the dropdown menu
    setSearchHistory((prev: SearchHistoryItem[]) =>
      prev.map((i: SearchHistoryItem) => ({ ...i, isMenuOpen: false }))
    );
  };

  const handleSaveEdit = async (newSearchCondition: string) => {
    if (editingItem) {
      startTransition(async () => {
        const result = await updateSearchHistoryTitle(editingItem.id, newSearchCondition);
        if (result.success) {
          setSearchHistory((prev: SearchHistoryItem[]) =>
            prev.map((item: SearchHistoryItem) =>
              item.id === editingItem.id
                ? { ...item, searchCondition: newSearchCondition }
                : item
            )
          );
        } else {
          console.error('Failed to update search title:', result.error);
          // エラーハンドリング - ユーザーに通知したい場合
        }
      });
    }
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (item: SearchHistoryItem) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
    // Close the dropdown menu
    setSearchHistory((prev: SearchHistoryItem[]) =>
      prev.map((i: SearchHistoryItem) => ({ ...i, isMenuOpen: false }))
    );
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      startTransition(async () => {
        const result = await deleteSearchHistory(deletingItem.id);
        if (result.success) {
          setSearchHistory((prev: SearchHistoryItem[]) =>
            prev.filter((item: SearchHistoryItem) => item.id !== deletingItem.id)
          );
          setDeleteModalOpen(false);
          setDeletingItem(null);
        } else {
          console.error('Failed to delete search history:', result.error);
          // エラーハンドリング - ユーザーに通知したい場合
          // モーダルは開いたままにして、ユーザーに再試行の機会を与える
        }
      });
    } else {
      setDeleteModalOpen(false);
      setDeletingItem(null);
    }
  };

  // 検索条件をURLパラメータに変換する関数
  const buildSearchUrl = (searchConditions: any, groupId: string): string => {
    const params = new URLSearchParams();
    
    // グループIDを設定
    params.set('search_group', groupId);
    
    // キーワード（データベースではkeywords配列だが単体として扱う）
    if (searchConditions.keywords?.length > 0) {
      params.set('keyword', searchConditions.keywords.join(' '));
    }
    
    // 年齢
    if (searchConditions.age_min !== undefined && searchConditions.age_min !== null && searchConditions.age_min !== '') {
      params.set('age_min', searchConditions.age_min.toString());
    }
    if (searchConditions.age_max !== undefined && searchConditions.age_max !== null && searchConditions.age_max !== '') {
      params.set('age_max', searchConditions.age_max.toString());
    }
    
    // 現在の年収
    if (searchConditions.current_salary_min !== undefined && searchConditions.current_salary_min !== null && searchConditions.current_salary_min !== '') {
      params.set('current_salary_min', searchConditions.current_salary_min.toString());
    }
    if (searchConditions.current_salary_max !== undefined && searchConditions.current_salary_max !== null && searchConditions.current_salary_max !== '') {
      params.set('current_salary_max', searchConditions.current_salary_max.toString());
    }
    
    // 希望年収
    if (searchConditions.desired_salary_min !== undefined && searchConditions.desired_salary_min !== null && searchConditions.desired_salary_min !== '') {
      params.set('desired_salary_min', searchConditions.desired_salary_min.toString());
    }
    if (searchConditions.desired_salary_max !== undefined && searchConditions.desired_salary_max !== null && searchConditions.desired_salary_max !== '') {
      params.set('desired_salary_max', searchConditions.desired_salary_max.toString());
    }
    
    // 経験職種（データベースではjob_types）
    if (searchConditions.job_types?.length > 0) {
      params.set('experience_job_types', searchConditions.job_types.join(','));
    }
    
    // 経験業界（データベースではindustries）
    if (searchConditions.industries?.length > 0) {
      params.set('experience_industries', searchConditions.industries.join(','));
    }
    
    // 希望職種
    if (searchConditions.desired_job_types?.length > 0) {
      params.set('desired_job_types', searchConditions.desired_job_types.join(','));
    }
    
    // 希望業界
    if (searchConditions.desired_industries?.length > 0) {
      params.set('desired_industries', searchConditions.desired_industries.join(','));
    }
    
    // 希望勤務地（データベースではlocations）
    if (searchConditions.locations?.length > 0) {
      params.set('desired_locations', searchConditions.locations.join(','));
    }
    
    // 働き方
    if (searchConditions.work_styles?.length > 0) {
      params.set('work_styles', searchConditions.work_styles.join(','));
    }
    
    // 学歴（データベースではeducation_levels配列だが単体として扱う）
    if (searchConditions.education_levels?.length > 0) {
      params.set('education', searchConditions.education_levels[0]);
    }
    
    // スキル
    if (searchConditions.skills?.length > 0) {
      params.set('qualifications', searchConditions.skills.join(','));
    }
    
    // その他の条件
    if (searchConditions.current_company) {
      params.set('current_company', searchConditions.current_company);
    }
    if (searchConditions.english_level) {
      params.set('english_level', searchConditions.english_level);
    }
    if (searchConditions.other_language) {
      params.set('other_language', searchConditions.other_language);
    }
    if (searchConditions.other_language_level) {
      params.set('other_language_level', searchConditions.other_language_level);
    }
    if (searchConditions.transfer_time) {
      params.set('transfer_time', searchConditions.transfer_time);
    }
    if (searchConditions.selection_status) {
      params.set('selection_status', searchConditions.selection_status);
    }
    if (searchConditions.similar_company_industry) {
      params.set('similar_company_industry', searchConditions.similar_company_industry);
    }
    if (searchConditions.similar_company_location) {
      params.set('similar_company_location', searchConditions.similar_company_location);
    }
    if (searchConditions.last_login_min) {
      params.set('last_login_min', searchConditions.last_login_min);
    }
    if (searchConditions.job_type_and_search) {
      params.set('job_type_and_search', searchConditions.job_type_and_search);
    }
    if (searchConditions.industry_and_search) {
      params.set('industry_and_search', searchConditions.industry_and_search);
    }
    
    return `/company/search/result?${params.toString()}`;
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    // SearchHistoryItemからServerSearchHistoryItemを取得
    const serverItem = initialSearchHistory.find(h => h.id === item.id);
    if (serverItem) {
      const searchUrl = buildSearchUrl(serverItem.search_conditions, serverItem.group_id);
      router.push(searchUrl);
    }
  };

  // グループオプションを生成（重複なし）
  const uniqueGroupsMap = new Map();
  searchHistory.forEach(item => {
    if (!uniqueGroupsMap.has(item.group)) {
      uniqueGroupsMap.set(item.group, item.groupName);
    }
  });
  
  const groupOptions = [
    { value: '', label: '未選択' },
    ...Array.from(uniqueGroupsMap.entries()).map(([groupId, groupName]) => ({
      value: groupId,
      label: groupName
    }))
  ];

  // フィルタリング済みの検索履歴
  const filteredSearchHistory = searchHistory.filter(item => {
    // グループフィルタ
    if (selectedGroup && item.group !== selectedGroup) return false;
    
    // キーワードフィルタ
    if (keyword && !item.searchCondition.toLowerCase().includes(keyword.toLowerCase())) return false;
    
    // 保存済みフィルタ
    if (showSavedOnly && !item.saved) return false;
    
    return true;
  });

  // ページネーション計算
  const totalItems = filteredSearchHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSearchHistory.slice(startIndex, endIndex);
  const displayStartIndex = totalItems > 0 ? startIndex + 1 : 0;
  const displayEndIndex = Math.min(endIndex, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div
        className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10'
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className='w-full max-w-[1200px] mx-auto'>
          {/* Page Title */}
          <div className='flex items-center gap-4'>
            <SearchIcon />
            <h1
              className='text-white text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              検索履歴
            </h1>
          </div>
        </div>

        {/* Search Filters */}
        <div className='w-full max-w-[1200px] mx-auto mt-10'>
          <div className='bg-white rounded-[10px] p-6 min-[1200px]:p-10'>
            <div className='flex flex-col min-[1200px]:flex-row gap-6 min-[1200px]:gap-10 items-start'>
              {/* Group Select */}
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap'>
                  グループ
                </span>
                <SelectInput
                  options={groupOptions}
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                  placeholder='未選択'
                  className='w-full min-[1200px]:w-60'
                />
              </div>

              {/* Keyword Search */}
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap'>
                  検索条件名から検索
                </span>
                <div className='flex gap-2 w-full min-[1200px]:w-auto'>
                  <Input
                    type='text'
                    value={keyword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setKeyword(e.target.value)
                    }
                    placeholder='キーワード検索'
                    className='bg-white border-[#999999] flex-1 min-[1200px]:w-60 text-[#323232] text-[16px] tracking-[1.6px] placeholder:text-[#999999] h-auto py-1 rounded-[10px]'
                  />
                  <Button
                    variant='small-green'
                    size='figma-small'
                    className='px-6 py-2'
                  >
                    検索
                  </Button>
                </div>
              </div>
            </div>

            {/* Saved Only Checkbox */}
            <div className='mt-6'>
              <Checkbox
                checked={showSavedOnly}
                onChange={setShowSavedOnly}
                label={
                  <span className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                    保存済のみ表示
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-[#f9f9f9] px-20 pt-10 pb-20 min-h-[577px]'>
        <div className='w-full max-w-[1200px] mx-auto'>
          {/* Top Actions */}
          <div className='flex justify-between items-center mb-10'>
            <Button
              variant='blue-gradient'
              size='figma-blue'
              className='min-w-[160px]'
              onClick={() => {
                // Redirect to new search page
              router.push('/company/search');
              }}>
              新規検索
            </Button>

            {/* Pagination Info */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || totalItems === 0}
                className={currentPage === 1 || totalItems === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              >
                <ChevronLeftIcon />
              </button>
              <span className='text-[#323232] text-[12px] font-bold tracking-[1.2px]'>
                {displayStartIndex}〜{displayEndIndex}件 / {totalItems}件
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalItems === 0}
                className={currentPage === totalPages || totalItems === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className='flex items-center px-10 pb-2 border-b border-[#dcdcdc]'>
            {/* Spacer for bookmark icon */}
            <div className='w-[18px]'></div>

            {/* Group column */}
            <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[164px] ml-4 min-[1200px]:ml-6 text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
              グループ
            </div>

            {/* Search Condition column */}
            <div className='w-[320px] min-[1200px]:w-[400px] min-[1300px]:w-[500px] ml-4 min-[1200px]:ml-6 text-[#323232] text-[14px] font-bold tracking-[1.4px] truncate'>
              検索条件名
            </div>

            {/* Searcher column */}
            <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[160px] ml-4 min-[1200px]:ml-6 text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
              検索者
            </div>

            {/* Date column */}
            <div className='w-[80px] min-[1200px]:w-[90px] min-[1300px]:w-[100px] ml-4 min-[1200px]:ml-6 text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
              検索日
            </div>

            {/* Spacer for menu button */}
            <div className='w-[24px] ml-4 min-[1200px]:ml-6'></div>
          </div>

          {/* Search History Items */}
          <div className='flex flex-col gap-2 mt-2'>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">検索履歴を読み込んでいます...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">検索履歴の取得に失敗しました</p>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">検索履歴がありません</p>
              </div>
            ) : (
              currentItems.map((item: SearchHistoryItem) => (
              <div
                key={item.id}
                className='bg-white rounded-[10px] px-10 py-5 flex items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] relative hover:bg-gray-50 cursor-pointer transition-colors duration-150'
                onClick={() => handleHistoryClick(item)}
              >
                {/* Bookmark Icon */}
                <button
                  className='w-[18px] flex-shrink-0'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleBookmark(item.id);
                  }}
                >
                  <BookmarkIcon filled={item.saved} />
                </button>

                {/* Group Badge */}
                <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[164px] ml-4 min-[1200px]:ml-6 flex-shrink-0 bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-3 min-[1200px]:px-5 py-1 flex items-center justify-center'>
                  <span className='text-white text-[14px] font-bold tracking-[1.4px] truncate'>
                    {item.groupName}
                  </span>
                </div>

                {/* Search Condition */}
                <div className='w-[320px] min-[1200px]:w-[400px] min-[1300px]:w-[500px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] min-[1200px]:text-[16px] font-bold tracking-[1.4px] min-[1200px]:tracking-[1.6px] truncate'>
                  {item.searchCondition}
                </div>

                {/* Searcher */}
                <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[160px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] min-[1200px]:text-[16px] font-bold tracking-[1.4px] min-[1200px]:tracking-[1.6px] truncate'>
                  {item.searcher}
                </div>

                {/* Date */}
                <div className='w-[80px] min-[1200px]:w-[90px] min-[1300px]:w-[100px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate'>
                  {item.date}
                </div>

                {/* Menu Button */}
                <div className='w-[24px] ml-4 min-[1200px]:ml-6 flex-shrink-0 relative ml-auto'>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleMenu(item.id);
                  }}>
                    <DotsMenuIcon />
                  </button>

                  {/* Dropdown Menu */}
                  {item.isMenuOpen && (
                    <div className='absolute top-5 right-0 bg-white rounded-[5px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] p-2 min-w-[80px] z-10'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleEdit(item);
                        }}
                        className='block w-full text-left text-[#323232] text-[14px] font-medium tracking-[1.4px] py-1 hover:bg-gray-50'
                      >
                        編集
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(item);
                        }}
                        className='block w-full text-left text-[#ff5b5b] text-[14px] font-medium tracking-[1.4px] py-1 hover:bg-gray-50'
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-10"
          />
        </div>
      </div>

      {/* Edit Modal */}
      <EditSearchConditionModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
        groupName={editingItem?.groupName || ''}
        initialValue={editingItem?.searchCondition || ''}
      />

      {/* Delete Modal */}
      <DeleteSearchConditionModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingItem(null);
        }}
        onDelete={handleConfirmDelete}
        searchConditionName={deletingItem?.searchCondition || ''}
      />
    </>
  );
}
