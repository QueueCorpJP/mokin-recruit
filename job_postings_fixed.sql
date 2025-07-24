CREATE TABLE "job_postings" (
    -- 基本識別情報
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID REFERENCES "company_accounts"("id"),
    "company_group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
    "created_by" UUID NOT NULL REFERENCES "company_users"("id"),

    -- 基本求人情報
    "title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "position_summary" TEXT,

    -- スキル・要件
    "required_skills" TEXT[] DEFAULT '{}',
    "other_requirements" TEXT,

    -- 給与情報
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_note" TEXT,

    -- 職種・業種（複数選択対応）
    "job_types" TEXT[] NOT NULL DEFAULT '{}',
    "industries" TEXT[] NOT NULL DEFAULT '{}',

    -- 勤務地情報
    "locations" TEXT[] NOT NULL DEFAULT '{}',
    "location_note" TEXT,
    "remote_work_available" BOOLEAN DEFAULT false,

    -- 雇用形態
    "employment_type" TEXT NOT NULL CHECK ("employment_type" IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    "employment_type_note" TEXT,

    -- 勤務条件
    "working_hours" TEXT,
    "overtime" TEXT CHECK ("overtime" IN ('あり', 'なし')),
    "holidays" TEXT,

    -- 選考情報
    "selection_process" TEXT,
    "application_deadline" TIMESTAMP WITH TIME ZONE,

    -- アピール・環境
    "appeal_points" TEXT[] DEFAULT '{}',
    "smoke_prevention_measure" TEXT CHECK ("smoke_prevention_measure" IN ('屋内禁煙', '喫煙室設置', '対策なし', 'その他')),
    "smoke_note" TEXT,

    -- 応募要件
    "resume_required" TEXT[] DEFAULT '{}',

    -- 画像・ファイル
    "image_files" TEXT[] DEFAULT '{}',

    -- 管理・公開設定
    "internal_memo" TEXT,
    "publication_type" TEXT DEFAULT 'public' CHECK ("publication_type" IN ('public', 'members', 'scout')),
    "status" TEXT DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CLOSED')),
    "able_watch" TEXT DEFAULT '',

    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "published_at" TIMESTAMP WITH TIME ZONE,

    -- 制約条件
    CONSTRAINT check_job_types_limit CHECK (array_length(job_types, 1) <= 3),
    CONSTRAINT check_industries_limit CHECK (array_length(industries, 1) <= 3),
    CONSTRAINT check_locations_limit CHECK (array_length(locations, 1) <= 47),
    CONSTRAINT check_appeal_points_limit CHECK (array_length(appeal_points, 1) <= 6),
    CONSTRAINT check_image_files_limit CHECK (array_length(image_files, 1) <= 5),
    CONSTRAINT check_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min)
);

-- ================================================
-- インデックス（最適化）
-- ================================================

-- 基本検索用
CREATE INDEX idx_job_postings_company_account ON job_postings(company_account_id);
CREATE INDEX idx_job_postings_company_group ON job_postings(company_group_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_publication_type ON job_postings(publication_type);

-- 配列フィールド検索用（GINインデックス）
CREATE INDEX idx_job_postings_job_types ON job_postings USING GIN(job_types);
CREATE INDEX idx_job_postings_industries ON job_postings USING GIN(industries);
CREATE INDEX idx_job_postings_locations ON job_postings USING GIN(locations);
CREATE INDEX idx_job_postings_required_skills ON job_postings USING GIN(required_skills);
CREATE INDEX idx_job_postings_appeal_points ON job_postings USING GIN(appeal_points);

-- 給与範囲検索用
CREATE INDEX idx_job_postings_salary_range ON job_postings(salary_min, salary_max);

-- 公開日時検索用
CREATE INDEX idx_job_postings_published_at ON job_postings(published_at) WHERE status = 'PUBLISHED';

-- ================================================
-- 更新トリガー
-- ================================================

CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Row Level Security
-- ================================================

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- 公開済み求人は誰でも閲覧可能
CREATE POLICY job_postings_public_read ON job_postings
    FOR SELECT USING (status = 'PUBLISHED');