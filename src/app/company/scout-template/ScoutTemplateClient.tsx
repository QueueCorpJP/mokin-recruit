'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { 
  type ScoutTemplate as ServerScoutTemplate,
  type JobPosting 
} from './actions';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';      

// Icons
const MailIcon = () => (
  <img
    src='/images/mail.svg'
    alt='メッセージテンプレートアイコン'
    width={32}
    height={32}
    style={{ filter: 'brightness(0) invert(1)' }}
  />
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

const SortUpIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='8'
    viewBox='0 0 12 8'
    fill='none'
  >
    <path
      d='M6 0L11.1962 7.5H0.803847L6 0Z'
      fill='#666666'
    />
  </svg>
);

const SortDownIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='8'
    viewBox='0 0 12 8'
    fill='none'
  >
    <path
      d='M6 8L0.803847 0.5H11.1962L6 8Z'
      fill='#666666'
    />
  </svg>
);

interface ScoutTemplateItem {
  id: string;
  group: string; // group_id for filtering
  groupName: string; // group_name for display
  templateName: string;
  subject: string;
  targetJobId: string;
  targetJobTitle: string;
  createdAt: string;
  updatedAt: string;
  isMenuOpen?: boolean;
}

interface ScoutTemplateClientProps {
  initialScoutTemplates: ServerScoutTemplate[];
  initialJobPostings: JobPosting[];
  initialError: string | null;
}

type SortField = 'groupName' | 'templateName' | 'subject' | 'targetJobTitle' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function ScoutTemplateClient({ initialScoutTemplates, initialJobPostings, initialError }: ScoutTemplateClientProps) {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  
  // クライアントサイドでの認証状態確認
  useEffect(() => {
    const checkClientAuth = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        console.log('🖥️ Client-side auth check:', {
          user: user ? { id: user.id, email: user.email, user_metadata: user.user_metadata } : null,
          error: error?.message
        });
        
        // セッション状態も確認
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🖥️ Client-side session:', session ? 'exists' : 'none');
        
      } catch (error) {
        console.error('🖥️ Client auth check error:', error);
      }
    };
    
    checkClientAuth();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading] = useState(false);
  const [error] = useState<string | null>(initialError);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // ServerScoutTemplateをクライアント用のScoutTemplateItemに変換
  const transformScoutTemplates = (items: ServerScoutTemplate[]): ScoutTemplateItem[] => {
    return items.map(item => ({
      id: item.id,
      group: item.group_id, // group_idを使用してフィルタリングと統一
      groupName: item.group_name, // 表示用のgroup_name
      templateName: item.template_name,
      subject: item.subject,
      targetJobId: item.target_job_posting_id,
      targetJobTitle: item.target_job_title,
      createdAt: new Date(item.created_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      updatedAt: new Date(item.updated_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isMenuOpen: false,
    }));
  };

  const [scoutTemplates, setScoutTemplates] = useState<ScoutTemplateItem[]>(
    transformScoutTemplates(initialScoutTemplates)
  );

  const toggleMenu = (id: string) => {
    setScoutTemplates((prev: ScoutTemplateItem[]) =>
      prev.map((item: ScoutTemplateItem) =>
        item.id === id
          ? { ...item, isMenuOpen: !item.isMenuOpen }
          : { ...item, isMenuOpen: false }
      )
    );
  };


  const handleEdit = (item: ScoutTemplateItem) => {
    try {
      console.log('Editing template:', item.id);
      // editページに遷移し、テンプレート情報をクエリパラメータで渡す
      router.push(`/company/scout-template/edit?id=${item.id}`);
      // Close the dropdown menu
      setScoutTemplates((prev: ScoutTemplateItem[]) =>
        prev.map((i: ScoutTemplateItem) => ({ ...i, isMenuOpen: false }))
      );
    } catch (error) {
      console.error('Failed to navigate to edit page:', error);
      alert('編集ページへの遷移に失敗しました');
    }
  };

  const handleDuplicate = (item: ScoutTemplateItem) => {
    try {
      console.log('Duplicating template:', item.id);
      // 新規作成ページに遷移し、テンプレート情報をクエリパラメータで渡す
      const params = new URLSearchParams({
        duplicate: 'true',
        templateId: item.id,
        groupId: item.group,
        groupName: item.groupName,
        templateName: item.templateName
      });
      router.push(`/company/scout-template/new?${params.toString()}`);
      
      // Close the dropdown menu
      setScoutTemplates((prev: ScoutTemplateItem[]) =>
        prev.map((i: ScoutTemplateItem) => ({ ...i, isMenuOpen: false }))
      );
    } catch (error) {
      console.error('Failed to navigate to new page for duplication:', error);
      alert('複製ページへの遷移に失敗しました');
    }
  };

  const handleDelete = (item: ScoutTemplateItem) => {
    try {
      console.log('Deleting template:', item.id);
      // editページに遷移し、テンプレート情報をクエリパラメータで渡す（編集と同じ処理）
      router.push(`/company/scout-template/edit?id=${item.id}`);
      // Close the dropdown menu
      setScoutTemplates((prev: ScoutTemplateItem[]) =>
        prev.map((i: ScoutTemplateItem) => ({ ...i, isMenuOpen: false }))
      );
    } catch (error) {
      console.error('Failed to navigate to edit page for deletion:', error);
      alert('削除ページへの遷移に失敗しました');
    }
  };

  // ソート機能
  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    setCurrentPage(1); // ソート時は最初のページに戻る
  };

  const getSortedData = (data: ScoutTemplateItem[]): ScoutTemplateItem[] => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const { field, direction } = sortConfig;
      let aValue: string | Date;
      let bValue: string | Date;

      switch (field) {
        case 'groupName':
          aValue = a.groupName;
          bValue = b.groupName;
          break;
        case 'templateName':
          aValue = a.templateName;
          bValue = b.templateName;
          break;
        case 'subject':
          aValue = a.subject;
          bValue = b.subject;
          break;
        case 'targetJobTitle':
          aValue = a.targetJobTitle;
          bValue = b.targetJobTitle;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          return 0;
      }

      if (field === 'createdAt' || field === 'updatedAt') {
        const result = (aValue as Date).getTime() - (bValue as Date).getTime();
        return direction === 'asc' ? result : -result;
      } else {
        const result = (aValue as string).localeCompare(bValue as string);
        return direction === 'asc' ? result : -result;
      }
    });
  };

  // グループオプションを生成（重複なし）
  const uniqueGroupsMap = new Map();
  scoutTemplates.forEach(item => {
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

  // 求人オプションを生成
  const jobOptions = [
    { value: '', label: 'すべて' },
    ...initialJobPostings.map(job => ({
      value: job.id,
      label: job.title
    }))
  ];

  // フィルタリング済みのスカウトテンプレート
  const filteredScoutTemplates = scoutTemplates.filter(item => {
    // グループフィルタ
    if (selectedGroup && item.group !== selectedGroup) return false;
    
    // 求人フィルタ
    if (selectedJob && item.targetJobId !== selectedJob) return false;
    
    // キーワードフィルタ（テンプレート名と求人タイトルで検索）
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      const templateNameMatch = item.templateName.toLowerCase().includes(keywordLower);
      const jobTitleMatch = item.targetJobTitle.toLowerCase().includes(keywordLower);
      if (!templateNameMatch && !jobTitleMatch) return false;
    }
    
    return true;
  });

  // ソートを適用
  const sortedScoutTemplates = getSortedData(filteredScoutTemplates);

  // ページネーション計算
  const totalItems = sortedScoutTemplates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedScoutTemplates.slice(startIndex, endIndex);
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
            <MailIcon />
            <h1
              className='text-white text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウトテンプレート一覧
            </h1>
          </div>
        </div>

        {/* Search Filters */}
        <div className='w-full max-w-[1200px] mx-auto mt-10'>
          <div className='flex flex-col bg-white rounded-[10px] p-6 min-[1200px]:p-10 gap-4'>
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
                  placeholder='すべて'
                  className='w-full min-[1200px]:w-60'
                />
              </div>

              {/* Job Search */}
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap'>
                  対象の求人
                </span>
               <SelectInput
                  options={jobOptions}
                  value={selectedJob}
                  onChange={setSelectedJob}
                  placeholder='すべて'
                  className='w-full min-[1200px]:w-60'
                />
              </div>
               
            </div>
            <div className='flex gap-4 w-[700px]'>
                <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap flex items-center'>
                  テンプレート名、求人タイトルから検索
                </span>
                  <Input
                    type='text'
                    value={keyword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setKeyword(e.target.value)
                    }
                    placeholder='キーワード検索'
                    className='bg-white border-[#999999] flex-1 text-[#323232] text-[16px] tracking-[1.6px] placeholder:text-[#999999] h-auto py-1 rounded-[8px]'
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
                router.push('/company/scout-template/new');
              }}>
              新規スカウトテンプレート作成
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
            {/* Group column */}
            <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[164px]'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                グループ
              </span>
            </div>

            {/* Template Name column */}
            <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                テンプレート名
              </span>
            </div>

            {/* Subject column */}
            <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                件名
              </span>
            </div>

            {/* Target Job column */}
            <div className='w-[160px] min-[1200px]:w-[180px] min-[1300px]:w-[200px] ml-4 min-[1200px]:ml-6'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                対象の求人
              </span>
            </div>

            {/* Created Date column */}
            <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                作成日
              </span>
            </div>

            {/* Updated Date column */}
            <div className='flex-1 ml-4 min-[1200px]:ml-6'>
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                最終更新日
              </span>
            </div>

            {/* Spacer for menu button */}
            <div className='w-[24px]'></div>
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
              currentItems.map((item: ScoutTemplateItem) => (
              <div
                key={item.id}
                className='bg-white rounded-[10px] px-10 py-5 flex items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] relative'
              >
                {/* Group Badge */}
                <div className='w-[120px] min-[1200px]:w-[140px] min-[1300px]:w-[164px] flex-shrink-0 bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-3 min-[1200px]:px-5 py-1 flex items-center justify-center'>
                  <span className='text-white text-[14px] font-bold tracking-[1.4px] truncate'>
                    {item.groupName}
                  </span>
                </div>

                {/* Template Name */}
                <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] min-[1200px]:text-[16px] font-bold tracking-[1.4px] min-[1200px]:tracking-[1.6px] truncate'>
                  {item.templateName}
                </div>

                {/* Subject */}
                <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] min-[1200px]:text-[16px] font-bold tracking-[1.4px] min-[1200px]:tracking-[1.6px] truncate'>
                  {item.subject}
                </div>

                {/* Target Job */}
                <div className='w-[160px] min-[1200px]:w-[180px] min-[1300px]:w-[200px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] min-[1200px]:text-[16px] font-bold tracking-[1.4px] min-[1200px]:tracking-[1.6px] truncate'>
                  {item.targetJobTitle}
                </div>

                {/* Created Date */}
                <div className='w-[140px] min-[1200px]:w-[160px] min-[1300px]:w-[180px] ml-4 min-[1200px]:ml-6 flex-shrink-0 text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                  {item.createdAt}
                </div>

                {/* Updated Date */}
                <div className='flex-1 ml-4 min-[1200px]:ml-6 text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                  {item.updatedAt}
                </div>

                {/* Menu Button */}
                <div className='w-[24px] flex-shrink-0 relative'>
                  <button onClick={() => toggleMenu(item.id)}>
                    <DotsMenuIcon />
                  </button>

                  {/* Dropdown Menu */}
                  {item.isMenuOpen && (
                    <div className='absolute top-5 left-0 bg-white rounded-[5px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] p-2 min-w-[80px] z-10'>
                      <button
                        onClick={() => handleEdit(item)}
                        className='block w-full text-left text-[#323232] text-[14px] font-medium tracking-[1.4px] py-1 hover:bg-gray-50'
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDuplicate(item)}
                        className='block w-full text-left text-[#323232] text-[14px] font-medium tracking-[1.4px] py-1 hover:bg-gray-50'
                      >
                        複製
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
    </>
  );
}