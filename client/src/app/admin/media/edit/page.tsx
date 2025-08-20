import { createServerAdminClient } from '@/lib/supabase/server-admin';
import EditMediaForm from './EditMediaForm';
import { saveArticle } from './actions';

// 画像URL変数を実際のURLに変換する関数
function replaceImageVariables(content: string): string {
  if (!content) return content;
  
  let processedContent = content;
  
  // 既にSupabase URLが含まれている場合はそのまま返す
  if (processedContent.includes('/storage/v1/object/public/blog/')) {
    console.log('Content already has Supabase URLs, returning as-is');
    return processedContent;
  }
  
  // ハードコードされたSupabase URL（client.tsと同じ値を使用）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
  
  // src属性内の{{image:filename}}形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/src=["']?\{\{image:([^}]+)\}\}["']?/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    console.log(`Replacing src attribute: ${match} -> src="${publicUrl}"`);
    return `src="${publicUrl}"`;
  });
  
  // 単体の{{image:filename}} 形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/\{\{image:([^}]+)\}\}/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    console.log(`Replacing standalone variable: ${match} -> ${publicUrl}`);
    return publicUrl;
  });
  
  return processedContent;
}

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
      const processedContent = replaceImageVariables(article.content || '');
      console.log('=== DEBUG IMAGE REPLACEMENT ===');
      console.log('Original content:', article.content);
      console.log('Processed content:', processedContent);
      console.log('Has image variables?', article.content?.includes('{{image:'));
      console.log('Has supabase URLs?', article.content?.includes('/storage/v1/object/public/blog/'));
      console.log('============================');
      
      articleData = {
        ...article,
        article_categories: categoryRelations?.map(rel => rel.article_categories).filter(Boolean) || [],
        article_tags: tagRelations?.map(rel => rel.article_tags).filter(Boolean) || [],
        // コンテンツ内の画像変数を実際のURLに変換
        content: processedContent
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