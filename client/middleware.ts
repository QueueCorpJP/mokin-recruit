// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import { logger } from '@/lib/server/utils/logger';

// /**
//  * 認証ミドルウェア
//  * 保護されたルートへのアクセス制御を行う
//  */
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // 静的ファイルとAPIルートは除外
//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname.startsWith('/static') ||
//     pathname.includes('.')
//   ) {
//     return NextResponse.next();
//   }

//   // 認証不要のパス
//   const publicPaths = [
//     '/',
//     '/auth/login',
//     '/auth/register',
//     '/auth/forgot-password',
//     '/auth/reset-password',
//     '/candidate/auth/login',
//     '/candidate/auth/register',
//     '/candidate/auth/reset-password',
//     '/company/auth/login',
//     '/company/auth/register',
//     '/company/auth/reset-password',
//     '/admin/auth/login',
//     '/admin/auth/register',
//     '/admin/auth/reset-password',
//     '/about',
//     '/contact',
//     '/privacy',
//     '/terms',
//     '/dev-tools', // 開発者ツールページ
//   ];

//   // 認証が必要なパス
//   const protectedPaths = [
//     '/dashboard',
//     '/profile',
//     '/settings',
//     '/admin',
//     '/company',
//     '/candidate',
//   ];

//   // 公開パスは認証チェックをスキップ
//   if (publicPaths.some(path => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // 保護されたパスの認証チェック
//   if (protectedPaths.some(path => pathname.startsWith(path))) {
//     try {
//       // Supabaseクライアントの初期化
//       const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//       const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

//       if (!supabaseUrl || !supabaseAnonKey) {
//         logger.error('Supabase configuration missing in middleware');
//         return NextResponse.redirect(new URL('/auth/login', request.url));
//       }

//       const supabase = createClient(supabaseUrl, supabaseAnonKey);

//       // セッションの確認
//       const token = request.cookies.get('supabase-auth-token')?.value;
//       const bypassToken = request.cookies.get('auth-bypass-token')?.value;

//       // 開発環境での認証バイパスチェック
//       if (process.env.NODE_ENV === 'development' && bypassToken) {
//         try {
//           // バイパストークンの検証
//           if (bypassToken.startsWith('bypass.')) {
//             const payload = JSON.parse(
//               Buffer.from(
//                 bypassToken.replace('bypass.', ''),
//                 'base64'
//               ).toString()
//             );

//             if (payload.bypass && payload.exp > Math.floor(Date.now() / 1000)) {
//               logger.info(
//                 `🔓 Auth bypass used for ${pathname} by ${payload.userType}`
//               );

//               // バイパスユーザー情報をヘッダーに追加
//               const response = NextResponse.next();
//               response.headers.set('x-user-id', payload.userId);
//               response.headers.set('x-user-email', payload.email);
//               response.headers.set('x-user-type', payload.userType);
//               response.headers.set('x-auth-bypass', 'true');

//               return response;
//             }
//           }
//         } catch (error) {
//           logger.warn('Invalid bypass token:', error);
//         }
//       }

//       // 実際の認証チェック
//       if (token) {
//         try {
//           const { data, error } = await supabase.auth.getUser(token);
//           if (error || !data.user) {
//             throw new Error('Invalid token');
//           }

//           // ユーザー情報をヘッダーに追加
//           const response = NextResponse.next();
//           response.headers.set('x-user-id', data.user.id);
//           response.headers.set('x-user-email', data.user.email || '');
//           response.headers.set('x-auth-bypass', 'false');

//           return response;
//         } catch (error) {
//           logger.warn('Token validation failed:', error);
//         }
//       }

//       // 認証失敗時のリダイレクト先を決定
//       const getLoginRedirect = () => {
//         if (pathname.startsWith('/candidate')) {
//           return new URL('/candidate/auth/login', request.url);
//         } else if (pathname.startsWith('/company')) {
//           return new URL('/company/auth/login', request.url);
//         } else if (pathname.startsWith('/admin')) {
//           return new URL('/admin/auth/login', request.url);
//         } else {
//           return new URL('/auth/login', request.url);
//         }
//       };

//       return NextResponse.redirect(getLoginRedirect());
//     } catch (error) {
//       logger.error('Middleware authentication error:', error);
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
//   }

//   // レガシーURL のリダイレクト処理
//   if (
//     pathname === '/auth/login' ||
//     pathname === '/auth/register' ||
//     pathname === '/auth/reset-password'
//   ) {
//     // クエリパラメータでユーザータイプを判定
//     const userType = request.nextUrl.searchParams.get('type');

//     if (userType === 'candidate') {
//       return NextResponse.redirect(
//         new URL(pathname.replace('/auth/', '/candidate/auth/'), request.url)
//       );
//     } else if (userType === 'company') {
//       return NextResponse.redirect(
//         new URL(pathname.replace('/auth/', '/company/auth/'), request.url)
//       );
//     } else if (userType === 'admin') {
//       return NextResponse.redirect(
//         new URL(pathname.replace('/auth/', '/admin/auth/'), request.url)
//       );
//     }

//     // デフォルトは候補者ログインにリダイレクト
//     return NextResponse.redirect(
//       new URL(pathname.replace('/auth/', '/candidate/auth/'), request.url)
//     );
//   }

//   // デフォルトは通過
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };
