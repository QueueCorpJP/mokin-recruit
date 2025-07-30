'use client';

import { useEffect, useRef } from 'react';

import { selectInitialized, useAuthStore } from '@/stores/authStore';

export const AuthInitializer = () => {
  const initialized = useAuthStore(selectInitialized);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 未初期化かつ初回実行の場合のみ実行
    if (!initialized && !hasInitialized.current) {
      hasInitialized.current = true;
      
      // eslint-disable-next-line no-console
      console.log('🚀 AuthInitializer: Starting auth initialization...');
      
      // ストアから直接関数を呼び出して依存関係の問題を回避
      useAuthStore.getState().fetchUserSession();
    } else if (initialized) {
      // eslint-disable-next-line no-console
      console.log('✅ AuthInitializer: Already initialized');
    }
  }, [initialized]);

  // フォールバック：5秒経っても初期化されない場合は強制的に初期化済みとする
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentState = useAuthStore.getState();
      if (!currentState.initialized) {
        // eslint-disable-next-line no-console
        console.log('⚠️ AuthInitializer: Forcing initialization after timeout');
        currentState.setInitialized(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};