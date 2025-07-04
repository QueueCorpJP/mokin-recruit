#!/usr/bin/env node

/**
 * テストユーザー作成スクリプト
 * 開発環境でのログインテスト用にユーザーを作成
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// UUID生成関数
function generateUUID() {
  return crypto.randomUUID();
}

// Supabase設定
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY が設定されていません');
  process.exit(1);
}

// Supabase Admin クライアント
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// テストユーザーデータ
const testUsers = [
  {
    email: 'test-candidate@example.com',
    password: 'TestPassword123!',
    userType: 'candidate',
    profile: {
      lastName: '山田',
      firstName: '太郎',
      lastNameKana: 'ヤマダ',
      firstNameKana: 'タロウ',
      gender: 'MALE',
      phoneNumber: '090-1234-5678',
      birthDate: '1990-01-01',
      currentResidence: '東京都千代田区',
    },
  },
  {
    email: 'test-company@example.com',
    password: 'TestPassword123!',
    userType: 'company_user',
    profile: {
      fullName: '田中花子',
      companyAccountId: generateUUID(), // UUID生成
      positionTitle: '人事マネージャー',
    },
  },
];

async function createTestUsers() {
  console.log('🚀 テストユーザー作成を開始します...');

  for (const userData of testUsers) {
    try {
      console.log(`📝 ユーザー作成中: ${userData.email}`);

      // Supabase Authにユーザーを作成
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // メール確認をスキップ
          user_metadata: {
            userType: userData.userType,
            fullName:
              userData.userType === 'candidate'
                ? `${userData.profile.lastName} ${userData.profile.firstName}`
                : userData.profile.fullName,
            createdForTesting: true,
          },
        });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  ユーザーは既に存在します: ${userData.email}`);
          continue;
        }
        throw authError;
      }

      console.log(`✅ Supabase Authユーザー作成成功: ${userData.email}`);

      // パスワードハッシュ化
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // データベースにユーザー情報を挿入
      if (userData.userType === 'candidate') {
        // 候補者テーブルに挿入（実際のスキーマに合わせて修正）
        const { error: candidateError } = await supabaseAdmin
          .from('candidates')
          .insert({
            id: authData.user.id,
            email: userData.email,
            password_hash: hashedPassword,
            last_name: userData.profile.lastName,
            first_name: userData.profile.firstName,
            last_name_kana: userData.profile.lastNameKana,
            first_name_kana: userData.profile.firstNameKana,
            gender: userData.profile.gender,
            phone_number: userData.profile.phoneNumber,
            birth_date: userData.profile.birthDate,
            current_residence: userData.profile.currentResidence,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (candidateError) {
          console.error(`❌ 候補者データ挿入エラー: ${candidateError.message}`);
        } else {
          console.log(`✅ 候補者データ挿入成功: ${userData.email}`);
        }
      } else if (userData.userType === 'company_user') {
        // 企業アカウントが存在しない場合は作成
        const { data: existingCompany } = await supabaseAdmin
          .from('company_accounts')
          .select('id')
          .eq('id', userData.profile.companyAccountId)
          .single();

        if (!existingCompany) {
          const { error: companyError } = await supabaseAdmin
            .from('company_accounts')
            .insert({
              id: userData.profile.companyAccountId,
              company_name: 'テスト企業株式会社',
              headquarters_address: '東京都千代田区丸の内1-1-1',
              representative_name: '代表取締役 テスト太郎',
              industry: 'IT・通信',
              company_overview: 'テスト用の企業アカウントです',
              appeal_points: '優秀な人材を募集中',
              status: 'ACTIVE',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (companyError) {
            console.error(
              `❌ 企業アカウント作成エラー: ${companyError.message}`
            );
          } else {
            console.log(
              `✅ 企業アカウント作成成功: ${userData.profile.companyAccountId}`
            );
          }
        }

        // 企業ユーザーテーブルに挿入
        const { error: companyUserError } = await supabaseAdmin
          .from('company_users')
          .insert({
            id: authData.user.id,
            company_account_id: userData.profile.companyAccountId,
            email: userData.email,
            password_hash: hashedPassword,
            full_name: userData.profile.fullName,
            position_title: userData.profile.positionTitle,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (companyUserError) {
          console.error(
            `❌ 企業ユーザーデータ挿入エラー: ${companyUserError.message}`
          );
        } else {
          console.log(`✅ 企業ユーザーデータ挿入成功: ${userData.email}`);
        }
      }

      console.log(`🎉 テストユーザー作成完了: ${userData.email}`);
    } catch (error) {
      console.error(
        `❌ ユーザー作成エラー (${userData.email}):`,
        error.message
      );
    }
  }

  console.log('\n🎯 テストユーザー作成完了！');
  console.log('\n📋 作成されたテストユーザー:');
  testUsers.forEach(user => {
    console.log(`  📧 ${user.email}`);
    console.log(`  🔑 ${user.password}`);
    console.log(`  👤 ${user.userType}`);
    console.log('');
  });
}

// スクリプト実行
createTestUsers().catch(error => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
