'use server';

import { createClient } from '@/lib/supabase/server';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export interface MessageTemplateData {
  groupId: string;
  templateName: string;
  body: string;
}

export interface GroupOption {
  value: string;
  label: string;
}

// 企業のグループ一覧を取得
export async function getCompanyGroups(): Promise<GroupOption[]> {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.log('❌ getCompanyGroups - Auth failed');
      throw new Error('認証が必要です');
    }

    const { companyUserId } = authResult.data;
    const supabase = await createClient();

    // ユーザーが権限を持つグループのみ取得
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(`
        company_group:company_groups (
          id,
          group_name
        )
      `)
      .eq('company_user_id', companyUserId);

    if (error) {
      console.error('Error fetching company groups:', error);
      throw new Error('グループの取得に失敗しました');
    }

    // グループ形式に変換
    const formattedGroups = (userPermissions || [])
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        value: group.id,
        label: group.group_name
      }));

    return [
      { value: '', label: '未選択' },
      ...formattedGroups
    ];
  } catch (error) {
    console.error('Error in getCompanyGroups:', error);
    return [{ value: '', label: '未選択' }];
  }
}

// メッセージテンプレートを保存
export async function createMessageTemplate(data: MessageTemplateData) {
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

    // メッセージテンプレートを保存
    const { error: insertError } = await supabase
      .from('message_templates')
      .insert({
        company_id: companyAccountId,
        group_id: data.groupId,
        template_name: data.templateName.trim(),
        body: data.body.trim()
      });

    if (insertError) {
      console.error('Error creating message template:', insertError);
      return { success: false, error: 'メッセージテンプレートの作成に失敗しました' };
    }

    // キャッシュを更新
    revalidatePath('/company/template');
    
    return { success: true };
  } catch (error) {
    console.error('Error in createMessageTemplate:', error);
    return { success: false, error: 'メッセージテンプレートの作成に失敗しました' };
  }
}
