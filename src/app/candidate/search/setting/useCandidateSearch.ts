import { useCallback, useMemo, useState } from 'react';
import { useFavoriteStatusQuery, useFavoriteToggleMutation } from '@/hooks';
import { getJobSearchData } from './actions';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface JobSearchResultMinimal {
  id: string;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  tags: string[];
  companyName: string;
  location: string | string[];
  salary: string;
  apell: string[];
}

interface SearchConditions {
  keyword?: string;
  location?: string;
  salaryMin?: string;
  industries: string[];
  jobTypes: string[];
  appealPoints: string[];
  page: number;
  limit: number;
}

interface UseCandidateSearchParams {
  initialJobs: JobSearchResultMinimal[];
  initialPagination: PaginationInfo;
}

export function useCandidateSearch({
  initialJobs,
  initialPagination,
}: UseCandidateSearchParams) {
  const [jobCards, setJobCards] =
    useState<JobSearchResultMinimal[]>(initialJobs);
  const [pagination, setPagination] =
    useState<PaginationInfo>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<
    Record<string, boolean>
  >({});

  const jobIds = useMemo(() => jobCards.map(j => j.id), [jobCards]);
  const {
    data: favoriteStatus,
    refetch: refetchFavoriteStatus,
    updateOptimistic,
  } = useFavoriteStatusQuery(jobIds);
  const favoriteToggle = useFavoriteToggleMutation();

  const updateURL = useCallback((conditions: SearchConditions) => {
    const params = new URLSearchParams();
    if (conditions.keyword) params.set('keyword', String(conditions.keyword));
    if (conditions.location)
      params.set('location', String(conditions.location));
    if (conditions.salaryMin && conditions.salaryMin !== '問わない')
      params.set('salaryMin', String(conditions.salaryMin));
    if (conditions.industries?.length)
      params.set('industries', conditions.industries.join(','));
    if (conditions.jobTypes?.length)
      params.set('jobTypes', conditions.jobTypes.join(','));
    if (conditions.appealPoints?.length)
      params.set('appealPoints', conditions.appealPoints.join(','));
    if (conditions.page > 1) params.set('page', String(conditions.page));

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    if (typeof window !== 'undefined') {
      window.history.replaceState(
        null,
        '',
        `/candidate/search/setting${newUrl}`
      );
    }
  }, []);

  const executeSearch = useCallback(
    async (conditions: SearchConditions) => {
      setLoading(true);
      try {
        const result = await getJobSearchData(conditions);
        if (result.success && result.data) {
          setJobCards(result.data.jobs as unknown as JobSearchResultMinimal[]);
          setPagination(result.data.pagination as PaginationInfo);
          updateURL(conditions);
        }
      } finally {
        setLoading(false);
      }
    },
    [updateURL]
  );

  const toggleFavorite = useCallback(
    async (jobId: string, isCurrentlyFavorite: boolean) => {
      // 楽観的更新：即座にUIを更新
      updateOptimistic(jobId, !isCurrentlyFavorite);
      setFavoriteLoading(prev => ({ ...prev, [jobId]: true }));

      try {
        const res = await favoriteToggle.mutateAsync({
          jobPostingId: jobId,
          isFavorite: isCurrentlyFavorite,
        });
        if (res.success) {
          await refetchFavoriteStatus();
        } else {
          // エラー時は元の状態に戻す
          updateOptimistic(jobId, isCurrentlyFavorite);
          alert(res.error || 'お気に入り操作に失敗しました');
        }
      } catch (error) {
        // エラー時は元の状態に戻す
        updateOptimistic(jobId, isCurrentlyFavorite);
        console.error('お気に入り操作エラー:', error);
        alert(
          'ネットワークエラーが発生しました。インターネット接続を確認してください。'
        );
      } finally {
        setFavoriteLoading(prev => ({ ...prev, [jobId]: false }));
      }
    },
    [favoriteToggle, refetchFavoriteStatus, updateOptimistic]
  );

  return {
    jobCards,
    pagination,
    loading,
    favoriteStatus,
    favoriteLoading,
    executeSearch,
    toggleFavorite,
  };
}
