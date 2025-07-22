#!/usr/bin/env node

/**
 * テストユーザー修正スクリプト
 * 既存のSupabase Authユーザーに対してデータベースレコードを追加
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

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

async function fixTestUsers() {
  console.log('🔧 テストユーザーのデータベースレコード修正を開始します...');

  try {
    // 既存のSupabase Authユーザーを取得
    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    const testUsers = authUsers.users.filter(
      user =>
        user.email?.includes('test-candidate@example.com') ||
        user.email?.includes('test-company@example.com')
    );

    console.log(`📋 見つかったテストユーザー: ${testUsers.length}件`);

    for (const authUser of testUsers) {
      console.log(`\n🔧 修正中: ${authUser.email}`);

      const userType = authUser.user_metadata?.userType;
      const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

      if (userType === 'candidate') {
        // 候補者データの挿入
        const { error: candidateError } = await supabaseAdmin
          .from('candidates')
          .upsert(
            {
              id: authUser.id,
              email: authUser.email,
              password_hash: hashedPassword,
              last_name: '山田',
              first_name: '太郎',
              last_name_kana: 'ヤマダ',
              first_name_kana: 'タロウ',
              gender: 'MALE',
              phone_number: '090-1234-5678',
              birth_date: '1990-01-01',
              current_residence: '東京都千代田区',
              status: 'ACTIVE',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'id',
            }
          );

        if (candidateError) {
          console.error(`❌ 候補者データ挿入エラー: ${candidateError.message}`);
        } else {
          console.log(`✅ 候補者データ挿入成功: ${authUser.email}`);
        }
      } else if (userType === 'company_user') {
        // 企業アカウント作成
        const companyAccountId = crypto.randomUUID();

        const { error: companyError } = await supabaseAdmin
          .from('company_accounts')
          .upsert(
            {
              id: companyAccountId,
              company_name: 'テスト企業株式会社',
              headquarters_address: '東京都千代田区丸の内1-1-1',
              representative_name: '代表取締役 テスト太郎',
              industry: 'IT・通信',
              company_overview: 'テスト用の企業アカウントです',
              appeal_points: '優秀な人材を募集中',
              status: 'ACTIVE',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'id',
            }
          );

        if (companyError) {
          console.error(`❌ 企業アカウント作成エラー: ${companyError.message}`);
          continue;
        } else {
          console.log(`✅ 企業アカウント作成成功: ${companyAccountId}`);
        }

        // 企業ユーザーデータの挿入
        const { error: companyUserError } = await supabaseAdmin
          .from('company_users')
          .upsert(
            {
              id: authUser.id,
              company_account_id: companyAccountId,
              email: authUser.email,
              password_hash: hashedPassword,
              full_name: '田中花子',
              position_title: '人事マネージャー',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'id',
            }
          );

        if (companyUserError) {
          console.error(
            `❌ 企業ユーザーデータ挿入エラー: ${companyUserError.message}`
          );
        } else {
          console.log(`✅ 企業ユーザーデータ挿入成功: ${authUser.email}`);
        }
      }
    }

    console.log('\n🎉 テストユーザーの修正が完了しました！');
  } catch (error) {
    console.error('❌ 修正スクリプト実行エラー:', error);
  }
}

// 追加: yuto.suda1024@gmail.com の初期化
(async () => {
  const email = 'yuto.suda1024@gmail.com';
  const newPassword = 'TestPassword2024!';
  const fullName = '須田悠人';
  const positionTitle = 'テスト担当者';
  const companyAccountId = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Supabase Authユーザー取得
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.listUsers();
  if (userError) {
    console.error('❌ ユーザー一覧取得エラー:', userError.message);
    return;
  }
  const user = userData.users.find(u => u.email === email);
  if (!user) {
    console.error('❌ 指定メールのユーザーが見つかりません:', email);
    return;
  }

  // 企業アカウント再作成
  const { error: companyError } = await supabaseAdmin
    .from('company_accounts')
    .upsert(
      {
        id: companyAccountId,
        company_name: 'テスト企業株式会社',
        headquarters_address: '東京都千代田区丸の内1-1-1',
        representative_name: '代表取締役 テスト太郎',
        industry: 'IT・通信',
        company_overview: 'テスト用の企業アカウントです',
        appeal_points: '優秀な人材を募集中',
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  if (companyError) {
    console.error('❌ 企業アカウント作成エラー:', companyError.message);
    return;
  }

  // company_usersを初期化
  const { error: companyUserError } = await supabaseAdmin
    .from('company_users')
    .upsert(
      {
        id: user.id,
        company_account_id: companyAccountId,
        email: email,
        password_hash: hashedPassword,
        full_name: fullName,
        position_title: positionTitle,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  if (companyUserError) {
    console.error(
      '❌ 企業ユーザーデータ初期化エラー:',
      companyUserError.message
    );
    return;
  }
  console.log(
    '✅ yuto.suda1024@gmail.com のアカウント初期化・パスワードリセット完了'
  );
})();

// スクリプト実行
fixTestUsers().catch(error => {
  console.error('❌ スクリプト実行エラー:', error);
  process.exit(1);
});
