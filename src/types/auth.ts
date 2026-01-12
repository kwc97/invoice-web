/**
 * 인증 관련 타입 정의
 * NextAuth.js와 연동되는 사용자 인증 타입
 */

/**
 * 사용자 (User) 타입
 * 관리자 계정 정보
 */
export interface User {
  /** 사용자 ID */
  id: string
  /** 이메일 (로그인 ID) */
  email: string
  /** 이름 (선택) */
  name?: string
  /** 역할 (현재 MVP에서는 admin만 지원) */
  role: 'admin'
}

/**
 * 로그인 인증 정보 (Credentials)
 */
export interface LoginCredentials {
  /** 이메일 */
  email: string
  /** 비밀번호 */
  password: string
}

/**
 * 세션 (Session) 타입
 * NextAuth.js 세션 정보
 */
export interface Session {
  /** 사용자 정보 */
  user: User
  /** 세션 만료 시간 (ISO 형식) */
  expires: string
}

/**
 * 인증 상태 타입
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  /** 성공 여부 */
  success: boolean
  /** 사용자 정보 (성공 시) */
  user?: User
  /** 에러 메시지 (실패 시) */
  error?: string
}

/**
 * 로그아웃 응답 타입
 */
export interface LogoutResponse {
  /** 성공 여부 */
  success: boolean
  /** 메시지 */
  message?: string
}
