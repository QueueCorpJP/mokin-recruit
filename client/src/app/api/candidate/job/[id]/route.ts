import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== Candidate Job Detail API Started ===');
    const resolvedParams = await params;
    console.log('Job ID:', resolvedParams.id);

    const supabase = getSupabaseAdminClient();
    
    // 求人詳細を取得
    const { data: job, error: jobError } = await supabase
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
        status
      `)
      .eq('id', resolvedParams.id)
      .neq('status', 'DRAFT')
      .single();

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
      .single();

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