import { useState, useEffect, useCallback } from 'react';
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

  const [data, setData] = useState<JobSearchResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
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
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search jobs'));
    } finally {
      setIsLoading(false);
    }
  }, [keyword, location, salaryMin, industries, jobTypes, page, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};

// 求人詳細取得
export const useJobDetailQuery = (jobId: string, enabled = true) => {
  const [data, setData] = useState<JobPosting | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!jobId || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<JobPosting>(`/company/job/${jobId}`);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch job detail'));
    } finally {
      setIsLoading(false);
    }
  }, [jobId, enabled]);

  useEffect(() => {
    if (enabled && jobId) {
      refetch();
    }
  }, [refetch, enabled, jobId]);

  return { data, isLoading, error, refetch };
};

// 企業の求人一覧取得
export const useCompanyJobsQuery = (companyId?: string) => {
  const [data, setData] = useState<JobSearchResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<JobSearchResponse>('/company/job');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch company jobs'));
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      refetch();
    }
  }, [refetch, companyId]);

  return { data, isLoading, error, refetch };
};

// 求人作成
export const useJobCreateMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: JobCreateData): Promise<JobPosting> => {
    setIsPending(true);
    try {
      const response = await apiClient.post<JobPosting>('/company/job/new', data);
      return response;
    } catch (error) {
      logError(error as any, 'useJobCreateMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// 求人更新
export const useJobUpdateMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: JobUpdateData): Promise<JobPosting> => {
    setIsPending(true);
    try {
      const { id, ...updateData } = data;
      const response = await apiClient.put<JobPosting>(`/company/job/edit`, {
        id,
        ...updateData,
      });
      return response;
    } catch (error) {
      logError(error as any, 'useJobUpdateMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// 求人削除
export const useJobDeleteMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (jobId: string): Promise<void> => {
    setIsPending(true);
    try {
      await apiClient.delete(`/company/job/delete`, {
        body: JSON.stringify({ id: jobId }),
      });
    } catch (error) {
      logError(error as any, 'useJobDeleteMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};