import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // admin配下のルートをチェック
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // クッキーから認証情報をチェック
    const authToken = request.cookies.get('auth_token')?.value
    const adminUser = request.cookies.get('admin_user')?.value

    // 認証されていない場合、または admin_user でない場合はログインページにリダイレクト
    if (!authToken || adminUser !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}