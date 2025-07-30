'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// QueryClientの設定
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // デフォルトの設定
        staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: (failureCount, error: any) => {
          // 認証エラー（401, 403）の場合はリトライしない
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          // その他のエラーは最大3回まで
          return failureCount < 3;
        },
        refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再取得を無効
        refetchOnMount: true, // マウント時に再取得
        refetchOnReconnect: true, // 再接続時に再取得
      },
      mutations: {
        retry: (failureCount, error: any) => {
          // 認証エラーやクライアントエラー（4xx）の場合はリトライしない
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // サーバーエラー（5xx）は最大2回まで
          return failureCount < 2;
        },
      },
    },
  });
};

// QueryClientのインスタンスを作成（シングルトン）
let queryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* 開発環境でのみDevtoolsを表示 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
};

// QueryClientをエクスポート（必要に応じて直接アクセス用）
export { getQueryClient };