import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/client';
import { logError } from '../lib/errors/errorHandler';

// 型定義
interface JobPosting {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  benefits?: string;
  employment_type: string;
  experience_level: string;
  industry: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'draft';
}

interface JobSearchParams {
  keyword?: string;
  location?: string;
  salaryMin?: string;
  industries?: string[];
  jobTypes?: string[];
  page?: number;
  limit?: number;
}

interface JobSearchResponse {
  success: boolean;
  data?: {
    jobs: JobPosting[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

interface JobCreateData {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  employment_type: string;
  experience_level: string;
  industry: string;
}

interface JobUpdateData extends Partial<JobCreateData> {
  id: string;
}

// Query Keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params: JobSearchParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  company: () => [...jobKeys.all, 'company'] as const,
  companyJobs: (companyId?: string) => [...jobKeys.company(), companyId] as const,
} as const;

// 求人検索
export const useJobSearchQuery = (params: JobSearchParams = {}) => {
  const {
    keyword,
    location,
    salaryMin,
    industries,
    jobTypes,
    page = 1,
    limit = 20,
  } = params;

  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: async (): Promise<JobSearchResponse> => {
      const searchParams = new URLSearchParams();
      
      if (keyword) searchParams.append('keyword', keyword);
      if (location) searchParams.append('location', location);
      if (salaryMin) searchParams.append('salaryMin', salaryMin);
      if (industries?.length) searchParams.append('industries', industries.join(','));
      if (jobTypes?.length) searchParams.append('jobTypes', jobTypes.join(','));
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());

      const response = await apiClient.get<JobSearchResponse>(
        `/candidate/job/search?${searchParams.toString()}`
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2分間は新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
    enabled: true,
  });
};

// 求人詳細取得
export const useJobDetailQuery = (jobId: string, enabled = true) => {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: async (): Promise<JobPosting> => {
      const response = await apiClient.get<JobPosting>(`/company/job/${jobId}`);
      return response;
    },
    enabled: enabled && !!jobId,
    staleTime: 5 * 60 * 1000, // 5分間は新鮮とみなす
    gcTime: 30 * 60 * 1000, // 30分間キャッシュを保持
  });
};

// 企業の求人一覧取得
export const useCompanyJobsQuery = (companyId?: string) => {
  return useQuery({
    queryKey: jobKeys.companyJobs(companyId),
    queryFn: async (): Promise<JobSearchResponse> => {
      const response = await apiClient.get<JobSearchResponse>('/company/job');
      return response;
    },
    enabled: !!companyId,
    staleTime: 1 * 60 * 1000, // 1分間は新鮮とみなす
    gcTime: 5 * 60 * 1000, // 5分間キャッシュを保持
  });
};

// 求人作成
export const useJobCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobCreateData): Promise<JobPosting> => {
      const response = await apiClient.post<JobPosting>('/company/job/new', data);
      return response;
    },
    onSuccess: (data) => {
      // 企業の求人一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: jobKeys.company() });
      
      // 作成した求人の詳細をキャッシュに追加
      queryClient.setQueryData(jobKeys.detail(data.id), data);
    },
    onError: (error) => {
      logError(error as any, 'useJobCreateMutation');
    },
  });
};

// 求人更新
export const useJobUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobUpdateData): Promise<JobPosting> => {
      const { id, ...updateData } = data;
      const response = await apiClient.put<JobPosting>(`/company/job/edit`, {
        id,
        ...updateData,
      });
      return response;
    },
    onSuccess: (data) => {
      // 該当する求人の詳細キャッシュを更新
      queryClient.setQueryData(jobKeys.detail(data.id), data);
      
      // 企業の求人一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: jobKeys.company() });
      
      // 検索結果のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
    onError: (error) => {
      logError(error as any, 'useJobUpdateMutation');
    },
  });
};

// 求人削除
export const useJobDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string): Promise<void> => {
      await apiClient.delete(`/company/job/delete`, {
        body: JSON.stringify({ id: jobId }),
      });
    },
    onSuccess: (data, jobId) => {
      // 削除した求人の詳細キャッシュを削除
      queryClient.removeQueries({ queryKey: jobKeys.detail(jobId) });
      
      // 企業の求人一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: jobKeys.company() });
      
      // 検索結果のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
    onError: (error) => {
      logError(error as any, 'useJobDeleteMutation');
    },
  });
};