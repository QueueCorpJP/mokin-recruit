'use client';

import React, { Suspense, useMemo } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { MediaCacheProvider } from '@/contexts/MediaCacheContext';
import { NewsCacheProvider } from '@/contexts/NewsCacheContext';

interface CombinedProvidersProps {
  children: React.ReactNode;
}

// プロバイダを並列で初期化するための最適化されたラッパー
export const CombinedProviders: React.FC<CombinedProvidersProps> = ({ children }) => {
  // プロバイダの順序を最適化（依存関係を考慮）
  // AuthProvider -> MediaCacheProvider -> NewsCacheProvider -> ToastProvider の順序で並列初期化
  const providerTree = useMemo(() => (
    <AuthProvider>
      <MediaCacheProvider>
        <NewsCacheProvider>
          <ToastProvider>
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
              {children}
            </Suspense>
          </ToastProvider>
        </NewsCacheProvider>
      </MediaCacheProvider>
    </AuthProvider>
  ), [children]);

  return providerTree;
};