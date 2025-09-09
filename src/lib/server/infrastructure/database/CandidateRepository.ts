import { injectable } from 'inversify';
import { logger } from '@/lib/server/utils/logger';
import { UserSupabaseRepository } from './UserSupabaseRepository';
import { ICandidateRepository } from '@/lib/server/core/interfaces/IDomainRepository';

// MVPスキーマに対応したシンプルな候補者エンティティ
export interface CandidateEntity {
  id: string;
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  phone_number?: string;
  prefecture?: string;
  current_salary?: string;
  desired_salary?: string;
  skills: string[];
  experience_years: number;
  desired_industries: string[];
  desired_job_types: string[];
  desired_locations: string[];
  scout_reception_enabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  // 追加: DBスキーマに合わせる
  birth_date?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  gender?: string;
  current_income?: string;
}

// MVPスキーマ対応の候補者作成データ
export interface CreateCandidateData {
  email: string;
  password_hash: string;
  last_name: string;
  first_name: string;
  phone_number?: string;
  current_residence?: string;
  prefecture?: string;
  current_salary?: string;
  desired_salary?: string;
  skills?: string[];
  experience_years?: number;
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_locations?: string[];
  scout_reception_enabled?: boolean;
}

@injectable()
export class CandidateRepository
  extends UserSupabaseRepository<CandidateEntity>
  implements ICandidateRepository
{
  protected tableName = 'candidates';

  constructor() {
    super();
  }

  // signup時の重複チェック用（管理者権限で実行）
  async findByEmailForSignup(email: string): Promise<CandidateEntity | null> {
    try {
      const client = this.getAdminClient();
      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug(`Candidate not found with email: ${email}`);
          return null;
        }
        logger.error('Error finding candidate by email for signup:', error);
        return null;
      }

      logger.debug(`Found candidate for signup check: ${email}`);
      return data;
    } catch (error) {
      logger.error('Exception in findByEmailForSignup:', error);
      return null;
    }
  }

  // signup時の候補者作成（管理者権限で実行）
  async create(candidateData: CreateCandidateData): Promise<CandidateEntity> {
    try {
      const createData = {
        ...candidateData,
        skills: candidateData.skills || [],
        experience_years: candidateData.experience_years || 0,
        desired_industries: candidateData.desired_industries || [],
        desired_job_types: candidateData.desired_job_types || [],
        desired_locations: candidateData.desired_locations || [],
        scout_reception_enabled: candidateData.scout_reception_enabled ?? true,
        status: 'ACTIVE' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await this.createWithAdmin(createData);
      if (!result) {
        throw new Error('Failed to create candidate');
      }

      logger.info(`Created candidate: ${result.email}`);
      return result;
    } catch (error) {
      logger.error('Exception in create candidate:', error);
      throw error;
    }
  }

  // 候補者の更新
  async update(
    id: string,
    updates: Partial<CandidateEntity>
  ): Promise<CandidateEntity> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.client
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating candidate:', error);
        throw new Error(`Failed to update candidate: ${error.message}`);
      }

      logger.debug(`Updated candidate: ${id}`);
      return data;
    } catch (error) {
      logger.error('Exception in update candidate:', error);
      throw error;
    }
  }

  // 最終ログイン時刻の更新
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

  // IDで候補者を検索
  async findById(id: string): Promise<CandidateEntity | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.debug(`Candidate not found with id: ${id}`);
          return null;
        }
        logger.error('Error finding candidate by id:', error);
        throw new Error(`Failed to find candidate: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('Exception in findById:', error);
      throw error;
    }
  }

  // 候補者の削除
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting candidate:', error);
        return false;
      }

      logger.info(`Deleted candidate: ${id}`);
      return true;
    } catch (error) {
      logger.error('Exception in delete candidate:', error);
      return false;
    }
  }

  // 候補者の検索（基本的なフィルタリング）
  async search(filters: {
    skills?: string[];
    desired_industries?: string[];
    desired_locations?: string[];
    experience_years_min?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<CandidateEntity[]> {
    try {
      let query = this.client.from(this.tableName).select('*');

      // フィルタリング条件の適用
      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills);
      }

      if (filters.desired_industries && filters.desired_industries.length > 0) {
        query = query.overlaps(
          'desired_industries',
          filters.desired_industries
        );
      }

      if (filters.desired_locations && filters.desired_locations.length > 0) {
        query = query.overlaps('desired_locations', filters.desired_locations);
      }

      if (filters.experience_years_min !== undefined) {
        query = query.gte('experience_years', filters.experience_years_min);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // ページネーション
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error searching candidates:', error);
        throw new Error(`Failed to search candidates: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      logger.error('Exception in search candidates:', error);
      throw error;
    }
  }
}
