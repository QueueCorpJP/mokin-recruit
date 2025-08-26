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
    
    // X-User-Idヘッダーからcompany_users.idを取得
    const companyUserId = request.headers.get('x-user-id');
    
    if (!token) {
      console.log('No auth token provided');
      return NextResponse.json({ success: false, error: '認証トークンがありません' }, { status: 401 });
    }
    
    console.log('Validating session...');
    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      console.log('Session validation failed:', sessionResult.error);
      return NextResponse.json({ success: false, error: `認証エラー: ${sessionResult.error}` }, { status: 401 });
    }
    
    console.log('User authenticated:', sessionResult.sessionInfo.user.email);
    const supabase = getSupabaseAdminClient();
    
    let userData: { company_account_id: string } | null = null;
    
    // X-User-Idヘッダーがある場合は直接検索（最適化）
    if (companyUserId) {
      console.log('Using X-User-Id header for optimized lookup:', companyUserId);
      
      const { data: userByIdData, error: userByIdError } = await supabase
        .from('company_users')
        .select('company_account_id, email')
        .eq('id', companyUserId)
        .single();
      
      if (!userByIdError && userByIdData) {
        // セキュリティチェック：セッションのメールアドレスと一致するか確認
        if (userByIdData.email === sessionResult.sessionInfo.user.email) {
          userData = { company_account_id: userByIdData.company_account_id };
          console.log('✅ Optimized lookup successful');
        } else {
          console.warn('⚠️ Security check failed: email mismatch');
        }
      }
    }
    
    // フォールバック：メールアドレスで検索
    if (!userData) {
      console.log('Falling back to email lookup...');
      
      const { data: userByEmail, error: emailError } = await supabase
        .from('company_users')
        .select('id, company_account_id')
        .eq('email', sessionResult.sessionInfo.user.email)
        .single();
      
      if (emailError || !userByEmail) {
        console.log('Failed to get user by email:', emailError);
        return NextResponse.json({ 
          success: false, 
          error: `企業情報の取得に失敗しました: ${emailError?.message || 'ユーザーが見つかりません'}` 
        }, { status: 400 });
      }
      
      userData = { company_account_id: userByEmail.company_account_id };
      console.log('📧 Email lookup successful');
    }

    // データベース制約に合わせて、company_usersを"グループ"として取得
    const { data: users, error: usersError } = await supabase
      .from('company_users')
      .select('id, full_name, position_title')
      .eq('company_account_id', userData.company_account_id)
      .order('full_name');
    
    if (usersError) {
      console.error('Failed to fetch company users:', usersError);
      return NextResponse.json({ success: false, error: 'グループ情報の取得に失敗しました' }, { status: 500 });
    }

    // ユーザーデータを"グループ"形式に変換
    const groupsData = (users || []).map(user => ({
      id: user.id,
      group_name: user.full_name || 'ユーザー',
      description: user.position_title || '担当者'
    }));
    
    console.log('Company groups fetched successfully:', groupsData.length, 'groups');
    return NextResponse.json({ success: true, data: groupsData });
  } catch (e: any) {
    console.error('Company groups API error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}