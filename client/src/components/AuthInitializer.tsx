'use client';

import { useEffect, useRef, useState } from 'react';
import { authStore } from '@/stores/authStore';

// 🔥 根本修正: AuthInitializerの完全簡素化
export const AuthInitializer = () => {
  const hasInitialized = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // CSRでのみ実行
    if (typeof window !== 'undefined') {
      // hydration実行
      authStore.persist.rehydrate();
      setHydrated(true);
      
      // 初期化は一度だけ（状態に依存しない）
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        const { fetchUserSession, initialized } = authStore.getState();
        if (!initialized) {
          fetchUserSession();
        }
      }
    }
  }, []); // 依存関係なし - 一度だけ実行

  return null; // SSRでは何も描画しない
};