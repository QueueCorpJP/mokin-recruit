import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Company Job List API Started ===');

    // セッションからユーザーID取得
    const sessionService = new SessionService();
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      console.log('No auth token provided');
      return NextResponse.json(
        { success: false, error: '認証トークンがありません' },
        { status: 401 }
      );
    }

    console.log('Validating session...');
    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      console.log('Session validation failed:', sessionResult.error);
      return NextResponse.json(
        { success: false, error: '認証エラー' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // セッション認証のユーザーIDとcompany_usersのIDは異なるため、メールアドレスで検索
    console.log(
      'Searching user by email:',
      sessionResult.sessionInfo.user.email
    );
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id, email, full_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      console.log('Failed to get user by email:', emailError);
      return NextResponse.json(
        { success: false, error: '企業アカウント情報の取得に失敗しました' },
        { status: 400 }
      );
    }

    console.log('Found user by email:', userByEmail);
    const userCompanyAccountId = userByEmail.company_account_id;

    // URL パラメータからフィルター条件を取得
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const groupId = searchParams.get('groupId');
    const searchKeyword = searchParams.get('search');

    // 基本クエリ：同じ会社アカウントの求人のみ
    let query = supabase
      .from('job_postings')
      .select(
        `
        id,
        title,
        job_description,
        job_type,
        industry,
        employment_type,
        work_location,
        salary_min,
        salary_max,
        status,
        created_at,
        updated_at,
        published_at,
        company_group_id
      `
      )
      .eq('company_account_id', userCompanyAccountId)
      .order('updated_at', { ascending: false });

    // ステータスフィルター
    if (status && status !== 'すべて') {
      const statusMap: Record<string, string> = {
        下書き: 'DRAFT',
        '掲載待ち（承認待ち）': 'PENDING_APPROVAL',
        掲載済: 'PUBLISHED',
        停止: 'CLOSED',
      };
      if (statusMap[status]) {
        query = query.eq('status', statusMap[status]);
      }
    }

    // グループフィルター
    if (groupId && groupId !== 'すべて') {
      query = query.eq('company_group_id', groupId);
    }

    // キーワード検索
    if (searchKeyword) {
      query = query.or(
        `title.ilike.%${searchKeyword}%,job_type.ilike.%${searchKeyword}%`
      );
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      console.error('Failed to fetch jobs:', jobsError);
      return NextResponse.json(
        { success: false, error: '求人情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // グループ名を取得するために、関連するcompany_usersの情報も取得
    const groupIds = [
      ...new Set(jobs?.map(job => job.company_group_id).filter(Boolean)),
    ];
    let groupNames: Record<string, string> = {};

    if (groupIds.length > 0) {
      const { data: groups, error: groupsError } = await supabase
        .from('company_users')
        .select('id, full_name')
        .in('id', groupIds);

      if (!groupsError && groups) {
        groupNames = groups.reduce(
          (acc, group) => {
            acc[group.id] = group.full_name || 'ユーザー';
            return acc;
          },
          {} as Record<string, string>
        );
      }
    }

    // レスポンス用にデータを整形
    const formattedJobs = (jobs || []).map(job => ({
      id: job.id,
      title: job.title,
      jobType: job.job_type,
      industry: job.industry,
      employmentType: job.employment_type,
      workLocation: job.work_location,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      status: job.status,
      groupName: groupNames[job.company_group_id] || 'ユーザー',
      groupId: job.company_group_id,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      publishedAt: job.published_at,
    }));

    console.log('Jobs fetched successfully:', formattedJobs.length, 'jobs');
    return NextResponse.json({ success: true, data: formattedJobs });
  } catch (e: any) {
    console.error('Company jobs API error:', e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
