import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 더미 인증 미들웨어
 * /admin/* 경로 접근 시 쿠키 기반 인증 체크
 * Phase 3에서 NextAuth.js로 교체 예정
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin 경로 보호
  if (pathname.startsWith('/admin')) {
    const isAuthenticated = request.cookies.get('dummy-auth')?.value === 'true'

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
