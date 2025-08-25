import { createNewsService } from './newsService.common';

export type { Article, PopularArticle, ArticleCategory, ArticleTag } from './newsService.common';

export const newsService = createNewsService();