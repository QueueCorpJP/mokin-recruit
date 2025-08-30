'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PopularArticle, ArticleCategory, ArticleTag } from '@/app/candidate/news/actions';

interface SidebarData {
  popularArticles: PopularArticle[];
  categories: ArticleCategory[];
  tags: ArticleTag[];
}

interface NewsCacheContextType {
  sidebarData: SidebarData | null;
  setSidebarData: (data: SidebarData) => void;
  clearCache: () => void;
  lastUpdated: number | null;
}

const NewsCacheContext = createContext<NewsCacheContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5分間キャッシュ

export function NewsCacheProvider({ children }: { children: ReactNode }) {
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
    <NewsCacheContext.Provider value={{
      sidebarData: getCachedSidebarData(),
      setSidebarData,
      clearCache,
      lastUpdated
    }}>
      {children}
    </NewsCacheContext.Provider>
  );
}

export function useNewsCache() {
  const context = useContext(NewsCacheContext);
  if (context === undefined) {
    throw new Error('useNewsCache must be used within a NewsCacheProvider');
  }
  return context;
}