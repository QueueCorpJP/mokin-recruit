import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function DELETE(request: NextRequest) {
  try {
    const sessionService = new SessionService();
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return NextResponse.json({ success: false, error: '認証トークンがありません' }, { status: 401 });
    }
    
    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return NextResponse.json({ success: false, error: '認証エラー' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'idが必要です' 
      }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 求人情報の削除
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '求人情報が削除されました' });
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message 
    }, { status: 500 });
  }
}