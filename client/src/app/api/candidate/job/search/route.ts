import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Candidate Job Search API Started ===');

    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    
    // 検索パラメータを取得
    const keyword = searchParams.get('keyword');
    const location = searchParams.get('location');
    const salaryMin = searchParams.get('salaryMin');
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;

    // 基本クエリ：公開されている求人のみ
    let query = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        job_description,
        required_skills,
        preferred_skills,
        salary_min,
        salary_max,
        salary_note,
        employment_type,
        work_location,
        remote_work_available,
        job_type,
        industry,
        position_summary,
        location_note,
        employment_type_note,
        working_hours,
        overtime_info,
        holidays,
        selection_process,
        appeal_points,
        smoking_policy,
        smoking_policy_note,
        application_deadline,
        created_at,
        updated_at,
        published_at,
        image_urls,
        company_account_id
      `)
      .neq('status', 'DRAFT')
      .order('created_at', { ascending: false });

    // キーワード検索
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,job_description.ilike.%${keyword}%,required_skills.ilike.%${keyword}%,preferred_skills.ilike.%${keyword}%`
      );
    }

    // 勤務地検索
    if (location) {
      query = query.ilike('work_location', `%${location}%`);
    }

    // 最低年収フィルター
    if (salaryMin) {
      const minSalary = parseInt(salaryMin);
      query = query.gte('salary_min', minSalary);
    }

    // 業界フィルター
    if (industries.length > 0) {
      query = query.in('industry', industries);
    }

    // 職種フィルター
    if (jobTypes.length > 0) {
      query = query.in('job_type', jobTypes);
    }

    // ページネーション
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      console.error('Failed to fetch jobs:', jobsError);
      return NextResponse.json(
        { success: false, error: '求人情報の取得に失敗しました' },
        { status: 500 }
      );
    }


    // 会社名を取得するために、company_accountsテーブルから情報を取得
    const companyAccountIds = [...new Set(jobs?.map(job => job.company_account_id).filter(Boolean))];
    let companyNamesMap: Record<string, string> = {};

    if (companyAccountIds.length > 0) {
      const { data: companies, error: companiesError } = await supabase
        .from('company_accounts')
        .select('id, company_name')
        .in('id', companyAccountIds);

      if (!companiesError && companies) {
        companyNamesMap = companies.reduce((acc, company) => {
          acc[company.id] = company.company_name;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // 求人データに会社名を追加
    const jobsWithCompanyNames = jobs?.map(job => ({
      ...job,
      company_name: companyNamesMap[job.company_account_id] || '企業名未設定'
    }));

    // 総件数を取得（ページネーション用）
    let countQuery = supabase
      .from('job_postings')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'DRAFT');

    // 同じフィルター条件を適用
    if (keyword) {
      countQuery = countQuery.or(
        `title.ilike.%${keyword}%,job_description.ilike.%${keyword}%,required_skills.ilike.%${keyword}%,preferred_skills.ilike.%${keyword}%`
      );
    }
    if (location) {
      countQuery = countQuery.ilike('work_location', `%${location}%`);
    }
    if (salaryMin) {
      const minSalary = parseInt(salaryMin);
      countQuery = countQuery.gte('salary_min', minSalary);
    }
    if (industries.length > 0) {
      countQuery = countQuery.in('industry', industries);
    }
    if (jobTypes.length > 0) {
      countQuery = countQuery.in('job_type', jobTypes);
    }

    const { count: totalCount } = await countQuery;

    console.log(`Found ${jobs?.length} jobs out of ${totalCount} total`);

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobsWithCompanyNames || [],
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    });

  } catch (error) {
    console.error('Candidate job search error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 