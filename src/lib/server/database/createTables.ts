import { getSupabaseAdminClient } from './supabase';
import { logger } from '@/lib/server/utils/logger';

/**
 * テーブルが存在するかチェック
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const client = getSupabaseAdminClient();
    const { data, error } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      logger.error(`Error checking table ${tableName}:`, error);
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error(`Error checking table ${tableName}:`, error);
    return false;
  }
}

/**
 * テーブル作成のメイン関数
 */
export async function createDatabaseTables(): Promise<{
  success: boolean;
  tablesCreated: string[];
  errors: string[];
  sqlScript: string;
}> {
  const result = {
    success: false,
    tablesCreated: [] as string[],
    errors: [] as string[],
    sqlScript: ''
  };

  logger.info('🔧 Starting database table creation process...');
  
  try {
    // 主要テーブルの存在チェック
    const requiredTables = ['candidates', 'company_accounts', 'company_users', 'job_postings', 'messages'];
    const existingTables = [];
    
    for (const table of requiredTables) {
      const exists = await checkTableExists(table);
      if (exists) {
        existingTables.push(table);
      }
    }

    if (existingTables.length === requiredTables.length) {
      logger.info('✅ All required tables already exist');
      result.success = true;
      result.tablesCreated = existingTables;
      return result;
    }

    // Supabase Dashboard用のSQL生成
    const sqlScript = `-- Mokin Recruit Database Schema
-- Execute this script in Supabase Dashboard > SQL Editor

-- 基本的なテーブル作成
CREATE TABLE IF NOT EXISTS "candidates" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name_kana" TEXT,
    "first_name_kana" TEXT,
    "gender" TEXT,
    "current_residence" TEXT,
    "birth_date" DATE,
    "phone_number" TEXT,
    "current_salary" TEXT,
    "has_job_change_experience" BOOLEAN DEFAULT false,
    "desired_change_timing" TEXT,
    "job_search_status" TEXT,
    "skills" TEXT[] DEFAULT '{}',
    "desired_industries" TEXT[] DEFAULT '{}',
    "desired_job_types" TEXT[] DEFAULT '{}',
    "desired_locations" TEXT[] DEFAULT '{}',
    "job_histories" JSONB DEFAULT '[]',
    "recent_job_company_name" TEXT,
    "recent_job_department_position" TEXT,
    "recent_job_start_year" TEXT,
    "recent_job_start_month" TEXT,
    "recent_job_end_year" TEXT,
    "recent_job_end_month" TEXT,
    "recent_job_is_currently_working" BOOLEAN DEFAULT false,
    "recent_job_industries" JSONB DEFAULT '[]',
    "recent_job_types" JSONB DEFAULT '[]',
    "recent_job_description" TEXT,
    "recent_job_updated_at" TIMESTAMP WITH TIME ZONE,
    "email_notification_settings" JSONB DEFAULT '{}',
    "scout_reception_enabled" BOOLEAN DEFAULT true,
    "status" TEXT DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_login_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "company_accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "headquarters_address" TEXT,
    "representative_name" TEXT,
    "industry" TEXT NOT NULL,
    "company_overview" TEXT,
    "appeal_points" TEXT,
    "logo_image_path" TEXT,
    "contract_plan" JSONB DEFAULT '{}',
    "status" TEXT DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "company_users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
    "full_name" TEXT NOT NULL,
    "position_title" TEXT,
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_notification_settings" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_login_at" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "job_postings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "department_name" TEXT,
    "job_description" TEXT NOT NULL,
    "required_skills" TEXT[] DEFAULT '{}',
    "preferred_skills" TEXT[] DEFAULT '{}',
    "employment_type" TEXT,
    "salary_range" TEXT,
    "work_location" TEXT,
    "work_style" TEXT[] DEFAULT '{}',
    "benefits" TEXT,
    "selection_process" TEXT,
    "application_requirements" TEXT,
    "visibility_scope" TEXT DEFAULT 'PUBLIC',
    "target_candidate_conditions" JSONB DEFAULT '{}',
    "publication_status" TEXT DEFAULT 'DRAFT',
    "published_at" TIMESTAMP WITH TIME ZONE,
    "application_deadline" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sender_type" TEXT NOT NULL,
    "sender_candidate_id" UUID REFERENCES "candidates"("id") ON DELETE CASCADE,
    "sender_company_user_id" UUID REFERENCES "company_users"("id") ON DELETE CASCADE,
    "receiver_type" TEXT NOT NULL,
    "receiver_candidate_id" UUID REFERENCES "candidates"("id") ON DELETE CASCADE,
    "receiver_company_user_id" UUID REFERENCES "company_users"("id") ON DELETE CASCADE,
    "message_type" TEXT DEFAULT 'GENERAL',
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachment_file_paths" TEXT[] DEFAULT '{}',
    "status" TEXT DEFAULT 'SENT',
    "read_at" TIMESTAMP WITH TIME ZONE,
    "replied_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS "idx_candidates_email" ON "candidates"("email");
CREATE INDEX IF NOT EXISTS "idx_candidates_status" ON "candidates"("status");
CREATE INDEX IF NOT EXISTS "idx_company_users_email" ON "company_users"("email");
CREATE INDEX IF NOT EXISTS "idx_job_postings_publication_status" ON "job_postings"("publication_status");
CREATE INDEX IF NOT EXISTS "idx_messages_created_at" ON "messages"("created_at");

-- 更新時刻の自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルに更新トリガーを適用
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON "candidates" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_accounts_updated_at 
    BEFORE UPDATE ON "company_accounts" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_users_updated_at 
    BEFORE UPDATE ON "company_users" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at 
    BEFORE UPDATE ON "job_postings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON "messages" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- サンプルデータの挿入（開発用）
INSERT INTO "company_accounts" ("company_name", "industry", "headquarters_address", "representative_name") 
VALUES 
    ('テスト株式会社', 'IT・インターネット', '東京都渋谷区', '田中太郎'),
    ('サンプル企業', '製造業', '大阪府大阪市', '佐藤花子')
ON CONFLICT DO NOTHING;

SELECT 'Database schema created successfully!' as message;`;

    result.sqlScript = sqlScript;
    
    logger.info('📋 SQL script generated for Supabase Dashboard');
    logger.info('📝 Please execute this script in Supabase Dashboard > SQL Editor');
    logger.info('🔗 Supabase Dashboard: https://supabase.com/dashboard/project/mjhqeagxibsklugikyma');
    
    return result;
  } catch (error) {
    logger.error('❌ Failed to create database tables:', error);
    result.errors.push(`Creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}
