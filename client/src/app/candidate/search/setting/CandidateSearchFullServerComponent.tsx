import React from 'react';
import { SearchIcon, Star, X } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getJobSearchData, getFavoriteStatusServer, JobSearchResult } from './actions';
import { BaseInput } from '@/components/ui/base-input';
import { SelectInput } from '@/components/ui/select-input';
import { PaginationArrow } from '@/components/svg/PaginationArrow';
import { JobPostCard } from '@/components/ui/JobPostCard';
import { Pagination } from '@/components/ui/Pagination';
import SearchForm from './SearchForm';

interface CandidateSearchFullServerComponentProps {
  searchParams?: {
    keyword?: string;
    location?: string;
    salaryMin?: string;
    industries?: string | string[];
    jobTypes?: string | string[];
    appealPoints?: string | string[];
    page?: string;
  };
}

function parseArrayParam(param: string | string[] | undefined): string[] {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param.split(',').filter(Boolean);
}

export default async function CandidateSearchFullServerComponent({ 
  searchParams = {} 
}: CandidateSearchFullServerComponentProps) {
  
  // クエリパラメータから検索条件を構築
  const searchConditions = {
    keyword: searchParams.keyword || '',
    location: searchParams.location || '',
    salaryMin: searchParams.salaryMin || '',
    industries: parseArrayParam(searchParams.industries),
    jobTypes: parseArrayParam(searchParams.jobTypes),
    appealPoints: parseArrayParam(searchParams.appealPoints),
    page: parseInt(searchParams.page || '1'),
    limit: 10
  };

  // サーバーサイドで求人データを取得
  const jobSearchResponse = await getJobSearchData(searchConditions);
  
  let jobsWithFavorites: JobSearchResult[] = [];
  let pagination = {
    page: searchConditions.page,
    limit: 10,
    total: 0,
    totalPages: 0
  };

  try {
    if (jobSearchResponse.success && jobSearchResponse.data) {
      const jobs = jobSearchResponse.data.jobs;
      pagination = jobSearchResponse.data.pagination;
      
      // お気に入り状態を取得
      if (jobs.length > 0) {
        const jobIds = jobs.map(job => job.id);
        const favoriteResponse = await getFavoriteStatusServer(jobIds);
        
        jobsWithFavorites = jobs.map(job => ({
          ...job,
          starred: favoriteResponse.data?.[job.id] || false
        })) as JobSearchResult[];
      }
    } else {
      console.error('Failed to get jobs:', jobSearchResponse.error);
    }
  } catch (error) {
    console.error('Error in CandidateSearchFullServerComponent:', error);
    // エラー時もコンポーネントを描画（空の状態で）
  }

  // URL構築用のヘルパー関数
  const buildSearchURL = (params: any) => {
    const urlParams = new URLSearchParams();
    
    if (params.keyword) urlParams.set('keyword', params.keyword);
    if (params.location) urlParams.set('location', params.location);
    if (params.salaryMin && params.salaryMin !== '問わない') urlParams.set('salaryMin', params.salaryMin);
    if (params.industries && params.industries.length > 0) urlParams.set('industries', params.industries.join(','));
    if (params.jobTypes && params.jobTypes.length > 0) urlParams.set('jobTypes', params.jobTypes.join(','));
    if (params.appealPoints && params.appealPoints.length > 0) urlParams.set('appealPoints', params.appealPoints.join(','));
    if (params.page && params.page > 1) urlParams.set('page', params.page.toString());

    const queryString = urlParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  // ページネーション用URL
  const getPaginationURL = (page: number) => {
    return buildSearchURL({
      ...searchConditions,
      page
    });
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
              <Link
                href="/candidate/job/favorite"
                className='w-[150px] h-[94px] border-2 border-white rounded-[10px] bg-transparent p-[14px] hover:bg-white/30 transition-colors duration-150 md:mt-0 md:absolute md:right-0 md:top-0'
                style={{ minWidth: 150, minHeight: 94 }}
              >
                <div className='flex flex-col items-center justify-center h-full gap-[10px]'>
                  <Star size={24} fill='white' stroke='white' />
                  <span className='text-white text-[16px] font-bold'>
                    お気に入り求人
                  </span>
                </div>
              </Link>
            </div>
            <div className='flex-1 flex items-center justify-center mt-10'>
              <div className='w-full md:w-[742px] bg-white rounded-lg shadow p-6 md:p-[40px]'>
                <SearchForm 
                  initialKeyword={searchConditions.keyword}
                  initialLocations={searchConditions.location ? searchConditions.location.split(',').filter(Boolean) : []}
                  initialSalary={searchConditions.salaryMin}
                  initialIndustries={searchConditions.industries}
                  initialJobTypes={searchConditions.jobTypes}
                  initialAppealPoints={searchConditions.appealPoints[0] || ''}
                />
              </div>
            </div>
          </div>
        </section>
        <section className='w-full bg-[#F9F9F9] py-4 md:pt-10 px-6 pb-20'>
          <div className='max-w-[1280px] mx-auto'>
            {/* ページネーションデザイン（矢印アイコン8px） */}
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              {pagination.page > 1 ? (
                <Link 
                  href={`/candidate/search/setting${getPaginationURL(pagination.page - 1)}`}
                  className='p-1 cursor-pointer hover:opacity-70'
                  aria-label="前のページ"
                >
                  <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
                </Link>
              ) : (
                <div className='p-1 opacity-50 cursor-not-allowed'>
                  <PaginationArrow direction='left' className='w-[8px] h-[8px]' />
                </div>
              )}
              
              <span className='font-bold text-[12px] leading-[1.6] tracking-[0.1em] text-[#323232]'>
                {pagination.total === 0 
                  ? '0件' 
                  : `${((pagination.page - 1) * pagination.limit) + 1}〜${Math.min(pagination.page * pagination.limit, pagination.total)}件 / ${pagination.total}件`
                }
              </span>
              
              {pagination.page < pagination.totalPages ? (
                <Link 
                  href={`/candidate/search/setting${getPaginationURL(pagination.page + 1)}`}
                  className='p-1 cursor-pointer hover:opacity-70'
                  aria-label="次のページ"
                >
                  <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
                </Link>
              ) : (
                <div className='p-1 opacity-50 cursor-not-allowed'>
                  <PaginationArrow direction='right' className='w-[8px] h-[8px]' />
                </div>
              )}
            </div>
            
            {/* 求人カード表示 */}
            <div className='grid grid-cols-1 gap-8 mt-10'>
              {jobsWithFavorites.length === 0 ? (
                <div className='text-center py-10'>
                  <span className='text-gray-500'>該当する求人が見つかりませんでした</span>
                </div>
              ) : (
                jobsWithFavorites.map((job) => (
                  <div key={job.id} className='border rounded-lg p-6 bg-white shadow-sm'>
                    <Link href={`/candidate/search/setting/${job.id}`} className='block'>
                      <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden'>
                          <img 
                            src={job.imageUrl || '/company.jpg'} 
                            alt={job.companyName}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-xl font-bold mb-2'>{job.title}</h3>
                          <p className='text-gray-600 mb-2'>{job.companyName}</p>
                          <div className='flex flex-wrap gap-2 mb-2'>
                            {job.tags.map((tag, index) => (
                              <span key={index} className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm'>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className='flex flex-wrap gap-2 mb-2'>
                            {job.location.map((loc, index) => (
                              <span key={index} className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>
                                {loc}
                              </span>
                            ))}
                          </div>
                          <p className='text-gray-800 font-semibold'>{job.salary}</p>
                          <div className='flex flex-wrap gap-2 mt-2'>
                            {job.apell.map((appeal, index) => (
                              <span key={index} className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm'>
                                {appeal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            
            {/* ページネーション（下部） */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex gap-2">
                  {pagination.page > 1 && (
                    <Link 
                      href={`/candidate/search/setting${getPaginationURL(pagination.page - 1)}`}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      前へ
                    </Link>
                  )}
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Link
                        key={page}
                        href={`/candidate/search/setting${getPaginationURL(page)}`}
                        className={`px-3 py-1 border rounded ${
                          page === pagination.page 
                            ? 'bg-blue-500 text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                  
                  {pagination.page < pagination.totalPages && (
                    <Link 
                      href={`/candidate/search/setting${getPaginationURL(pagination.page + 1)}`}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      次へ
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}