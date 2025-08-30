import { injectable } from 'inversify';
import { SupabaseRepository } from './SupabaseRepository';
import { logger } from '@/utils/logger';

export interface AdminUserEntity {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

@injectable()
export class AdminUserRepository extends SupabaseRepository<AdminUserEntity> {
  protected tableName = 'admin_users';

  constructor() {
    super();
  }

  // メールアドレスでadminユーザーを検索
  async findByEmail(email: string): Promise<AdminUserEntity | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();
      if (error || !data) {
        logger.warn('Admin user not found or error:', error);
        return null;
      }
      return data as AdminUserEntity;
    } catch (err) {
      logger.error('findByEmail error (admin):', err);
      return null;
    }
  }

  // last_login_atの更新
  async updateLastLogin(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        logger.warn('Failed to update last_login_at for admin:', error);
      }
    } catch (err) {
      logger.error('updateLastLogin error (admin):', err);
    }
  }
}
