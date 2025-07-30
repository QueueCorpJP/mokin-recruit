import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../lib/api/client';
import { logError } from '../lib/errors/errorHandler';
import type { UserType } from '../stores/authStore';

// 型定義
interface LoginData {
  email: string;
  password: string;
  userType?: UserType;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  userType: UserType;
}

interface ResetPasswordData {
  email: string;
}

interface NewPasswordData {
  token: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    userType: UserType;
    name?: string;
    emailConfirmed: boolean;
    lastSignIn?: string;
  };
  session?: {
    expiresAt: string;
    needsRefresh: boolean;
  };
  error?: string;
}

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
} as const;

// セッション情報を取得するクエリ（ストア更新は外部で行う）
export const useSessionQuery = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async (): Promise<SessionResponse> => {
      const response = await apiClient.get<SessionResponse>('/auth/session');
      return response;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間は新鮮とみなす
    gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
    retry: false, // セッション確認は失敗時にリトライしない
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再確認を無効
    refetchOnMount: false, // マウント時の自動再確認を無効
  });
};

// ログイン
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const refreshAuth = useAuthStore((state) => state.refreshAuth);

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post('/auth/login', data);
      return response;
    },
    onSuccess: async () => {
      // ログイン成功後にセッション情報を再取得
      await queryClient.invalidateQueries({ queryKey: authKeys.session() });
      await refreshAuth();
    },
    onError: (error) => {
      logError(error as any, 'useLoginMutation');
    },
  });
};

// ログアウト
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const reset = useAuthStore((state) => state.reset);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      // 全てのキャッシュをクリア
      queryClient.clear();
      reset();
    },
    onError: (error) => {
      logError(error as any, 'useLogoutMutation');
      // エラーが発生してもローカル状態はクリア
      reset();
    },
  });
};

// 会員登録
export const useRegisterMutation = (userType: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<RegisterData, 'userType'>) => {
      const endpoint = userType === 'candidate' 
        ? '/auth/register/candidate' 
        : '/auth/register/company';
      
      const response = await apiClient.post(endpoint, {
        ...data,
        userType,
      });
      return response;
    },
    onSuccess: () => {
      // 登録成功後にセッション情報を再取得
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
    onError: (error) => {
      logError(error as any, 'useRegisterMutation');
    },
  });
};

// パスワードリセット申請
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await apiClient.post('/auth/reset-password/request', data);
      return response;
    },
    onError: (error) => {
      logError(error as any, 'useResetPasswordMutation');
    },
  });
};

// 新しいパスワード設定
export const useNewPasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewPasswordData) => {
      const response = await apiClient.post('/auth/reset-password', data);
      return response;
    },
    onSuccess: () => {
      // パスワード更新後にセッション情報を再取得
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
    onError: (error) => {
      logError(error as any, 'useNewPasswordMutation');
    },
  });
};

// 認証状態の更新（手動でセッションを再取得）
export const useRefreshAuth = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);

  return async () => {
    setLoading(true);
    try {
      await queryClient.invalidateQueries({ queryKey: authKeys.session() });
      await queryClient.refetchQueries({ queryKey: authKeys.session() });
    } finally {
      setLoading(false);
    }
  };
};