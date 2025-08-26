import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Candidate Job Search API Started ===');

    // JWT認証（認証されていないユーザーは一般公開のみ閲覧可能）
    const validationResult = await validateJWT(request);
    const isAuthenticated = validationResult.isValid && validationResult.candidateId;
    
    console.log('Authentication status:', {
      isAuthenticated,
      candidateId: validationResult.candidateId
    });

    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    
    // 検索パラメータを取得
    const keyword = searchParams.get('keyword');
    const location = searchParams.get('location');
    const salaryMin = searchParams.get('salaryMin');
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean) || [];
    const appealPoints = searchParams.get('appealPoints')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 1000);
    const offset = (page - 1) * limit;

    // 基本クエリ：掲載済みの求人のみ + 公開範囲による制限
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
        company_account_id,
        publication_type
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    // 公開範囲による制限
    if (isAuthenticated) {
      // 認証済みユーザーは 一般公開 + 登録会員限定 を閲覧可能
      query = query.in('publication_type', ['public', 'members']);
    } else {
      // 未認証ユーザーは 一般公開のみ
      query = query.eq('publication_type', 'public');
    }

    // 応募期限チェック（期限が設定されていない場合は無制限とする）
    const now = new Date().toISOString();
    query = query.or(`application_deadline.is.null,application_deadline.gte.${now}`);

    // キーワード検索
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,job_description.ilike.%${keyword}%,required_skills.ilike.%${keyword}%,preferred_skills.ilike.%${keyword}%`
      );
    }

    // 勤務地検索（配列フィールド用）
    if (location) {
      // 配列に完全一致する要素が含まれているかチェック
      query = query.contains('work_location', [location]);
    }

    // 最低年収フィルター
    if (salaryMin) {
      const minSalary = parseInt(salaryMin);
      query = query.gte('salary_min', minSalary);
    }

    // 業界フィルター（配列フィールド用）
    if (industries.length > 0) {
      // 配列の重複検索：overlap演算子を使用
      query = query.overlaps('industry', industries);
    }

    // 職種フィルター（配列フィールド用）
    if (jobTypes.length > 0) {
      // 配列の重複検索：overlap演算子を使用
      query = query.overlaps('job_type', jobTypes);
    }

    // アピールポイントフィルター（配列フィールド用）
    if (appealPoints.length > 0) {
      // 配列の重複検索：overlap演算子を使用
      query = query.overlaps('appeal_points', appealPoints);
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
      .eq('status', 'PUBLISHED');

    // 公開範囲による制限（カウントクエリにも適用）
    if (isAuthenticated) {
      countQuery = countQuery.in('publication_type', ['public', 'members']);
    } else {
      countQuery = countQuery.eq('publication_type', 'public');
    }

    // 応募期限チェック（カウントクエリにも適用）
    countQuery = countQuery.or(`application_deadline.is.null,application_deadline.gte.${now}`);

    // 同じフィルター条件を適用
    if (keyword) {
      countQuery = countQuery.or(
        `title.ilike.%${keyword}%,job_description.ilike.%${keyword}%,required_skills.ilike.%${keyword}%,preferred_skills.ilike.%${keyword}%`
      );
    }
    if (location) {
      countQuery = countQuery.contains('work_location', [location]);
    }
    if (salaryMin) {
      const minSalary = parseInt(salaryMin);
      countQuery = countQuery.gte('salary_min', minSalary);
    }
    if (industries.length > 0) {
      countQuery = countQuery.overlaps('industry', industries);
    }
    if (jobTypes.length > 0) {
      countQuery = countQuery.overlaps('job_type', jobTypes);
    }
    if (appealPoints.length > 0) {
      countQuery = countQuery.overlaps('appeal_points', appealPoints);
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