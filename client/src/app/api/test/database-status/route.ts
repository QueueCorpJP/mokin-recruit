import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/server/database/supabase';

/**
 * データベースの状況確認用テストエンドポイント
 * 開発環境でのデバッグ用
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const results: any = {
      timestamp: new Date().toISOString(),
      tables: {},
      errors: []
    };

    // テーブル一覧とレコード数を確認
    const tablesToCheck = [
      'candidates',
      'company_accounts', 
      'company_users',
      'job_postings',
      'favorites',
      'locations',
      'industries',
      'job_types',
      'education_levels',
      'work_styles'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          results.tables[tableName] = {
            exists: false,
            error: error.message,
            errorCode: error.code
          };
          results.errors.push(`${tableName}: ${error.message}`);
        } else {
          results.tables[tableName] = {
            exists: true,
            count: count || 0
          };
        }
      } catch (err: any) {
        results.tables[tableName] = {
          exists: false,
          error: err.message
        };
        results.errors.push(`${tableName}: ${err.message}`);
      }
    }

    // 特定の求人IDをチェック
    const testJobId = '4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91';
    if (results.tables.job_postings?.exists) {
      try {
        const { data: jobData, error: jobError } = await supabase
          .from('job_postings')
          .select('id, title, status, company_account_id')
          .eq('id', testJobId)
          .single();

        results.specificJob = {
          id: testJobId,
          exists: !jobError,
          data: jobData,
          error: jobError?.message
        };
      } catch (err: any) {
        results.specificJob = {
          id: testJobId,
          exists: false,
          error: err.message
        };
      }
    }

    // 公開求人の数をチェック
    if (results.tables.job_postings?.exists) {
      try {
        const { count: publishedCount, error: publishedError } = await supabase
          .from('job_postings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'PUBLISHED');

        results.publishedJobs = {
          count: publishedCount || 0,
          error: publishedError?.message
        };
      } catch (err: any) {
        results.publishedJobs = {
          count: 0,
          error: err.message
        };
      }
    }

    // 候補者データの確認
    if (results.tables.candidates?.exists) {
      try {
        const { count: candidateCount, error: candidateError } = await supabase
          .from('candidates')
          .select('*', { count: 'exact', head: true });

        results.candidates = {
          count: candidateCount || 0,
          error: candidateError?.message
        };
      } catch (err: any) {
        results.candidates = {
          count: 0,
          error: err.message
        };
      }
    }

    // 全体的な健全性チェック
    const missingTables = Object.entries(results.tables)
      .filter(([_, info]: [string, any]) => !info.exists)
      .map(([name, _]) => name);

    results.summary = {
      totalTables: tablesToCheck.length,
      existingTables: tablesToCheck.length - missingTables.length,
      missingTables: missingTables,
      hasErrors: results.errors.length > 0,
      isHealthy: missingTables.length === 0 && results.errors.length === 0
    };

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error: any) {
    console.error('データベース状況確認エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'データベース状況の確認中にエラーが発生しました',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * テストデータ作成エンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { action } = body;

    if (action === 'create-test-job') {
      // テスト求人を作成
      const testCompanyId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const testJobId = '4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91';

      // 企業アカウントを作成（存在しない場合）
      const { error: companyError } = await supabase
        .from('company_accounts')
        .upsert({
          id: testCompanyId,
          company_name: 'テスト株式会社',
          headquarters_address: '東京都千代田区丸の内1-1-1',
          representative_name: '代表取締役 テスト太郎',
          industry: 'IT・通信',
          company_overview: 'テスト用の企業です。',
          appeal_points: 'フレックス制度、リモートワーク可能',
          status: 'ACTIVE'
        });

      if (companyError) {
        return NextResponse.json(
          {
            success: false,
            error: '企業アカウント作成エラー',
            details: companyError.message
          },
          { status: 500 }
        );
      }

      // テスト求人を作成
      const { error: jobError } = await supabase
        .from('job_postings')
        .upsert({
          id: testJobId,
          company_account_id: testCompanyId,
          title: 'フロントエンドエンジニア',
          position_summary: 'React/TypeScriptを使用したWebアプリケーション開発',
          job_description: 'モダンなフロントエンド技術を使用して、ユーザーフレンドリーなWebアプリケーションを開発していただきます。',
          salary_min: 6000000,
          salary_max: 10000000,
          employment_type: '正社員',
          work_location: '東京都渋谷区',
          remote_work_available: true,
          job_type: 'フロントエンドエンジニア',
          industry: 'IT・通信',
          status: 'PUBLISHED',
          appeal_points: ['リモートワーク可能', 'フレックス制度', '最新技術導入']
        });

      if (jobError) {
        return NextResponse.json(
          {
            success: false,
            error: 'テスト求人作成エラー',
            details: jobError.message
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'テストデータを作成しました',
        data: {
          companyId: testCompanyId,
          jobId: testJobId
        }
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: '無効なアクションです'
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('テストデータ作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'テストデータ作成中にエラーが発生しました',
        details: error.message
      },
      { status: 500 }
    );
  }
}