import { createClient } from '@/lib/supabase/client';
import { createMediaService } from './mediaService.common';

export type { PopularArticle, ArticleCategory, ArticleTag, Article } from './mediaService.common';

export const mediaService = createMediaService(createClient());