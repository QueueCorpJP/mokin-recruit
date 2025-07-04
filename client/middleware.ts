import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/server/utils/logger';

/**
 * 認証ミドルウェア
 * 保護されたルートへのアクセス制御を行う
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静的ファイルとAPIルートは除外
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 認証不要のパス
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/dev-tools', // 開発者ツールページ
  ];

  // 認証が必要なパス
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin',
    '/company',
    '/candidate',
  ];

  // 公開パスは認証チェックをスキップ
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 保護されたパスの認証チェック
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    try {
      // Supabaseクライアントの初期化
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        logger.error('Supabase configuration missing in middleware');
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // セッションの確認
      const token = request.cookies.get('supabase-auth-token')?.value;
      const bypassToken = request.cookies.get('auth-bypass-token')?.value;

      // 開発環境での認証バイパスチェック
      if (process.env.NODE_ENV === 'development' && bypassToken) {
        try {
          // バイパストークンの検証
          if (bypassToken.startsWith('bypass.')) {
            const payload = JSON.parse(
              Buffer.from(
                bypassToken.replace('bypass.', ''),
                'base64'
              ).toString()
            );

            if (payload.bypass && payload.exp > Math.floor(Date.now() / 1000)) {
              logger.info(
                `🔓 Auth bypass used for ${pathname} by ${payload.userType}`
              );

              // バイパスユーザー情報をヘッダーに追加
              const response = NextResponse.next();
              response.headers.set('x-user-id', payload.userId);
              response.headers.set('x-user-email', payload.email);
              response.headers.set('x-user-type', payload.userType);
              response.headers.set('x-auth-bypass', 'true');

              return response;
            }
          }
        } catch (error) {
          logger.warn('Invalid bypass token:', error);
        }
      }

      if (!token) {
        logger.info(`Unauthorized access attempt to ${pathname}`);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      // トークンの検証
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        logger.warn(`Invalid token for ${pathname}: ${error?.message}`);
        // 無効なトークンをクリア
        const response = NextResponse.redirect(
          new URL('/auth/login', request.url)
        );
        response.cookies.delete('supabase-auth-token');
        return response;
      }

      // ユーザータイプによるアクセス制御
      const userType = user.user_metadata?.userType;

      // 管理者専用パス
      if (pathname.startsWith('/admin') && userType !== 'admin') {
        logger.warn(`Unauthorized admin access attempt by user ${user.id}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // 企業ユーザー専用パス
      if (pathname.startsWith('/company') && userType !== 'company_user') {
        logger.warn(`Unauthorized company access attempt by user ${user.id}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // 候補者専用パス
      if (pathname.startsWith('/candidate') && userType !== 'candidate') {
        logger.warn(`Unauthorized candidate access attempt by user ${user.id}`);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // 認証済みユーザーの情報をヘッダーに追加
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-email', user.email || '');
      response.headers.set('x-user-type', userType || 'unknown');

      return response;
    } catch (error) {
      logger.error('Middleware authentication error:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // デフォルトは通過
  return NextResponse.next();
}

/**
 * ミドルウェアの適用範囲を設定
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
