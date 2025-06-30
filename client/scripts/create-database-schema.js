#!/usr/bin/env node

/**
 * Supabase Database Schema Creator
 *
 * このスクリプトは、Supabase SQL APIを使用して
 * データベーススキーマを作成します。
 */

// fs, path は削除（直接テーブル定義を使用するため不要）

// 環境変数の読み込み
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 環境変数が設定されていません:');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅ 設定済み' : '❌ 未設定');
  console.error(
    '   SUPABASE_SERVICE_ROLE_KEY:',
    SUPABASE_SERVICE_ROLE_KEY ? '✅ 設定済み' : '❌ 未設定'
  );
  console.error('\n📝 .env.local ファイルに以下を設定してください:');
  console.error('   SUPABASE_URL=https://your-project.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// readSQLFile関数は削除（直接テーブル定義を使用）

// 未使用関数は削除（将来的に必要な場合は復活可能）

/**
 * 代替方法: Supabase Clientを使用した直接実行
 */
async function executeSchemaWithSupabaseClient() {
  console.log('🚀 Supabase Clientを使用してスキーマを作成します...\n');

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // SQLを実行
    console.log('📝 SQLスキーマを実行中...');

    // 個別のテーブル作成SQLを実行
    const tableStatements = [
      // candidates テーブル
      `CREATE TABLE IF NOT EXISTS "candidates" (
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
      );`,

      // company_accounts テーブル
      `CREATE TABLE IF NOT EXISTS "company_accounts" (
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
      );`,

      // company_users テーブル
      `CREATE TABLE IF NOT EXISTS "company_users" (
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
      );`,

      // job_postings テーブル
      `CREATE TABLE IF NOT EXISTS "job_postings" (
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
      );`,

      // messages テーブル
      `CREATE TABLE IF NOT EXISTS "messages" (
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
      );`,
    ];

    // 各テーブルを順番に作成
    for (let i = 0; i < tableStatements.length; i++) {
      const tableName = [
        'candidates',
        'company_accounts',
        'company_users',
        'job_postings',
        'messages',
      ][i];
      console.log(`🔄 作成中: ${tableName} テーブル`);

      const { error } = await supabase.rpc('exec', {
        sql: tableStatements[i],
      });

      if (error) {
        console.error(`❌ ${tableName} テーブル作成エラー:`, error);
      } else {
        console.log(`✅ ${tableName} テーブル作成成功`);
      }
    }

    console.log('\n🎉 データベーススキーマの作成が完了しました！');
  } catch (error) {
    console.error('❌ スキーマ作成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log('🚀 Mokin Recruit - Database Schema Creator\n');

  try {
    await executeSchemaWithSupabaseClient();
  } catch (error) {
    console.error('❌ 実行エラー:', error.message);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}
