import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';

// お気に入り一覧取得 (GET)
export async function GET(request: NextRequest) {
  try {
    // JWTトークンの検証
    const authResult = await validateJWT(request);
    if (!authResult.isValid || !authResult.candidateId) {
      return NextResponse.json(
        { success: false, error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const candidateId = authResult.candidateId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // お気に入り求人を取得（求人詳細を含む）
    const { data: favorites, error: favoritesError, count } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        job_posting_id,
        job_postings!inner (
          id,
          title,
          position_summary,
          job_description,
          salary_min,
          salary_max,
          employment_type,
          work_location,
          remote_work_available,
          job_type,
          industry,
          application_deadline,
          created_at,
          updated_at,
          status,
          company_account_id,
          company_accounts (
            company_name,
            industry
          )
        )
      `, { count: 'exact' })
      .eq('candidate_id', candidateId)
      .eq('job_postings.status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (favoritesError) {
      console.error('お気に入り取得エラー:', favoritesError);
      return NextResponse.json(
        { success: false, error: 'お気に入りの取得に失敗しました' },
        { status: 500 }
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      favorites: favorites || [],
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    console.error('GET /api/candidate/favorite エラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入り追加 (POST)
export async function POST(request: NextRequest) {
  try {
    // JWTトークンの検証
    const authResult = await validateJWT(request);
    if (!authResult.isValid || !authResult.candidateId) {
      return NextResponse.json(
        { success: false, error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const candidateId = authResult.candidateId;
    const body = await request.json();
    const { job_posting_id } = body;

    // バリデーション
    if (!job_posting_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: '求人IDは必須です',
          errors: [{ field: 'job_posting_id', message: '求人IDは必須です' }]
        },
        { status: 400 }
      );
    }

    // 求人が存在し、公開されているかチェック
    const { data: jobPosting, error: jobError } = await supabase
      .from('job_postings')
      .select('id, status')
      .eq('id', job_posting_id)
      .eq('status', 'PUBLISHED')
      .single();

    if (jobError || !jobPosting) {
      return NextResponse.json(
        { success: false, error: '指定された求人が見つからないか、公開されていません' },
        { status: 404 }
      );
    }

    // 既にお気に入りに追加されているかチェック
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', job_posting_id)
      .single();

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'この求人は既にお気に入りに追加されています' },
        { status: 409 }
      );
    }

    // お気に入りに追加
    const { data: newFavorite, error: insertError } = await supabase
      .from('favorites')
      .insert({
        candidate_id: candidateId,
        job_posting_id: job_posting_id
      })
      .select(`
        id,
        created_at,
        job_posting_id,
        job_postings (
          id,
          title,
          position_summary,
          company_accounts (
            company_name
          )
        )
      `)
      .single();

    if (insertError) {
      console.error('お気に入り追加エラー:', insertError);
      return NextResponse.json(
        { success: false, error: 'お気に入りの追加に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'お気に入りに追加しました',
      favorite: newFavorite
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/candidate/favorite エラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// お気に入り削除 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    // JWTトークンの検証
    const authResult = await validateJWT(request);
    if (!authResult.isValid || !authResult.candidateId) {
      return NextResponse.json(
        { success: false, error: '認証トークンが無効です' },
        { status: 401 }
      );
    }

    const candidateId = authResult.candidateId;
    const { searchParams } = new URL(request.url);
    const job_posting_id = searchParams.get('job_posting_id');

    // バリデーション
    if (!job_posting_id) {
      return NextResponse.json(
        { success: false, error: '求人IDは必須です' },
        { status: 400 }
      );
    }

    // お気に入りが存在するかチェック
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', job_posting_id)
      .single();

    if (checkError || !existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'お気に入りが見つかりません' },
        { status: 404 }
      );
    }

    // お気に入りを削除
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', job_posting_id);

    if (deleteError) {
      console.error('お気に入り削除エラー:', deleteError);
      return NextResponse.json(
        { success: false, error: 'お気に入りの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'お気に入りから削除しました'
    });

  } catch (error) {
    console.error('DELETE /api/candidate/favorite エラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 