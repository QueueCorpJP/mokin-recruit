import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/database/supabase';
import { logger } from '@/utils/logger';

// Supabaseベースリポジトリ (実用的実装)
export abstract class SupabaseRepository<T> {
  protected readonly client: SupabaseClient;
  protected abstract readonly tableName: string;

  constructor() {
    this.client = getSupabaseAdminClient();
  }

  // 基本CRUD操作
  async findById(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        logger.error(`Error finding ${this.tableName} by id:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in findById for ${this.tableName}:`, error);
      return null;
    }
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: {
      column: string;
      ascending?: boolean;
    };
  }): Promise<T[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // 並び順の設定
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // ページネーション
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Error finding all ${this.tableName}:`, error);
        return [];
      }

      return data as T[];
    } catch (error) {
      logger.error(`Exception in findAll for ${this.tableName}:`, error);
      return [];
    }
  }

  async create(entity: Partial<T>): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating ${this.tableName}:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in create for ${this.tableName}:`, error);
      return null;
    }
  }

  async createMany(entities: Partial<T>[]): Promise<T[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(entities)
        .select();

      if (error) {
        logger.error(`Error creating multiple ${this.tableName}:`, error);
        return [];
      }

      return data as T[];
    } catch (error) {
      logger.error(`Exception in createMany for ${this.tableName}:`, error);
      return [];
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating ${this.tableName}:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in update for ${this.tableName}:`, error);
      return null;
    }
  }

  async upsert(entity: Partial<T>): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .upsert(entity)
        .select()
        .single();

      if (error) {
        logger.error(`Error upserting ${this.tableName}:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in upsert for ${this.tableName}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting ${this.tableName}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Exception in delete for ${this.tableName}:`, error);
      return false;
    }
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        logger.error(`Error deleting multiple ${this.tableName}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Exception in deleteMany for ${this.tableName}:`, error);
      return false;
    }
  }

  // 検索機能
  async search(criteria: Record<string, unknown>): Promise<T[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // 動的にフィルター条件を追加
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;

      if (error) {
        logger.error(`Error searching ${this.tableName}:`, error);
        return [];
      }

      return data as T[];
    } catch (error) {
      logger.error(`Exception in search for ${this.tableName}:`, error);
      return [];
    }
  }

  // 高度なフィルタリング
  async findWhere(
    filters: {
      column: string;
      operator:
        | 'eq'
        | 'neq'
        | 'gt'
        | 'gte'
        | 'lt'
        | 'lte'
        | 'like'
        | 'ilike'
        | 'in'
        | 'overlaps';
      value: any;
    }[]
  ): Promise<T[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      filters.forEach(filter => {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.column, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.column, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.column, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.column, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.column, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.column, filter.value);
            break;
          case 'like':
            query = query.like(filter.column, filter.value);
            break;
          case 'ilike':
            query = query.ilike(filter.column, filter.value);
            break;
          case 'in':
            query = query.in(filter.column, filter.value);
            break;
          case 'overlaps':
            query = query.overlaps(filter.column, filter.value);
            break;
        }
      });

      const { data, error } = await query;

      if (error) {
        logger.error(`Error in findWhere for ${this.tableName}:`, error);
        return [];
      }

      return data as T[];
    } catch (error) {
      logger.error(`Exception in findWhere for ${this.tableName}:`, error);
      return [];
    }
  }

  // ページネーション
  async findWithPagination(
    page: number,
    limit: number,
    options?: {
      filters?: Record<string, unknown>;
      orderBy?: {
        column: string;
        ascending?: boolean;
      };
    }
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    try {
      const offset = (page - 1) * limit;

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // フィルター適用
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // 並び順の設定
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      const { data, error, count } = await query.range(
        offset,
        offset + limit - 1
      );

      if (error) {
        logger.error(`Error in pagination for ${this.tableName}:`, error);
        return {
          items: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        items: data as T[],
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error(
        `Exception in findWithPagination for ${this.tableName}:`,
        error
      );
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  }

  // カウント機能
  async count(filters?: Record<string, unknown>): Promise<number> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) {
        logger.error(`Error counting ${this.tableName}:`, error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error(`Exception in count for ${this.tableName}:`, error);
      return 0;
    }
  }

  // 存在確認
  async exists(id: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        logger.error(`Error checking existence in ${this.tableName}:`, error);
        return false;
      }

      return !!data;
    } catch (error) {
      logger.error(`Exception in exists for ${this.tableName}:`, error);
      return false;
    }
  }
}
