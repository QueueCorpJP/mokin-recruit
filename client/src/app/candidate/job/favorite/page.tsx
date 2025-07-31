'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { JobPostCard } from '@/components/ui/JobPostCard';

import Link from 'next/link';
import { useFavoritesQuery, useRemoveFavoriteMutation } from '@/hooks/useFavoriteApi';
import { getUserFriendlyMessage } from '@/lib/errors/errorHandler';
import type { AppError } from '@/lib/errors/types';

export default function CandidateFavoritePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const limit = 12;

  // React Queryを使用してお気に入り一覧を取得
  const {
    data: favoritesResponse,
    isLoading,
    error: queryError,
    refetch,
  } = useFavoritesQuery({ page: currentPage, limit });

  // お気に入り削除のmutation
  const removeFavoriteMutation = useRemoveFavoriteMutation();

  // エラーハンドリング
  if (queryError) {
    const errorMessage = getUserFriendlyMessage(queryError as AppError);
    if (error !== errorMessage) {
      setError(errorMessage);
    }
  }

  // データの変換
  const transformedJobs = (favoritesResponse as any)?.success && (favoritesResponse as any).data 
    ? (favoritesResponse as any).data.favorites.map((favorite: any) => {
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
          starred: true,
          apell: Array.isArray(job.appeal_points) ? job.appeal_points : ['アピールポイントなし']
        };
      })
    : [];

  const pagination = (favoritesResponse as any)?.success && (favoritesResponse as any).data 
    ? (favoritesResponse as any).data.pagination 
    : { page: 1, limit, total: 0, totalPages: 0 };

  // スター切り替え（お気に入りから削除）
  const handleStarClick = async (idx: number) => {
    const job = transformedJobs[idx];
    if (!job) return;

    try {
      await removeFavoriteMutation.mutateAsync(job.id);
      // React Queryが自動的にキャッシュを更新するため、手動でのstate更新は不要
    } catch (error) {
      console.error('お気に入り削除エラー:', error);
      setError('お気に入りの削除に失敗しました。再度お試しください。');
    }
  };

  // ページ変更
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      setError(null); // エラーをクリア
    }
  };


  return (
    <>
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
                {isLoading ? 'Loading...' : `${((pagination.page - 1) * pagination.limit) + 1}〜${Math.min(pagination.page * pagination.limit, pagination.total)}件 / ${pagination.total}件`}
              </span>
              <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-4'>
                <p className='text-red-600 text-sm'>{error}</p>
                <button 
                  onClick={() => { setError(null); refetch(); }}
                  className='text-red-600 underline text-sm mt-2 hover:text-red-800'
                >
                  再試行
                </button>
              </div>
            )}

            {/* 求人カード表示 */}
            <div className='grid grid-cols-1 gap-8 mt-10'>
              {isLoading ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>お気に入り求人を読み込み中...</span>
                </div>
              ) : transformedJobs.length === 0 ? (
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
                transformedJobs.map((card: any, idx: number) => (
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
                    isFavoriteLoading={removeFavoriteMutation.isPending}
                  />
                ))
              )}
            </div>
            {/* ページネーション */}
            {pagination.totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-10'>
                <button
                  className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${
                    currentPage === 1 
                      ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent'
                      : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <PaginationArrow direction='left' className='w-3 h-4' />
                </button>
                {/* ページ番号ボタン */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  if (pageNumber > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      className={`w-14 h-14 flex items-center justify-center rounded-full border text-[16px] font-bold mx-2 ${
                        pageNumber === currentPage 
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
                    currentPage === pagination.totalPages
                      ? 'border-[#DCDCDC] text-[#DCDCDC] cursor-not-allowed bg-transparent'
                      : 'border-[#0F9058] text-[#0F9058] hover:bg-[#F3FBF7] bg-transparent'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <PaginationArrow direction='right' className='w-3 h-4' />
                </button>
              </div>
            )}

          </div>
        </section>

      </main>
    </>
  );
}
