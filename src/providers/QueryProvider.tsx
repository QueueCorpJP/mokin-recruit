'use client';

import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

// ReactQueryDevtoolsを遅延読み込み
import { ReactQueryDevtools } from '@/lib/lazy-imports';

// QueryClientの設定を最適化
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分間はキャッシュを新鮮とみなす
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false, // パフォーマンス向上
        refetchOnMount: true,
        refetchOnReconnect: true,
        // 並列クエリの最適化
        throwOnError: false,
        // ネットワーク状態に基づく自動調整
        networkMode: 'online',
      },
      mutations: {
        retry: (failureCount, error: any) => {
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        networkMode: 'online',
        throwOnError: false,
      },
    },
  });
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // useMemoでQueryClientを最適化（再作成を防ぐ）
  const client = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* 開発環境でのみDevtoolsを遅延表示 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
};

// QueryClientを取得するための関数をエクスポート
export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // サーバーサイドでは新しいインスタンスを作成
    return createQueryClient();
  }
  // クライアントサイドではシングルトンを返す
  if (!globalThis.__queryClient) {
    globalThis.__queryClient = createQueryClient();
  }
  return globalThis.__queryClient;
};

// グローバル型定義
declare global {
  var __queryClient: QueryClient | undefined;
}