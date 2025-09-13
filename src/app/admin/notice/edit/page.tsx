import { createServerAdminClient } from '@/lib/supabase/server-admin';
import EditNoticeForm from './EditNoticeForm';
import { saveNotice } from './actions';

// 画像URL変数を実際のURLに変換する関数
function replaceImageVariables(content: string): string {
  if (!content) return content;
  
  let processedContent = content;
  
  // 既にSupabase URLが含まれている場合はそのまま返す
  if (processedContent.includes('/storage/v1/object/public/blog/')) {
    return processedContent;
  }
  
  // ハードコードされたSupabase URL（client.tsと同じ値を使用）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
  
  // src属性内の{{image:filename}}形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/src=["']?\{\{image:([^}]+)\}\}["']?/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    return `src="${publicUrl}"`;
  });
  
  // 単体の{{image:filename}} 形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/\{\{image:([^}]+)\}\}/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    return publicUrl;
  });
  
  return processedContent;
}

interface EditNoticePageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditNoticePage({ searchParams }: EditNoticePageProps) {
  const supabase = createServerAdminClient();
  
  // searchParamsをawait
  const params = await searchParams;
  
  // カテゴリを取得
  const categoriesResult = await supabase.from('notice_categories').select('*').order('name');

  if (categoriesResult.error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  // お知らせIDがある場合はお知らせデータを取得
  let noticeData = null;
  if (params.id) {
    // まずお知らせ本体を取得
    const { data: notice, error: noticeError } = await supabase
      .from('notices')
      .select('*')
      .eq('id', params.id)
      .single();

    if (noticeError) {
      if (process.env.NODE_ENV === 'development') console.error('お知らせの読み込みに失敗:', noticeError);
    } else {
      // カテゴリの取得
      const { data: categoryRelations } = await supabase
        .from('notice_category_relations')
        .select('category_id, notice_categories(id, name)')
        .eq('notice_id', params.id);

      // データを整形
      const processedContent = replaceImageVariables(notice.content || '');
      
      noticeData = {
        ...notice,
        notice_categories: categoryRelations?.map(rel => rel.notice_categories).filter(Boolean) || [],
        // コンテンツ内の画像変数を実際のURLに変換
        content: processedContent
      };
    }
  }

  return (
    <EditNoticeForm 
      categories={categoriesResult.data || []} 
      saveNotice={saveNotice}
      initialNotice={noticeData}
    />
  );
}