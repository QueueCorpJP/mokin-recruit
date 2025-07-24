import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({ 
        success: false, 
        error: '求人IDが必要です' 
      }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 求人情報を取得
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ 
        success: false, 
        error: '求人情報が見つかりません' 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const { job_posting_id, ...updateData } = body;

    if (!job_posting_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'job_posting_idが必要です' 
      }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // ステータスが'PUBLISHED'に変更される場合、published_atを自動設定
    if (updateData.status === 'PUBLISHED') {
      // 現在のステータスを確認
      const { data: currentJob, error: fetchError } = await supabase
        .from('job_postings')
        .select('status, published_at')
        .eq('id', job_posting_id)
        .single();

      if (fetchError) {
        return NextResponse.json({ 
          success: false, 
          error: fetchError.message 
        }, { status: 500 });
      }

      // 現在のステータスが'PUBLISHED'でない場合（初回公開の場合）、published_atを設定
      if (currentJob.status !== 'PUBLISHED') {
        updateData.published_at = new Date().toISOString();
      }
    }

    // 求人情報の更新
    const { data, error } = await supabase
      .from('job_postings')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', job_posting_id)
      .select();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: '求人情報が見つかりません' 
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message 
    }, { status: 500 });
  }
}