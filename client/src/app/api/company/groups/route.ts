import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Company Groups API Started ===');
    
    // セッションからユーザーID取得
    const sessionService = new SessionService();
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      console.log('No auth token provided');
      return NextResponse.json({ success: false, error: '認証トークンがありません' }, { status: 401 });
    }
    
    console.log('Validating session...');
    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      console.log('Session validation failed:', sessionResult.error);
      return NextResponse.json({ success: false, error: '認証エラー' }, { status: 401 });
    }
    
    const userId = sessionResult.sessionInfo.user.id;
    console.log('User authenticated:', userId);
    console.log('Session user details:', {
      id: sessionResult.sessionInfo.user.id,
      email: sessionResult.sessionInfo.user.email,
      user_metadata: sessionResult.sessionInfo.user.user_metadata,
      app_metadata: sessionResult.sessionInfo.user.app_metadata,
    });

    const supabase = getSupabaseAdminClient();
    
    // デバッグ：company_usersテーブルの全レコードを確認
    console.log('Checking all company_users records...');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('company_users')
      .select('id, email, company_account_id');
    
    if (!allUsersError && allUsers) {
      console.log('All company_users records:', allUsers);
    }
    
    // ユーザーの会社アカウントIDを取得
    let { data: userData, error: userError } = await supabase
      .from('company_users')
      .select('company_account_id')
      .eq('id', userId)
      .single();
    
    if (userError || !userData?.company_account_id) {
      console.log('Failed to get user company_account_id:', userError);
      console.log('Searching by email instead...');
      
      // ユーザーIDで見つからない場合、メールアドレスで検索
      const { data: userByEmail, error: emailError } = await supabase
        .from('company_users')
        .select('id, company_account_id')
        .eq('email', sessionResult.sessionInfo.user.email)
        .single();
      
      if (emailError || !userByEmail) {
        console.log('Failed to get user by email:', emailError);
        return NextResponse.json({ success: false, error: '企業情報の取得に失敗しました' }, { status: 400 });
      }
      
      console.log('Found user by email:', userByEmail);
      // メールで見つかった場合は新しいオブジェクトを作成
      userData = { company_account_id: userByEmail.company_account_id };
    }

    // 同じ会社アカウントに属する全てのグループを取得
    const { data: groups, error: groupsError } = await supabase
      .from('company_groups')
      .select('id, group_name, description')
      .eq('company_account_id', userData.company_account_id);
    
    if (groupsError) {
      console.error('Failed to fetch company groups:', groupsError);
      return NextResponse.json({ success: false, error: 'グループ情報の取得に失敗しました' }, { status: 500 });
    }

    // グループが存在しない場合は空配列を返す
    const groupsData = groups || [];
    console.log('Company groups fetched successfully:', groupsData);
    return NextResponse.json({ success: true, data: groupsData });
  } catch (e: any) {
    console.error('Company groups API error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}