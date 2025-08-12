import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { createMediaService } from './mediaService.common';

export type { PopularArticle, ArticleCategory, ArticleTag } from './mediaService.common';

export const mediaService = createMediaService(createServerAdminClient());