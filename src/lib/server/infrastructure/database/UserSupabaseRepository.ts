import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/server/utils/logger';

// ユーザー関連操作用のSupabaseリポジトリ
// signup時のみ管理者クライアント、その他は認証済みクライアントを使用
export abstract class UserSupabaseRepository<T> {
  protected abstract readonly tableName: string;

  // signup用の管理者クライアントを取得
  protected getAdminClient(): SupabaseClient {
    return getSupabaseAdminClient();
  }

  // 認証済みクライアントを取得
  protected async getAuthenticatedClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  // signup時のみ使用するINSERT操作（管理者権限）
  async createWithAdmin(entity: Partial<T>): Promise<T | null> {
    try {
      const client = this.getAdminClient();
      const { data, error } = await client
        .from(this.tableName)
        .insert(entity)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating ${this.tableName} with admin:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in createWithAdmin for ${this.tableName}:`, error);
      return null;
    }
  }

  // 基本CRUD操作（認証済みクライアント使用）
  async findById(id: string): Promise<T | null> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
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

  async findByEmail(email: string): Promise<T | null> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error(`Error finding ${this.tableName} by email:`, error);
        return null;
      }

      return data as T;
    } catch (error) {
      logger.error(`Exception in findByEmail for ${this.tableName}:`, error);
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
      const client = await this.getAuthenticatedClient();
      let query = client.from(this.tableName).select('*');

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

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

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
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
      const client = await this.getAuthenticatedClient();
      const { error } = await client
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

  async search(criteria: Record<string, unknown>): Promise<T[]> {
    try {
      const client = await this.getAuthenticatedClient();
      let query = client.from(this.tableName).select('*');

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

  async exists(id: string): Promise<boolean> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
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