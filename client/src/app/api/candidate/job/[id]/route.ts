import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== Candidate Job Detail API Started ===');
    const resolvedParams = await params;
    console.log('Job ID:', resolvedParams.id);

    // JWT認証（認証されていないユーザーは一般公開のみ閲覧可能）
    const validationResult = await validateJWT(request);
    const isAuthenticated = validationResult.isValid && validationResult.candidateId;
    
    console.log('Authentication status:', {
      isAuthenticated,
      candidateId: validationResult.candidateId
    });

    const supabase = getSupabaseAdminClient();
    
    // 求人詳細を取得
    let jobQuery = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        job_description,
        position_summary,
        required_skills,
        preferred_skills,

        salary_min,
        salary_max,
        salary_note,
        employment_type,
        employment_type_note,
        work_location,
        location_note,
        working_hours,
        overtime,
        overtime_info,

        holidays,
        selection_process,
        appeal_points,
        smoking_policy,
        smoking_policy_note,
        required_documents,
        remote_work_available,
        job_type,
        industry,
        application_deadline,
        created_at,
        updated_at,
        published_at,
        image_urls,
        company_account_id,
        status,
        publication_type
      `)
      .eq('id', resolvedParams.id)
      .eq('status', 'PUBLISHED');

    // 公開範囲による制限
    if (isAuthenticated) {
      // 認証済みユーザーは 一般公開 + 登録会員限定 を閲覧可能
      jobQuery = jobQuery.in('publication_type', ['public', 'members']);
    } else {
      // 未認証ユーザーは 一般公開のみ
      jobQuery = jobQuery.eq('publication_type', 'public');
    }

    // 応募期限チェック（期限が設定されていない場合は無制限とする）
    const now = new Date().toISOString();
    jobQuery = jobQuery.or(`application_deadline.is.null,application_deadline.gte.${now}`);

    const { data: job, error: jobError } = await jobQuery.single();

    if (jobError || !job) {
      console.error('Failed to fetch job:', jobError);
      return NextResponse.json(
        { success: false, error: '求人情報が見つかりませんでした' },
        { status: 404 }
      );
    }

    // 会社情報を取得
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select(`
        id,
        company_name,
        representative_name,
        industry,
        company_overview,
        headquarters_address,
        status,
        created_at,
        updated_at
      `)
      .eq('id', job.company_account_id)
      .maybeSingle();

    if (companyError) {
      console.error('Failed to fetch company:', companyError);
    }

    // 求人データに会社情報を追加
    const jobWithCompany = {
      ...job,
      company_name: company?.company_name || '企業名未設定',
      // 会社情報
      representative_name: company?.representative_name,
      company_industry: company?.industry,
      company_overview: company?.company_overview,
      headquarters_address: company?.headquarters_address,
      company_status: company?.status
    };

    console.log('Successfully fetched job details for ID:', resolvedParams.id);

    return NextResponse.json({
      success: true,
      data: jobWithCompany
    });

  } catch (error) {
    console.error('Candidate job detail error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}