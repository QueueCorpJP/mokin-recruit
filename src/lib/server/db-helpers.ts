/**
 * データベース操作の共通ヘルパー関数
 * 重複コードを削減し、一貫性のあるエラーハンドリングを提供
 */

import { getSupabaseActionClient, getSupabaseAdminClient } from '@/lib/supabase/server-client';
import { logger } from '@/lib/server/utils/logger';

/**
 * トランザクション風の複数操作を実行
 * Supabaseは本物のトランザクションをサポートしていないが、
 * エラーハンドリングを統一
 */
export async function executeTransaction<T>(
  operations: Array<() => Promise<any>>,
  options?: {
    useAdmin?: boolean;
    rollbackOnError?: boolean;
  }
): Promise<{ success: boolean; data?: T; error?: string }> {
  const results = [];
  
  try {
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
      
      // エラーチェック
      if (result?.error) {
        throw new Error(result.error.message || 'Operation failed');
      }
    }
    
    return { success: true, data: results as T };
  } catch (error) {
    logger.error('Transaction failed:', error);
    
    // ロールバック処理が必要な場合はここに実装
    if (options?.rollbackOnError) {
      // TODO: ロールバック処理
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * 候補者の存在確認と取得
 */
export async function getCandidateById(candidateId: string) {
  const supabase = getSupabaseActionClient();
  
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', candidateId)
    .single();
    
  if (error) {
    logger.error('Failed to get candidate:', error);
    return null;
  }
  
  return data;
}

/**
 * ユーザーの認証状態を確認
 */
export async function verifyUserAuth(userId: string) {
  const supabase = getSupabaseAdminClient();
  
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !data.user) {
      return { authenticated: false, user: null };
    }
    
    return { authenticated: true, user: data.user };
  } catch (error) {
    logger.error('Auth verification failed:', error);
    return { authenticated: false, user: null };
  }
}

/**
 * バッチ挿入処理
 */
export async function batchInsert<T extends Record<string, any>>(
  tableName: string,
  records: T[],
  options?: {
    chunkSize?: number;
    useAdmin?: boolean;
  }
): Promise<{ success: boolean; inserted: number; errors: any[] }> {
  const chunkSize = options?.chunkSize || 100;
  const supabase = options?.useAdmin ? getSupabaseAdminClient() : getSupabaseActionClient();
  
  let totalInserted = 0;
  const errors = [];
  
  // レコードをチャンクに分割
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(chunk)
      .select();
      
    if (error) {
      errors.push({ chunk: i / chunkSize, error });
      logger.error(`Batch insert failed for chunk ${i / chunkSize}:`, error);
    } else {
      totalInserted += data?.length || 0;
    }
  }
  
  return {
    success: errors.length === 0,
    inserted: totalInserted,
    errors,
  };
}

/**
 * ページネーション付きクエリ
 */
export async function paginatedQuery<T>(
  tableName: string,
  options: {
    page?: number;
    limit?: number;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, any>;
    select?: string;
  }
): Promise<{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: any;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;
  
  const supabase = getSupabaseActionClient();
  
  // クエリビルダー
  let query = supabase.from(tableName).select(options.select || '*', { count: 'exact' });
  
  // フィルター適用
  if (options.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }
  
  // ソート
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }
  
  // ページネーション
  query = query.range(offset, offset + limit - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    logger.error('Paginated query failed:', error);
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
      error,
    };
  }
  
  const total = count || 0;
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

/**
 * キャッシュ付きクエリ（メモリキャッシュ）
 */
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1分

export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = queryCache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < (ttl || CACHE_TTL)) {
    return cached.data;
  }
  
  const data = await queryFn();
  queryCache.set(key, { data, timestamp: now });
  
  // 古いキャッシュを定期的にクリーンアップ
  if (queryCache.size > 100) {
    for (const [k, v] of queryCache.entries()) {
      if (now - v.timestamp > CACHE_TTL * 2) {
        queryCache.delete(k);
      }
    }
  }
  
  return data;
}

/**
 * 安全なデータ更新（楽観的ロック）
 */
export async function safeUpdate<T extends { updated_at?: string }>(
  tableName: string,
  id: string,
  updates: Partial<T>,
  expectedVersion?: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  const supabase = getSupabaseActionClient();
  
  try {
    // 現在のデータを取得
    const { data: current, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      throw new Error(`Failed to fetch current data: ${fetchError.message}`);
    }
    
    // バージョンチェック
    if (expectedVersion && current.updated_at !== expectedVersion) {
      return {
        success: false,
        error: 'Data has been modified by another user',
      };
    }
    
    // 更新実行
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    logger.error('Safe update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed',
    };
  }
}