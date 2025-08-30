import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { logError } from '../lib/errors/errorHandler';
import { 
  getFavoriteListAction, 
  getFavoriteStatusAction, 
  addFavoriteAction, 
  removeFavoriteAction,
  type FavoriteActionResult,
  type FavoriteListResult,
  type FavoriteStatusResult
} from '../lib/actions/favoriteActions';

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

// Query Keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (params: FavoriteParams) => [...favoriteKeys.lists(), params] as const,
  status: (jobIds: string[]) => [...favoriteKeys.all, 'status', jobIds] as const,
} as const;

// お気に入り一覧を取得
export const useFavoritesQuery = (params: FavoriteParams = {}) => {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: favoriteKeys.list({ page, limit }),
    queryFn: async (): Promise<FavoriteListResult> => {
      return await getFavoriteListAction({ page, limit });
    },
    staleTime: 30 * 1000, // 30秒間は新鮮とみなす
    gcTime: 5 * 60 * 1000, // 5分間キャッシュを保持
    enabled: true,
  });
};

// お気に入りに追加
export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPostingId: string): Promise<FavoriteActionResult> => {
      return await addFavoriteAction(jobPostingId);
    },
    onSuccess: (data, jobPostingId) => {
      // お気に入り一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      
      // お気に入り状態のキャッシュも更新
      queryClient.setQueryData(
        favoriteKeys.status([jobPostingId]),
        { [jobPostingId]: true }
      );
    },
    onError: (error) => {
      logError(error as any, 'useAddFavoriteMutation');
    },
  });
};

// お気に入りから削除
export const useRemoveFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobPostingId: string): Promise<FavoriteActionResult> => {
      return await removeFavoriteAction(jobPostingId);
    },
    onSuccess: (data, jobPostingId) => {
      // お気に入り一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
      
      // お気に入り状態のキャッシュも更新
      queryClient.setQueryData(
        favoriteKeys.status([jobPostingId]),
        { [jobPostingId]: false }
      );
    },
    onError: (error) => {
      logError(error as any, 'useRemoveFavoriteMutation');
    },
  });
};

// お気に入り状態を確認（複数の求人ID）
export const useFavoriteStatusQuery = (jobPostingIds: string[]) => {
  return useQuery({
    queryKey: favoriteKeys.status(jobPostingIds),
    queryFn: async (): Promise<Record<string, boolean>> => {
      if (jobPostingIds.length === 0) {
        return {};
      }

      const result = await getFavoriteStatusAction(jobPostingIds);
      
      if (!result.success || !result.data) {
        return {};
      }

      return result.data;
    },
    enabled: jobPostingIds.length > 0,
    staleTime: 1 * 60 * 1000, // 1分間は新鮮とみなす
    gcTime: 5 * 60 * 1000, // 5分間キャッシュを保持
  });
};

// お気に入りのトグル（追加/削除を自動判定）
export const useFavoriteToggleMutation = () => {
  const queryClient = useQueryClient();
  const addFavorite = useAddFavoriteMutation();
  const removeFavorite = useRemoveFavoriteMutation();

  return useMutation({
    mutationFn: async ({ jobPostingId, isFavorite }: { 
      jobPostingId: string; 
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        return await removeFavorite.mutateAsync(jobPostingId);
      } else {
        return await addFavorite.mutateAsync(jobPostingId);
      }
    },
    onSuccess: (data, variables) => {
      // 状態のキャッシュを即座に更新（楽観的更新）
      queryClient.setQueryData(
        favoriteKeys.status([variables.jobPostingId]),
        { [variables.jobPostingId]: !variables.isFavorite }
      );
    },
    onError: (error) => {
      logError(error as any, 'useFavoriteToggleMutation');
    },
  });
};