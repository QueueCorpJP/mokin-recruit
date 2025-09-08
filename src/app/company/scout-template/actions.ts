'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface ScoutTemplate {
  id: string;
  template_name: string;
  subject: string;
  body: string;
  group_name: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}

// スカウトテンプレート一覧を取得
export async function getScoutTemplates(limit: number = 50, offset: number = 0) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です', data: [] };
    }
    if (!companyUser.user_metadata?.company_account_id) {
      return { success: false, error: '企業アカウント情報が見つかりません。再ログインしてください。', data: [] };
    }
    const companyAccountId = companyUser.user_metadata.company_account_id;

    const supabase = await createClient();

    // 企業のスカウトテンプレートを取得（RLSで自動的にアクセス制御）
    let query = supabase
      .from('search_templates')
      .select(`
        id,
        template_name,
        subject,
        body,
        created_at,
        updated_at,
        company_groups!inner(group_name),
        job_postings(title)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (companyAccountId) {
      query = query.eq('company_id', companyAccountId);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching scout templates:', error);
      return { 
        success: false, 
        error: 'スカウトテンプレートの取得に失敗しました', 
        data: [] 
      };
    }

    const formattedTemplates: ScoutTemplate[] = templates?.map(template => ({
      id: template.id,
      template_name: template.template_name,
      subject: template.subject,
      body: template.body,
      group_name: (template.company_groups as any)?.group_name || '',
      job_title: (template.job_postings as any)?.title || '',
      created_at: template.created_at,
      updated_at: template.updated_at,
    })) || [];

    return { 
      success: true, 
      data: formattedTemplates
    };
  } catch (error) {
    console.error('Error in getScoutTemplates:', error);
    return { success: false, error: 'スカウトテンプレートの取得に失敗しました', data: [] };
  }
}

// スカウトテンプレートを削除
export async function deleteScoutTemplate(templateId: string) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    const supabase = createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.company_account_id) {
      return { success: false, error: '権限がありません' };
    }

    // テンプレートを削除
    const { error: deleteError } = await supabase
      .from('search_templates')
      .delete()
      .eq('id', templateId);

    if (deleteError) {
      console.error('Error deleting scout template:', deleteError);
      return { success: false, error: 'テンプレートの削除に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteScoutTemplate:', error);
    return { success: false, error: 'テンプレートの削除に失敗しました' };
  }
}

// スカウトテンプレートの名前を更新
export async function updateScoutTemplateName(templateId: string, newName: string) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    if (!newName.trim()) {
      return { success: false, error: 'テンプレート名を入力してください' };
    }

    const supabase = createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.company_account_id) {
      return { success: false, error: '権限がありません' };
    }

    // テンプレート名を更新
    const { error: updateError } = await supabase
      .from('search_templates')
      .update({ 
        template_name: newName.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);

    if (updateError) {
      console.error('Error updating scout template name:', updateError);
      return { success: false, error: 'テンプレート名の更新に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateScoutTemplateName:', error);
    return { success: false, error: 'テンプレート名の更新に失敗しました' };
  }
}

// スカウトテンプレートの保存状態を更新
export async function updateScoutTemplateSavedStatus(templateId: string, isSaved: boolean) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    const supabase = createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.company_account_id) {
      return { success: false, error: '権限がありません' };
    }

    // 保存状態を更新
    const { error: updateError } = await supabase
      .from('search_templates')
      .update({ 
        is_saved: isSaved,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);

    if (updateError) {
      console.error('Error updating scout template saved status:', updateError);
      return { success: false, error: '保存状態の更新に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateScoutTemplateSavedStatus:', error);
    return { success: false, error: '保存状態の更新に失敗しました' };
  }
}
