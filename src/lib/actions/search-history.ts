'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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
 * 検索履歴を保存する（RLS有効・サーバーサイドでクライアントキー使用）
 */
export async function saveSearchHistory(data: SaveSearchHistoryData) {
  console.log('[saveSearchHistory] Called with data:', JSON.stringify(data, null, 2));
  
  try {
    // 企業ユーザー認証（従来通り）
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { 
        success: false, 
        error: authResult.error 
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[saveSearchHistory] Company User ID:', companyUserId);
    
    // RLS有効なサーバークライアントを作成
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      }
    );

    // company_usersから現在のユーザー情報を取得（JOINのため.single()は使わない）
    const { data: companyUsers, error: userError } = await supabase
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
      .eq('id', companyUserId);

    if (userError || !companyUsers || companyUsers.length === 0) {
      console.error('[saveSearchHistory] Error fetching company user:', userError);
      return {
        success: false,
        error: '企業ユーザー情報の取得に失敗しました: ' + (userError?.message || 'ユーザーが見つかりません')
      };
    }
    
    const companyUser = companyUsers[0];

    // 指定されたグループにユーザーがアクセス権限を持っているかチェック
    const userGroups = companyUser.company_user_group_permissions || [];
    console.log('[saveSearchHistory] User groups:', JSON.stringify(userGroups, null, 2));
    console.log('[saveSearchHistory] Looking for group_id:', data.group_id);
    
    const targetGroup = userGroups.find((perm: any) => 
      perm.company_group?.id === data.group_id
    );

    console.log('[saveSearchHistory] Found target group:', JSON.stringify(targetGroup, null, 2));
    
    // グループ名の取得状況をログ出力
    if (targetGroup) {
      const groupName = targetGroup.company_group?.group_name;
      if (groupName) {
        console.log('[saveSearchHistory] ✅ グループ名が正常に取得されました:', groupName);
      } else {
        console.warn('[saveSearchHistory] ⚠️ グループ名が取得できませんでした');
      }
    }

    if (!targetGroup) {
      console.log('[saveSearchHistory] No matching group found for group_id:', data.group_id);
      console.log('[saveSearchHistory] Available group IDs:', userGroups.map((perm: any) => perm.company_group?.id));
      return {
        success: false,
        error: '指定されたグループへのアクセス権限がありません'
      };
    }

    // 検索履歴を挿入（RLSが自動的にアクセス制御）
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
 * 検索履歴一覧を取得する（サーバーサイドでWHEREによる手動フィルタリング）
 */
export async function getSearchHistory(
  groupId?: string,
  limit: number = 50,
  offset: number = 0
) {
  console.log('[getSearchHistory] Called with params:', { groupId, limit, offset });
  
  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('[getSearchHistory] Company auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[getSearchHistory] Company auth successful, user ID:', companyUserId);

    // Supabase管理者クライアントを使用（RLS無効でWHEREで手動フィルタリング）
    const supabase = getSupabaseAdminClient();
    
    // company_usersから現在のユーザーの権限を取得
    const { data: userPermissions, error: userError } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (userError || !userPermissions) {
      console.error('[getSearchHistory] Failed to get user permissions:', userError);
      return {
        success: false,
        error: '企業ユーザー情報の取得に失敗しました'
      };
    }

    // ユーザーがアクセス権を持つグループIDを取得
    const accessibleGroupIds = userPermissions.map(
      (perm: any) => perm.company_group_id
    );

    if (accessibleGroupIds.length === 0) {
      console.log('[getSearchHistory] User has no group permissions');
      return {
        success: true,
        data: []
      };
    }

    console.log('[getSearchHistory] User has access to groups:', accessibleGroupIds);

    // 手動でWHEREフィルタリングを適用
    let query = supabase
      .from('search_history')
      .select('*')
      .in('group_id', accessibleGroupIds) // アクセス可能なグループのみ
      .order('searched_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 特定のグループで絞り込み
    if (groupId) {
      if (!accessibleGroupIds.includes(groupId)) {
        return {
          success: false,
          error: '指定されたグループへのアクセス権限がありません'
        };
      }
      console.log('[getSearchHistory] Filtering by specific group:', groupId);
      query = query.eq('group_id', groupId);
    }

    console.log('[getSearchHistory] Executing query with manual WHERE filtering...');
    const { data: searchHistories, error: fetchError } = await query;

    if (fetchError) {
      console.error('[getSearchHistory] Database query error:', {
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
        code: fetchError.code
      });
      return {
        success: false,
        error: '検索履歴の取得に失敗しました'
      };
    }

    console.log('[getSearchHistory] Query successful, found items:', searchHistories?.length || 0);
    if (searchHistories && searchHistories.length > 0) {
      console.log('[getSearchHistory] Sample item:', JSON.stringify(searchHistories[0], null, 2));
    }

    return {
      success: true,
      data: searchHistories || []
    };

  } catch (error) {
    console.error('[getSearchHistory] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 検索履歴の保存状態を更新する（サーバーサイドでWHEREによる手動フィルタリング）
 */
export async function updateSearchHistorySavedStatus(historyId: string, isSaved: boolean) {
  console.log('[updateSearchHistorySavedStatus] Called with:', { historyId, isSaved });
  
  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('[updateSearchHistorySavedStatus] Company auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[updateSearchHistorySavedStatus] Company auth successful, user ID:', companyUserId);

    // Supabase管理者クライアントを使用（手動でアクセス制御）
    const supabase = getSupabaseAdminClient();

    // まず、対象の検索履歴が現在のユーザーがアクセス可能なグループに属するかチェック
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: false,
        error: 'アクセス権限がありません'
      };
    }

    const accessibleGroupIds = userPermissions.map((perm: any) => perm.company_group_id);

    console.log('[updateSearchHistorySavedStatus] Executing update query with access control...');
    // 手動でアクセス制御を適用して更新
    const { data: updated, error: updateError } = await supabase
      .from('search_history')
      .update({
        is_saved: isSaved,
        updated_at: new Date().toISOString()
      })
      .eq('id', historyId)
      .in('group_id', accessibleGroupIds) // アクセス可能なグループのみ
      .select('*')
      .single();

    if (updateError) {
      console.error('[updateSearchHistorySavedStatus] Update error:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return {
        success: false,
        error: '検索履歴の更新に失敗しました'
      };
    }

    console.log('[updateSearchHistorySavedStatus] Update successful');
    return {
      success: true,
      data: updated
    };

  } catch (error) {
    console.error('[updateSearchHistorySavedStatus] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * ユーザーがアクセス可能な会社グループを取得する
 */
export async function getCompanyGroups() {
  console.log('[getCompanyGroups] Called');
  
  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('[getCompanyGroups] Company auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error,
        data: []
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[getCompanyGroups] Company auth successful, user ID:', companyUserId);

    // Supabase管理者クライアントを使用
    const supabase = getSupabaseAdminClient();
    
    // company_usersから現在のユーザーの権限を取得
    const { data: userPermissions, error: userError } = await supabase
      .from('company_user_group_permissions')
      .select(`
        company_group:company_groups (
          id,
          group_name
        )
      `)
      .eq('company_user_id', companyUserId);

    if (userError || !userPermissions) {
      console.error('[getCompanyGroups] Failed to get user permissions:', userError);
      return {
        success: false,
        error: '企業ユーザー情報の取得に失敗しました',
        data: []
      };
    }

    // グループデータを整形
    console.log('[getCompanyGroups] Raw userPermissions:', JSON.stringify(userPermissions, null, 2));
    
    const groups = userPermissions
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        id: group.id,
        name: group.group_name
      }));

    console.log('[getCompanyGroups] Successfully retrieved groups:', groups);
    return {
      success: true,
      data: groups
    };

  } catch (error) {
    console.error('[getCompanyGroups] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return {
      success: false,
      error: 'サーバーエラーが発生しました',
      data: []
    };
  }
}

/**
 * 検索条件名を更新する（サーバーサイドでWHEREによる手動フィルタリング）
 */
export async function updateSearchHistoryTitle(historyId: string, searchTitle: string) {
  console.log('[updateSearchHistoryTitle] Called with:', { historyId, searchTitle });
  
  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('[updateSearchHistoryTitle] Company auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[updateSearchHistoryTitle] Company auth successful, user ID:', companyUserId);

    // Supabase管理者クライアントを使用（手動でアクセス制御）
    const supabase = getSupabaseAdminClient();

    // まず、対象の検索履歴が現在のユーザーがアクセス可能なグループに属するかチェック
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: false,
        error: 'アクセス権限がありません'
      };
    }

    const accessibleGroupIds = userPermissions.map((perm: any) => perm.company_group_id);

    console.log('[updateSearchHistoryTitle] Executing update query with access control...');
    // 手動でアクセス制御を適用して更新
    const { data: updated, error: updateError } = await supabase
      .from('search_history')
      .update({
        search_title: searchTitle,
        updated_at: new Date().toISOString()
      })
      .eq('id', historyId)
      .in('group_id', accessibleGroupIds) // アクセス可能なグループのみ
      .select('*')
      .single();

    if (updateError) {
      console.error('[updateSearchHistoryTitle] Update error:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
      return {
        success: false,
        error: '検索条件名の更新に失敗しました'
      };
    }

    console.log('[updateSearchHistoryTitle] Update successful');
    return {
      success: true,
      data: updated
    };

  } catch (error) {
    console.error('[updateSearchHistoryTitle] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 検索履歴を削除する（サーバーサイドでWHEREによる手動フィルタリング）
 */
export async function deleteSearchHistory(historyId: string) {
  console.log('[deleteSearchHistory] Called with:', { historyId });
  
  try {
    // 企業ユーザー認証の確認
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      console.error('[deleteSearchHistory] Company auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }

    const { companyUserId } = authResult.data;
    console.log('[deleteSearchHistory] Company auth successful, user ID:', companyUserId);

    // Supabase管理者クライアントを使用（手動でアクセス制御）
    const supabase = getSupabaseAdminClient();

    // まず、対象の検索履歴が現在のユーザーがアクセス可能なグループに属するかチェック
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: false,
        error: 'アクセス権限がありません'
      };
    }

    const accessibleGroupIds = userPermissions.map((perm: any) => perm.company_group_id);

    console.log('[deleteSearchHistory] Executing delete query with access control...');
    // 手動でアクセス制御を適用して削除
    const { error: deleteError } = await supabase
      .from('search_history')
      .delete()
      .eq('id', historyId)
      .in('group_id', accessibleGroupIds); // アクセス可能なグループのみ

    if (deleteError) {
      console.error('[deleteSearchHistory] Delete error:', {
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code
      });
      return {
        success: false,
        error: '検索履歴の削除に失敗しました'
      };
    }

    console.log('[deleteSearchHistory] Delete successful');
    return {
      success: true
    };

  } catch (error) {
    console.error('[deleteSearchHistory] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

