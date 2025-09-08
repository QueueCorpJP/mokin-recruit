'use client';

import { SearchIcon } from 'lucide-react';
import { Star } from 'lucide-react';
import { BaseInput } from '@/components/ui/base-input';
import { useState, useEffect, useTransition, useCallback, useMemo } from 'react';
import { addFavoriteAction, removeFavoriteAction } from '@/lib/actions/favoriteActions';
import { useFavoriteStatusQuery } from '@/hooks/useFavoriteApi';

import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { LocationModal } from '@/app/company/job/LocationModal';
import { Modal } from '@/components/ui/mo-dal';
import { X } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { JobPostCard } from '@/components/ui/JobPostCard';
import { Pagination } from '@/components/ui/Pagination';

import { useRouter, useSearchParams } from 'next/navigation';
import { JobSearchResult, getJobSearchData } from './actions';

interface CandidateSearchClientProps {
  initialJobs: JobSearchResult[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialSearchConditions: {
    keyword: string;
    location: string;
    salaryMin: string;
    industries: string[];
    jobTypes: string[];
    appealPoints: string[];
    page: number;
    limit: number;
  };
}

export default function CandidateSearchClient({ 
  initialJobs,
  initialPagination,
  initialSearchConditions
}: CandidateSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialSearchConditions.jobTypes);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialSearchConditions.location ? initialSearchConditions.location.split(',').filter(Boolean) : []
  );
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialSearchConditions.industries);
  const [searchKeyword, setSearchKeyword] = useState(initialSearchConditions.keyword);
  
  // 年収とアピールポイントの状態
  const [selectedSalary, setSelectedSalary] = useState(initialSearchConditions.salaryMin || '');
  const [selectedAppealPoint, setSelectedAppealPoint] = useState(
    initialSearchConditions.appealPoints[0] || ''
  );
  
  // 求人データとローディング状態
  const [jobCards, setJobCards] = useState<JobSearchResult[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState(initialPagination);

  // お気に入り状態を取得（メモ化で無限レンダリングを防止）
  const jobIds = useMemo(() => jobCards.map(job => job.id), [jobCards]);
  const { data: favoriteStatus, refetch: refetchFavoriteStatus } = useFavoriteStatusQuery(jobIds);

  // 初期化とURLパラメータの読み取り
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    if (!initialized && typeof window !== 'undefined') {
      setInitialized(true);
      
      // URLパラメータを直接読み取り（状態の同期のため）
      const urlParams = new URLSearchParams(window.location.search);
      
      // URLパラメータがある場合のみ状態を更新（初期データと重複を避ける）
      if (urlParams.toString()) {
        const parsedConditions = {
          keyword: urlParams.get('keyword') || '',
          location: urlParams.get('location') || '',
          salaryMin: urlParams.get('salaryMin') || '',
          industries: urlParams.get('industries')?.split(',').filter(Boolean) || [],
          jobTypes: urlParams.get('jobTypes')?.split(',').filter(Boolean) || [],
          appealPoints: urlParams.get('appealPoints')?.split(',').filter(Boolean) || [],
          page: parseInt(urlParams.get('page') || '1'),
          limit: 10
        };
        
        // 状態を初期化（URLパラメータに基づく）
        setSelectedJobTypes(parsedConditions.jobTypes);
        setSelectedLocations(parsedConditions.location ? parsedConditions.location.split(',').filter(Boolean) : []);
        setSelectedIndustries(parsedConditions.industries);
        setSearchKeyword(parsedConditions.keyword);
        setSelectedSalary(parsedConditions.salaryMin);
        setSelectedAppealPoint(parsedConditions.appealPoints[0] || '');
        
        // URLパラメータがあり、初期データと異なる場合のみ検索実行
        const hasUrlParams = urlParams.toString();
        const isDifferentFromInitial = (
          parsedConditions.keyword !== initialSearchConditions.keyword ||
          parsedConditions.location !== initialSearchConditions.location ||
          parsedConditions.salaryMin !== initialSearchConditions.salaryMin ||
          JSON.stringify(parsedConditions.industries) !== JSON.stringify(initialSearchConditions.industries) ||
          JSON.stringify(parsedConditions.jobTypes) !== JSON.stringify(initialSearchConditions.jobTypes) ||
          JSON.stringify(parsedConditions.appealPoints) !== JSON.stringify(initialSearchConditions.appealPoints) ||
          parsedConditions.page !== initialSearchConditions.page
        );
        
        if (hasUrlParams && isDifferentFromInitial) {
          // 直接実行（useCallbackを避ける）
          (async () => {
            setLoading(true);
            try {
              const result = await getJobSearchData(parsedConditions);
              if (result.success && result.data) {
                setJobCards(result.data.jobs);
                setPagination(result.data.pagination);
              }
            } catch (error) {
              console.error('Initial search error:', error);
            } finally {
              setLoading(false);
            }
          })();
        }
      }
    }
  }, [initialized, initialSearchConditions]);

  // 検索条件をURLに反映（サーバーレンダリングを避ける）
  const updateURL = (newConditions: any) => {
    const params = new URLSearchParams();
    
    if (newConditions.keyword) params.set('keyword', newConditions.keyword);
    if (newConditions.location) params.set('location', newConditions.location);
    if (newConditions.salaryMin && newConditions.salaryMin !== '問わない') params.set('salaryMin', newConditions.salaryMin);
    if (newConditions.industries.length > 0) params.set('industries', newConditions.industries.join(','));
    if (newConditions.jobTypes.length > 0) params.set('jobTypes', newConditions.jobTypes.join(','));
    if (newConditions.appealPoints.length > 0) params.set('appealPoints', newConditions.appealPoints.join(','));
    if (newConditions.page > 1) params.set('page', newConditions.page.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    // URLの更新をHistory APIで直接行い、Reactのrouterを使わない
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/candidate/search/setting${newUrl}`);
    }
  };

  // 検索条件を使って検索を実行（useCallbackで安定化）
  const fetchJobsWithConditions = useCallback(async (conditions: any) => {
    setLoading(true);
    
    try {
      const result = await getJobSearchData(conditions);
      
      if (result.success && result.data) {
        setJobCards(result.data.jobs);
        setPagination(result.data.pagination);
        
        // URLも更新する
        updateURL(conditions);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 現在の状態を使って検索を実行
  const fetchJobs = useCallback(async (page: number = 1) => {
    const searchConditions = {
      keyword: searchKeyword,
      location: selectedLocations.join(','),
      salaryMin: selectedSalary && selectedSalary !== '問わない' ? selectedSalary.replace(/[^\d]/g, '') : undefined,
      industries: selectedIndustries,
      jobTypes: selectedJobTypes,
      appealPoints: selectedAppealPoint ? [selectedAppealPoint] : [],
      page: page,
      limit: pagination.limit || 10
    };
    
    await fetchJobsWithConditions(searchConditions);
  }, [searchKeyword, selectedLocations, selectedSalary, selectedIndustries, selectedJobTypes, selectedAppealPoint, pagination.limit, fetchJobsWithConditions]);

  // 検索実行（条件変更時）
  const handleSearch = () => {
    fetchJobs(1); // 1ページ目から検索結果を表示
  };

  // スター切り替え（サーバーアクション使用）
  const handleStarClick = async (idx: number) => {
    const job = jobCards[idx];
    const jobId = job.id;
    const isCurrentlyStarred = favoriteStatus?.[jobId] || false;

    // ローディング状態を設定
    setFavoriteLoading(prev => ({ ...prev, [jobId]: true }));

    try {
      let response;
      if (isCurrentlyStarred) {
        response = await removeFavoriteAction(jobId);
      } else {
        response = await addFavoriteAction(jobId);
      }

      if (response.success) {
        // お気に入り状態を再取得
        await refetchFavoriteStatus();
      } else {
        console.error('お気に入り操作エラー:', response.error);
        alert(response.error || 'お気に入り操作に失敗しました');
      }
    } catch (error) {
      console.error('お気に入り操作エラー:', error);
      alert('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    } finally {
      // ローディング状態を解除
      setFavoriteLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // 年収セレクト用
  const salaryOptions = [
    '問わない',
    '600万円以上',
    '700万円以上',
    '800万円以上',
    '900万円以上',
    '1000万円以上',
    '1100万円以上',
    '1200万円以上',
    '1300万円以上',
    '1400万円以上',
    '1500万円以上',
    '1600万円以上',
    '1700万円以上',
    '1800万円以上',
    '1900万円以上',
    '2000万円以上',
    '2100万円以上',
    '2200万円以上',
    '2300万円以上',
    '2400万円以上',
    '2500万円以上',
    '2600万円以上',
    '2700万円以上',
    '2800万円以上',
    '2900万円以上',
    '3000万円以上',
    '4000万円以上',
    '5000万円以上',
  ].map(v => ({ value: v, label: v }));

  // アピールポイントセレクト用
  const appealPointOptions = [
    'CxO候補',
    '新規事業立ち上げ',
    '経営戦略に関与',
    '裁量が大きい',
    'スピード感がある',
    'グローバル事業に関与',
    '成長フェーズ',
    '上場準備中',
    '社会課題に貢献',
    '少数精鋭',
    '代表と距離が近い',
    '20〜30代中心',
    'フラットな組織',
    '多様な人材が活躍',
    'フレックス制度',
    'リモートあり',
    '副業OK',
    '残業少なめ',
    '育児／介護と両立しやすい',
  ].map(v => ({ value: v, label: v }));
  const [isSearchConditionActive, setIsSearchConditionActive] = useState(false);

  // タグ展開状態の管理
  const [showAllJobTypes, setShowAllJobTypes] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);

  // ページネーション処理（サーバーサイド）
  const handlePageChange = (page: number) => {
    fetchJobs(page);
    
    // ページ遷移後にページトップにスクロール
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <main>
        <section className='w-full px-4 py-6 md:px-[80px] md:py-[40px] bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] flex items-center justify-center'>
          <div className='max-w-[1280px] w-full h-full flex flex-col relative'>
            <div className='flex flex-row items-center justify-between md:justify-start md:items-start md:flex-col md:flex md:relative'>
              <div className='flex items-center'>
                <SearchIcon size={32} className='text-white' />
                <span className='ml-4 text-white text-[20px] md:text-2xl font-bold'>
                  求人を探す
                </span>
              </div>
              {/* モバイルではstatic配置、md以上でabsolute配置 */}
              <button
                className='w-[150px] h-[94px] border-2 border-white rounded-[10px] bg-transparent p-[14px] hover:bg-white/30 transition-colors duration-150 md:mt-0 md:absolute md:right-0 md:top-0'
                style={{ minWidth: 150, minHeight: 94 }}
                onClick={() => router.push('/candidate/job/favorite')}
              >
                <div className='flex flex-col items-center justify-center h-full gap-[10px]'>
                  <Star size={24} fill='white' stroke='white' />
                  <span className='text-white text-[16px] font-bold'>
                    お気に入り求人
                  </span>
                </div>
              </button>
            </div>
            <div className='flex-1 flex items-center justify-center mt-10'>
              <div className='w-full md:w-[742px] bg-white rounded-lg shadow p-6 md:p-[40px]'>
                <div className='max-w-[662px] w-full mx-auto flex flex-col gap-6'>
                  <BaseInput 
                    placeholder='キーワード検索' 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />

                  <div className='flex flex-col md:flex-row gap-6 items-start justify-start w-full'>
                    {/* 職種ボタン＋ラベル */}
                    <div className='flex flex-col items-start w-full md:w-auto'>
                      <button
                        type='button'
                        onClick={() => setJobTypeModalOpen(true)}
                        className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-full md:w-[205px]'
                      >
                        <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
                          職種を選択
                        </span>
                      </button>
                      {selectedJobTypes.length > 0 && (
                        <div className='flex flex-col items-start mt-2'>
                          <div className='flex flex-col gap-2 w-full'>
                            {(showAllJobTypes ? selectedJobTypes : selectedJobTypes.slice(0, 6)).map(item => (
                              <div
                                key={item}
                                className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {item}
                                </span>
                                <button
                                  className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                                  onClick={() =>
                                    setSelectedJobTypes(
                                      selectedJobTypes.filter(j => j !== item)
                                    )
                                  }
                                  aria-label='削除'
                                >
                                  <X size={18} className='text-[#0f9058]' />
                                </button>
                              </div>
                            ))}
                            {selectedJobTypes.length > 6 && (
                              <button
                                onClick={() => setShowAllJobTypes(!showAllJobTypes)}
                                className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] hover:underline cursor-pointer bg-transparent border-none p-0"
                              >
                                {showAllJobTypes ? '折りたたむ' : `+${selectedJobTypes.length - 6}件`}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 勤務地ボタン＋ラベル */}
                    <div className='flex flex-col items-start w-full md:w-auto'>
                      <button
                        type='button'
                        onClick={() => setLocationModalOpen(true)}
                        className='flex flex-row gap-2.5 h-[50px] items-center justify-center min-w-40 px-10 py-0 rounded-[32px] border border-[#999999] w-full md:w-[205px]'
                      >
                        <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
                          勤務地を選択
                        </span>
                      </button>
                      {selectedLocations.length > 0 && (
                        <div className='flex flex-col items-start mt-2'>
                          <div className='flex flex-row flex-wrap gap-2 max-w-[205px] w-full'>
                            {(showAllLocations ? selectedLocations : selectedLocations.slice(0, 6)).map(item => (
                              <div
                                key={item}
                                className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                              >
                                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                  {item}
                                </span>
                                <button
                                  className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                                  onClick={() =>
                                    setSelectedLocations(
                                      selectedLocations.filter(l => l !== item)
                                    )
                                  }
                                  aria-label='削除'
                                >
                                  <X size={18} className='text-[#0f9058]' />
                                </button>
                              </div>
                            ))}
                          </div>
                          {selectedLocations.length > 6 && (
                            <button
                              onClick={() => setShowAllLocations(!showAllLocations)}
                              className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] hover:underline cursor-pointer bg-transparent border-none p-0 mt-2 w-full text-center"
                            >
                              {showAllLocations ? '折りたたむ' : `+${selectedLocations.length - 6}件`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {/* セレクトコンポーネント（年収） */}
                    <div className='w-full md:w-[205px]'>
                      <SelectInput
                        options={salaryOptions}
                        value={selectedSalary}
                        onChange={v => setSelectedSalary(v)}
                        placeholder={
                          selectedSalary
                            ? `年収：${selectedSalary.length > 7 ? selectedSalary.slice(0, 7) + '...' : selectedSalary}`
                            : '年収'
                        }
                        className='w-full'
                        style={{
                          padding: '8px 16px 8px 11px',
                          color: '#323232',
                        }}
                      />
                    </div>
                  </div>
                  {/* 幅100%、高さ32pxのdiv（中央に線を追加） */}
                  <div
                    className=''
                    style={{
                      width: '100%',
                      height: '32px',
                      position: 'relative',
                    }}
                  >
                    {/* 線の上に白いdiv */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: 0,
                        width: '100%',
                        height: '16px',
                        background: '#FFF',
                        zIndex: 2,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: '#EFEFEF',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                    {/* 線を覆う中央の184x32pxのdiv */}
                    <button
                      onClick={() => setIsSearchConditionActive(!isSearchConditionActive)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '184px',
                        height: '32px',
                        background: '#fff',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 3,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      className='flex items-center justify-center gap-4'
                    >
                      <span className='text-[#0F9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[Noto_Sans_JP]'>
                        検索条件追加
                      </span>
                      <svg
                        width='14'
                        height='10'
                        viewBox='0 0 14 10'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{ 
                          transform: isSearchConditionActive ? 'rotate(0deg)' : 'rotate(180deg)',
                          transition: 'transform 0.4s ease'
                        }}
                      >
                        <path
                          d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                          fill='#0F9058'
                        />
                      </svg>
                    </button>
                  </div>
                  {/* 新しいコンテンツ用のdiv（業種・アピールポイント） */}
                  {isSearchConditionActive && (
                    <div className='rounded flex flex-col md:flex-row gap-6 justify-center'>
                      {/* 業種を選択ボタン＋ラベル */}
                      <div className='flex flex-col items-start w-full md:w-[319px]'>
                        <button
                          type='button'
                          onClick={() => setIndustryModalOpen(true)}
                          className='flex flex-row gap-2.5 h-[50px] items-center justify-center px-10 py-0 rounded-[32px] border border-[#999999] w-full bg-white shadow-sm'
                        >
                          <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full text-center">
                            業種を選択
                          </span>
                        </button>
                        {selectedIndustries.length > 0 && (
                          <div className='flex flex-col items-start mt-2'>
                            <div className='flex flex-col gap-2 w-full'>
                              {(showAllIndustries ? selectedIndustries : selectedIndustries.slice(0, 6)).map(item => (
                                <div
                                  key={item}
                                  className='bg-[#d2f1da] flex flex-row items-center justify-start px-[11px] py-[4px] rounded-[5px] w-fit'
                                >
                                  <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                                    {item}
                                  </span>
                                  <button
                                    className='ml-0.5 p-1 rounded hover:bg-[#b6e5c5] transition-colors'
                                    onClick={() =>
                                      setSelectedIndustries(
                                        selectedIndustries.filter(j => j !== item)
                                      )
                                    }
                                    aria-label='削除'
                                  >
                                    <X size={18} className='text-[#0f9058]' />
                                  </button>
                                </div>
                              ))}
                              {selectedIndustries.length > 6 && (
                                <button
                                  onClick={() => setShowAllIndustries(!showAllIndustries)}
                                  className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] hover:underline cursor-pointer bg-transparent border-none p-0"
                                >
                                  {showAllIndustries ? '折りたたむ' : `+${selectedIndustries.length - 6}件`}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* アピールポイントセレクト */}
                      <div className='w-full md:w-[319px]'>
                        <SelectInput
                          options={appealPointOptions}
                          value={selectedAppealPoint}
                          onChange={v => setSelectedAppealPoint(v)}
                          placeholder={
                            selectedAppealPoint
                              ? `アピールポイント：${selectedAppealPoint.length > 19 ? selectedAppealPoint.slice(0, 19) + '...' : selectedAppealPoint}`
                              : 'アピールポイント'
                          }
                          className='w-full'
                          style={{
                            padding: '8px 16px 8px 11px',
                            color: '#323232',
                            background: '#fff',
                            border: '1px solid #999999',
                            borderRadius: '5px',
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {/* 業種モーダル */}
                  {industryModalOpen && (
                    <Modal
                      title='業種を選択'
                      isOpen={industryModalOpen}
                      onClose={() => setIndustryModalOpen(false)}
                      primaryButtonText='決定'
                      onPrimaryAction={() => setIndustryModalOpen(false)}
                      width='800px'
                      height='680px'
                    >
                      <IndustryModal
                        selectedIndustries={selectedIndustries}
                        onIndustriesChange={setSelectedIndustries}
                        onClose={() => setIndustryModalOpen(false)}
                      />
                    </Modal>
                  )}
                  {/* 職種モーダル */}
                  {jobTypeModalOpen && (
                    <Modal
                      title='職種を選択'
                      isOpen={jobTypeModalOpen}
                      onClose={() => setJobTypeModalOpen(false)}
                      primaryButtonText='決定'
                      onPrimaryAction={() => setJobTypeModalOpen(false)}
                      width='800px'
                      height='680px'
                    >
                      <JobTypeModal
                        selectedJobTypes={selectedJobTypes}
                        setSelectedJobTypes={setSelectedJobTypes}
                      />
                    </Modal>
                  )}
                  {/* 勤務地モーダル */}
                  {locationModalOpen && (
                    <Modal
                      title='勤務地を選択'
                      isOpen={locationModalOpen}
                      onClose={() => setLocationModalOpen(false)}
                      primaryButtonText='決定'
                      onPrimaryAction={() => setLocationModalOpen(false)}
                      width='800px'
                      height='680px'
                    >
                      <LocationModal
                        selectedLocations={selectedLocations}
                        setSelectedLocations={setSelectedLocations}
                      />
                    </Modal>
                  )}
                  {/* 新しいフィルター用div（仮） */}
                  <div className='flex flex-row gap-6 justify-center'>
                    <button
                      type='button'
                      onClick={handleSearch}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        minWidth: '160px',
                        padding: '15px 40px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        borderRadius: '32px',
                        background: 'linear-gradient(263deg, #26AF94 0%, #3A93CB 100%)',
                        boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.15)',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                      }}
                      className='w-full md:w-[160px] transition-all duration-150 hover:shadow-[0_5px_10px_0_rgba(0,0,0,0.15)] hover:bg-[linear-gradient(263deg,#249881_0%,#27668D_100%)]'
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.background = 'linear-gradient(263deg, #249881 0%, #27668D 100%)';
                          e.currentTarget.style.boxShadow = '0 5px 10px 0 rgba(0, 0, 0, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.background = 'linear-gradient(263deg, #26AF94 0%, #3A93CB 100%)';
                          e.currentTarget.style.boxShadow = '0 5px 10px 0 rgba(0, 0, 0, 0.15)';
                        }
                      }}
                    >
                      {loading ? '検索中...' : '検索'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* ここにコンテンツを追加できます */}
          </div>
        </section>
        <section className='w-full bg-[#F9F9F9] py-4 md:pt-10 px-6 pb-20'>
          <div className='max-w-[1280px] mx-auto'>
            {/* ページネーションデザイン（矢印アイコン8px） */}
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <button
                className={`p-1 ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-70'}`}
                onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                aria-label="前のページ"
              >
                <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
              </button>
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232] cursor-pointer hover:text-[#0F9058] transition-colors'
                    onClick={() => {
                      const targetPage = prompt(`ページ番号を入力してください (1-${pagination.totalPages}):`, pagination.page.toString());
                      if (targetPage) {
                        const pageNum = parseInt(targetPage, 10);
                        if (pageNum >= 1 && pageNum <= pagination.totalPages) {
                          handlePageChange(pageNum);
                        } else {
                          alert(`有効なページ番号を入力してください (1-${pagination.totalPages})`);
                        }
                      }
                    }}
                    title="クリックしてページ移動">
                {loading ? 'Loading...' : pagination.total === 0 ? '0件' : `${((pagination.page - 1) * pagination.limit) + 1}〜${Math.min(pagination.page * pagination.limit, pagination.total)}件 / ${pagination.total}件`}
              </span>
              <button
                className={`p-1 ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-70'}`}
                onClick={() => pagination.page < pagination.totalPages && handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                aria-label="次のページ"
              >
                <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
              </button>
            </div>
            {/* 求人カード表示 */}
            <div className='grid grid-cols-1 gap-8 mt-10'>
              {loading ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>求人を読み込み中...</span>
                </div>
              ) : jobCards.length === 0 ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>該当する求人が見つかりませんでした</span>
                </div>
              ) : (
                jobCards.map((card, idx) => (
                  <JobPostCard
                    key={card.id}
                    imageUrl={card.imageUrl}
                    imageAlt={card.imageAlt || card.companyName}
                    title={card.title}
                    tags={card.tags}
                    companyName={card.companyName}
                    location={card.location}
                    salary={card.salary}
                    apell={card.apell}
                    starred={favoriteStatus?.[card.id] || false}
                    onStarClick={() => handleStarClick(idx)}
                    isFavoriteLoading={favoriteLoading[card.id]}
                    jobId={card.id}
                    onClick={() => router.push(`/candidate/search/setting/${card.id}`)}
                  />
                ))
              )}

            </div>
            {/* ページネーション */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                className="mt-10"
              />
            )}
          </div>
        </section>

      </main>
    </>
  );
}