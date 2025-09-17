import React from 'react';
import { SearchIcon, Star } from 'lucide-react';
import { getJobSearchData, JobSearchResult } from './actions';
import { JobSearchResultUI } from '@/types/job';
import { getFavoriteStatusAction } from '@/lib/actions/favoriteActions';
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
  searchParams = {},
}: CandidateSearchServerComponentProps) {
  // searchParamsをawait
  const awaitedSearchParams = await searchParams;

  // クエリパラメータから検索条件を構築
  const searchConditions = {
    keyword: awaitedSearchParams.keyword || '',
    location: awaitedSearchParams.location || '',
    salaryMin: awaitedSearchParams.salaryMin || '',
    industries: parseArrayParam(awaitedSearchParams.industries),
    jobTypes: parseArrayParam(awaitedSearchParams.jobTypes),
    appealPoints: parseArrayParam(awaitedSearchParams.appealPoints),
    page: parseInt(awaitedSearchParams.page || '1'),
    limit: 10,
  };

  let jobsWithFavorites: JobSearchResultUI[] = [];
  let pagination = {
    page: searchConditions.page,
    limit: searchConditions.limit,
    total: 0,
    totalPages: 0,
  };

  try {
    // サーバーサイドで求人データを取得
    const jobSearchResponse = await getJobSearchData(searchConditions);

    if (jobSearchResponse.success && jobSearchResponse.data) {
      const jobs = jobSearchResponse.data.jobs;
      pagination = jobSearchResponse.data.pagination;

      // 求人データが存在する場合、お気に入り状態を並列で取得
      if (jobs.length > 0) {
        const jobIds = jobs.map(job => job.id);

        // Promise.allで並列処理（すでにjobsは取得済みだが、他の関連データがあれば並列化可能）
        const [favoriteResponse] = await Promise.all([
          getFavoriteStatusAction(jobIds),
        ]);

        jobsWithFavorites = jobs.map(job => ({
          ...job,
          starred: favoriteResponse.data?.[job.id] || false,
        })) as JobSearchResultUI[];
      } else {
        jobsWithFavorites = jobs as JobSearchResultUI[];
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
