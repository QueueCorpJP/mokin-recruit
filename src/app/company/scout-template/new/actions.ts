'use server';

import { createServerActionClient } from '@/lib/supabase/server';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ScoutTemplateData {
  groupId: string;
  targetJobPostingId: string;
  templateName: string;
  subject: string;
  body: string;
}

export interface GroupOption {
  value: string;
  label: string;
}

export interface JobOption {
  value: string;
  label: string;
}

// 企業のグループ一覧を取得
export async function getCompanyGroups(): Promise<GroupOption[]> {
  try {
    console.log('📋 Getting company groups...');
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    console.log(
      '👤 Auth result for getCompanyGroups:',
      authResult.success ? 'success' : 'failed'
    );

    if (!authResult.success) {
      console.log(
        '❌ getCompanyGroups - Auth failed:',
        (authResult as any).error || '認証が必要です'
      );
      throw new Error('認証が必要です');
    }

    const { companyUserId } = authResult.data;
    const supabase = createServerActionClient();

    // ユーザーが権限を持つグループのみ取得
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(
        `
        company_group:company_groups (
          id,
          group_name
        )
      `
      )
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
        label: group.group_name,
      }));

    return [{ value: '', label: '未選択' }, ...formattedGroups];
  } catch (error) {
    console.error('Error in getCompanyGroups:', error);
    return [{ value: '', label: '未選択' }];
  }
}

// グループに関連する求人一覧を取得
export async function getJobPostingsByGroup(
  groupId: string
): Promise<JobOption[]> {
  if (!groupId) {
    return [{ value: '', label: '未選択' }];
  }

  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.log(
        '❌ getJobPostingsByGroup - Auth failed:',
        (authResult as any).error || '認証が必要です'
      );
      throw new Error('認証が必要です');
    }

    const supabase = createServerActionClient();

    const { data: jobPostings, error } = await supabase
      .from('job_postings')
      .select('id, title')
      .eq('company_group_id', groupId)
      .in('status', ['PUBLISHED', 'DRAFT']) // ドラフトも含める
      .order('title');

    if (error) {
      console.error('Error fetching job postings:', error);
      throw new Error('求人の取得に失敗しました');
    }

    console.log('🔍 Job postings for group', groupId, ':', jobPostings);

    const formattedJobs = [
      { value: '', label: '未選択' },
      ...(jobPostings?.map(job => ({
        value: job.id,
        label: job.title,
      })) || []),
    ];

    console.log('🔍 Formatted job options:', formattedJobs);

    return formattedJobs;
  } catch (error) {
    console.error('Error in getJobPostingsByGroup:', error);
    return [{ value: '', label: '未選択' }];
  }
}

// スカウトテンプレートを保存
export async function createScoutTemplate(data: ScoutTemplateData) {
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
    if (!data.targetJobPostingId) {
      return { success: false, error: '対象の求人を選択してください' };
    }
    if (!data.templateName.trim()) {
      return { success: false, error: 'テンプレート名を入力してください' };
    }
    if (!data.subject.trim()) {
      return { success: false, error: '件名を入力してください' };
    }
    if (!data.body.trim()) {
      return { success: false, error: '本文を入力してください' };
    }

    const supabase = createServerActionClient();

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

    // 求人がグループのものかチェック
    const { data: jobPosting, error: jobError } = await supabase
      .from('job_postings')
      .select('company_group_id')
      .eq('id', data.targetJobPostingId)
      .single();

    if (jobError || !jobPosting) {
      return { success: false, error: '指定された求人が見つかりません' };
    }

    if (jobPosting.company_group_id !== data.groupId) {
      return { success: false, error: '求人とグループが一致しません' };
    }

    // スカウトテンプレートを保存
    const { error: insertError } = await supabase
      .from('search_templates')
      .insert({
        company_id: companyAccountId,
        group_id: data.groupId,
        template_name: data.templateName.trim(),
        target_job_posting_id: data.targetJobPostingId,
        subject: data.subject.trim(),
        body: data.body.trim(),
      });

    if (insertError) {
      console.error('Error creating scout template:', insertError);
      return {
        success: false,
        error: 'スカウトテンプレートの作成に失敗しました',
      };
    }

    // キャッシュを更新
    revalidatePath('/company/scout-template');

    return { success: true };
  } catch (error) {
    console.error('Error in createScoutTemplate:', error);
    return {
      success: false,
      error: 'スカウトテンプレートの作成に失敗しました',
    };
  }
}
