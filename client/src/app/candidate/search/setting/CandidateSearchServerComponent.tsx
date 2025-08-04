import React from 'react';
import { SearchIcon, Star } from 'lucide-react';
import { getJobSearchData, getFavoriteStatusServer, JobSearchResult } from './actions';
import CandidateSearchClient from './CandidateSearchClient';

interface CandidateSearchServerComponentProps {
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

export default async function CandidateSearchServerComponent({ 
  searchParams = {} 
}: CandidateSearchServerComponentProps) {
  
  // クエリパラメータから検索条件を構築
  const awaitedSearchParams = await searchParams;
  const searchConditions = {
    keyword: awaitedSearchParams.keyword || '',
    location: awaitedSearchParams.location || '',
    salaryMin: awaitedSearchParams.salaryMin || '',
    industries: parseArrayParam(awaitedSearchParams.industries),
    jobTypes: parseArrayParam(awaitedSearchParams.jobTypes),
    appealPoints: parseArrayParam(awaitedSearchParams.appealPoints),
    page: parseInt(awaitedSearchParams.page || '1'),
    limit: 10
  };

  // サーバーサイドで求人データを取得
  const jobSearchResponse = await getJobSearchData(searchConditions);
  
  let jobsWithFavorites: JobSearchResult[] = [];
  let pagination = {
    page: searchConditions.page,
    limit: searchConditions.limit,
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
    console.error('Error in CandidateSearchServerComponent:', error);
    // エラー時もコンポーネントを描画（空の状態で）
  }

  return (
    <CandidateSearchClient 
      initialJobs={jobsWithFavorites}
      initialPagination={pagination}
      initialSearchConditions={searchConditions}
    />
  );
}