import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';
import { logger } from '@/lib/server/utils/logger';

interface ApplicationRequestBody {
  job_posting_id: string;
  resume_url?: string;
  career_history_url?: string;
  application_message?: string;
}

/**
 * 候補者の求人応募API
 * POST /api/candidate/application
 */
export async function POST(request: NextRequest) {
  try {
    logger.info('=== Application submission started ===');

    // JWT認証
    const validationResult = await validateJWT(request);
    if (!validationResult.isValid || !validationResult.candidateId) {
      logger.warn('Invalid authentication for application submission');
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }

    const candidateId = validationResult.candidateId;
    logger.info(`Application attempt by candidate: ${candidateId}`);

    // リクエストボディの取得
    const body: ApplicationRequestBody = await request.json();
    const { job_posting_id, resume_url, career_history_url, application_message } = body;

    if (!job_posting_id) {
      return NextResponse.json(
        { success: false, error: '求人IDが必要です' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // 求人情報を取得
    const { data: jobPosting, error: jobError } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        company_account_id,
        company_group_id,
        status
      `)
      .eq('id', job_posting_id)
      .maybeSingle();

    if (jobError || !jobPosting) {
      logger.error('Failed to fetch job posting:', jobError);
      return NextResponse.json(
        { success: false, error: '求人情報が見つかりませんでした' },
        { status: 404 }
      );
    }

    // 求人がアクティブかどうかチェック
    if (jobPosting.status !== 'PUBLISHED') {
      return NextResponse.json(
        { success: false, error: 'この求人は現在応募できません' },
        { status: 400 }
      );
    }

    // company_group_idが存在するかチェック、存在しない場合はデフォルトグループを作成
    let validCompanyGroupId = jobPosting.company_group_id;
    let companyUserId = null;
    
    if (jobPosting.company_group_id) {
      // まずcompany_groupsテーブルで確認
      const { data: existingGroup, error: groupCheckError } = await supabase
        .from('company_groups')
        .select('id, company_account_id')
        .eq('id', jobPosting.company_group_id)
        .maybeSingle();
        
      if (groupCheckError || !existingGroup) {
        logger.warn(`Company group ${jobPosting.company_group_id} not found, creating default group`);
        
        // デフォルトのcompany_groupを作成
        const { data: newGroup, error: createGroupError } = await supabase
          .from('company_groups')
          .insert({
            id: jobPosting.company_group_id,
            company_account_id: jobPosting.company_account_id,
            group_name: '採用チーム',
            description: '自動作成された採用チーム'
          })
          .select('id')
          .maybeSingle();
          
        if (createGroupError || !newGroup) {
          logger.error('Failed to create company group:', createGroupError);
          return NextResponse.json(
            { success: false, error: '企業グループ情報の作成に失敗しました' },
            { status: 500 }
          );
        }
        
        validCompanyGroupId = newGroup.id;
      }
    }
    
    // 該当会社の最初のユーザーを取得（company_user_idとして使用）
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('id')
      .eq('company_account_id', jobPosting.company_account_id)
      .limit(1)
      .maybeSingle();

    if (companyUserError || !companyUser) {
      logger.error('Failed to fetch company user:', companyUserError);
      return NextResponse.json(
        { success: false, error: '企業ユーザー情報が見つかりませんでした' },
        { status: 404 }
      );
    }
    
    companyUserId = companyUser.id;

    // 既に応募済みかどうかチェック
    const { data: existingApplication, error: checkError } = await supabase
      .from('application')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', job_posting_id)
      .maybeSingle();

    if (checkError) {
      logger.error('Failed to check existing application:', checkError);
      return NextResponse.json(
        { success: false, error: 'サーバーエラーが発生しました' },
        { status: 500 }
      );
    }

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'この求人には既に応募済みです' },
        { status: 400 }
      );
    }

    // applicationテーブルに応募情報を保存
    const { data: application, error: applicationError } = await supabase
      .from('application')
      .insert({
        candidate_id: candidateId,
        job_posting_id,
        company_account_id: jobPosting.company_account_id,
        company_group_id: validCompanyGroupId,
        company_user_id: companyUserId,
        resume_url: resume_url || null,
        career_history_url: career_history_url || null,
        application_message: application_message || null,
        status: 'SENT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (applicationError) {
      logger.error('Failed to create application:', applicationError);
      return NextResponse.json(
        { success: false, error: '応募の送信に失敗しました' },
        { status: 500 }
      );
    }

    logger.info(`Application created successfully:`, {
      applicationId: application.id,
      candidateId,
      jobPostingId: job_posting_id
    });

    return NextResponse.json({
      success: true,
      data: {
        application_id: application.id,
        job_title: jobPosting.title,
        status: 'SENT',
        applied_at: application.created_at
      },
      message: '応募が完了しました'
    });

  } catch (error) {
    logger.error('Application submission error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * 候補者の応募履歴取得API
 * GET /api/candidate/application
 */
export async function GET(request: NextRequest) {
  try {
    // JWT認証
    const validationResult = await validateJWT(request);
    if (!validationResult.isValid || !validationResult.candidateId) {
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }

    const candidateId = validationResult.candidateId;
    const supabase = getSupabaseAdminClient();

    // 候補者の応募履歴を取得
    const { data: applications, error } = await supabase
      .from('application')
      .select(`
        id,
        job_posting_id,
        application_message,
        status,
        created_at,
        updated_at,
        job_postings!inner(
          id,
          title,
          company_account_id,
          company_accounts!inner(
            company_name
          )
        )
      `)
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch applications:', error);
      return NextResponse.json(
        { success: false, error: '応募履歴の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: applications
    });

  } catch (error) {
    logger.error('Get applications error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}