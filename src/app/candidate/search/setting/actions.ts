'use server'

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export interface JobSearchResult {
  id: string;
  title: string;
  companyName: string;
  imageUrl: string;
  imageAlt?: string;
  tags: string[];
  location: string[];
  salary: string;
  apell: string[];
  starred?: boolean;
  created_at: string;
  job_type: string | string[];
  work_location: string | string[];
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  appeal_points?: any;
  image_urls?: string[];
  company_name?: string;
}

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  salaryMin?: string;
  industries?: string[];
  jobTypes?: string[];
  appealPoints?: string[];
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  success: boolean;
  data?: {
    jobs: JobSearchResult[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface FavoriteStatusResponse {
  success: boolean;
  data?: Record<string, boolean>;
  error?: string;
}

// フィルタリング条件を適用する共通関数
function applyFilters(query: any, params: JobSearchParams) {
  // キーワード検索
  if (params.keyword && params.keyword.trim()) {
    query = query.or(`title.ilike.%${params.keyword}%,job_description.ilike.%${params.keyword}%`);
  }

  // 勤務地フィルター
  if (params.location && params.location.trim()) {
    const locations = params.location.split(',').filter(loc => loc.trim());
    if (locations.length > 0) {
      const locationConditions = locations.map(loc => `work_location.cs.{${loc.trim()}}`).join(',');
      query = query.or(locationConditions);
    }
  }

  // 年収フィルター
  if (params.salaryMin && params.salaryMin !== '問わない') {
    const minSalary = parseInt(params.salaryMin);
    if (!isNaN(minSalary)) {
      query = query.gte('salary_min', minSalary);
    }
  }

  // 業種フィルター
  if (params.industries && params.industries.length > 0) {
    const industryConditions = params.industries.map(industry => `industry.cs.{${industry}}`).join(',');
    query = query.or(industryConditions);
  }

  // 職種フィルター
  if (params.jobTypes && params.jobTypes.length > 0) {
    const jobTypeConditions = params.jobTypes.map(jobType => `job_type.cs.{${jobType}}`).join(',');
    query = query.or(jobTypeConditions);
  }

  // アピールポイントフィルター
  if (params.appealPoints && params.appealPoints.length > 0) {
    const appealConditions = params.appealPoints.map(point => `appeal_points.cs.{${point}}`).join(',');
    query = query.or(appealConditions);
  }

  return query;
}


// 簡単なメモリキャッシュ
const searchCache = new Map<string, { data: JobSearchResponse; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2分

// 最適化された検索関数 - すべての関連データを並列で取得
async function searchJobsServerOptimized(params: JobSearchParams): Promise<JobSearchResponse> {
  const startTime = performance.now();
  
  try {
    const supabase = getSupabaseAdminClient();
    
    // ページネーション設定
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    // カウントクエリ（独立したクエリを作成）
    let countQuery = supabase
      .from('job_postings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);
    countQuery = applyFilters(countQuery, params);

    // データ取得クエリ（企業情報をJOINで一緒に取得）
    let dataQuery = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        salary_min,
        salary_max,
        salary_note,
        work_location,
        job_type,
        industry,
        appeal_points,
        created_at,
        image_urls,
        company_account_id,
        company_accounts (
          id,
          company_name
        )
      `)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);
    dataQuery = applyFilters(dataQuery, params);
    dataQuery = dataQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 並列実行 - カウントとデータを同時に取得（JOINで企業情報も含まれる）
    const dbStartTime = performance.now();
    const [countResult, dataResult] = await Promise.all([
      countQuery,
      dataQuery
    ]);
    const dbEndTime = performance.now();
    console.log(`[OPTIMIZED] Job queries with JOIN completed in ${(dbEndTime - dbStartTime).toFixed(2)}ms`);

    const { count, error: countError } = countResult;
    const { data: jobs, error: dataError } = dataResult;

    if (countError) {
      console.error('Failed to count jobs:', countError);
    }

    if (dataError || !jobs) {
      console.error('Failed to search jobs:', dataError);
      return {
        success: false,
        error: 'Failed to search jobs'
      };
    }

    // データ変換（JOINされた企業情報を使用）
    const transformedJobs = jobs.map((job: any, index: number) => {
      const companyName = job.company_accounts?.company_name || `企業名未設定 #${index + 1}`;
      
      return {
        id: job.id,
        title: job.title || `求人タイトル未設定 #${index + 1}`,
        companyName: companyName,
        imageUrl: job.image_urls?.[0] || '/company.jpg',
        imageAlt: companyName,
        tags: Array.isArray(job.job_type) ? job.job_type.slice(0, 3) : [job.job_type].filter(Boolean),
        location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
        salary: job.salary_min && job.salary_max && job.salary_min > 0 && job.salary_max > 0
          ? `${job.salary_min}万〜${job.salary_max}万`
          : job.salary_note || '給与応相談',
        apell: Array.isArray(job.appeal_points) && job.appeal_points.length > 0 
          ? job.appeal_points.slice(0, 3) 
          : ['アピールポイントなし'],
        starred: false,
        created_at: job.created_at,
        job_type: job.job_type,
        work_location: job.work_location,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_note: job.salary_note,
        appeal_points: job.appeal_points,
        image_urls: job.image_urls,
        company_name: companyName
      };
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    const endTime = performance.now();
    console.log(`[OPTIMIZED] Search completed in ${(endTime - startTime).toFixed(2)}ms - Jobs: ${transformedJobs.length}`);

    return {
      success: true,
      data: {
        jobs: transformedJobs,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    };

  } catch (error) {
    console.error('Failed to search jobs from database:', error);
    return {
      success: false,
      error: 'Database error occurred'
    };
  }
}

export async function getJobSearchData(params: JobSearchParams): Promise<JobSearchResponse> {
  console.log('[getJobSearchData] Called with params:', JSON.stringify(params));
  
  // キャッシュキーの生成
  const cacheKey = JSON.stringify(params);
  const cached = searchCache.get(cacheKey);
  
  // 期限切れキャッシュを即座に削除
  if (cached && Date.now() - cached.timestamp >= CACHE_TTL) {
    searchCache.delete(cacheKey);
  } else if (cached) {
    console.log('[getJobSearchData] Cache hit - returning cached data');
    return cached.data;
  }
  
  console.log('[getJobSearchData] Cache miss - fetching new data');
  
  // 新しいデータを取得（最適化版を使用）
  const result = await searchJobsServerOptimized(params);
  
  // 成功した場合のみキャッシュに保存
  if (result.success) {
    searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    // キャッシュサイズを制限（メモリ使用量対策）
    if (searchCache.size > 30) {
      const oldestKey = searchCache.keys().next().value;
      if (oldestKey) {
        searchCache.delete(oldestKey);
      }
    }
  }
  
  return result;
}

export async function getFavoriteStatusServer(jobPostingIds: string[]): Promise<FavoriteStatusResponse> {
  try {
    if (jobPostingIds.length === 0) {
      return { success: true, data: {} };
    }

    // デフォルトはすべてfalse
    const favoriteStatus: Record<string, boolean> = {};
    jobPostingIds.forEach(jobId => {
      favoriteStatus[jobId] = false;
    });

    return {
      success: true,
      data: favoriteStatus
    };

  } catch (error) {
    console.error('Failed to get favorite status:', error);
    return {
      success: false,
      error: 'Failed to get favorite status'
    };
  }
}

export async function addToFavoritesServer(jobPostingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Adding to favorites server-side:', jobPostingId);
    
    // For now, return success without actual database operation
    // This should be replaced with actual favorite add logic
    return {
      success: true
    };
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    return {
      success: false,
      error: 'Failed to add to favorites'
    };
  }
}

export async function removeFromFavoritesServer(jobPostingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Removing from favorites server-side:', jobPostingId);
    
    // For now, return success without actual database operation
    // This should be replaced with actual favorite remove logic
    return {
      success: true
    };
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
    return {
      success: false,
      error: 'Failed to remove from favorites'
    };
  }
}