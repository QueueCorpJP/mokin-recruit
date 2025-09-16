// Media and News article types

export interface PopularArticle {
  id: string;
  title: string;
  views_count: number;
  published_at: string;
  created_at: string;
  excerpt?: string;
  content?: string | Record<string, unknown>;
  thumbnail_url?: string;
}

export interface ArticleCategory {
  name: string;
  count: number;
}

export interface ArticleTag {
  name: string;
  count: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string | Record<string, unknown>;
  thumbnail_url: string;
  published_at: string;
  created_at: string;
  categories: string[];
  tags: string[];
}

// Legacy aliases for backward compatibility
export interface MediaArticle extends Article {}
export interface NewsArticle extends Article {}

// Cache context types
export interface SidebarData {
  popularArticles: PopularArticle[];
  categories: ArticleCategory[];
  tags: ArticleTag[];
}

export interface MediaCacheContextType {
  sidebarData: SidebarData | null;
  setSidebarData: (_data: SidebarData) => void;
  clearCache: () => void;
  lastUpdated: number | null;
}
