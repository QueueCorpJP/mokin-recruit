'use client';

import { useEffect, useState } from 'react';

import type { UserType } from '@/stores/authStore';

import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
  showLoadingSpinner?: boolean;
}

/**
 * AuthGuard - 認証状態を監視するコンポーネント
 * 
 * 機能:
 * - 認証状態を監視（既にAuthInitializerで初期化済み）
 * - ヘッダーなどのUIで使用する認証情報を提供
 * - ページアクセス制限は個別のlayoutで実装
 */
export function AuthGuard({
  children,
  requireAuth: _requireAuth = false, // 未使用パラメータ（後方互換性のため）
  allowedUserTypes: _allowedUserTypes, // 未使用パラメータ（後方互換性のため）
  redirectTo: _redirectTo, // 未使用パラメータ（後方互換性のため）
  showLoadingSpinner = true,
}: AuthGuardProps) {
  const { isLoading, initialized, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setMounted(true);
  }, []);

  // デバッグログを追加
  useEffect(() => {
    if (mounted) {
      // eslint-disable-next-line no-console
      console.log('🔍 AuthGuard State:', {
        mounted,
        initialized,
        isLoading,
        isAuthenticated,
        shouldShowContent: mounted && initialized,
        timestamp: new Date().toISOString()
      });
    }
  }, [mounted, initialized, isLoading, isAuthenticated]);

  // サーバーサイドまたは初期ローディング中の表示
  // 初期化が完了していない場合のみローディングを表示
  if (!mounted || !initialized) {
    return showLoadingSpinner ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F9058]"></div>
      </div>
    ) : null;
  }

  // 認証状態に関係なくコンテンツを表示
  // 個別の認証制限は各layoutで実装
  return <>{children}</>;
}