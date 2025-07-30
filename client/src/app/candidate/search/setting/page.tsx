'use client';

import { SearchIcon } from 'lucide-react';
import { Star } from 'lucide-react';
import { BaseInput } from '@/components/ui/base-input';
import { useState, useEffect } from 'react';
import { searchJobs, addToFavorites, removeFromFavorites, checkFavoriteStatus } from '@/lib/utils/api-client';

import { JobTypeModal } from '@/app/company/company/job/JobTypeModal';
import { LocationModal } from '@/app/company/company/job/LocationModal';
import { Modal } from '@/components/ui/mo-dal';
import { X } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { IndustryModal } from '@/app/company/company/job/IndustryModal';
import { Button } from '@/components/ui/button';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { JobPostCard } from '@/components/ui/JobPostCard';
import { Pagination } from '@/components/ui/Pagination';
import { TagDisplay } from '@/components/ui/TagDisplay';
import { Tag } from '@/components/ui/Tag';
import { MapPinIcon, CurrencyYenIcon } from '@heroicons/react/24/solid';
import { Footer } from '@/components/ui/footer';
import { useRouter } from 'next/navigation';

export default function CandidateSearchPage() {
  const router = useRouter();
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [starred, setStarred] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 求人データとローディング状態
  const [allJobCards, setAllJobCards] = useState<any[]>([]); // 全件データ
  const [displayJobCards, setDisplayJobCards] = useState<any[]>([]); // 表示用データ
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // 10件ずつ表示
    total: 0,
    totalPages: 0
  });

  // 表示用データを更新（クライアントサイドページング）
  const updateDisplayJobs = (allJobs: any[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = allJobs.slice(startIndex, endIndex);
    setDisplayJobCards(paginatedJobs);
  };

  // APIから全件データを取得（初回・検索条件変更時のみ）
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      // 最大1000件まで取得（メモリ使用量を考慮）
      const response = await searchJobs({
        keyword: searchKeyword,
        location: selectedLocations.join(','),
        salaryMin: selectedSalary ? selectedSalary.replace(/[^\d]/g, '') : undefined,
        industries: selectedIndustries,
        jobTypes: selectedJobTypes,
        page: 1,
        limit: 1000 // 大きな値で全件取得
      });

      if (response.success && response.data) {
        const transformedJobs = response.data.jobs.map((job: any) => {
          return {
            id: job.id,
            imageUrl: job.image_urls?.[0] || '/company.jpg',
            imageAlt: job.company_name || 'company',
            title: job.title,
            tags: Array.isArray(job.job_type) ? job.job_type.slice(0, 3) : [job.job_type].filter(Boolean),
            companyName: job.company_name || '企業名',
            location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
            salary: job.salary_min && job.salary_max && job.salary_min > 0 && job.salary_max > 0
              ? `${job.salary_min}万〜${job.salary_max}万`
              : job.salary_note || '給与応相談',
            starred: false,
            apell: Array.isArray(job.appeal_points) ? job.appeal_points : ['アピールポイントなし'],
            created_at: job.created_at // ソート用に日付情報を保持
          };
        });
        
        // 全件データを保存
        setAllJobCards(transformedJobs);
        
        // ページネーション情報を更新
        const totalJobs = transformedJobs.length;
        const totalPages = Math.ceil(totalJobs / pagination.limit);
        setPagination(prev => ({
          ...prev,
          total: totalJobs,
          totalPages: totalPages,
          page: 1
        }));

        // お気に入り状態を確認
        const jobIds = transformedJobs.map((job: any) => job.id);
        const favoriteStatus = await checkFavoriteStatus(jobIds);
        
        const jobsWithFavorites = transformedJobs.map(job => ({
          ...job,
          starred: favoriteStatus[job.id] || false
        }));
        
        // 最新順にソート（created_atで降順、新しいものが先）
        const sortedJobs = jobsWithFavorites.sort((a, b) => {
          // created_atフィールドがある場合はそれを使用、なければIDで比較
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return b.id.localeCompare(a.id);
        });
        
        setAllJobCards(sortedJobs);
        updateDisplayJobs(sortedJobs, 1, pagination.limit);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初期データ読み込み
  useEffect(() => {
    fetchAllJobs();
  }, []); // 初回のみ実行

  // 検索実行（条件変更時）
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchAllJobs(); // 検索条件変更時のみAPI呼び出し
  };

  // スター切り替え（お気に入りAPI呼び出し）
  const handleStarClick = async (idx: number) => {
    const job = displayJobCards[idx];
    const jobId = job.id;
    const isCurrentlyStarred = job.starred;

    console.log('お気に入り操作開始:', { jobId, isCurrentlyStarred });

    // ローディング状態を設定
    setFavoriteLoading(prev => ({ ...prev, [jobId]: true }));

    try {
      let response;
      if (isCurrentlyStarred) {
        // お気に入りから削除
        console.log('お気に入りから削除中...');
        response = await removeFromFavorites(jobId);
      } else {
        // お気に入りに追加
        console.log('お気に入りに追加中...');
        response = await addToFavorites(jobId);
      }

      console.log('API応答:', response);

      if (response.success) {
        // 全件データと表示データの両方を更新
        const updatedAllJobs = allJobCards.map(job => 
          job.id === jobId ? { ...job, starred: !isCurrentlyStarred } : job
        );
        setAllJobCards(updatedAllJobs);
        
        // 表示データも更新
        setDisplayJobCards(cards =>
          cards.map((card, i) =>
            i === idx ? { ...card, starred: !isCurrentlyStarred } : card
          )
        );
        console.log('お気に入り操作成功');
      } else {
        console.error('お気に入り操作エラー:', response.error);
        
        // より詳細なエラー情報を表示
        let errorMessage = response.error || 'お気に入り操作に失敗しました';
        
        // デバッグ情報がある場合は表示
        if (response.debug) {
          console.error('デバッグ情報:', response.debug);
          
          // 認証エラーの場合の詳細メッセージ
          if (!response.debug.hasAuthHeader && !response.debug.hasCookieToken) {
            errorMessage = 'ログインが必要です。再度ログインしてください。';
          } else if (response.debug.validationError) {
            errorMessage = `認証エラー: ${response.debug.validationError}`;
          } else if (response.debug.jobPostingId && !response.debug.jobExists) {
            // 求人が存在しない場合
            errorMessage = 'この求人は削除されたか、現在利用できません。ページを更新してください。';
            
            // 求人リストから該当の求人を削除
            const filteredAllJobs = allJobCards.filter(card => card.id !== jobId);
            setAllJobCards(filteredAllJobs);
            setDisplayJobCards(cards => cards.filter(card => card.id !== jobId));
          } else if (response.debug.jobExists && response.debug.jobStatus !== 'PUBLISHED') {
            // 求人は存在するが公開されていない場合
            errorMessage = `この求人は現在公開されていません（ステータス: ${response.debug.jobStatus}）`;
            
            // 求人リストから該当の求人を削除
            const filteredAllJobs = allJobCards.filter(card => card.id !== jobId);
            setAllJobCards(filteredAllJobs);
            setDisplayJobCards(cards => cards.filter(card => card.id !== jobId));
          }
        }
        
        // ユーザーに分かりやすいエラーメッセージを表示
        alert(errorMessage);
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
  const [selectedSalary, setSelectedSalary] = useState('');

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
  const [selectedAppealPoint, setSelectedAppealPoint] = useState('');
  const [isSearchConditionActive, setIsSearchConditionActive] = useState(false);

  // ページネーション処理（クライアントサイド）
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    updateDisplayJobs(allJobCards, page, pagination.limit);
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
                            {selectedJobTypes.map(item => (
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
                            {selectedLocations.map(item => (
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
                              {selectedIndustries.map(item => (
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
                              ? `アピールポイント：${selectedAppealPoint.length > 9 ? selectedAppealPoint.slice(0, 9) + '...' : selectedAppealPoint}`
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
                        setSelectedIndustries={setSelectedIndustries}
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
              <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232]'>
                {loading ? 'Loading...' : `${((pagination.page - 1) * pagination.limit) + 1}〜${Math.min(pagination.page * pagination.limit, pagination.total)}件 / ${pagination.total}件`}
              </span>
              <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
            </div>
            {/* 求人カード表示 */}
            <div className='grid grid-cols-1 gap-8 mt-10'>
              {loading ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>求人を読み込み中...</span>
                </div>
              ) : displayJobCards.length === 0 ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>該当する求人が見つかりませんでした</span>
                </div>
              ) : (
                displayJobCards.map((card, idx) => (
                  <JobPostCard
                    key={card.id}
                    imageUrl={card.imageUrl}
                    imageAlt={card.imageAlt}
                    title={card.title}
                    tags={card.tags}
                    companyName={card.companyName}
                    location={card.location}
                    salary={card.salary}
                    apell={card.apell}
                    starred={card.starred}
                    onStarClick={() => handleStarClick(idx)}
                    isFavoriteLoading={favoriteLoading[card.id]}
                  />
                ))
              )}

            </div>
            {/* ページネーション */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-10"
            />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
