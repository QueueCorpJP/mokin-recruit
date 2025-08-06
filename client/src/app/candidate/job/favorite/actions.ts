'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuthWithSession } from '@/lib/auth/server';

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

export async function getFavoriteList(params: FavoriteListParams = {}): Promise<FavoriteListResult> {
  const startTime = performance.now();
  
  try {
    console.log('[DEBUG] Favorite page - starting auth check');
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthWithSession();
    console.log('[DEBUG] Favorite page - auth result:', { 
      success: authResult.success, 
      error: authResult.error,
      hasData: !!authResult.data 
    });
    
    if (!authResult.success) {
      console.log('[DEBUG] Favorite page - auth failed:', authResult.error);
      return {
        success: false,
        error: authResult.error
      };
    }

    const candidateId = authResult.data.candidateId;
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdminClient();

    // データクエリのみを実行し、カウントも取得する最適化
    const favoritesDataQuery = supabase
      .from('favorites')
      .select(`
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
          appeal_points,
          image_urls
        )
      `, { count: 'exact' })
      .eq('candidate_id', candidateId)
      .eq('job_postings.status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 単一クエリ実行
    const { data: favorites, count, error: favoritesError } = await favoritesDataQuery;

    if (favoritesError) {
      console.error('お気に入り取得エラー:', favoritesError);
      return {
        success: false,
        error: 'お気に入りの取得に失敗しました'
      };
    }

    // company_account_idを使って企業名を取得（必要な場合のみ）
    const companyAccountIds = Array.from(new Set(
      favorites?.map((fav: any) => fav.job_postings?.company_account_id).filter(Boolean)
    ));
    
    let companyNamesMap: Record<string, any> = {};
    if (companyAccountIds.length > 0) {
      const { data: companies, error: companiesError } = await supabase
        .from('company_accounts')
        .select('id, company_name, industry')
        .in('id', companyAccountIds);

      if (!companiesError && companies) {
        companyNamesMap = companies.reduce((acc, company) => {
          acc[company.id] = company;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // 企業名を追加した結果を作成
    const favoritesWithCompanyNames = favorites?.map((favorite: any) => ({
      ...favorite,
      job_postings: {
        ...favorite.job_postings,
        company_users: companyNamesMap[favorite.job_postings?.company_account_id] || {
          company_name: '企業名未設定',
          industry: '未設定'
        }
      }
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const endTime = performance.now();
    console.log(`[OPTIMIZED] Favorites list completed in ${(endTime - startTime).toFixed(2)}ms - Favorites: ${favoritesWithCompanyNames?.length || 0}, Companies: ${companyAccountIds.length}, Total: ${totalCount}`);

    return {
      success: true,
      data: {
        favorites: favoritesWithCompanyNames || [],
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      }
    };

  } catch (error) {
    console.error('getFavoriteList エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

export async function addFavorite(jobPostingId: string): Promise<FavoriteActionResult> {
  try {
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthWithSession();
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error
      };
    }

    const candidateId = authResult.data.candidateId;
    const supabase = getSupabaseAdminClient();

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
        .maybeSingle()
    ]);

    const { data: jobData, error: jobError } = jobResult;
    const { data: existingFavorite, error: checkError } = favoriteResult;

    if (jobError || !jobData) {
      return {
        success: false,
        error: '指定された求人が存在しません'
      };
    }

    if (jobData.status !== 'PUBLISHED') {
      return {
        success: false,
        error: 'この求人は現在お気に入りに追加できません'
      };
    }

    if (existingFavorite) {
      return {
        success: false,
        error: 'この求人は既にお気に入りに追加されています'
      };
    }

    // お気に入りに追加
    const { error: insertError } = await supabase
      .from('favorites')
      .insert({
        candidate_id: candidateId,
        job_posting_id: jobPostingId
      });

    if (insertError) {
      console.error('お気に入り追加エラー:', insertError);
      return {
        success: false,
        error: 'お気に入りの追加に失敗しました'
      };
    }

    return {
      success: true,
      message: 'お気に入りに追加しました'
    };

  } catch (error) {
    console.error('addFavorite エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

export async function removeFavorite(jobPostingId: string): Promise<FavoriteActionResult> {
  try {
    // 統一的な認証チェック
    const authResult = await requireCandidateAuthWithSession();
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error
      };
    }

    const candidateId = authResult.data.candidateId;
    const supabase = getSupabaseAdminClient();

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
        error: 'お気に入りが見つかりません'
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
        error: 'お気に入りの削除に失敗しました'
      };
    }

    return {
      success: true,
      message: 'お気に入りから削除しました'
    };

  } catch (error) {
    console.error('removeFavorite エラー:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}