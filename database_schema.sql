-- Mokin Recruit Database Schema
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
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
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

SELECT 'Database schema created successfully!' as message;
