export interface FormattedArticleCard {
  id: string;
  date: string;
  categories: string[];
  tags: string[];
  title: string;
  description: string;
  imageUrl: string;
}

export function parseArticleContent(content: any): any {
  if (!content) return content;
  if (typeof content === 'string') {
    if (
      content.startsWith('<') ||
      content.includes('<p>') ||
      content.includes('<div>')
    ) {
      return content;
    }
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }
  return content;
}

export function formatArticleCards(articles: any[]): FormattedArticleCard[] {
  return (articles || []).map((article: any) => ({
    id: article.id,
    date: new Date(
      article.published_at || article.created_at
    ).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    categories: article.categories || ['メディア'],
    tags: article.tags || [],
    title: article.title,
    description: article.excerpt || 'No description available',
    imageUrl: article.thumbnail_url || '/images/media01.jpg',
  }));
}
