/**
 * NextAuth.js v5 미들웨어
 * auth 함수를 미들웨어로 내보내기
 */

export { auth as middleware } from '@/auth'

/**
 * 미들웨어가 적용될 경로 설정
 * - /admin/* : 관리자 페이지 (인증 필요)
 * - /login : 로그인 페이지 (인증된 사용자 리다이렉트)
 * - /api/auth/* : NextAuth.js API 라우트 제외
 */
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
}
