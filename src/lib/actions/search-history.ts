'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

export interface SearchConditions {
  // 基本検索条件
  keywords?: string[];
  age_min?: number;
  age_max?: number;
  experience_years_min?: number;
  experience_years_max?: number;
  
  // 選択式条件
  industries?: string[];
  job_types?: string[];
  locations?: string[];
  work_styles?: string[];
  education_levels?: string[];
  skills?: string[];
  
  // その他の条件
  salary_min?: number;
  salary_max?: number;
  language_skills?: string[];
  
  [key: string]: any; // その他の動的な条件に対応
}

export interface SaveSearchHistoryData {
  search_conditions: SearchConditions;
  search_title: string;
  group_id: string;
  is_saved?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  searcher_id: string;
  searcher_name: string;
  group_id: string;
  group_name: string;
  search_conditions: SearchConditions;
  search_title: string;
  is_saved: boolean;
  searched_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * 検索履歴を保存する
 */
export async function saveSearchHistory(data: SaveSearchHistoryData) {
  console.log('[saveSearchHistory] Called with data:', JSON.stringify(data, null, 2));
  
  try {
    // 企業ユーザー認証
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { 
        success: false, 
        error: authResult.error 
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[saveSearchHistory] Company User ID:', companyUserId);
    
    const supabase = getSupabaseAdminClient();

    // company_user_idから企業ユーザー情報を取得
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select(`
        id,
        full_name,
        company_user_group_permissions (
          company_group:company_groups (
            id,
            group_name
          )
        )
      `)
      .eq('id', data.group_id)
      .single();

    if (userError || !companyUser) {
      return {
        success: false,
        error: '企業ユーザー情報の取得に失敗しました'
      };
    }

    // 指定されたグループが存在するか、ユーザーがそのグループに所属しているかチェック
    const userGroups = companyUser.company_user_group_permissions || [];
    const targetGroup = userGroups.find((perm: any) => 
      perm.company_group?.id === data.group_id
    );

    if (!targetGroup) {
      return {
        success: false,
        error: '指定されたグループへのアクセス権限がありません'
      };
    }

    // 検索履歴を挿入
    const insertData = {
      searcher_id: companyUser.id,
      searcher_name: companyUser.full_name || 'Unknown User',
      group_id: data.group_id,
      group_name: targetGroup.company_group?.group_name || 'Unknown Group',
      search_conditions: data.search_conditions,
      search_title: data.search_title,
      is_saved: data.is_saved || false,
      searched_at: new Date().toISOString(),
    };
    
    console.log('[saveSearchHistory] Inserting data:', JSON.stringify(insertData, null, 2));
    
    const { data: searchHistory, error: insertError } = await supabase
      .from('search_history')
      .insert(insertData)
      .select('*')
      .single();

    if (insertError) {
      console.error('[saveSearchHistory] Insert error:', insertError);
      console.error('[saveSearchHistory] Error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return {
        success: false,
        error: '検索履歴の保存に失敗しました'
      };
    }

    console.log('[saveSearchHistory] Successfully saved:', searchHistory?.id);
    
    return {
      success: true,
      data: searchHistory
    };

  } catch (error) {
    console.error('Save search history error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 検索履歴一覧を取得する
 */
export async function getSearchHistory(
  groupId?: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    // 企業ユーザー認証
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    // ユーザーのグループ権限を確認
    const { data: userGroups, error: groupsError } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (groupsError || !userGroups || userGroups.length === 0) {
      return {
        success: false,
        error: 'グループ権限の取得に失敗しました'
      };
    }

    const userGroupIds = userGroups.map(g => g.company_group_id);

    // クエリを構築
    let query = supabase
      .from('search_history')
      .select('*')
      .in('group_id', userGroupIds)
      .order('searched_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 特定のグループで絞り込み
    if (groupId && userGroupIds.includes(groupId)) {
      query = query.eq('group_id', groupId);
    }

    const { data: searchHistories, error: fetchError } = await query;

    if (fetchError) {
      console.error('Search history fetch error:', fetchError);
      return {
        success: false,
        error: '検索履歴の取得に失敗しました'
      };
    }

    return {
      success: true,
      data: searchHistories || []
    };

  } catch (error) {
    console.error('Get search history error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 検索履歴の保存状態を更新する
 */
export async function updateSearchHistorySavedStatus(historyId: string, isSaved: boolean) {
  try {
    // 企業ユーザー認証
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    // ユーザーのアクセス権限チェックを含む更新
    const { data: updated, error: updateError } = await supabase
      .from('search_history')
      .update({
        is_saved: isSaved,
        updated_at: new Date().toISOString()
      })
      .eq('id', historyId)
      .eq('searcher_id', companyUserId) // 自分の履歴のみ更新可能
      .select('*')
      .single();

    if (updateError) {
      console.error('Search history update error:', updateError);
      return {
        success: false,
        error: '検索履歴の更新に失敗しました'
      };
    }

    return {
      success: true,
      data: updated
    };

  } catch (error) {
    console.error('Update search history error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 検索履歴を削除する
 */
export async function deleteSearchHistory(historyId: string) {
  try {
    // 企業ユーザー認証
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    // ユーザーのアクセス権限チェックを含む削除
    const { error: deleteError } = await supabase
      .from('search_history')
      .delete()
      .eq('id', historyId)
      .eq('searcher_id', companyUserId); // 自分の履歴のみ削除可能

    if (deleteError) {
      console.error('Search history delete error:', deleteError);
      return {
        success: false,
        error: '検索履歴の削除に失敗しました'
      };
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Delete search history error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

