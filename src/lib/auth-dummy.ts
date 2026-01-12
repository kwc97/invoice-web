/**
 * 더미 인증 유틸리티
 * Phase 3에서 NextAuth.js로 교체 예정
 * 보안을 위해 실제 배포 시에는 제거되어야 합니다
 */

export const DUMMY_ADMIN = {
  email: 'admin@example.com',
  password: 'password123',
  name: '관리자',
}

/**
 * 인증 정보 검증
 */
export function validateCredentials(email: string, password: string): boolean {
  return email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password
}

/**
 * 더미 로그인 함수
 * 500ms 지연으로 실제 API 호출 시뮬레이션
 * 쿠키 기반 인증 (미들웨어와 연동)
 */
export async function dummyLogin(
  email: string,
  password: string
): Promise<{
  success: boolean
  message: string
}> {
  // API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500))

  const isValid = validateCredentials(email, password)

  if (isValid) {
    // 쿠키 설정 (24시간)
    document.cookie = 'dummy-auth=true; path=/; max-age=86400'
    return { success: true, message: '로그인 성공' }
  }

  return {
    success: false,
    message: '이메일 또는 비밀번호가 올바르지 않습니다',
  }
}

/**
 * 더미 로그아웃 함수
 * 쿠키 제거
 */
export function dummyLogout() {
  document.cookie = 'dummy-auth=; path=/; max-age=0'
}

/**
 * 인증 상태 확인 (클라이언트 사이드)
 */
export function isDummyAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return document.cookie.includes('dummy-auth=true')
}
