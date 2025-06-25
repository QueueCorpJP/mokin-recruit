import { SupabaseRepository } from './SupabaseRepository';
import { logger } from '@/utils/logger';

// CompanyUserエンティティの型定義
export interface CompanyUserEntity {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  companyAccountId: string;
  lastLoginAt?: Date;
  emailNotificationSettings: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

// CompanyAccountエンティティの型定義
export interface CompanyAccountEntity {
  id: string;
  companyName: string;
  industry: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 企業ユーザーリポジトリの実装
export class CompanyUserRepository extends SupabaseRepository<CompanyUserEntity> {
  protected readonly tableName = 'company_users';

  async findByEmail(email: string): Promise<CompanyUserEntity | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data as CompanyUserEntity;
    } catch (error) {
      logger.error('Error finding company user by email:', error);
      return null;
    }
  }

  async findByEmailWithCompany(
    email: string
  ): Promise<
    (CompanyUserEntity & { companyAccount: CompanyAccountEntity }) | null
  > {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select(
          `
          *,
          company_accounts!company_users_company_account_id_fkey (*)
        `
        )
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return {
        ...data,
        companyAccount: data.company_accounts,
      } as CompanyUserEntity & { companyAccount: CompanyAccountEntity };
    } catch (error) {
      logger.error('Error finding company user with company by email:', error);
      return null;
    }
  }

  async updateLastLogin(id: string): Promise<boolean> {
    try {
      const { error } = await this.client
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
}

// CompanyAccountリポジトリの実装
export class CompanyAccountRepository extends SupabaseRepository<CompanyAccountEntity> {
  protected readonly tableName = 'company_accounts';

  async findByIndustry(industry: string): Promise<CompanyAccountEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('industry', industry);

      if (error) {
        throw error;
      }

      return data as CompanyAccountEntity[];
    } catch (error) {
      logger.error('Error finding company accounts by industry:', error);
      return [];
    }
  }
}
