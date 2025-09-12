import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/admin/:path*',
    '/candidate/:path*',
    '/company/:path*',
  ]
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 公開パスは早期通過（DBアクセスなし）
  if (
    path.startsWith('/admin/login') ||
    path.startsWith('/candidate/auth') ||
    path === '/candidate' ||
    path.startsWith('/company/auth') ||
    path === '/company'
  ) {
    return NextResponse.next()
  }

  // Supabase SSR のセッションクッキー存在のみで高速判定
  // 例: sb-<project-ref>-auth-token.0 / .1
  const hasAccessToken = request.cookies
    .getAll()
    .some(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'))

  if (!hasAccessToken) {
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (path.startsWith('/company')) {
      return NextResponse.redirect(new URL('/company/auth/login', request.url))
    }
    return NextResponse.redirect(new URL('/candidate/auth/login', request.url))
  }

  return NextResponse.next()
}