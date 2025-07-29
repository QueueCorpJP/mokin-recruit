import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/server/database/supabase';
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
    const supabase = getSupabaseClient();
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
          appeal_points,
          image_urls
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

    // company_account_idを使って企業名を別途取得
    const companyAccountIds = [...new Set(
      favorites?.map((fav: any) => fav.job_postings?.company_account_id).filter(Boolean)
    )];
    
    let companyNamesMap: Record<string, any> = {};
    if (companyAccountIds.length > 0) {
      const { data: companies, error: companiesError } = await supabase
        .from('company_accounts')
        .select('id, company_name, industry')
        .in('id', companyAccountIds);

      if (!companiesError && companies) {
        companyNamesMap = companies.reduce((acc, company) => {
          acc[company.id] = company;
          return acc;
        }, {} as Record<string, any>);
      }
    }

    // 企業名を追加した結果を作成
    const favoritesWithCompanyNames = favorites?.map((favorite: any) => ({
      ...favorite,
      job_postings: {
        ...favorite.job_postings,
        company_users: companyNamesMap[favorite.job_postings?.company_account_id] || {
          company_name: '企業名未設定',
          industry: '未設定'
        }
      }
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        favorites: favoritesWithCompanyNames || [],
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
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
    console.log('POST /api/candidate/favorite - リクエスト受信');
    
    // リクエストヘッダーとクッキーの詳細ログ
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    console.log('Cookie token:', cookieToken ? 'Present' : 'Missing');
    
    // JWTトークンの検証
    const authResult = await validateJWT(request);
    console.log('認証結果:', {
      isValid: authResult.isValid,
      candidateId: authResult.candidateId,
      error: authResult.error
    });
    
    if (!authResult.isValid) {
      console.log('認証失敗 - 詳細:', authResult);
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || '認証トークンが無効です',
          debug: {
            hasAuthHeader: !!authHeader,
            hasCookieToken: !!cookieToken,
            validationError: authResult.error
          }
        },
        { status: 401 }
      );
    }

    if (!authResult.candidateId) {
      console.log('候補者ID取得失敗');
      return NextResponse.json(
        {
          success: false,
          error: '候補者情報が見つかりません。候補者としてログインしてください。',
          debug: {
            authResult: authResult
          }
        },
        { status: 403 }
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
    const supabase = getSupabaseClient();
    
    // テーブルの存在確認
    const { data: tableCheck, error: tableError } = await supabase
      .from('job_postings')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.error('job_postingsテーブルアクセスエラー:', tableError);
      return NextResponse.json(
        {
          success: false,
          error: 'データベースの設定に問題があります。管理者にお問い合わせください。',
          debug: {
            tableError: tableError.message,
            suggestion: 'job_postingsテーブルが存在しない可能性があります'
          }
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    // まず求人が存在するかチェック
    const { data: allJobData, error: allJobError } = await supabase
      .from('job_postings')
      .select('id, status, title, company_account_id')
      .eq('id', job_posting_id)
      .single();
    
    console.log('求人チェック - job_posting_id:', job_posting_id);
    console.log('求人データ:', allJobData);
    console.log('求人エラー:', allJobError);
    
    // 求人が存在しない場合の処理
    if (allJobError && allJobError.code === 'PGRST116') {
      console.log('求人が存在しません - ID:', job_posting_id);
      return NextResponse.json(
        {
          success: false,
          error: '指定された求人が存在しません。求人が削除されたか、無効なIDが指定されています。',
          debug: {
            jobPostingId: job_posting_id,
            errorCode: allJobError.code,
            suggestion: '有効な求人IDを指定してください'
          }
        },
        { status: 404 }
      );
    }
    
    if (allJobError) {
      console.error('求人取得エラー:', allJobError);
      return NextResponse.json(
        {
          success: false,
          error: '求人情報の取得中にエラーが発生しました',
          debug: {
            jobPostingId: job_posting_id,
            errorCode: allJobError.code,
            errorMessage: allJobError.message
          }
        },
        { status: 500 }
      );
    }
    
    // 求人のステータスをチェック
    if (!allJobData || allJobData.status !== 'PUBLISHED') {
      const currentStatus = allJobData?.status || 'UNKNOWN';
      console.log(`求人は存在しますが公開されていません - ステータス: ${currentStatus}`);
      return NextResponse.json(
        {
          success: false,
          error: `この求人は現在お気に入りに追加できません。求人のステータス: ${currentStatus}`,
          debug: {
            jobPostingId: job_posting_id,
            jobExists: true,
            currentStatus: currentStatus,
            requiredStatus: 'PUBLISHED'
          }
        },
        { status: 403 } // Forbidden
      );
    }
    
    console.log('求人確認完了 - タイトル:', allJobData.title);

    // favoritesテーブルの存在確認
    const { data: favTableCheck, error: favTableError } = await supabase
      .from('favorites')
      .select('count', { count: 'exact', head: true });
    
    if (favTableError) {
      console.error('favoritesテーブルアクセスエラー:', favTableError);
      return NextResponse.json(
        {
          success: false,
          error: 'お気に入り機能が利用できません。管理者にお問い合わせください。',
          debug: {
            tableError: favTableError.message,
            suggestion: 'favoritesテーブルが存在しない可能性があります'
          }
        },
        { status: 503 } // Service Unavailable
      );
    }

    // 既にお気に入りに追加されているかチェック
    const { data: existingFavorite, error: checkError } = await supabase
      .from('favorites')
      .select('id, created_at')
      .eq('candidate_id', candidateId)
      .eq('job_posting_id', job_posting_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('お気に入り重複チェックエラー:', checkError);
      return NextResponse.json(
        {
          success: false,
          error: 'お気に入りの確認中にエラーが発生しました',
          debug: {
            errorCode: checkError.code,
            errorMessage: checkError.message
          }
        },
        { status: 500 }
      );
    }

    if (existingFavorite) {
      console.log('既にお気に入りに追加済み:', existingFavorite.id);
      return NextResponse.json(
        {
          success: false,
          error: 'この求人は既にお気に入りに追加されています',
          debug: {
            existingFavoriteId: existingFavorite.id,
            addedAt: existingFavorite.created_at
          }
        },
        { status: 409 } // Conflict
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
          company_account_id
        )
      `)
      .single();

    if (insertError) {
      console.error('お気に入り追加エラー:', insertError);
      
      // 外部キー制約エラーの場合
      if (insertError.code === '23503') {
        return NextResponse.json(
          {
            success: false,
            error: '指定された求人または候補者が見つかりません',
            debug: {
              errorCode: insertError.code,
              suggestion: '求人IDまたは候補者IDが無効です'
            }
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: 'お気に入りの追加に失敗しました',
          debug: {
            errorCode: insertError.code,
            errorMessage: insertError.message
          }
        },
        { status: 500 }
      );
    }

    const jobPosting = Array.isArray(newFavorite.job_postings)
      ? newFavorite.job_postings[0]
      : newFavorite.job_postings;

    console.log('お気に入り追加成功:', {
      favoriteId: newFavorite.id,
      jobTitle: jobPosting?.title
    });

    return NextResponse.json({
      success: true,
      message: 'お気に入りに追加しました',
      favorite: {
        id: newFavorite.id,
        created_at: newFavorite.created_at,
        job_posting: {
          id: jobPosting?.id,
          title: jobPosting?.title,
          position_summary: jobPosting?.position_summary
        }
      }
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
    const supabase = getSupabaseClient();
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