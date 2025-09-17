'use server';

import { createServerActionClient } from '@/lib/supabase/server';
import {
  getCachedCompanyUser,
  requireCompanyAuthForAction,
} from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export interface ScoutTemplateData {
  id: string;
  templateName: string;
  groupId: string;
  targetJobPostingId: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// スカウトテンプレートを取得
export async function getScoutTemplateById(templateId: string) {
  try {
    console.log('🔍 Getting scout template by ID:', templateId);
    const authResult = await requireCompanyAuthForAction();
    console.log(
      '👤 Auth result for getScoutTemplateById:',
      authResult.success ? 'success' : 'failed'
    );

    if (!authResult.success) {
      console.log(
        '❌ Authentication failed:',
        (authResult as any).error || '認証が必要です'
      );
      return {
        success: false,
        error: (authResult as any).error || '認証が必要です',
        data: null,
      };
    }

    const supabase = createServerActionClient();

    // セッション状態を確認
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();
    console.log('🔐 Server Action session check:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: sessionError?.message,
    });

    const { data: template, error } = await supabase
      .from('search_templates')
      .select(
        `
        id,
        template_name,
        group_id,
        target_job_posting_id,
        subject,
        body,
        created_at,
        updated_at
      `
      )
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching scout template:', error);
      return {
        success: false,
        error: 'スカウトテンプレートの取得に失敗しました',
        data: null,
      };
    }

    if (!template) {
      return {
        success: false,
        error: 'スカウトテンプレートが見つかりません',
        data: null,
      };
    }

    const formattedTemplate: ScoutTemplateData = {
      id: template.id,
      templateName: template.template_name || '',
      groupId: template.group_id || '',
      targetJobPostingId: template.target_job_posting_id || '',
      subject: template.subject || '',
      body: template.body || '',
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    };

    return {
      success: true,
      data: formattedTemplate,
    };
  } catch (error) {
    console.error('Exception in getScoutTemplateById:', error);
    return {
      success: false,
      error: 'スカウトテンプレートの取得に失敗しました',
      data: null,
    };
  }
}

// スカウトテンプレートを更新
export async function updateScoutTemplate(
  templateId: string,
  data: {
    groupId: string;
    targetJobPostingId: string;
    templateName: string;
    subject: string;
    body: string;
  }
) {
  try {
    console.log('🔄 Updating scout template:', templateId);
    const companyUser = await getCachedCompanyUser();
    console.log(
      '👤 Company user for update:',
      companyUser
        ? {
            id: companyUser.id,
            company_account_id: companyUser.user_metadata?.company_account_id,
          }
        : 'not found'
    );

    if (!companyUser) {
      console.log('❌ No company user found for update');
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

    // テンプレートを更新
    const { error: updateError } = await supabase
      .from('search_templates')
      .update({
        group_id: data.groupId,
        target_job_posting_id: data.targetJobPostingId,
        template_name: data.templateName,
        subject: data.subject,
        body: data.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', templateId);

    if (updateError) {
      console.error('Error updating scout template:', updateError);
      return { success: false, error: 'テンプレートの更新に失敗しました' };
    }

    // キャッシュを無効化
    revalidatePath('/company/scout-template');

    return { success: true };
  } catch (error) {
    console.error('Error in updateScoutTemplate:', error);
    return { success: false, error: 'テンプレートの更新に失敗しました' };
  }
}

// スカウトテンプレートを削除
export async function deleteScoutTemplate(templateId: string) {
  try {
    console.log('🗑️ Deleting scout template:', templateId);
    const companyUser = await getCachedCompanyUser();
    console.log(
      '👤 Company user for delete:',
      companyUser
        ? {
            id: companyUser.id,
            company_account_id: companyUser.user_metadata?.company_account_id,
          }
        : 'not found'
    );

    if (!companyUser) {
      console.log('❌ No company user found for delete');
      return { success: false, error: '認証が必要です' };
    }

    const supabase = createServerActionClient();

    // セッション状態を確認
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();
    console.log('🔐 Delete action session check:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: sessionError?.message,
    });

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

    // キャッシュを無効化
    revalidatePath('/company/scout-template');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteScoutTemplate:', error);
    return { success: false, error: 'テンプレートの削除に失敗しました' };
  }
}
