#!/usr/bin/env node

/**
 * 不足しているテーブル作成スクリプト
 * job_postings, company_accounts, favorites テーブルを作成
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 環境変数が設定されていません');
  console.error('SUPABASE_URL:', SUPABASE_URL ? '設定済み' : '未設定');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定');
  process.exit(1);
}

async function createMissingTables() {
  console.log('🚀 不足しているテーブルを作成します...\n');

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 企業アカウントテーブル
    const companyAccountsSchema = `
CREATE TABLE IF NOT EXISTS "company_accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_name" TEXT NOT NULL,
    "headquarters_address" TEXT,
    "representative_name" TEXT,
    "industry" TEXT,
    "company_overview" TEXT,
    "appeal_points" TEXT,
    "status" TEXT DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_company_accounts_status" ON "company_accounts"("status");
CREATE INDEX IF NOT EXISTS "idx_company_accounts_industry" ON "company_accounts"("industry");
    `;

    // 企業ユーザーテーブル
    const companyUsersSchema = `
CREATE TABLE IF NOT EXISTS "company_users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
    "email" TEXT UNIQUE NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "position_title" TEXT,
    "status" TEXT DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_company_users_email" ON "company_users"("email");
CREATE INDEX IF NOT EXISTS "idx_company_users_company_account_id" ON "company_users"("company_account_id");
CREATE INDEX IF NOT EXISTS "idx_company_users_status" ON "company_users"("status");
    `;

    // 求人投稿テーブル
    const jobPostingsSchema = `
CREATE TABLE IF NOT EXISTS "job_postings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_account_id" UUID NOT NULL REFERENCES "company_accounts"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "position_summary" TEXT,
    "job_description" TEXT NOT NULL,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "employment_type" TEXT CHECK ("employment_type" IN ('正社員', '契約社員', '派遣社員', '業務委託', 'アルバイト・パート')),
    "work_location" TEXT,
    "remote_work_available" BOOLEAN DEFAULT false,
    "job_type" TEXT,
    "industry" TEXT,
    "application_deadline" DATE,
    "status" TEXT DEFAULT 'DRAFT' CHECK ("status" IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED')),
    "appeal_points" TEXT[],
    "image_urls" TEXT[],
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_job_postings_company_account_id" ON "job_postings"("company_account_id");
CREATE INDEX IF NOT EXISTS "idx_job_postings_status" ON "job_postings"("status");
CREATE INDEX IF NOT EXISTS "idx_job_postings_job_type" ON "job_postings"("job_type");
CREATE INDEX IF NOT EXISTS "idx_job_postings_industry" ON "job_postings"("industry");
CREATE INDEX IF NOT EXISTS "idx_job_postings_work_location" ON "job_postings"("work_location");
    `;

    // お気に入りテーブル
    const favoritesSchema = `
CREATE TABLE IF NOT EXISTS "favorites" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_id" UUID NOT NULL REFERENCES "candidates"("id") ON DELETE CASCADE,
    "job_posting_id" UUID NOT NULL REFERENCES "job_postings"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("candidate_id", "job_posting_id")
);

CREATE INDEX IF NOT EXISTS "idx_favorites_candidate_id" ON "favorites"("candidate_id");
CREATE INDEX IF NOT EXISTS "idx_favorites_job_posting_id" ON "favorites"("job_posting_id");
    `;

    // メッセージテーブル
    const messagesSchema = `
CREATE TABLE IF NOT EXISTS "messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID NOT NULL,
    "sender_type" TEXT NOT NULL CHECK ("sender_type" IN ('candidate', 'company_user')),
    "receiver_type" TEXT NOT NULL CHECK ("receiver_type" IN ('candidate', 'company_user')),
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_messages_sender_id" ON "messages"("sender_id");
CREATE INDEX IF NOT EXISTS "idx_messages_receiver_id" ON "messages"("receiver_id");
CREATE INDEX IF NOT EXISTS "idx_messages_created_at" ON "messages"("created_at");
    `;

    // 更新時刻の自動更新トリガー
    const triggersSchema = `
CREATE TRIGGER IF NOT EXISTS update_company_accounts_updated_at 
    BEFORE UPDATE ON "company_accounts" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_company_users_updated_at 
    BEFORE UPDATE ON "company_users" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_job_postings_updated_at 
    BEFORE UPDATE ON "job_postings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_messages_updated_at 
    BEFORE UPDATE ON "messages" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    const schemas = [
      { name: '企業アカウント', sql: companyAccountsSchema },
      { name: '企業ユーザー', sql: companyUsersSchema },
      { name: '求人投稿', sql: jobPostingsSchema },
      { name: 'お気に入り', sql: favoritesSchema },
      { name: 'メッセージ', sql: messagesSchema },
      { name: 'トリガー', sql: triggersSchema },
    ];

    for (const schema of schemas) {
      console.log(`📝 ${schema.name}テーブルを作成中...`);
      const { error } = await supabase.rpc('exec', { sql: schema.sql });
      if (error) {
        console.error(`❌ ${schema.name}テーブル作成エラー:`, error);
        return;
      }
      console.log(`✅ ${schema.name}テーブル作成完了`);
    }

    // テストデータの投入
    console.log('\n📊 テストデータを投入中...');

    // テスト企業アカウント
    const testCompanyId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    const testCompanyData = `
INSERT INTO "company_accounts" ("id", "company_name", "headquarters_address", "representative_name", "industry", "company_overview", "appeal_points", "status")
VALUES (
    '${testCompanyId}',
    'テスト株式会社',
    '東京都千代田区丸の内1-1-1',
    '代表取締役 テスト太郎',
    'IT・通信',
    'テスト用の企業です。革新的なソリューションを提供しています。',
    'フレックス制度、リモートワーク可能、充実した福利厚生',
    'ACTIVE'
) ON CONFLICT (id) DO NOTHING;
    `;

    // テスト求人データ
    const testJobId = '4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91';
    const testJobData = `
INSERT INTO "job_postings" ("id", "company_account_id", "title", "position_summary", "job_description", "salary_min", "salary_max", "employment_type", "work_location", "remote_work_available", "job_type", "industry", "status", "appeal_points", "image_urls")
VALUES (
    '${testJobId}',
    '${testCompanyId}',
    'フロントエンドエンジニア',
    'React/TypeScriptを使用したWebアプリケーション開発',
    'モダンなフロントエンド技術を使用して、ユーザーフレンドリーなWebアプリケーションを開発していただきます。チームでの開発経験があり、新しい技術に積極的に取り組める方を募集しています。',
    6000000,
    10000000,
    '正社員',
    '東京都渋谷区',
    true,
    'フロントエンドエンジニア',
    'IT・通信',
    'PUBLISHED',
    ARRAY['リモートワーク可能', 'フレックス制度', '最新技術導入'],
    ARRAY['https://example.com/image1.jpg']
) ON CONFLICT (id) DO NOTHING;
    `;

    // 追加のテスト求人データ
    const additionalJobsData = `
INSERT INTO "job_postings" ("company_account_id", "title", "position_summary", "job_description", "salary_min", "salary_max", "employment_type", "work_location", "remote_work_available", "job_type", "industry", "status", "appeal_points")
VALUES 
(
    '${testCompanyId}',
    'バックエンドエンジニア',
    'Node.js/TypeScriptを使用したAPI開発',
    'スケーラブルなバックエンドシステムの設計・開発を担当していただきます。',
    7000000,
    12000000,
    '正社員',
    '東京都渋谷区',
    true,
    'バックエンドエンジニア',
    'IT・通信',
    'PUBLISHED',
    ARRAY['リモートワーク可能', 'フレックス制度', '技術力向上支援']
),
(
    '${testCompanyId}',
    'プロダクトマネージャー',
    'プロダクトの企画・戦略立案',
    'プロダクトの方向性を決定し、開発チームと連携してプロダクトを成功に導いていただきます。',
    8000000,
    15000000,
    '正社員',
    '東京都渋谷区',
    false,
    'プロダクトマネージャー',
    'IT・通信',
    'PUBLISHED',
    ARRAY['裁量権大', '成長企業', '新規事業']
);
    `;

    const testDataInserts = [
      { name: 'テスト企業', sql: testCompanyData },
      { name: 'テスト求人（指定ID）', sql: testJobData },
      { name: '追加テスト求人', sql: additionalJobsData },
    ];

    for (const testData of testDataInserts) {
      console.log(`📊 ${testData.name}データを投入中...`);
      const { error } = await supabase.rpc('exec', { sql: testData.sql });
      if (error) {
        console.error(`❌ ${testData.name}データ投入エラー:`, error);
      } else {
        console.log(`✅ ${testData.name}データ投入完了`);
      }
    }

    // 検証
    console.log('\n🔍 データベース検証中...');

    const tables = [
      'company_accounts',
      'company_users', 
      'job_postings',
      'favorites'
    ];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.error(`❌ ${table} 検証エラー:`, error);
      } else {
        console.log(`✅ ${table}: ${count} レコード`);
      }
    }

    // 特定の求人IDが存在するかチェック
    const { data: specificJob, error: jobError } = await supabase
      .from('job_postings')
      .select('id, title, status')
      .eq('id', testJobId)
      .single();

    if (jobError) {
      console.error(`❌ 特定求人(${testJobId})の確認エラー:`, jobError);
    } else {
      console.log(`✅ 特定求人確認: ${specificJob.title} (${specificJob.status})`);
    }

    console.log('\n🎉 不足しているテーブルの作成とテストデータ投入が完了しました！');
    console.log(`📝 テスト求人ID: ${testJobId}`);
    console.log('🔧 これでお気に入り機能のテストが可能になります。');

  } catch (error) {
    console.error('❌ テーブル作成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
createMissingTables();