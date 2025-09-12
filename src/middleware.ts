import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getNonce } from '@/lib/server/utils/nonce';
import { verifyJwt } from '@/lib/server/utils/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 各リクエストにnonceを付与（CSP強化のための下準備。現時点では非破壊）
  const nonce = getNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // admin配下のルートをチェック
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // クッキーから認証情報をチェック
    const authToken = request.cookies.get('auth_token')?.value;
    const adminUser = request.cookies.get('admin_user')?.value;

    let isAdmin = false;
    if (authToken && process.env.ADMIN_JWT_SECRET) {
      try {
        const verified = await verifyJwt(
          authToken,
          process.env.ADMIN_JWT_SECRET
        );
        // 期待するクレーム: { role: 'admin' } または { admin: true }
        if (verified.valid) {
          const payload = verified.payload as any;
          isAdmin = payload?.role === 'admin' || payload?.admin === true;
        }
      } catch {}
    }

    // 既存の Cookie フラグも後方互換として許容（段階的移行）
    if (!authToken || (!isAdmin && adminUser !== 'true')) {
      const redirectResponse = NextResponse.redirect(
        new URL('/admin/login', request.url)
      );
      redirectResponse.headers.set('x-nonce', nonce);
      return redirectResponse;
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

  response.headers.set('Content-Security-Policy-Report-Only', reportOnlyCsp);
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

export const config = {
  // すべてのアプリページに適用（_next, api, 静的ファイルなどは除外）
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
