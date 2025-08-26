'use server';

import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

export interface FavoriteActionResult {
  success: boolean;
  error?: string;
  favorite?: any;
  message?: string;
}

export interface FavoriteListResult {
  success: boolean;
  data?: {
    favorites: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface FavoriteStatusResult {
  success: boolean;
  data?: Record<string, boolean>;
  error?: string;
}

// お気に入り一覧を取得
export async function getFavoriteListAction(params: {
  page?: number;
  limit?: number;
} = {}): Promise<FavoriteListResult> {
  try {
    const auth = await requireCandidateAuthForAction();
    if (!auth.success) {
      return {
        success: false,
        error: auth.error
      };
    }

    const supabase = getSupabaseAdminClient();
    const { page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    // 総数を取得
    const { count, error: countError } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', auth.data.candidateId);

    if (countError) {
      console.error('お気に入り総数取得エラー:', countError);
      return {
        success: false,
        error: 'お気に入りの総数取得に失敗しました'
      };
    }

    // お気に入りリストを取得
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        id,
        job_posting_id,
        candidate_id,
        created_at,
        job_postings (
          id,
          title,
          job_description,
          salary_min,
          salary_max,
          work_location,
          company_accounts (
            company_name
          )
        )
      `)
      .eq('candidate_id', auth.data.candidateId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('お気に入り取得エラー:', error);
      return {
        success: false,
        error: 'お気に入りの取得に失敗しました'
      };
    }

    return {
      success: true,
      data: {
        favorites: favorites || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    };
  } catch (error) {
    console.error('お気に入り一覧取得エラー:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました'
    };
  }
}

// お気に入り状態を取得（複数の求人ID）
export async function getFavoriteStatusAction(jobPostingIds: string[]): Promise<FavoriteStatusResult> {
  try {
    if (jobPostingIds.length === 0) {
      return {
        success: true,
        data: {}
      };
    }

    const auth = await requireCandidateAuthForAction();
    if (!auth.success) {
      return {
        success: false,
        error: auth.error
      };
    }

    const supabase = getSupabaseAdminClient();

    // お気に入りに登録されている求人IDを取得
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('job_posting_id')
      .eq('candidate_id', auth.data.candidateId)
      .in('job_posting_id', jobPostingIds);

    if (error) {
      console.error('お気に入り状態取得エラー:', error);
      return {
        success: false,
        error: 'お気に入り状態の取得に失敗しました'
      };
    }

    // お気に入りに登録されているジョブIDのセット
    const favoriteJobIds = new Set(favorites?.map(fav => fav.job_posting_id) || []);

    // 結果をマップ形式で作成
    const result: Record<string, boolean> = {};
    jobPostingIds.forEach(id => {
      result[id] = favoriteJobIds.has(id);
    });

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('お気に入り状態取得エラー:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました'
    };
  }
}

// お気に入りに追加
export async function addFavoriteAction(jobPostingId: string): Promise<FavoriteActionResult> {
  try {
    const auth = await requireCandidateAuthForAction();
    if (!auth.success) {
      return {
        success: false,
        error: auth.error
      };
    }

    const supabase = getSupabaseAdminClient();

    // 既にお気に入りに追加されていないかチェック
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('candidate_id', auth.data.candidateId)
      .eq('job_posting_id', jobPostingId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('お気に入りチェックエラー:', checkError);
      return {
        success: false,
        error: 'お気に入り状態の確認に失敗しました'
      };
    }

    if (existing) {
      return {
        success: false,
        error: '既にお気に入りに追加されています'
      };
    }

    // お気に入りに追加
    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert({
        candidate_id: auth.data.candidateId,
        job_posting_id: jobPostingId
      })
      .select()
      .single();

    if (error) {
      console.error('お気に入り追加エラー:', error);
      return {
        success: false,
        error: 'お気に入りの追加に失敗しました'
      };
    }

    revalidatePath('/candidate/job/favorite');
    
    return {
      success: true,
      favorite,
      message: 'お気に入りに追加しました'
    };
  } catch (error) {
    console.error('お気に入り追加エラー:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました'
    };
  }
}

// お気に入りから削除
export async function removeFavoriteAction(jobPostingId: string): Promise<FavoriteActionResult> {
  try {
    const auth = await requireCandidateAuthForAction();
    if (!auth.success) {
      return {
        success: false,
        error: auth.error
      };
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('candidate_id', auth.data.candidateId)
      .eq('job_posting_id', jobPostingId);

    if (error) {
      console.error('お気に入り削除エラー:', error);
      return {
        success: false,
        error: 'お気に入りの削除に失敗しました'
      };
    }

    revalidatePath('/candidate/job/favorite');
    
    return {
      success: true,
      message: 'お気に入りから削除しました'
    };
  } catch (error) {
    console.error('お気に入り削除エラー:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました'
    };
  }
}