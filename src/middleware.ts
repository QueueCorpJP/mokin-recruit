import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getNonce } from '@/lib/server/utils/nonce';
import { verifyJwtEdge } from '@/lib/edge/utils/jwt';

interface SupabaseJWTPayload {
  sub: string;
  email?: string;
  user_metadata?: {
    user_type?: 'candidate' | 'company_user';
    userType?: 'candidate' | 'company_user';
    company_account_id?: string;
    companyAccountId?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Check if user has valid Supabase session
 */
function checkSupabaseSession(request: NextRequest): boolean {
  try {
    // Check for sb-access-token first
    let accessToken = request.cookies.get('sb-access-token')?.value;

    // Check for sb-<project-ref>-auth-token.0 (base64 JSON)
    if (!accessToken) {
      const all = request.cookies.getAll();
      const v2Cookie = all.find(c => /sb-.*-auth-token\.0/.test(c.name));
      if (v2Cookie) {
        try {
          const decoded = JSON.parse(atob(v2Cookie.value));
          accessToken = decoded.access_token;
        } catch {
          // Ignore decode errors
        }
      }
    }

    // Check for legacy supabase-auth-token
    if (!accessToken) {
      const legacy = request.cookies.get('supabase-auth-token')?.value;
      if (legacy && legacy.split('.').length === 3) {
        accessToken = legacy;
      }
    }

    return !!accessToken;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 各リクエストにnonceを付与（CSP強化のための下準備。現時点では非破壊）
  const nonce = getNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // サインアップフローの進捗チェック
  const signupUserId = request.cookies.get('signup_user_id')?.value;
  if (
    signupUserId &&
    !path.startsWith('/signup') &&
    !path.startsWith('/api/') &&
    !path.startsWith('/_next/') &&
    !path.startsWith('/candidate') &&
    !path.startsWith('/company') &&
    !path.startsWith('/admin')
  ) {
    try {
      // signup_user_idがある場合、まず認証済みかチェック
      const hasSupabaseSession = checkSupabaseSession(request);

      // 認証済みユーザーは通常のページアクセスを許可
      if (hasSupabaseSession) {
        // サインアップ完了済みなのでクッキーをクリア
        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });
        response.headers.set('x-nonce', nonce);
        response.cookies.delete('signup_user_id');
        response.cookies.delete('signup_email');
        return response;
      }

      // 未認証でサインアップ途中の場合のみリダイレクト
      const redirectResponse = NextResponse.redirect(
        new URL('/signup', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    } catch (error) {
      // エラーが発生した場合は正常処理を継続
      console.error('Signup progress check error:', error);
    }
  }

  // Handle root domain redirect based on user type
  if (path === '/') {
    const userType = await getUserTypeFromSession(request);

    if (userType === 'company_user') {
      const redirectResponse = NextResponse.redirect(
        new URL('/company/mypage', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    } else if (userType === 'candidate') {
      const redirectResponse = NextResponse.redirect(
        new URL('/candidate/mypage', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    } else {
      // Not authenticated or unknown user type -> redirect to candidate LP
      const redirectResponse = NextResponse.redirect(
        new URL('/candidate', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    }
  }

  // admin配下のルートをチェック（認証必須・auth配下は除外）
  // 判定はサーバー側レイアウトに委譲するため、ここでは
  // セッション（アクセストークン）の存在のみを確認
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // まずはadmin専用のクッキーをチェック
    const adminUser = request.cookies.get('admin_user')?.value;
    const authToken = request.cookies.get('auth_token')?.value;
    const userId = request.cookies.get('user_id')?.value;

    // admin専用のクッキーがある場合は認証済みとみなす
    if (adminUser === 'true' && authToken && userId) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[MW:/admin] admin session found, continue');
      }
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      response.headers.set('x-nonce', nonce);
      return response;
    }

    // Supabaseのセッションクッキーを確認（優先: sb-access-token）
    let accessToken = request.cookies.get('sb-access-token')?.value;
    let hasSupabaseSession = false;
    if (process.env.NODE_ENV !== 'production') {
      try {
        const names = request.cookies.getAll().map(c => c.name);
        console.log('[MW:/admin] path=', path, 'cookies=', names);
      } catch {}
    }

    // 次に sb-<project-ref>-auth-token.0（base64 JSON）を探す
    if (!accessToken) {
      try {
        const all = request.cookies.getAll();
        // v2 cookieの存在自体をセッション有りとみなす（デコードは不要）
        const hasV2 = all.some(c => /sb-.*-auth-token\.(0|1)/.test(c.name));
        if (hasV2) {
          hasSupabaseSession = true;
        }
      } catch {}
    }

    // 最後にレガシーな supabase-auth-token（JWT文字列）を確認
    if (!accessToken) {
      const legacy = request.cookies.get('supabase-auth-token')?.value;
      if (legacy && legacy.split('.').length === 3) {
        accessToken = legacy;
      }
    }

    if (!accessToken && !hasSupabaseSession) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[MW:/admin] redirect -> /admin/login (no accessToken)');
      }
      const redirectResponse = NextResponse.redirect(
        new URL('/admin/login', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[MW:/admin] session found, continue');
    }
  }

  // company配下のルートをチェック（認証必須・auth配下は除外）
  // 判定はサーバー側レイアウトに委譲するため、ここでは
  // セッション（アクセストークン）の存在のみを確認
  if (
    path.startsWith('/company') &&
    !path.startsWith('/company/auth') &&
    path !== '/company'
  ) {
    // Supabaseのセッションクッキーを確認（優先: sb-access-token）
    let accessToken = request.cookies.get('sb-access-token')?.value;
    let hasSupabaseSession = false;
    if (process.env.NODE_ENV !== 'production') {
      try {
        const names = request.cookies.getAll().map(c => c.name);
        console.log('[MW:/company] path=', path, 'cookies=', names);
      } catch {}
    }

    // 次に sb-<project-ref>-auth-token.0（base64 JSON）を探す
    if (!accessToken) {
      try {
        const all = request.cookies.getAll();
        // v2 cookieの存在自体をセッション有りとみなす（デコードは不要）
        const hasV2 = all.some(c => /sb-.*-auth-token\.(0|1)/.test(c.name));
        if (hasV2) {
          hasSupabaseSession = true;
        }
      } catch {}
    }

    // 最後にレガシーな supabase-auth-token（JWT文字列）を確認
    if (!accessToken) {
      const legacy = request.cookies.get('supabase-auth-token')?.value;
      if (legacy && legacy.split('.').length === 3) {
        accessToken = legacy;
      }
    }

    if (!accessToken && !hasSupabaseSession) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[MW:/company] redirect -> /company/auth/login (no accessToken)'
        );
      }
      const redirectResponse = NextResponse.redirect(
        new URL('/company/auth/login', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[MW:/company] session found, continue');
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('x-nonce', nonce);

  // Report-Only CSP をnonce付きで動的に適用（本番のみ厳格）
  const isProd = process.env.NODE_ENV === 'production';
  const scriptSrc = isProd
    ? `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://checkout.stripe.com`
    : `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com`;
  const reportOnlyCsp = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' https://mjhqeagxibsklugikyma.supabase.co https://api.stripe.com`,
    `frame-src 'self' https://js.stripe.com https://checkout.stripe.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    // Reporting API (Chromium) と legacy report-uri を併用
    `report-to csp-endpoint`,
    `report-uri /api/csp-report`,
  ].join('; ');

  // 開発環境では緩いCSP、本番環境ではReport-Onlyモード
  if (isProd) {
    response.headers.set('Content-Security-Policy-Report-Only', reportOnlyCsp);
  } else {
    response.headers.set('Content-Security-Policy', reportOnlyCsp);
  }
  // Reporting-Endpoints/Report-To ヘッダを併用（ブラウザ差異対策）
  try {
    const endpoints = [{ url: '/api/csp-report' }];
    response.headers.set(
      'Reporting-Endpoints',
      `csp-endpoint="/api/csp-report"`
    );
    response.headers.set(
      'Report-To',
      JSON.stringify({ group: 'csp-endpoint', max_age: 10886400, endpoints })
    );
  } catch {}
  return response;
}

/**
 * Get user type from Supabase session cookies
 */
async function getUserTypeFromSession(
  request: NextRequest
): Promise<'candidate' | 'company_user' | null> {
  try {
    // Check for sb-access-token first
    let accessToken = request.cookies.get('sb-access-token')?.value;

    // Check for sb-<project-ref>-auth-token.0 (base64 JSON)
    if (!accessToken) {
      const all = request.cookies.getAll();
      const v2Cookie = all.find(c => /sb-.*-auth-token\.0/.test(c.name));
      if (v2Cookie) {
        try {
          const decoded = JSON.parse(atob(v2Cookie.value));
          accessToken = decoded.access_token;
        } catch {
          // Ignore decode errors
        }
      }
    }

    // Check for legacy supabase-auth-token
    if (!accessToken) {
      const legacy = request.cookies.get('supabase-auth-token')?.value;
      if (legacy && legacy.split('.').length === 3) {
        accessToken = legacy;
      }
    }

    if (!accessToken) {
      return null;
    }

    // Decode JWT without verification (we just need the payload)
    // In edge middleware, we can't easily verify the JWT signature
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1])) as SupabaseJWTPayload;
    const meta = payload.user_metadata || {};

    // Determine user type from metadata
    let userType = meta.user_type || meta.userType;

    // Fallback: if company_account_id exists, it's a company user
    if (!userType && (meta.company_account_id || meta.companyAccountId)) {
      userType = 'company_user';
    }

    // Default to candidate if no explicit type
    return userType || 'candidate';
  } catch (error) {
    // If any error occurs, return null (not authenticated)
    return null;
  }
}

export const config = {
  // すべてのアプリページに適用（_next, api, 静的ファイルなどは除外）
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
