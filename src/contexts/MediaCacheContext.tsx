'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { SidebarData, MediaCacheContextType } from '@/types';

const MediaCacheContext = createContext<MediaCacheContextType | undefined>(
  undefined
);

const CACHE_DURATION = 5 * 60 * 1000; // 5分間キャッシュ

export function MediaCacheProvider({ children }: { children: ReactNode }) {
  const [sidebarData, setSidebarDataState] = useState<SidebarData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const setSidebarData = (data: SidebarData) => {
    setSidebarDataState(data);
    setLastUpdated(Date.now());
  };

  const clearCache = () => {
    setSidebarDataState(null);
    setLastUpdated(null);
  };

  const isExpired = () => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated > CACHE_DURATION;
  };

  const getCachedSidebarData = () => {
    if (!sidebarData || isExpired()) {
      return null;
    }
    return sidebarData;
  };

  return (
    <MediaCacheContext.Provider
      value={{
        sidebarData: getCachedSidebarData(),
        setSidebarData,
        clearCache,
        lastUpdated,
      }}
    >
      {children}
    </MediaCacheContext.Provider>
  );
}

export function useMediaCache() {
  const context = useContext(MediaCacheContext);
  if (context === undefined) {
    throw new Error('useMediaCache must be used within a MediaCacheProvider');
  }
  return context;
}
