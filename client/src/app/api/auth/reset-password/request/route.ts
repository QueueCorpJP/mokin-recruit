import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// リクエストボディのバリデーションスキーマ
const ForgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  userType: z.enum(['candidate', 'company']).optional(),
});

export async function POST(request: NextRequest) {
  // 最初のログ出力（最も基本的な機能のテスト）
  console.log(
    '🔄 Password reset request received at:',
    new Date().toISOString()
  );

  try {
    // ステップ1: 環境変数の確認
    console.log('🔧 Step 1: Checking environment variables...');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
      });
      return NextResponse.json(
        {
          success: false,
          message: 'サーバー設定エラーが発生しました。',
        },
        { status: 500 }
      );
    }
    console.log('✅ Environment variables OK');

    // ステップ2: リクエストボディの解析
    console.log('📥 Step 2: Parsing request body...');
    let body;
    try {
      body = await request.json();
      console.log('📥 Request body parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        {
          success: false,
          message: '無効なリクエスト形式です。',
        },
        { status: 400 }
      );
    }

    // ステップ3: バリデーション
    console.log('🔍 Step 3: Validating email format...');
    const validationResult = ForgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      console.log('❌ Password reset validation failed:', firstError);

      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Invalid input',
          field: firstError?.path?.[0] || 'general',
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    console.log('🔍 Step 4: Request details:', {
      email: email.substring(0, 3) + '***',
      userType: validationResult.data.userType,
      hasUserType: !!validationResult.data.userType
    });

    // ステップ4: Supabaseクライアントの動的インポートと初期化
    console.log('🔧 Step 5: Dynamic import of Supabase...');
    let createClient;
    try {
      const supabaseModule = await import('@supabase/supabase-js');
      createClient = supabaseModule.createClient;
      console.log('✅ Supabase module imported successfully');
    } catch (importError) {
      console.error('❌ Failed to import Supabase module:', importError);
      return NextResponse.json(
        {
          success: false,
          message: 'サーバーライブラリの読み込みに失敗しました。',
        },
        { status: 500 }
      );
    }

    // ステップ5: Supabaseクライアントの作成
    console.log('🔧 Step 6: Creating Supabase client...');
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'X-Client-Info': 'mokin-recruit-server',
          },
        },
      });
      console.log('✅ Supabase client created successfully');
    } catch (clientError) {
      console.error('❌ Failed to create Supabase client:', clientError);
      return NextResponse.json(
        {
          success: false,
          message: 'データベース接続の初期化に失敗しました。',
        },
        { status: 500 }
      );
    }

    // ステップ6: URL設定の動的取得
    console.log('🔧 Step 7: Getting redirect URL...');
    let redirectUrl;
    try {
      // userTypeパラメータを含めたリダイレクトURL生成
      const { userType } = validationResult.data;
      const userTypeParam = userType ? `?userType=${userType}` : '';
      
      console.log('🔗 URL generation details:', {
        userType,
        userTypeParam,
        hasUserType: !!userType
      });
      
      // 本番環境とVercelでの動的URL取得
      if (process.env.VERCEL_URL) {
        redirectUrl = `https://${process.env.VERCEL_URL}/auth/reset-password/new${userTypeParam}`;
      } else if (process.env.NODE_ENV === 'production') {
        redirectUrl = `https://mokin-recruit-client.vercel.app/auth/reset-password/new${userTypeParam}`;
      } else {
        redirectUrl = `http://localhost:3000/auth/reset-password/new${userTypeParam}`;
      }
      console.log('✅ Redirect URL configured:', redirectUrl);
    } catch (urlError) {
      console.error('❌ Failed to configure redirect URL:', urlError);
      return NextResponse.json(
        {
          success: false,
          message: 'リダイレクトURL設定に失敗しました。',
        },
        { status: 500 }
      );
    }

    // ステップ7: パスワードリセットメールの送信
    console.log('📤 Step 8: Sending password reset email...');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.log(
          `⚠️ Password reset request failed for email: ${email.substring(0, 3)}***, error:`,
          error.message
        );

        // 本番環境でも詳細なエラー情報をログに記録
        if (process.env.NODE_ENV === 'production') {
          console.error('Production password reset error details:', {
            email: email.substring(0, 3) + '***',
            error: error.message,
            timestamp: new Date().toISOString(),
          });
        }

        // エラーの詳細は返さず、一般的なメッセージを返す（セキュリティ考慮）
        return NextResponse.json({
          success: true,
          message:
            'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
        });
      }

      console.log(
        `✅ Password reset email sent successfully to: ${email.substring(0, 3)}***`
      );

      // セキュリティ上、メールアドレスの存在に関係なく成功レスポンスを返す
      return NextResponse.json({
        success: true,
        message:
          'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      });
    } catch (resetError) {
      console.error('❌ Password reset operation failed:', resetError);
      return NextResponse.json(
        {
          success: false,
          message: 'パスワードリセット処理中にエラーが発生しました。',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Critical error in password reset API:', error);

    // 本番環境での詳細エラー情報
    if (process.env.NODE_ENV === 'production') {
      console.error('Production API error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString(),
        url: request.url,
        method: request.method,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
          },
        }),
      },
      { status: 500 }
    );
  }
}
