import { createServerAdminClient } from '@/lib/supabase/server-admin';
import EditMediaForm from './EditMediaForm';
import { saveArticle } from './actions';

interface EditMediaPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditMediaPage({ searchParams }: EditMediaPageProps) {
  const supabase = createServerAdminClient();
  
  // searchParamsをawait
  const params = await searchParams;
  
  // カテゴリとタグを取得
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('article_categories').select('*').order('name'),
    supabase.from('article_tags').select('*').order('name')
  ]);

  if (categoriesResult.error) {
    console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (tagsResult.error) {
    console.error('タグの読み込みに失敗:', tagsResult.error);
  }

  // 記事IDがある場合は記事データを取得
  let articleData = null;
  if (params.id) {
    // まず記事本体を取得
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (articleError) {
      console.error('記事の読み込みに失敗:', articleError);
    } else {
      // カテゴリの取得
      const { data: categoryRelations } = await supabase
        .from('article_category_relations')
        .select('category_id, article_categories(id, name)')
        .eq('article_id', params.id);

      // タグの取得
      const { data: tagRelations } = await supabase
        .from('article_tag_relations')
        .select('tag_id, article_tags(id, name)')
        .eq('article_id', params.id);

      // データを整形
      articleData = {
        ...article,
        article_categories: categoryRelations?.map(rel => rel.article_categories).filter(Boolean) || [],
        article_tags: tagRelations?.map(rel => rel.article_tags).filter(Boolean) || []
      };
    }
  }

  return (
    <EditMediaForm 
      categories={categoriesResult.data || []} 
      tags={tagsResult.data || []}
      saveArticle={saveArticle}
      initialArticle={articleData}
    />
  );
}