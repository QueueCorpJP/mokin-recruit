import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseAdminClient } from '@/database/supabase';
import { logger } from '@/utils/logger';
import {
  CandidateEntity,
  ICandidateRepository,
} from '@/core/interfaces/IDomainRepository';
import { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';

// 新しいSupabase型システムに対応した型エイリアス
type CandidateRow = Tables<'candidates'>;
type CandidateInsert = TablesInsert<'candidates'>;
type CandidateUpdate = TablesUpdate<'candidates'>;

// データベース型とエンティティ型の変換ヘルパー
function convertDbToEntity(dbData: CandidateRow): CandidateEntity {
  return {
    id: dbData.id,
    email: dbData.email,
    passwordHash: dbData.password_hash,
    firstName: dbData.first_name,
    lastName: dbData.last_name,
    firstNameKana: dbData.first_name_kana || '',
    lastNameKana: dbData.last_name_kana || '',
    gender: dbData.gender || '',
    status: dbData.status || 'active',
    currentResidence: dbData.current_residence || '',
    birthDate: dbData.birth_date ? new Date(dbData.birth_date) : new Date(),
    phoneNumber: dbData.phone_number || '',
    currentSalary: dbData.current_salary || '',
    hasJobChangeExperience: dbData.has_job_change_experience || false,
    desiredChangeTiming: dbData.desired_change_timing || '',
    jobSearchStatus: dbData.job_search_status || '',
    finalEducation: '', // デフォルト値
    englishLevel: '', // デフォルト値
    desiredSalary: '', // デフォルト値
    emailNotificationSettings:
      (dbData.email_notification_settings as Record<string, unknown>) || {},
    lastLoginAt: dbData.last_login_at
      ? new Date(dbData.last_login_at)
      : undefined,
    createdAt: dbData.created_at ? new Date(dbData.created_at) : undefined,
    updatedAt: dbData.updated_at ? new Date(dbData.updated_at) : undefined,
  };
}

function convertEntityToDb(
  entity: Partial<CandidateEntity>
): Partial<CandidateInsert> {
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
    email_notification_settings: entity.emailNotificationSettings
      ? JSON.parse(JSON.stringify(entity.emailNotificationSettings))
      : null,
    last_login_at: entity.lastLoginAt?.toISOString(),
    created_at: entity.createdAt?.toISOString(),
    updated_at: entity.updatedAt?.toISOString(),
  };
}

// 候補者リポジトリの実装 - 継承を使わずに直接実装
export class CandidateRepository implements ICandidateRepository {
  private readonly client: SupabaseClient;
  private readonly tableName = 'candidates';

  constructor() {
    this.client = getSupabaseAdminClient();
  }

  // インターフェース実装メソッド
  async findById(id: string): Promise<CandidateEntity | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return convertDbToEntity(data);
    } catch (error) {
      logger.error('Error finding candidate by id:', error);
      return null;
    }
  }

  async findAll(): Promise<CandidateEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*');

      if (error) {
        throw error;
      }

      return data.map(convertDbToEntity);
    } catch (error) {
      logger.error('Error finding all candidates:', error);
      return [];
    }
  }

  async create(
    entity: Partial<CandidateEntity>
  ): Promise<CandidateEntity | null> {
    try {
      const dbData = convertEntityToDb(entity);
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(dbData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return convertDbToEntity(data);
    } catch (error) {
      logger.error('Error creating candidate:', error);
      return null;
    }
  }

  async update(
    id: string,
    updates: Partial<CandidateEntity>
  ): Promise<CandidateEntity | null> {
    try {
      const dbData = convertEntityToDb(updates);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return convertDbToEntity(data);
    } catch (error) {
      logger.error('Error updating candidate:', error);
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
        throw error;
      }

      return true;
    } catch (error) {
      logger.error('Error deleting candidate:', error);
      return false;
    }
  }

  async search(criteria: Record<string, unknown>): Promise<CandidateEntity[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // 動的に条件を追加
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map(convertDbToEntity);
    } catch (error) {
      logger.error('Error searching candidates:', error);
      return [];
    }
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
    try {
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

      // ページネーション
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        items: data.map(convertDbToEntity),
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      logger.error('Error finding candidates with pagination:', error);
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
        throw error;
      }

      return true;
    } catch (error) {
      logger.error('Error updating last login:', error);
      return false;
    }
  }

  async findByCriteria(
    criteria: Record<string, unknown>
  ): Promise<CandidateEntity | null> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // 動的に条件を追加
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

      // 検索条件の適用
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

      if (searchOptions.salaryRange?.min) {
        query = query.gte('current_salary', searchOptions.salaryRange.min);
      }

      if (searchOptions.salaryRange?.max) {
        query = query.lte('current_salary', searchOptions.salaryRange.max);
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
        throw error;
      }

      return {
        candidates: data.map(convertDbToEntity),
        total: count || 0,
      };
    } catch (error) {
      logger.error('Error searching candidates:', error);
      return {
        candidates: [],
        total: 0,
      };
    }
  }
}
