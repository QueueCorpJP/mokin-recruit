'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';
import { cookies } from 'next/headers';

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
  try {
    // JWT検証のためのリクエストオブジェクトを作成
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;
    
    if (!token) {
      return {
        success: false,
        error: '認証トークンが見つかりません'
      };
    }

    // 仮のリクエストオブジェクトを作成（validateJWTがNextRequestを期待するため）
    const mockRequest = {
      headers: new Map([['authorization', `Bearer ${token}`]]),
      cookies: cookieStore
    } as any;

    const authResult = await validateJWT(mockRequest);
    if (!authResult.isValid || !authResult.candidateId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    const candidateId = authResult.candidateId;
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdminClient();

    // お気に入り求人を取得（求人詳細を含む）
    const { data: favorites, error: favoritesError, count } = await supabase
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

    if (favoritesError) {
      console.error('お気に入り取得エラー:', favoritesError);
      return {
        success: false,
        error: 'お気に入りの取得に失敗しました'
      };
    }

    // company_account_idを使って企業名を別途取得
    const companyAccountIds = [...new Set(
      favorites?.map((fav: any) => fav.job_postings?.company_account_id).filter(Boolean)
    )];
    
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
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;
    
    if (!token) {
      return {
        success: false,
        error: '認証トークンが見つかりません'
      };
    }

    const mockRequest = {
      headers: new Map([['authorization', `Bearer ${token}`]]),
      cookies: cookieStore
    } as any;

    const authResult = await validateJWT(mockRequest);
    if (!authResult.isValid || !authResult.candidateId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    const candidateId = authResult.candidateId;
    const supabase = getSupabaseAdminClient();

    // 求人が存在し、公開されているかチェック
    const { data: jobData, error: jobError } = await supabase
      .from('job_postings')
      .select('id, status, title')
      .eq('id', jobPostingId)
      .single();

    if (jobError) {
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

    // 既にお気に入りに追加されているかチェック
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', jobPostingId)
      .single();

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
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;
    
    if (!token) {
      return {
        success: false,
        error: '認証トークンが見つかりません'
      };
    }

    const mockRequest = {
      headers: new Map([['authorization', `Bearer ${token}`]]),
      cookies: cookieStore
    } as any;

    const authResult = await validateJWT(mockRequest);
    if (!authResult.isValid || !authResult.candidateId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    const candidateId = authResult.candidateId;
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