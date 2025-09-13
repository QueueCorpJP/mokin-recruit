'use server';

import { getCachedCompanyUser, requireCompanyAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface MessageTemplate {
  id: string;
  template_name: string;
  body: string;
  is_saved: boolean;
  group_id: string;
  group_name: string;
  searcher_name: string;
  created_at: string;
  updated_at: string;
}

// メッセージテンプレート一覧を取得
export async function getMessageTemplates(limit: number = 50, offset: number = 0) {
  try {
    if (process.env.NODE_ENV === 'development') console.log('🔍 Starting getMessageTemplates function');
    
    // より厳密な企業認証を使用
    const authResult = await requireCompanyAuthForAction();
    if (process.env.NODE_ENV === 'development') console.log('👤 Auth result:', authResult.success ? 'success' : 'failed');
    
    if (!authResult.success) {
      if (process.env.NODE_ENV === 'development') console.log('❌ Authentication failed');
      return { success: false, error: '認証が必要です', data: [] };
    }
    
    const { companyAccountId, companyUserId } = authResult.data;
    if (process.env.NODE_ENV === 'development') console.log('🏢 Company Account ID:', companyAccountId);
    if (process.env.NODE_ENV === 'development') console.log('👤 Company User ID:', companyUserId);

    const supabase = await createClient();
    if (process.env.NODE_ENV === 'development') console.log('✅ Supabase client created');

    // 現在の認証情報を確認
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (process.env.NODE_ENV === 'development') console.log('🔐 Current auth user:', user ? {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    } : 'not authenticated');
    
    if (userError) {
      if (process.env.NODE_ENV === 'development') console.log('❌ User auth error:', userError);
    }

    // 企業のメッセージテンプレートを取得（RLSで自動的にアクセス制御）
    let query = supabase
      .from('message_templates')
      .select(`
        id,
        template_name,
        group_id,
        created_at,
        updated_at,
        body,
        company_groups(id, group_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // RLS依存なのでcompany_idフィルターは削除
    if (process.env.NODE_ENV === 'development') console.log('🔎 Using RLS for data access control (no manual company_id filter)');

    if (process.env.NODE_ENV === 'development') console.log('📡 Executing Supabase query...');
    const { data: templates, error } = await query;
    
    if (process.env.NODE_ENV === 'development') console.log('📊 Query result:', {
      templates_count: templates?.length || 0,
      error: error || 'none',
      templates: templates
    });

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('❌ Error fetching message templates:', error);
      return { 
        success: false, 
        error: 'メッセージテンプレートの取得に失敗しました', 
        data: [] 
      };
    }

    if (process.env.NODE_ENV === 'development') console.log('🔄 Processing templates data...');
    const formattedTemplates: MessageTemplate[] = templates?.map(template => {
      if (process.env.NODE_ENV === 'development') console.log('📝 Processing template:', {
        id: template.id,
        template_name: template.template_name,
        group_id: template.group_id,
        company_groups: template.company_groups
      });
      
      return {
        id: template.id,
        template_name: template.template_name || '',
        body: template.body || '',
        is_saved: false, // message_templatesテーブルにis_savedカラムが存在しないため固定値
        group_id: template.group_id || (template.company_groups as any)?.id || '',
        group_name: (template.company_groups as any)?.group_name || '',
        searcher_name: '', // company_usersとのリレーションがないため空文字
        created_at: template.created_at,
        updated_at: template.updated_at,
      };
    }) || [];

    if (process.env.NODE_ENV === 'development') console.log('✅ Formatted templates count:', formattedTemplates.length);
    return { 
      success: true, 
      data: formattedTemplates
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('💥 Exception in getMessageTemplates:', error);
    return { success: false, error: 'メッセージテンプレートの取得に失敗しました', data: [] };
  }
}

// メッセージテンプレートを削除
export async function deleteMessageTemplate(templateId: string) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    const supabase = await createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('message_templates')
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
      .from('message_templates')
      .delete()
      .eq('id', templateId);

    if (deleteError) {
      if (process.env.NODE_ENV === 'development') console.error('Error deleting message template:', deleteError);
      return { success: false, error: 'テンプレートの削除に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in deleteMessageTemplate:', error);
    return { success: false, error: 'テンプレートの削除に失敗しました' };
  }
}

// メッセージテンプレートの名前を更新
export async function updateMessageTemplateName(templateId: string, newName: string) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    if (!newName.trim()) {
      return { success: false, error: 'テンプレート名を入力してください' };
    }

    const supabase = await createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('message_templates')
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
      .from('message_templates')
      .update({ 
        template_name: newName.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);

    if (updateError) {
      if (process.env.NODE_ENV === 'development') console.error('Error updating message template name:', updateError);
      return { success: false, error: 'テンプレート名の更新に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in updateMessageTemplateName:', error);
    return { success: false, error: 'テンプレート名の更新に失敗しました' };
  }
}

// メッセージテンプレートの保存状態を更新
export async function updateMessageTemplateSavedStatus(templateId: string, isSaved: boolean) {
  try {
    const companyUser = await getCachedCompanyUser();
    if (!companyUser) {
      return { success: false, error: '認証が必要です' };
    }

    const supabase = await createClient();

    // テンプレートが企業のものかチェック
    const { data: template, error: checkError } = await supabase
      .from('message_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !template) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (template.company_id !== companyUser.user_metadata?.company_account_id) {
      return { success: false, error: '権限がありません' };
    }

    // 保存状態を更新 (message_templatesテーブルにis_savedカラムがない場合はスキップ)
    // 今回はis_savedカラムがないため、この関数は何もしない
    if (process.env.NODE_ENV === 'development') console.log('ℹ️ message_templates table does not have is_saved column, skipping update');

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in updateMessageTemplateSavedStatus:', error);
    return { success: false, error: '保存状態の更新に失敗しました' };
  }
}

// メッセージテンプレートをIDで取得
export async function getMessageTemplateById(templateId: string) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: '認証が必要です' };
    }

    const { companyAccountId } = authResult.data;
    const supabase = await createClient();

    // テンプレートを取得（RLS使用）
    const { data: template, error } = await supabase
      .from('message_templates')
      .select(`
        id,
        template_name,
        body,
        group_id,
        company_groups(id, group_name)
      `)
      .eq('id', templateId)
      .single();

    if (error || !template) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching message template:', error);
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    return { 
      success: true, 
      data: {
        groupId: template.group_id,
        templateName: template.template_name,
        body: template.body
      }
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in getMessageTemplateById:', error);
    return { success: false, error: 'テンプレートの取得に失敗しました' };
  }
}

// メッセージテンプレートを更新
export async function updateMessageTemplate(templateId: string, data: MessageTemplateData) {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: '認証が必要です' };
    }

    const { companyAccountId } = authResult.data;

    // バリデーション
    if (!data.groupId) {
      return { success: false, error: 'グループを選択してください' };
    }
    if (!data.templateName.trim()) {
      return { success: false, error: 'テンプレート名を入力してください' };
    }
    if (!data.body.trim()) {
      return { success: false, error: '本文を入力してください' };
    }

    const supabase = await createClient();

    // テンプレートが存在し、企業のものかチェック
    const { data: existingTemplate, error: checkError } = await supabase
      .from('message_templates')
      .select('company_id')
      .eq('id', templateId)
      .single();

    if (checkError || !existingTemplate) {
      return { success: false, error: 'テンプレートが見つかりません' };
    }

    if (existingTemplate.company_id !== companyAccountId) {
      return { success: false, error: '権限がありません' };
    }

    // グループが企業のものかチェック
    const { data: group, error: groupError } = await supabase
      .from('company_groups')
      .select('company_account_id')
      .eq('id', data.groupId)
      .single();

    if (groupError || !group) {
      return { success: false, error: '指定されたグループが見つかりません' };
    }

    if (group.company_account_id !== companyAccountId) {
      return { success: false, error: '権限がありません' };
    }

    // メッセージテンプレートを更新
    const { error: updateError } = await supabase
      .from('message_templates')
      .update({
        group_id: data.groupId,
        template_name: data.templateName.trim(),
        body: data.body.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId);

    if (updateError) {
      if (process.env.NODE_ENV === 'development') console.error('Error updating message template:', updateError);
      return { success: false, error: 'メッセージテンプレートの更新に失敗しました' };
    }

    // キャッシュを更新
    revalidatePath('/company/template');
    
    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error in updateMessageTemplate:', error);
    return { success: false, error: 'メッセージテンプレートの更新に失敗しました' };
  }
}
