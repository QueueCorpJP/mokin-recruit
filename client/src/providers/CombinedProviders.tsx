'use client';

import React, { Suspense, useMemo } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { ToastProvider } from '@/components/ui/toast';

interface CombinedProvidersProps {
  children: React.ReactNode;
}

// プロバイダを並列で初期化するための最適化されたラッパー
export const CombinedProviders: React.FC<CombinedProvidersProps> = ({ children }) => {
  // プロバイダの順序を最適化（依存関係を考慮）
  // QueryProvider -> AuthProvider -> ToastProvider の順序で並列初期化
  const providerTree = useMemo(() => (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            {children}
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  ), [children]);

  return providerTree;
};