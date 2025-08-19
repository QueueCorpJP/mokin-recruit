import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * 認証ミドルウェア（最適化版）
 * - Supabase APIコールを削除
 * - JWT検証のみでトークンの有効性を確認
 * - ユーザー情報はJWTペイロードから取得
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
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/candidate/auth/login',
    '/candidate/auth/register',
    '/candidate/auth/reset-password',
    '/company/auth/login',
    '/company/auth/register',
    '/company/auth/reset-password',
    '/admin/auth/login',
    '/admin/auth/register',
    '/admin/auth/reset-password',
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
      // セッションの確認
      const token = request.cookies.get('supabase-auth-token')?.value;
      // バイパストークンは開発時でも無効化
      // const bypassToken = request.cookies.get('auth-bypass-token')?.value;

      // JWTトークンの簡易検証（Supabase APIコールなし）
      if (token) {
        try {
          // JWTの基本的な検証のみ実行
          const jwtSecret =
            process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';
          const payload = jwt.verify(token, jwtSecret) as any;
          // JWTペイロードのデバッグログ
          // console.log('🔍 middleware - JWT payload:', payload);
          // トークンの有効期限チェック
          if (payload.exp && payload.exp > Math.floor(Date.now() / 1000)) {
            // JWTペイロードからユーザータイプを取得（ログイン時に設定される）
            const userType =
              payload.user_metadata?.user_type ||
              payload.userType ||
              'candidate';
            // ★ admin配下のアクセス制御
            if (pathname.startsWith('/admin') && userType !== 'admin') {
              return NextResponse.redirect(
                new URL('/admin/auth/login', request.url)
              );
            }
            // ユーザー情報をヘッダーに追加
            const response = NextResponse.next();
            response.headers.set('x-user-id', payload.sub || '');
            response.headers.set('x-user-email', payload.email || '');
            response.headers.set('x-user-type', userType);
            response.headers.set('x-auth-bypass', 'false');
            response.headers.set('x-auth-validated', 'true');
            response.headers.set('x-token-exp', String(payload.exp));
            if (
              userType === 'company_user' &&
              payload.user_metadata?.company_account_id
            ) {
              response.headers.set(
                'x-company-account-id',
                payload.user_metadata.company_account_id
              );
            }
            return response;
          }
        } catch (error) {
          // JWT検証エラーは続行（リダイレクト処理へ）
        }
      }
      // トークンが無い、または検証失敗時は必ずリダイレクト
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/auth/login', request.url));
      } else if (pathname.startsWith('/candidate')) {
        return NextResponse.redirect(
          new URL('/candidate/auth/login', request.url)
        );
      } else if (pathname.startsWith('/company')) {
        return NextResponse.redirect(
          new URL('/company/auth/login', request.url)
        );
      } else {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } catch (error) {
      // 例外時も必ずリダイレクト
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // レガシーURL のリダイレクト処理
  if (
    pathname === '/auth/login' ||
    pathname === '/auth/register' ||
    pathname === '/auth/reset-password'
  ) {
    // クエリパラメータでユーザータイプを判定
    const userType = request.nextUrl.searchParams.get('type');

    if (userType === 'candidate') {
      return NextResponse.redirect(
        new URL(pathname.replace('/auth/', '/candidate/auth/'), request.url)
      );
    } else if (userType === 'company') {
      return NextResponse.redirect(
        new URL(pathname.replace('/auth/', '/company/auth/'), request.url)
      );
    } else if (userType === 'admin') {
      return NextResponse.redirect(
        new URL(pathname.replace('/auth/', '/admin/auth/'), request.url)
      );
    }

    // デフォルトは候補者ログインにリダイレクト
    return NextResponse.redirect(
      new URL(pathname.replace('/auth/', '/candidate/auth/'), request.url)
    );
  }

  // デフォルトは通過
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
