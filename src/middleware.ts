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
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로에 매칭:
     * - api/auth (NextAuth.js 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - public 폴더 내 파일
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
