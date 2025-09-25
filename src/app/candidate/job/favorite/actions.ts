'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

// 簡単なメモリキャッシュ
const favoritesCache = new Map<string, { data: any; timestamp: number }>();
const FAVORITES_CACHE_TTL = 30 * 1000; // 30秒

export interface FavoriteListParams {
  page?: number;
  limit?: number;
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

export interface FavoriteActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function getFavoriteList(
  params: FavoriteListParams = {}
): Promise<FavoriteListResult> {
  const startTime = performance.now();

  try {
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthForAction();

    if (!authResult.success) {
      return {
        success: false,
        error: (authResult as any).error || '認証が必要です',
      };
    }

    const candidateId = authResult.data.candidateId;

    // キャッシュキーの生成（パラメータを含める）
    const cacheKey = `${candidateId}-${JSON.stringify(params)}`;
    const cached = favoritesCache.get(cacheKey);

    // 期限切れキャッシュを即座に削除
    if (cached && Date.now() - cached.timestamp >= FAVORITES_CACHE_TTL) {
      favoritesCache.delete(cacheKey);
    } else if (cached) {
      return cached.data;
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const supabase = await getSupabaseServerClient();

    // データクエリ（企業情報もJOINで一緒に取得）
    const favoritesDataQuery = supabase
      .from('favorites')
      .select(
        `
        id,
        created_at,
        job_posting_id,
        job_postings!inner (
          id,
          title,
          position_summary,
          job_description,
          salary_min,
          salary_max,
          employment_type,
          work_location,
          remote_work_available,
          job_type,
          industry,
          application_deadline,
          created_at,
          updated_at,
          status,
          company_account_id,
          company_attractions,
          image_urls,
          company_accounts (
            id,
            company_name,
            industry
          )
        )
      `,
        { count: 'exact' }
      )
      .eq('candidate_id', candidateId)
      .eq('job_postings.status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 単一クエリ実行（企業情報も含む）
    const {
      data: favorites,
      count,
      error: favoritesError,
    } = await favoritesDataQuery;

    if (favoritesError) {
      console.error('お気に入り取得エラー:', favoritesError);
      return {
        success: false,
        error: 'お気に入りの取得に失敗しました',
      };
    }

    // JOINされた企業情報を使用した結果を作成
    const favoritesWithCompanyNames = favorites?.map((favorite: any) => ({
      ...favorite,
      job_postings: {
        ...favorite.job_postings,
        company_users: favorite.job_postings?.company_accounts || {
          company_name: '企業名未設定',
          industry: '未設定',
        },
      },
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const endTime = performance.now();

    const result = {
      success: true,
      data: {
        favorites: favoritesWithCompanyNames || [],
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      },
    };

    // 成功した場合のみキャッシュに保存
    favoritesCache.set(cacheKey, { data: result, timestamp: Date.now() });

    // キャッシュサイズを制限（メモリ使用量対策）
    if (favoritesCache.size > 20) {
      const oldestKey = favoritesCache.keys().next().value;
      if (oldestKey) {
        favoritesCache.delete(oldestKey);
      }
    }

    return result;
  } catch (error) {
    console.error('getFavoriteList エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました',
    };
  }
}

export async function addFavorite(
  jobPostingId: string
): Promise<FavoriteActionResult> {
  try {
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        error: (authResult as any).error || '認証が必要です',
      };
    }

    const candidateId = authResult.data.candidateId;
    const supabase = await getSupabaseServerClient();

    // 求人の存在チェックと既存のお気に入りチェックを並列実行
    const [jobResult, favoriteResult] = await Promise.all([
      supabase
        .from('job_postings')
        .select('id, status, title')
        .eq('id', jobPostingId)
        .single(),
      supabase
        .from('favorites')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('job_posting_id', jobPostingId)
        .maybeSingle(),
    ]);

    const { data: jobData, error: jobError } = jobResult;
    const { data: existingFavorite, error: checkError } = favoriteResult;

    if (jobError || !jobData) {
      return {
        success: false,
        error: '指定された求人が存在しません',
      };
    }

    if (jobData.status !== 'PUBLISHED') {
      return {
        success: false,
        error: 'この求人は現在お気に入りに追加できません',
      };
    }

    if (existingFavorite) {
      return {
        success: false,
        error: 'この求人は既にお気に入りに追加されています',
      };
    }

    // お気に入りに追加
    const { error: insertError } = await supabase.from('favorites').insert({
      candidate_id: candidateId,
      job_posting_id: jobPostingId,
    });

    if (insertError) {
      console.error('お気に入り追加エラー:', insertError);
      return {
        success: false,
        error: 'お気に入りの追加に失敗しました',
      };
    }

    return {
      success: true,
      message: 'お気に入りに追加しました',
    };
  } catch (error) {
    console.error('addFavorite エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました',
    };
  }
}

export async function removeFavorite(
  jobPostingId: string
): Promise<FavoriteActionResult> {
  try {
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      return {
        success: false,
        error: (authResult as any).error || '認証が必要です',
      };
    }

    const candidateId = authResult.data.candidateId;
    const supabase = await getSupabaseServerClient();

    // お気に入りが存在するかチェック
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', jobPostingId)
      .single();

    if (checkError || !existingFavorite) {
      return {
        success: false,
        error: 'お気に入りが見つかりません',
      };
    }

    // お気に入りを削除
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', jobPostingId);

    if (deleteError) {
      console.error('お気に入り削除エラー:', deleteError);
      return {
        success: false,
        error: 'お気に入りの削除に失敗しました',
      };
    }

    return {
      success: true,
      message: 'お気に入りから削除しました',
    };
  } catch (error) {
    console.error('removeFavorite エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました',
    };
  }
}
