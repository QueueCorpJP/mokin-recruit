import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Company Jobs List API Started ===');
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // セッションからユーザーID取得
    const sessionService = new SessionService();
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    console.log('Auth header found:', !!authHeader);
    console.log('Cookie token found:', !!cookieToken);
    console.log('Final token used:', !!token);
    
    if (!token) {
      console.log('❌ No auth token provided');
      return NextResponse.json({ success: false, error: '認証トークンがありません' }, { status: 401 });
    }
    
    console.log('🔍 Validating session...');
    const sessionResult = await sessionService.validateSession(token);
    console.log('Session validation result:', {
      success: sessionResult.success,
      hasSessionInfo: !!sessionResult.sessionInfo,
      error: sessionResult.error
    });
    
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      console.log('❌ Session validation failed:', sessionResult.error);
      return NextResponse.json({ success: false, error: '認証エラー' }, { status: 401 });
    }
    
    const userId = sessionResult.sessionInfo.user.id;
    const userEmail = sessionResult.sessionInfo.user.email;
    console.log('✅ User authenticated:', {
      userId,
      userEmail,
      hasUserMetadata: !!sessionResult.sessionInfo.user.user_metadata,
      hasAppMetadata: !!sessionResult.sessionInfo.user.app_metadata
    });

    const supabase = getSupabaseAdminClient();
    console.log('🔗 Supabase client initialized');
    
    // ユーザーの会社アカウントIDを取得（メール検索でフォールバック）
    console.log('🔍 Step 1: Searching company_users by user ID...');
    let { data: userData, error: userError } = await supabase
      .from('company_users')
      .select('company_account_id')
      .eq('id', userId)
      .single();
    
    console.log('Step 1 result:', {
      userData,
      userError,
      hasCompanyAccountId: !!userData?.company_account_id
    });
    
    if (userError || !userData?.company_account_id) {
      console.log('⚠️ Failed to get user company_account_id, searching by email...');
      
      const { data: userByEmail, error: emailError } = await supabase
        .from('company_users')
        .select('id, company_account_id')
        .eq('email', userEmail)
        .single();
      
      console.log('Step 1b (email search) result:', {
        userByEmail,
        emailError,
        hasCompanyAccountId: !!userByEmail?.company_account_id
      });
      
      if (emailError || !userByEmail) {
        console.log('❌ Failed to get user by email:', emailError);
        return NextResponse.json({ success: false, error: '企業情報の取得に失敗しました' }, { status: 400 });
      }
      
      userData = { company_account_id: userByEmail.company_account_id };
      console.log('✅ Using email-found user data:', userData);
    }

    // クエリパラメータ取得
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const groupId = url.searchParams.get('groupId');
    const keyword = url.searchParams.get('keyword');
    
    console.log('📋 Query parameters:', { status, groupId, keyword });

    // company_account_idで直接求人を取得
    console.log('🔍 Step 2: Building jobs query with company_account_id:', userData.company_account_id);
    
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
        employment_type,
        work_location,
        remote_work_available,
        job_type,
        industry,
        status,
        application_deadline,
        created_at,
        updated_at,
        published_at,
        company_group_id,
        company_account_id
      `)
      .eq('company_account_id', userData.company_account_id);

    // ステータスフィルター
    if (status && status !== 'すべて') {
      const statusMap: Record<string, string> = {
        '下書き': 'DRAFT',
        '掲載済': 'PUBLISHED',
        '掲載終了': 'CLOSED'
      };
      const dbStatus = statusMap[status] || status;
      console.log('Adding status filter:', status, '→', dbStatus);
      query = query.eq('status', dbStatus);
    }

    // キーワード検索（タイトルと説明文）
    if (keyword) {
      console.log('Adding keyword filter:', keyword);
      query = query.or(`title.ilike.%${keyword}%,job_description.ilike.%${keyword}%`);
    }

    // グループIDフィルター
    if (groupId && groupId !== 'すべて') {
      console.log('Adding group ID filter:', groupId);
      query = query.eq('company_group_id', groupId);
    }

    // 作成日時の降順でソート
    query = query.order('created_at', { ascending: false });
    
    console.log('🚀 Executing jobs query...');
    const { data: jobs, error: jobsError } = await query;
    
    console.log('Step 2 result - Jobs query:', {
      jobs: jobs?.length || 0,
      jobsError,
      jobsSample: jobs?.slice(0, 2)?.map(job => ({
        id: job.id,
        title: job.title,
        status: job.status,
        company_account_id: job.company_account_id,
        company_group_id: job.company_group_id
      }))
    });
    
    if (jobsError) {
      console.error('❌ Failed to fetch jobs:', jobsError);
      return NextResponse.json({ success: false, error: '求人情報の取得に失敗しました' }, { status: 500 });
    }

    // 会社グループ情報を取得（表示用）
    console.log('🔍 Step 3: Fetching company groups for display...');
    const { data: groups, error: groupsDisplayError } = await supabase
      .from('company_groups')
      .select('id, group_name, description')
      .eq('company_account_id', userData.company_account_id);

    console.log('Step 3 result - Groups display query:', {
      groups: groups?.length || 0,
      groupsDisplayError,
      groupsSample: groups?.slice(0, 2)?.map(group => ({
        id: group.id,
        group_name: group.group_name,
        description: group.description
      }))
    });

    console.log('✅ API execution completed successfully');
    console.log('Final response summary:', {
      jobsCount: jobs?.length || 0,
      groupsCount: groups?.length || 0,
      userCompanyAccountId: userData.company_account_id
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        jobs: jobs || [],
        groups: groups || []
      }
    });
  } catch (e: any) {
    console.error('🚨 CRITICAL ERROR in Company jobs API:', e);
    console.error('Error stack:', e.stack);
    console.error('Error details:', {
      name: e.name,
      message: e.message,
      cause: e.cause
    });
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}