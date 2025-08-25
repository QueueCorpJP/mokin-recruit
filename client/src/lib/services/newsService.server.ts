import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { createNewsService } from './newsService.common';

export type { Article, PopularArticle, ArticleCategory, ArticleTag } from './newsService.common';

export const newsService = createNewsService();