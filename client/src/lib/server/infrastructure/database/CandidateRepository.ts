import { SupabaseRepository } from './SupabaseRepository';
import { logger } from '@/utils/logger';
import {
  CandidateEntity,
  ICandidateRepository,
} from '@/core/interfaces/IDomainRepository';

// 候補者リポジトリの実装 (LSP準拠)
export class CandidateRepository
  extends SupabaseRepository<CandidateEntity>
  implements ICandidateRepository
{
  protected readonly tableName = 'candidates';

  async findByEmail(email: string): Promise<CandidateEntity | null> {
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

      return data as CandidateEntity;
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

      return data as CandidateEntity[];
    } catch (error) {
      logger.error('Error finding candidates by status:', error);
      return [];
    }
  }

  // 候補者固有の検索メソッド
  async findBySkills(skills: string[]): Promise<CandidateEntity[]> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .overlaps('skills', skills);

      if (error) {
        throw error;
      }

      return data as CandidateEntity[];
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

      return data as CandidateEntity[];
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
          // No rows found
          return null;
        }
        throw error;
      }

      return data as CandidateEntity;
    } catch (error) {
      logger.error('Error finding candidate by criteria:', error);
      return null;
    }
  }
}
