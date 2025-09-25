import { useState, useEffect, useCallback } from 'react';
import { logError } from '../lib/errors/errorHandler';
import {
  getFavoriteListAction,
  getFavoriteStatusAction,
  addFavoriteAction,
  removeFavoriteAction,
  type FavoriteActionResult,
  type FavoriteListResult,
  type FavoriteStatusResult,
} from '@/lib/actions/favoriteActions';

// 型定義
interface Favorite {
  id: string;
  job_posting_id: string;
  candidate_id: string;
  created_at: string;
  job_posting?: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    description: string;
  };
}

interface FavoriteParams {
  page?: number;
  limit?: number;
}

// お気に入り一覧を取得
export const useFavoritesQuery = (params: FavoriteParams = {}) => {
  const { page = 1, limit = 20 } = params;
  const [data, setData] = useState<FavoriteListResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFavoriteListAction({ page, limit });
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch favorites')
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};

// お気に入りに追加
export const useAddFavoriteMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    jobPostingId: string
  ): Promise<FavoriteActionResult> => {
    setIsPending(true);
    try {
      const result = await addFavoriteAction(jobPostingId);
      return result;
    } catch (error) {
      logError(error as any, 'useAddFavoriteMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// お気に入りから削除
export const useRemoveFavoriteMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    jobPostingId: string
  ): Promise<FavoriteActionResult> => {
    setIsPending(true);
    try {
      const result = await removeFavoriteAction(jobPostingId);
      return result;
    } catch (error) {
      logError(error as any, 'useRemoveFavoriteMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// お気に入り状態を確認（複数の求人ID）
export const useFavoriteStatusQuery = (jobPostingIds: string[]) => {
  const [data, setData] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // jobPostingIdsを安定した文字列に変換してメモ化
  const jobPostingIdsKey = jobPostingIds.sort().join(',');

  // 楽観的更新用の関数
  const updateOptimistic = useCallback((jobId: string, isFavorite: boolean) => {
    setData(prev => ({ ...prev, [jobId]: isFavorite }));
  }, []);

  const refetch = useCallback(async () => {
    if (jobPostingIds.length === 0) {
      setData({});
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await getFavoriteStatusAction(jobPostingIds);

      if (!result.success || !result.data) {
        setData({});
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch favorite status')
      );
      setData({});
    } finally {
      setIsLoading(false);
    }
  }, [jobPostingIdsKey]); // 安定した文字列キーを使用

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, updateOptimistic };
};

// お気に入りのトグル（追加/削除を自動判定）
export const useFavoriteToggleMutation = () => {
  const [isPending, setIsPending] = useState(false);
  const addFavorite = useAddFavoriteMutation();
  const removeFavorite = useRemoveFavoriteMutation();

  const mutate = async ({
    jobPostingId,
    isFavorite,
  }: {
    jobPostingId: string;
    isFavorite: boolean;
  }) => {
    setIsPending(true);
    try {
      if (isFavorite) {
        return await removeFavorite.mutateAsync(jobPostingId);
      } else {
        return await addFavorite.mutateAsync(jobPostingId);
      }
    } catch (error) {
      logError(error as any, 'useFavoriteToggleMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};
