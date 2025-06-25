import { SupabaseRepository } from './SupabaseRepository';
import { logger } from '@/utils/logger';
import {
  CandidateEntity,
  ICandidateRepository,
} from '@/core/interfaces/IDomainRepository';
import {
  CandidateRow,
  CandidateInsert,
  CandidateUpdate,
} from '../../types/supabase';

// データベース型とエンティティ型の変換ヘルパー
function convertDbToEntity(dbData: any): CandidateEntity {
  return {
    id: dbData.id,
    email: dbData.email,
    passwordHash: dbData.password_hash,
    firstName: dbData.first_name,
    lastName: dbData.last_name,
    firstNameKana: dbData.first_name_kana,
    lastNameKana: dbData.last_name_kana,
    gender: dbData.gender,
    status: dbData.status,
    currentResidence: dbData.current_residence,
    birthDate: dbData.birth_date ? new Date(dbData.birth_date) : new Date(),
    phoneNumber: dbData.phone_number,
    currentSalary: dbData.current_salary,
    hasJobChangeExperience: dbData.has_job_change_experience,
    desiredChangeTiming: dbData.desired_change_timing,
    jobSearchStatus: dbData.job_search_status,
    finalEducation: '', // デフォルト値
    englishLevel: '', // デフォルト値
    desiredSalary: '', // デフォルト値
    emailNotificationSettings: dbData.email_notification_settings || {},
    lastLoginAt: dbData.last_login_at
      ? new Date(dbData.last_login_at)
      : undefined,
    createdAt: dbData.created_at ? new Date(dbData.created_at) : undefined,
    updatedAt: dbData.updated_at ? new Date(dbData.updated_at) : undefined,
  };
}

function convertEntityToDb(entity: Partial<CandidateEntity>): any {
  return {
    id: entity.id,
    email: entity.email,
    password_hash: entity.passwordHash,
    first_name: entity.firstName,
    last_name: entity.lastName,
    first_name_kana: entity.firstNameKana,
    last_name_kana: entity.lastNameKana,
    gender: entity.gender,
    status: entity.status,
    current_residence: entity.currentResidence,
    birth_date: entity.birthDate?.toISOString(),
    phone_number: entity.phoneNumber,
    current_salary: entity.currentSalary,
    has_job_change_experience: entity.hasJobChangeExperience,
    desired_change_timing: entity.desiredChangeTiming,
    job_search_status: entity.jobSearchStatus,
    email_notification_settings: entity.emailNotificationSettings,
    last_login_at: entity.lastLoginAt?.toISOString(),
    created_at: entity.createdAt?.toISOString(),
    updated_at: entity.updatedAt?.toISOString(),
  };
}

// 候補者リポジトリの実装 (LSP準拠)
export class CandidateRepository
  extends SupabaseRepository<any>
  implements ICandidateRepository
{
  protected readonly tableName = 'candidates';

  // インターフェース実装メソッド
  async findById(id: string): Promise<CandidateEntity | null> {
    const result = await super.findById(id);
    return result ? convertDbToEntity(result) : null;
  }

  async findAll(): Promise<CandidateEntity[]> {
    const results = await super.findAll();
    return results.map(convertDbToEntity);
  }

  async create(
    entity: Partial<CandidateEntity>
  ): Promise<CandidateEntity | null> {
    const dbData = convertEntityToDb(entity);
    const result = await super.create(dbData);
    return result ? convertDbToEntity(result) : null;
  }

  async update(
    id: string,
    updates: Partial<CandidateEntity>
  ): Promise<CandidateEntity | null> {
    const dbData = convertEntityToDb(updates);
    const result = await super.update(id, dbData);
    return result ? convertDbToEntity(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    return super.delete(id);
  }

  async search(criteria: Record<string, unknown>): Promise<CandidateEntity[]> {
    const results = await super.search(criteria);
    return results.map(convertDbToEntity);
  }

  async findWithPagination(
    page: number,
    limit: number,
    filters?: Record<string, unknown>
  ): Promise<{
    items: CandidateEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const result = await super.findWithPagination(page, limit, { filters });
    return {
      ...result,
      items: result.items.map(convertDbToEntity),
    };
  }

  // ドメイン固有メソッド
  async findByEmail(email: string): Promise<CandidateEntity | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return convertDbToEntity(data);
    } catch (error) {
      logger.error('Error finding candidate by email:', error);
      return null;
    }
  }

  async findByStatus(status: string): Promise<CandidateEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('status', status);

      if (error) {
        throw error;
      }

      return data.map(convertDbToEntity);
    } catch (error) {
      logger.error('Error finding candidates by status:', error);
      return [];
    }
  }

  async findBySkills(skills: string[]): Promise<CandidateEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .overlaps('skills', skills);

      if (error) {
        throw error;
      }

      return data.map(convertDbToEntity);
    } catch (error) {
      logger.error('Error finding candidates by skills:', error);
      return [];
    }
  }

  async findByLocation(location: string): Promise<CandidateEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('current_residence', location);

      if (error) {
        throw error;
      }

      return data.map(convertDbToEntity);
    } catch (error) {
      logger.error('Error finding candidates by location:', error);
      return [];
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
        logger.error('Error updating candidate last login:', error);
        return false;
      }

      logger.debug(`Updated last login for candidate: ${id}`);
      return true;
    } catch (error) {
      logger.error('Exception in updateLastLogin for candidate:', error);
      return false;
    }
  }

  async findByCriteria(
    criteria: Record<string, unknown>
  ): Promise<CandidateEntity | null> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // 動的にフィルター条件を追加
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return convertDbToEntity(data);
    } catch (error) {
      logger.error('Error finding candidate by criteria:', error);
      return null;
    }
  }

  // 高度な検索機能
  async searchCandidates(searchOptions: {
    skills?: string[];
    location?: string;
    status?: string;
    industries?: string[];
    salaryRange?: { min?: string; max?: string };
    limit?: number;
    offset?: number;
  }): Promise<{
    candidates: CandidateEntity[];
    total: number;
  }> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // フィルター条件を動的に追加
      if (searchOptions.skills && searchOptions.skills.length > 0) {
        query = query.overlaps('skills', searchOptions.skills);
      }

      if (searchOptions.location) {
        query = query.eq('current_residence', searchOptions.location);
      }

      if (searchOptions.status) {
        query = query.eq('status', searchOptions.status);
      }

      if (searchOptions.industries && searchOptions.industries.length > 0) {
        query = query.overlaps('desired_industries', searchOptions.industries);
      }

      // ページネーション
      if (searchOptions.limit) {
        query = query.limit(searchOptions.limit);
      }

      if (searchOptions.offset) {
        query = query.range(
          searchOptions.offset,
          searchOptions.offset + (searchOptions.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error searching candidates:', error);
        return { candidates: [], total: 0 };
      }

      return {
        candidates: data.map(convertDbToEntity),
        total: count || 0,
      };
    } catch (error) {
      logger.error('Exception in searchCandidates:', error);
      return { candidates: [], total: 0 };
    }
  }
}
