'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Shared navigation hooks
 */
export function useCancelNavigation(redirectPath: string) {
  const router = useRouter();
  return useCallback(() => {
    router.push(redirectPath);
  }, [router, redirectPath]);
}
