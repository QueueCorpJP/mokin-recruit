#!/usr/bin/env node

/**
 * Database Reset and New Schema Application Script
 *
 * このスクリプトは以下を実行します：
 * 1. 既存のテーブルとデータを完全削除
 * 2. 新しい拡張候補者スキーマを適用
 * 3. マスターデータを投入
 * 4. 検証
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 環境変数が設定されていません');
  process.exit(1);
}

async function resetAndApplyNewSchema() {
  console.log('🚀 データベースリセットと新スキーマ適用を開始します...\n');

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Step 1: 既存テーブルの完全削除
    console.log('🗑️  既存テーブルを削除中...');

    const dropStatements = [
      'DROP TABLE IF EXISTS "candidate_selection_statuses" CASCADE;',
      'DROP TABLE IF EXISTS "candidate_languages" CASCADE;',
      'DROP TABLE IF EXISTS "candidate_job_type_experiences" CASCADE;',
      'DROP TABLE IF EXISTS "candidate_industry_experiences" CASCADE;',
      'DROP TABLE IF EXISTS "messages" CASCADE;',
      'DROP TABLE IF EXISTS "job_postings" CASCADE;',
      'DROP TABLE IF EXISTS "company_users" CASCADE;',
      'DROP TABLE IF EXISTS "company_accounts" CASCADE;',
      'DROP TABLE IF EXISTS "candidates" CASCADE;',
      'DROP TABLE IF EXISTS "work_styles" CASCADE;',
      'DROP TABLE IF EXISTS "education_levels" CASCADE;',
      'DROP TABLE IF EXISTS "job_types" CASCADE;',
      'DROP TABLE IF EXISTS "industries" CASCADE;',
      'DROP TABLE IF EXISTS "locations" CASCADE;',
      'DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;',
    ];

    for (const statement of dropStatements) {
      const { error } = await supabase.rpc('exec', { sql: statement });
      if (error) {
        console.warn(`⚠️  削除警告: ${error.message}`);
      }
    }
    console.log('✅ 既存テーブル削除完了\n');

    // Step 2: 新しいスキーマの適用
    console.log('📝 新しいスキーマを適用中...');

    // マスターデータテーブル作成
    const masterDataSchema = `
-- 都道府県・地域マスター
CREATE TABLE "locations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "region" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 業種マスター
CREATE TABLE "industries" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "industry_name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 職種マスター
CREATE TABLE "job_types" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "job_type_name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 最終学歴マスター
CREATE TABLE "education_levels" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "education_level" TEXT UNIQUE NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 働き方マスター
CREATE TABLE "work_styles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "category" TEXT NOT NULL,
    "work_style_name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `;

    const { error: masterError } = await supabase.rpc('exec', {
      sql: masterDataSchema,
    });
    if (masterError) {
      console.error('❌ マスターテーブル作成エラー:', masterError);
      return;
    }
    console.log('✅ マスターデータテーブル作成完了');

    // 拡張候補者テーブル作成
    const candidateSchema = `
-- 更新時刻の自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 候補者メインテーブル（拡張版）
CREATE TABLE "candidates" (
    -- 基本識別情報
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    
    -- 基本個人情報（変更不可）
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name_kana" TEXT NOT NULL,
    "first_name_kana" TEXT NOT NULL,
    "gender" TEXT CHECK ("gender" IN ('男性', '女性', '未回答')),
    "birth_year" INTEGER NOT NULL,
    "birth_month" INTEGER NOT NULL CHECK ("birth_month" BETWEEN 1 AND 12),
    "birth_day" INTEGER NOT NULL CHECK ("birth_day" BETWEEN 1 AND 31),
    "current_residence" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    
    -- 現在の状況
    "current_salary" TEXT NOT NULL CHECK ("current_salary" IN (
        '500万未満', '500~600万', '600~750万', '750~1,000万', '1,000~1.250万',
        '1250~1500万', '1500~2000万', '2000~3000万', '3000~5000万', '5000万~'
    )),
    
    -- 転職活動状況
    "job_change_experience" TEXT NOT NULL CHECK ("job_change_experience" IN ('あり', 'なし')),
    "desired_change_timing" TEXT NOT NULL CHECK ("desired_change_timing" IN (
        '3か月以内に', '6か月以内に', '1年以内に', '未定'
    )),
    "job_search_status" TEXT NOT NULL CHECK ("job_search_status" IN (
        'まだ始めていない', '情報収集中', '書類選考に進んでいる企業がある', 
        '面接・面談を受けている企業がある', '内定をもらっている'
    )),
    
    -- 直近の職歴
    "recent_company_name" TEXT NOT NULL,
    "recent_department_name" TEXT NOT NULL,
    "recent_position_name" TEXT,
    "employment_start_year" INTEGER NOT NULL,
    "employment_start_month" INTEGER NOT NULL CHECK ("employment_start_month" BETWEEN 1 AND 12),
    "employment_end_year" INTEGER,
    "employment_end_month" INTEGER CHECK ("employment_end_month" BETWEEN 1 AND 12),
    "is_currently_employed" BOOLEAN DEFAULT false,
    "recent_industry" TEXT NOT NULL,
    "recent_job_type" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    
    -- 学歴
    "final_education" TEXT NOT NULL,
    "school_name" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "graduation_year" INTEGER NOT NULL,
    "graduation_month" INTEGER NOT NULL CHECK ("graduation_month" BETWEEN 1 AND 12),
    
    -- 語学力
    "english_level" TEXT NOT NULL CHECK ("english_level" IN (
        'ネイティブ', 'ビジネス会話', '日常会話', '基礎会話', 'なし'
    )),
    
    -- スキル・資格
    "skills" TEXT[] NOT NULL DEFAULT '{}',
    "certifications" TEXT,
    
    -- 希望条件
    "desired_salary" TEXT NOT NULL CHECK ("desired_salary" IN (
        '問わない', '600万円以上', '700万円以上', '800万円以上', '900万円以上',
        '1000万円以上', '1100万円以上', '1200万円以上', '1300万円以上', '1400万円以上',
        '1500万円以上', '1600万円以上', '1700万円以上', '1800万円以上', '1900万円以上',
        '2000万円以上', '2100万円以上', '2200万円以上', '2300万円以上', '2400万円以上',
        '2500万円以上', '2600万円以上', '2700万円以上', '2800万円以上', '2900万円以上',
        '3000万円以上', '4000万円以上', '5000万円以上'
    )),
    "desired_industries" TEXT[] DEFAULT '{}',
    "desired_job_types" TEXT[] DEFAULT '{}',
    "desired_locations" TEXT[] DEFAULT '{}',
    "interested_work_styles" TEXT[] DEFAULT '{}',
    
    -- 追加情報
    "career_summary" TEXT,
    "self_pr" TEXT,
    "resume_file_path" TEXT,
    "career_history_file_path" TEXT,
    
    -- システム設定
    "scout_reception_enabled" BOOLEAN DEFAULT true,
    "email_notification_settings" JSONB DEFAULT '{}',
    "status" TEXT DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    
    -- タイムスタンプ
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "last_login_at" TIMESTAMP WITH TIME ZONE
);

-- 候補者の経験業種テーブル
CREATE TABLE "candidate_industry_experiences" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
    "industry" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL CHECK ("experience_years" >= 0),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 候補者の経験職種テーブル
CREATE TABLE "candidate_job_type_experiences" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
    "job_type" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL CHECK ("experience_years" >= 0),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 候補者の語学力テーブル（英語以外）
CREATE TABLE "candidate_languages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL CHECK ("level" IN (
        'ネイティブ', 'ビジネス会話', '日常会話', '基礎会話', 'なし'
    )),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 候補者の選考状況テーブル
CREATE TABLE "candidate_selection_statuses" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
    "company_name" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "position_name" TEXT,
    "selection_status" TEXT NOT NULL CHECK ("selection_status" IN (
        '書類選考', '一次面接', '二次面接', '最終面接', '内定'
    )),
    "disclosure_consent" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX "idx_candidates_email" ON "candidates"("email");
CREATE INDEX "idx_candidates_status" ON "candidates"("status");
CREATE INDEX "idx_candidates_current_residence" ON "candidates"("current_residence");
CREATE INDEX "idx_candidates_recent_industry" ON "candidates"("recent_industry");
CREATE INDEX "idx_candidates_recent_job_type" ON "candidates"("recent_job_type");
CREATE INDEX "idx_candidates_desired_salary" ON "candidates"("desired_salary");
CREATE INDEX "idx_candidates_job_search_status" ON "candidates"("job_search_status");

CREATE INDEX "idx_candidate_industry_experiences_candidate_id" ON "candidate_industry_experiences"("candidate_id");
CREATE INDEX "idx_candidate_job_type_experiences_candidate_id" ON "candidate_job_type_experiences"("candidate_id");
CREATE INDEX "idx_candidate_languages_candidate_id" ON "candidate_languages"("candidate_id");
CREATE INDEX "idx_candidate_selection_statuses_candidate_id" ON "candidate_selection_statuses"("candidate_id");

CREATE INDEX "idx_locations_region" ON "locations"("region");
CREATE INDEX "idx_industries_category" ON "industries"("category");
CREATE INDEX "idx_job_types_category" ON "job_types"("category");
CREATE INDEX "idx_work_styles_category" ON "work_styles"("category");

-- 更新時刻の自動更新トリガー
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON "candidates" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_selection_statuses_updated_at 
    BEFORE UPDATE ON "candidate_selection_statuses" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    const { error: candidateError } = await supabase.rpc('exec', {
      sql: candidateSchema,
    });
    if (candidateError) {
      console.error('❌ 候補者テーブル作成エラー:', candidateError);
      return;
    }
    console.log('✅ 候補者テーブル作成完了');

    // Step 3: マスターデータ投入
    console.log('📊 マスターデータを投入中...');

    // 地域データ投入（一部抜粋）
    const locationData = `
INSERT INTO "locations" ("region", "location_name", "sort_order") VALUES
('関東', '東京都', 1), ('関東', '神奈川', 2), ('関東', '埼玉', 3), ('関東', '千葉', 4),
('関西', '大阪', 5), ('関西', '京都', 6), ('関西', '兵庫', 7),
('東海', '愛知', 8), ('東海', '静岡', 9),
('九州', '福岡', 10), ('九州', '熊本', 11),
('北海道', '北海道', 12);
    `;

    // 業種データ投入（一部抜粋）
    const industryData = `
INSERT INTO "industries" ("category", "industry_name", "sort_order") VALUES
('IT・インターネット', 'インターネットサービス', 1),
('IT・インターネット', 'SIer', 2),
('IT・インターネット', 'ソフトウエア', 3),
('金融', '銀行・信託銀行', 4),
('金融', '証券', 5),
('メーカー', '電気・電子', 6),
('メーカー', '自動車・自動車部品', 7),
('コンサルティング', 'コンサルティング', 8);
    `;

    // 職種データ投入（一部抜粋）
    const jobTypeData = `
INSERT INTO "job_types" ("category", "job_type_name", "sort_order") VALUES
('IT技術職', 'フロントエンドエンジニア', 1),
('IT技術職', 'バックエンドエンジニア', 2),
('IT技術職', 'フルスタックエンジニア', 3),
('営業', '法人営業', 4),
('営業', '個人営業', 5),
('マーケティング', '商品企画', 6),
('経営', '経営企画・経営戦略', 7);
    `;

    // 学歴データ投入
    const educationData = `
INSERT INTO "education_levels" ("education_level", "sort_order") VALUES
('大学院博士課程修了', 1),
('大学院修士課程修了', 2),
('大学卒業', 3),
('短大卒業', 4),
('専門学校卒業', 5),
('高校卒業', 6);
    `;

    // 働き方データ投入
    const workStyleData = `
INSERT INTO "work_styles" ("category", "work_style_name", "sort_order") VALUES
('働き方・制度', 'フレックス制度で働きたい', 1),
('働き方・制度', 'リモートワークを希望', 2),
('組織・文化', 'フラットな組織文化で働きたい', 3),
('組織・文化', '成長フェーズの企業に興味がある', 4);
    `;

    const masterDataInserts = [
      locationData,
      industryData,
      jobTypeData,
      educationData,
      workStyleData,
    ];
    const masterDataNames = ['地域', '業種', '職種', '学歴', '働き方'];

    for (let i = 0; i < masterDataInserts.length; i++) {
      const { error } = await supabase.rpc('exec', {
        sql: masterDataInserts[i],
      });
      if (error) {
        console.error(`❌ ${masterDataNames[i]}データ投入エラー:`, error);
      } else {
        console.log(`✅ ${masterDataNames[i]}データ投入完了`);
      }
    }

    // Step 4: 検証
    console.log('\n🔍 データベース検証中...');

    const tables = [
      'locations',
      'industries',
      'job_types',
      'education_levels',
      'work_styles',
      'candidates',
      'candidate_industry_experiences',
      'candidate_job_type_experiences',
      'candidate_languages',
      'candidate_selection_statuses',
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      if (error) {
        console.error(`❌ ${table} 検証エラー:`, error);
      } else {
        console.log(`✅ ${table}: ${data?.length || 0} レコード`);
      }
    }

    console.log('\n🎉 データベースリセットと新スキーマ適用が完了しました！');
    console.log('📝 次のステップ: TypeScript型定義の生成');
    console.log('   pnpm run supabase:types');
  } catch (error) {
    console.error('❌ スキーマ適用中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
resetAndApplyNewSchema();
