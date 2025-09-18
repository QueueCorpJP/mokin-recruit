import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api/client';
import { logError } from '../lib/errors/errorHandler';
import type {
  UserType,
  LoginData,
  RegisterData,
  ResetPasswordData,
  NewPasswordData,
  SessionResponse,
} from '@/types';

// セッション情報を取得するクエリ（ストア更新は外部で行う）
export const useSessionQuery = (enabled = true) => {
  const [data, setData] = useState<SessionResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<SessionResponse>('/auth/session');
      setData(response.data || (response as unknown as SessionResponse));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch session')
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [refetch, enabled]);

  return { data, isLoading, error, refetch };
};

// ログイン
export const useLoginMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: LoginData) => {
    setIsPending(true);
    try {
      const response = await apiClient.post('/candidate/auth/login', data);
      // Page refresh to update server-side auth state
      window.location.reload();
      return response;
    } catch (error) {
      logError(error as any, 'useLoginMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// ログアウト
export const useLogoutMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async () => {
    setIsPending(true);
    try {
      await apiClient.post('/auth/logout');
      // Page refresh to update server-side auth state
      window.location.reload();
    } catch (error) {
      logError(error as any, 'useLogoutMutation');
      // エラーが発生してもページをリロード
      window.location.reload();
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// 会員登録
export const useRegisterMutation = (userType: UserType) => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: Omit<RegisterData, 'userType'>) => {
    setIsPending(true);
    try {
      const endpoint =
        userType === 'candidate' ? '/signup' : '/company/contact';

      const response = await apiClient.post(endpoint, {
        ...data,
        userType,
      });
      return response;
    } catch (error) {
      logError(error as any, 'useRegisterMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// パスワードリセット申請
export const useResetPasswordMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: ResetPasswordData) => {
    setIsPending(true);
    try {
      const response = await apiClient.post(
        '/candidate/auth/reset-password/request',
        data
      );
      return response;
    } catch (error) {
      logError(error as any, 'useResetPasswordMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// 新しいパスワード設定
export const useNewPasswordMutation = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: NewPasswordData) => {
    setIsPending(true);
    try {
      const response = await apiClient.post(
        '/candidate/auth/reset-password',
        data
      );
      return response;
    } catch (error) {
      logError(error as any, 'useNewPasswordMutation');
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutateAsync = mutate;

  return { mutate, mutateAsync, isPending };
};

// 認証状態の更新（手動でセッションを再取得）
export const useRefreshAuth = () => {
  return async () => {
    try {
      // Simple refresh by reloading the page
      window.location.reload();
    } catch (error) {
      logError(error as any, 'useRefreshAuth');
    }
  };
};
