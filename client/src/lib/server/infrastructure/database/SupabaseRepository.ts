import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/database/supabase';
import { logger } from '@/utils/logger';

// Supabaseベースリポジトリ (DIP準拠)
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
        logger.error(`Error finding ${this.tableName} by id:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in findById for ${this.tableName}:`, error);
      return null;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*');

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

  async create(
    entity: Omit<T, 'created_at' | 'updated_at'>
  ): Promise<T | null> {
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

  // ページネーション
  async findWithPagination(
    page: number,
    limit: number,
    filters?: Record<string, unknown>
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // フィルター適用
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
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
      };
    }
  }
}
