-- ================================================
-- MVP最小限テーブル設計（既存テーブルリセット込み）
-- ================================================
-- 実装方針: 機能を作りながらデータ構造を最適化
-- 対象: 基本的な候補者登録・企業登録・求人・メッセージ機能
-- 
-- 実行手順：
-- 1. Supabase Dashboard (https://supabase.com/dashboard/project/mjhqeagxibsklugikyma) にアクセス
-- 2. 左メニューから "SQL Editor" を選択
-- 3. このファイル全体をコピー&ペーストして実行
-- 
-- 注意: 既存のテーブルとデータがすべて削除されます

-- ================================================
-- 既存テーブルの完全リセット
-- ================================================

-- 既存のポリシーを削除（エラーを避けるため）
-- より安全なポリシー削除処理
DO $$ 
BEGIN
    -- ポリシーの存在チェックと削除
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'candidates_own_data' AND tablename = 'candidates') THEN
        DROP POLICY candidates_own_data ON candidates;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'job_postings_public_read' AND tablename = 'job_postings') THEN
        DROP POLICY job_postings_public_read ON job_postings;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーが発生しても処理を続行
        NULL;
END $$;

-- 既存のトリガーを削除（拡張スキーマ対応）
-- より安全なトリガー削除処理
DO $$ 
BEGIN
    -- トリガーの存在チェックと削除
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_candidates_updated_at') THEN
        DROP TRIGGER update_candidates_updated_at ON candidates;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_candidate_selection_statuses_updated_at') THEN
        DROP TRIGGER update_candidate_selection_statuses_updated_at ON candidate_selection_statuses;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_company_accounts_updated_at') THEN
        DROP TRIGGER update_company_accounts_updated_at ON company_accounts;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_company_groups_updated_at') THEN
        DROP TRIGGER update_company_groups_updated_at ON company_groups;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_company_users_updated_at') THEN
        DROP TRIGGER update_company_users_updated_at ON company_users;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_company_user_group_permissions_updated_at') THEN
        DROP TRIGGER update_company_user_group_permissions_updated_at ON company_user_group_permissions;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_job_postings_updated_at') THEN
        DROP TRIGGER update_job_postings_updated_at ON job_postings;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_messages_updated_at') THEN
        DROP TRIGGER update_messages_updated_at ON messages;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_applications_updated_at') THEN
        DROP TRIGGER update_applications_updated_at ON applications;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーが発生しても処理を続行
        NULL;
END $$;

-- 既存の関数を削除
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 既存のテーブルを削除（依存関係順序で削除）
-- 拡張スキーマの関連テーブルから削除
DROP TABLE IF EXISTS "candidate_selection_statuses" CASCADE;
DROP TABLE IF EXISTS "candidate_languages" CASCADE;
DROP TABLE IF EXISTS "candidate_job_type_experiences" CASCADE;
DROP TABLE IF EXISTS "candidate_industry_experiences" CASCADE;

-- 既存のアプリケーション関連テーブル
DROP TABLE IF EXISTS "applications" CASCADE;
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "job_postings" CASCADE;

-- 既存の企業関連テーブル
DROP TABLE IF EXISTS "company_user_group_permissions" CASCADE;
DROP TABLE IF EXISTS "company_users" CASCADE;
DROP TABLE IF EXISTS "company_groups" CASCADE;
DROP TABLE IF EXISTS "company_accounts" CASCADE;

-- 既存の候補者テーブル（メインとサブ）
DROP TABLE IF EXISTS "candidates" CASCADE;
DROP TABLE IF EXISTS "candidates_simple" CASCADE;

-- 既存のマスターテーブル
DROP TABLE IF EXISTS "work_styles" CASCADE;
DROP TABLE IF EXISTS "education_levels" CASCADE;
DROP TABLE IF EXISTS "job_types" CASCADE;
DROP TABLE IF EXISTS "industries" CASCADE;
DROP TABLE IF EXISTS "locations" CASCADE;
DROP TABLE IF EXISTS "selection_options" CASCADE;

-- 既存のインデックスを削除（テーブル削除で自動削除されるが、明示的に記載）
-- 拡張スキーマで作成されたインデックス
DROP INDEX IF EXISTS "idx_candidates_email" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_status" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_current_residence" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_recent_industry" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_recent_job_type" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_desired_salary" CASCADE;
DROP INDEX IF EXISTS "idx_candidates_job_search_status" CASCADE;
DROP INDEX IF EXISTS "idx_candidate_industry_experiences_candidate_id" CASCADE;
DROP INDEX IF EXISTS "idx_candidate_job_type_experiences_candidate_id" CASCADE;
DROP INDEX IF EXISTS "idx_candidate_languages_candidate_id" CASCADE;
DROP INDEX IF EXISTS "idx_candidate_selection_statuses_candidate_id" CASCADE;
DROP INDEX IF EXISTS "idx_locations_region" CASCADE;
DROP INDEX IF EXISTS "idx_industries_category" CASCADE;
DROP INDEX IF EXISTS "idx_job_types_category" CASCADE;
DROP INDEX IF EXISTS "idx_work_styles_category" CASCADE;

-- 既存のスキーマ確認用テーブルも削除
DROP TABLE IF EXISTS "schema_migrations" CASCADE;
DROP TABLE IF EXISTS "audit_logs" CASCADE;

SELECT 'All existing tables and related objects have been reset successfully.' as reset_status;

-- ================================================
-- 1. 候補者テーブル（最小限）
-- ================================================
CREATE TABLE "candidates" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    
    -- 基本個人情報
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "current_residence" TEXT,
    
    -- 基本職歴情報
    "current_salary" TEXT,
    "desired_salary" TEXT,
    "skills" TEXT[] DEFAULT '{}',
    "experience_years" INTEGER DEFAULT 0,
    
    -- 希望条件（シンプルに）
    "desired_industries" TEXT[] DEFAULT '{}',
    "desired_job_types" TEXT[] DEFAULT '{}',
    "desired_locations" TEXT[] DEFAULT '{}',
    
    -- システム設定
    "scout_reception_enabled" BOOLEAN DEFAULT true,
    "status" TEXT DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_login_at" TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- 2. 企業アカウントテーブル（最小限）
-- ================================================
CREATE TABLE "company_accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "headquarters_address" TEXT,
    "representative_name" TEXT,
    "company_overview" TEXT,
    
    -- システム設定
    "status" TEXT DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. 企業グループテーブル（最小限）
-- ================================================
CREATE TABLE "company_groups" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
    "group_name" TEXT NOT NULL,
    "description" TEXT,
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 4. 企業ユーザーテーブル（最小限）
-- ================================================
CREATE TABLE "company_users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "position_title" TEXT,
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_login_at" TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- 5. 企業ユーザー・グループ権限テーブル（最小限）
-- ================================================
CREATE TABLE "company_user_group_permissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_user_id" UUID NOT NULL REFERENCES "company_users"("id") ON DELETE CASCADE,
    "company_group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
    "permission_level" TEXT NOT NULL CHECK ("permission_level" IN ('SCOUT_STAFF', 'ADMINISTRATOR')),
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE("company_user_id", "company_group_id")
);

-- ================================================
-- 6. 求人テーブル（最小限）
-- ================================================
CREATE TABLE "job_postings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
    "created_by" UUID NOT NULL REFERENCES "company_users"("id"),
    
    -- 基本情報
    "title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "required_skills" TEXT[] DEFAULT '{}',
    "preferred_skills" TEXT[] DEFAULT '{}',
    
    -- 条件情報
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "employment_type" TEXT NOT NULL CHECK ("employment_type" IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    "work_location" TEXT NOT NULL,
    "remote_work_available" BOOLEAN DEFAULT false,
    "job_type" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    
    -- 公開設定
    "status" TEXT DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CLOSED')),
    "application_deadline" TIMESTAMP WITH TIME ZONE,
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "published_at" TIMESTAMP WITH TIME ZONE
);

-- ================================================
-- 7. メッセージテーブル（最小限）
-- ================================================
CREATE TABLE "messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 送受信者情報
    "sender_type" TEXT NOT NULL CHECK ("sender_type" IN ('CANDIDATE', 'COMPANY_USER')),
    "sender_candidate_id" UUID REFERENCES "candidates"("id"),
    "sender_company_user_id" UUID REFERENCES "company_users"("id"),
    "receiver_type" TEXT NOT NULL CHECK ("receiver_type" IN ('CANDIDATE', 'COMPANY_USER')),
    "receiver_candidate_id" UUID REFERENCES "candidates"("id"),
    "receiver_company_user_id" UUID REFERENCES "company_users"("id"),
    
    -- メッセージ情報
    "message_type" TEXT NOT NULL CHECK ("message_type" IN ('SCOUT', 'APPLICATION', 'GENERAL')),
    "related_job_posting_id" UUID REFERENCES "job_postings"("id"),
    "company_group_id" UUID REFERENCES "company_groups"("id"),
    
    -- コンテンツ
    "subject" TEXT,
    "content" TEXT NOT NULL,
    
    -- ステータス管理
    "status" TEXT DEFAULT 'SENT' CHECK ("status" IN ('SENT', 'READ', 'REPLIED')),
    
    -- タイムスタンプ
    "sent_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "read_at" TIMESTAMP WITH TIME ZONE,
    "replied_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 8. 応募テーブル（最小限）
-- ================================================
CREATE TABLE "applications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id"),
    "job_posting_id" UUID NOT NULL REFERENCES "job_postings"("id"),
    "company_group_id" UUID NOT NULL REFERENCES "company_groups"("id"),
    
    -- 応募情報
    "application_message" TEXT,
    "resume_file_path" TEXT,
    "status" TEXT DEFAULT 'APPLIED' CHECK ("status" IN ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN')),
    
    -- タイムスタンプ
    "applied_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE("candidate_id", "job_posting_id")
);

-- ================================================
-- 基本インデックス（パフォーマンス用）
-- ================================================

-- 候補者検索用
CREATE INDEX idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX idx_candidates_desired_industries ON candidates USING GIN(desired_industries);
CREATE INDEX idx_candidates_desired_locations ON candidates USING GIN(desired_locations);
CREATE INDEX idx_candidates_status ON candidates(status);

-- 求人検索用
CREATE INDEX idx_job_postings_company_group ON job_postings(company_group_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_job_type ON job_postings(job_type);
CREATE INDEX idx_job_postings_industry ON job_postings(industry);
CREATE INDEX idx_job_postings_required_skills ON job_postings USING GIN(required_skills);

-- メッセージ検索用
CREATE INDEX idx_messages_receiver_candidate ON messages(receiver_candidate_id) WHERE receiver_type = 'CANDIDATE';
CREATE INDEX idx_messages_receiver_company ON messages(receiver_company_user_id) WHERE receiver_type = 'COMPANY_USER';
CREATE INDEX idx_messages_company_group ON messages(company_group_id);
CREATE INDEX idx_messages_status ON messages(status);

-- 応募管理用
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_job_posting ON applications(job_posting_id);
CREATE INDEX idx_applications_company_group ON applications(company_group_id);
CREATE INDEX idx_applications_status ON applications(status);

-- 企業管理用
CREATE INDEX idx_company_user_permissions_user ON company_user_group_permissions(company_user_id);
CREATE INDEX idx_company_user_permissions_group ON company_user_group_permissions(company_group_id);

-- ================================================
-- Row Level Security (RLS) 基本設定
-- ================================================

-- 候補者データの保護
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY candidates_own_data ON candidates FOR ALL USING (auth.uid()::text = id::text);

-- 企業データの保護
ALTER TABLE company_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;

-- 求人データの保護
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_postings_public_read ON job_postings FOR SELECT USING (status = 'PUBLISHED');

-- メッセージデータの保護
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 応募データの保護
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 基本マスターデータ（開発用）
-- ================================================

-- サンプル業種データ
INSERT INTO company_accounts (company_name, industry, headquarters_address, representative_name, company_overview) VALUES
('テストIT企業', 'IT・インターネット', '東京都渋谷区', '田中太郎', 'Webサービス開発を行う企業です'),
('サンプルコンサル', 'コンサルティング', '東京都千代田区', '佐藤花子', '経営コンサルティングを提供します');

-- サンプル企業グループ
INSERT INTO company_groups (company_account_id, group_name, description) 
SELECT id, 'エンジニア採用チーム', 'エンジニアの採用を担当するチーム' FROM company_accounts WHERE company_name = 'テストIT企業';

-- ================================================
-- 更新トリガー（updated_at自動更新）
-- ================================================

-- 汎用更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガー設定
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_accounts_updated_at BEFORE UPDATE ON company_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_groups_updated_at BEFORE UPDATE ON company_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_users_updated_at BEFORE UPDATE ON company_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_user_group_permissions_updated_at BEFORE UPDATE ON company_user_group_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 完了メッセージ
-- ================================================
SELECT 'MVP Schema created successfully! Ready for development.' as status; 