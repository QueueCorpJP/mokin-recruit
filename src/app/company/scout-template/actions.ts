'use server';

import { getCachedCompanyUser, requireCompanyAuthForAction } from '@/lib/auth/server';
import { createServerActionClient } from '@/lib/supabase/server';

export interface ScoutTemplate {
  id: string;
  template_name: string;
  subject: string;
  target_job_posting_id: string;
  target_job_title: string;
  is_saved: boolean;
  group_id: string;
  group_name: string;
  searcher_name: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  status: string;
}

// スカウトテンプレート一覧を取得
export async function getScoutTemplates(limit: number = 50, offset: number = 0) {
  try {
    console.log('🔍 Starting getScoutTemplates function');
    
    // より厳密な企業認証を使用
    const authResult = await requireCompanyAuthForAction();
    console.log('👤 Auth result:', authResult.success ? 'success' : 'failed');
    
    if (!authResult.success) {
      console.log('❌ Authentication failed:', authResult.error);
      return { success: false, error: authResult.error, data: [] };
    }
    
    const { companyAccountId, companyUserId } = authResult.data;
    console.log('🏢 Company Account ID:', companyAccountId);
    console.log('👤 Company User ID:', companyUserId);

    const supabase = createServerActionClient();
    console.log('✅ Supabase client created');

    // 現在の認証情報を確認
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('🔐 Current auth user:', user ? {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    } : 'not authenticated');
    
    if (userError) {
      console.log('❌ User auth error:', userError);
    }

    // 企業のスカウトテンプレートを取得（RLSで自動的にアクセス制御）
    let query = supabase
      .from('search_templates')
      .select(`
        id,
        template_name,
        group_id,
        created_at,
        updated_at,
        subject,
        body,
        target_job_posting_id,
        is_saved,
        company_groups(id, group_name),
        job_postings(id, title)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // RLS依存なのでcompany_idフィルターは削除
    console.log('🔎 Using RLS for data access control (no manual company_id filter)');

    console.log('📡 Executing Supabase query...');
    const { data: templates, error } = await query;
    
    console.log('📊 Query result:', {
      templates_count: templates?.length || 0,
      error: error || 'none',
      templates: templates
    });

    if (error) {
      console.error('❌ Error fetching scout templates:', error);
      return { 
        success: false, 
        error: 'スカウトテンプレートの取得に失敗しました', 
        data: [] 
      };
    }

    console.log('🔄 Processing templates data...');
    const formattedTemplates: ScoutTemplate[] = templates?.map(template => {
      console.log('📝 Processing template:', {
        id: template.id,
        template_name: template.template_name,
        group_id: template.group_id,
        company_groups: template.company_groups,
        job_postings: template.job_postings
      });
      
      return {
        id: template.id,
        template_name: template.template_name || '',
        subject: template.subject || '',
        target_job_posting_id: template.target_job_posting_id || '',
        target_job_title: (template.job_postings as any)?.title || '',
        is_saved: template.is_saved || false,
        group_id: template.group_id || (template.company_groups as any)?.id || '',
        group_name: (template.company_groups as any)?.group_name || '',
        searcher_name: '', // company_usersとのリレーションがないため空文字
        created_at: template.created_at,
        updated_at: template.updated_at,
      };
    }) || [];

    console.log('✅ Formatted templates count:', formattedTemplates.length);
    return { 
      success: true, 
      data: formattedTemplates
    };
  } catch (error) {
    console.error('💥 Exception in getScoutTemplates:', error);
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

    const supabase = createServerActionClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.user_metadata?.company_account_id) {
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

    const supabase = createServerActionClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.user_metadata?.company_account_id) {
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

    const supabase = createServerActionClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('search_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.user_metadata?.company_account_id) {
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

// 企業の求人一覧を取得
export async function getJobPostings() {
  try {
    console.log('🔍 Starting getJobPostings function');
    
    // より厳密な企業認証を使用
    const authResult = await requireCompanyAuthForAction();
    console.log('👤 Auth result:', authResult.success ? 'success' : 'failed');
    
    if (!authResult.success) {
      console.log('❌ Authentication failed:', authResult.error);
      return { success: false, error: authResult.error, data: [] };
    }
    
    const { companyAccountId } = authResult.data;
    console.log('🏢 Company Account ID:', companyAccountId);

    const supabase = createServerActionClient();
    console.log('✅ Supabase client created');

    // 企業の求人を取得（公開済みとドラフト）
    const { data: jobPostings, error } = await supabase
      .from('job_postings')
      .select('id, title, status')
      .eq('company_account_id', companyAccountId)
      .in('status', ['PUBLISHED', 'DRAFT', 'active'])
      .order('created_at', { ascending: false });

    console.log('📊 Job postings query result:', {
      job_postings_count: jobPostings?.length || 0,
      error: error || 'none'
    });

    if (error) {
      console.error('❌ Error fetching job postings:', error);
      return { 
        success: false, 
        error: '求人の取得に失敗しました', 
        data: [] 
      };
    }

    const formattedJobPostings: JobPosting[] = jobPostings?.map(job => ({
      id: job.id,
      title: job.title || '',
      status: job.status || ''
    })) || [];

    console.log('✅ Formatted job postings count:', formattedJobPostings.length);
    return { 
      success: true, 
      data: formattedJobPostings
    };
  } catch (error) {
    console.error('💥 Exception in getJobPostings:', error);
    return { success: false, error: '求人の取得に失敗しました', data: [] };
  }
}
