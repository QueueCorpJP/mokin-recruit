'use client';

import { Navigation } from '@/components/ui/navigation';
import { SearchIcon } from 'lucide-react';
import { Star } from 'lucide-react';
import { BaseInput } from '@/components/ui/base-input';
import { useState, useEffect } from 'react';

import { JobTypeModal } from '@/app/company/company/job/JobTypeModal';
import { LocationModal } from '@/app/company/company/job/LocationModal';
import { Modal } from '@/components/ui/mo-dal';
import { X } from 'lucide-react';
import { SelectInput } from '@/components/ui/select-input';
import { IndustryModal } from '@/app/company/company/job/IndustryModal';
import { Button } from '@/components/ui/button';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { JobPostCard } from '@/components/ui/JobPostCard';
import { TagDisplay } from '@/components/ui/TagDisplay';
import { Tag } from '@/components/ui/Tag';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import { getFavorites, removeFromFavorites } from '@/lib/utils/api-client';

export default function CandidateFavoritePage() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // お気に入り一覧を取得
  const fetchFavorites = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getFavorites(page, pagination.limit);

      if (response.success && response.data) {
        const transformedJobs = response.data.favorites.map((favorite: any) => {
          const job = favorite.job_postings;
          return {
            id: job.id,
            favoriteId: favorite.id,
            imageUrl: job.image_urls?.[0] || '/company.jpg',
            imageAlt: job.company_accounts?.company_name || 'company',
            title: job.title,
            tags: Array.isArray(job.job_type) ? job.job_type.slice(0, 3) : [job.job_type].filter(Boolean),
            companyName: job.company_accounts?.company_name || '企業名',
            location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
            salary: job.salary_min && job.salary_max && job.salary_min > 0 && job.salary_max > 0
              ? `${job.salary_min}万〜${job.salary_max}万`
              : job.salary_note || '給与応相談',
            starred: true, // お気に入りページでは常にtrue
            apell: Array.isArray(job.appeal_points) ? job.appeal_points : ['アピールポイントなし']
          };
        });
        
        setJobCards(transformedJobs);
        setPagination(prev => ({
          ...prev,
          page: response.data!.pagination.page,
          total: response.data!.pagination.total,
          totalPages: response.data!.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初期データ読み込み
  useEffect(() => {
    fetchFavorites();
  }, []);

  // スター切り替え（お気に入りから削除）
  const handleStarClick = async (idx: number) => {
    const job = jobCards[idx];
    const jobId = job.id;

    // ローディング状態を設定
    setFavoriteLoading(prev => ({ ...prev, [jobId]: true }));

    try {
      const response = await removeFromFavorites(jobId);

      if (response.success) {
        // 成功時は該当の求人をリストから削除
        setJobCards(cards => cards.filter((_, i) => i !== idx));
        
        // ページネーション情報を更新
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      } else {
        console.error('お気に入り削除エラー:', response.error);
      }
    } catch (error) {
      console.error('お気に入り削除エラー:', error);
    } finally {
      // ローディング状態を解除
      setFavoriteLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // ページ変更
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchFavorites(newPage);
    }
  };


  return (
    <>
      <Navigation variant='candidate' />
      <main>
        <section className='w-full px-4 py-6 md:px-[80px] md:py-[40px] bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] flex items-center justify-center'>
          <div className='max-w-[1280px] w-full h-full flex flex-col relative'>
            <div className='flex flex-row items-center justify-between w-full'>
              <div className='flex items-center'>
                <Star size={32} className='text-white' fill='white' />
                <span className='ml-4 text-white text-[20px] md:text-2xl font-bold'>
                  お気に入り求人

                </span>
              </div>
              <Link href='/candidate/search/setting'>
                <button
                  className='box-border flex items-center justify-center rounded-[32px] border-2 border-white bg-transparent text-white font-bold text-[16px] tracking-[0.1em] whitespace-nowrap transition-colors duration-150 hover:bg-white/10'
                  style={{ width: 206, padding: '14px 40px', lineHeight: 2 }}
                >
                  求人検索に戻る
                </button>
              </Link>
            </div>
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
                  <span className='text-gray-500'>お気に入り求人を読み込み中...</span>
                </div>
              ) : jobCards.length === 0 ? (
                <div className='text-center py-10'>
                  <div className='flex flex-col items-center gap-4'>
                    <Star size={48} className='text-gray-300' />
                    <span className='text-gray-500 text-lg'>まだお気に入りに追加した求人がありません</span>
                    <Link href='/candidate/search/setting'>
                      <button className='bg-[#0F9058] text-white px-6 py-3 rounded-lg hover:bg-[#0D7A4C] transition-colors'>
                        求人を探す
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                jobCards.map((card, idx) => (
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
            {pagination.totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-10'>
                <button
                  className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${
                    pagination.page === 1 
                      ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent'
                      : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'
                  }`}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <PaginationArrow direction='left' className='w-3 h-4' />
                </button>
                {/* ページ番号ボタン */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, pagination.page - 2) + i;
                  if (pageNumber > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${
                        pageNumber === pagination.page 
                          ? 'bg-[#0F9058] text-white border-[#0F9058]' 
                          : 'border-[#0F9058] text-[#0F9058] bg-transparent hover:bg-[#F3FBF7]'
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${
                    pagination.page === pagination.totalPages
                      ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent'
                      : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'
                  }`}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <PaginationArrow direction='right' className='w-3 h-4' />
                </button>
              </div>
            )}

          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
