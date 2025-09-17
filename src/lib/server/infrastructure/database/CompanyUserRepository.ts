import { injectable } from 'inversify';
import { logger } from '@/lib/server/utils/logger';
import { UserSupabaseRepository } from './UserSupabaseRepository';

// MVPスキーマに対応した企業ユーザーエンティティ
export interface CompanyUserEntity {
  id: string;
  company_account_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  position_title?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// MVPスキーマ対応の企業ユーザー作成データ
export interface CreateCompanyUserData {
  company_account_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  position_title?: string;
}

// 企業アカウントエンティティ
export interface CompanyAccountEntity {
  id: string;
  company_name: string;
  industry: string;
  headquarters_address?: string;
  representative_name?: string;
  company_overview?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
}

@injectable()
export class CompanyUserRepository extends UserSupabaseRepository<CompanyUserEntity> {
  protected tableName = 'company_users';

  constructor() {
    super();
  }

  // signup時の重複チェック用（管理者権限で実行）
  async findByEmailForSignup(email: string): Promise<CompanyUserEntity | null> {
    try {
      const client = this.getAdminClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug(`Company user not found with email: ${email}`);
          return null;
        }
        logger.error('Error finding company user by email for signup:', error);
        return null;
      }

      logger.debug(`Found company user for signup check: ${email}`);
      return data;
    } catch (error) {
      logger.error('Exception in findByEmailForSignup:', error);
      return null;
    }
  }

  // signup時の企業ユーザー作成（管理者権限で実行）
  async create(userData: CreateCompanyUserData): Promise<CompanyUserEntity> {
    try {
      const createData = {
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await this.createWithAdmin(createData);
      if (!result) {
        throw new Error('Failed to create company user');
      }

      logger.info(`Created company user: ${result.email}`);
      return result;
    } catch (error) {
      logger.error('Exception in create company user:', error);
      throw error;
    }
  }

  // 企業ユーザーの更新
  async update(
    id: string,
    updates: Partial<CompanyUserEntity>
  ): Promise<CompanyUserEntity> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating company user:', error);
        throw new Error(`Failed to update company user: ${error.message}`);
      }

      logger.debug(`Updated company user: ${id}`);
      return data;
    } catch (error) {
      logger.error('Exception in update company user:', error);
      throw error;
    }
  }

  // 最終ログイン時刻の更新
  async updateLastLogin(id: string): Promise<boolean> {
    try {
      const client = await this.getAuthenticatedClient();
      const { error } = await client
        .from(this.tableName)
        .update({
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        logger.error('Error updating company user last login:', error);
        return false;
      }

      logger.debug(`Updated last login for company user: ${id}`);
      return true;
    } catch (error) {
      logger.error('Exception in updateLastLogin for company user:', error);
      return false;
    }
  }

  // IDで企業ユーザーを検索
  async findById(id: string): Promise<CompanyUserEntity | null> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug(`Company user not found with id: ${id}`);
          return null;
        }
        logger.error('Error finding company user by id:', error);
        throw new Error(`Failed to find company user: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('Exception in findById:', error);
      throw error;
    }
  }

  // 企業アカウントIDで企業ユーザーを検索
  async findByCompanyAccountId(
    companyAccountId: string
  ): Promise<CompanyUserEntity[]> {
    try {
      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('company_account_id', companyAccountId);

      if (error) {
        logger.error(
          'Error finding company users by company account id:',
          error
        );
        throw new Error(`Failed to find company users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in findByCompanyAccountId:', error);
      throw error;
    }
  }

  // 企業ユーザーの削除
  async delete(id: string): Promise<boolean> {
    try {
      const client = await this.getAuthenticatedClient();
      const { error } = await client.from(this.tableName).delete().eq('id', id);

      if (error) {
        logger.error('Error deleting company user:', error);
        return false;
      }

      logger.info(`Deleted company user: ${id}`);
      return true;
    } catch (error) {
      logger.error('Exception in delete company user:', error);
      return false;
    }
  }
}

@injectable()
export class CompanyAccountRepository extends UserSupabaseRepository<CompanyAccountEntity> {
  protected tableName = 'company_accounts';

  constructor() {
    super();
  }

  // signup時のID検索用（管理者権限で実行）
  async findByIdForSignup(id: string): Promise<CompanyAccountEntity | null> {
    try {
      const client = this.getAdminClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug(`Company account not found with id: ${id}`);
          return null;
        }
        logger.error('Error finding company account by id for signup:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Exception in findByIdForSignup:', error);
      return null;
    }
  }

  // 企業アカウントの作成
  async create(
    accountData: Omit<CompanyAccountEntity, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CompanyAccountEntity> {
    try {
      const createData = {
        ...accountData,
        status: accountData.status || ('ACTIVE' as const),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .insert(createData)
        .select()
        .single();

      if (error) {
        logger.error('Error creating company account:', error);
        throw new Error(`Failed to create company account: ${error.message}`);
      }

      logger.info(`Created company account: ${data.company_name}`);
      return data;
    } catch (error) {
      logger.error('Exception in create company account:', error);
      throw error;
    }
  }

  // 企業アカウントの更新
  async update(
    id: string,
    updates: Partial<CompanyAccountEntity>
  ): Promise<CompanyAccountEntity> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const client = await this.getAuthenticatedClient();
      const { data, error } = await client
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating company account:', error);
        throw new Error(`Failed to update company account: ${error.message}`);
      }

      logger.debug(`Updated company account: ${id}`);
      return data;
    } catch (error) {
      logger.error('Exception in update company account:', error);
      throw error;
    }
  }

  // 企業アカウントの削除
  async delete(id: string): Promise<boolean> {
    try {
      const client = await this.getAuthenticatedClient();
      const { error } = await client.from(this.tableName).delete().eq('id', id);

      if (error) {
        logger.error('Error deleting company account:', error);
        return false;
      }

      logger.info(`Deleted company account: ${id}`);
      return true;
    } catch (error) {
      logger.error('Exception in delete company account:', error);
      return false;
    }
  }
}
