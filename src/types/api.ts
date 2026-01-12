/**
 * API 응답 타입 정의
 * 일관된 API 응답 형식을 위한 표준 타입
 */

/**
 * API 성공 응답 타입
 */
export interface SuccessResponse<T> {
  /** 성공 여부 (항상 true) */
  success: true
  /** 응답 데이터 */
  data: T
  /** 선택적 메시지 */
  message?: string
}

/**
 * API 에러 응답 타입
 */
export interface ErrorResponse {
  /** 성공 여부 (항상 false) */
  success: false
  /** 에러 정보 */
  error: {
    /** 에러 코드 */
    code: string
    /** 에러 메시지 (사용자에게 표시) */
    message: string
    /** 상세 정보 (선택적, 디버깅용) */
    details?: unknown
  }
}

/**
 * API 응답 통합 타입 (Discriminated Union)
 * success 필드로 타입 좁히기 가능
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  /** 현재 페이지 번호 */
  page: number
  /** 페이지당 항목 수 */
  pageSize: number
  /** 전체 항목 수 */
  totalCount: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 다음 페이지 존재 여부 */
  hasMore: boolean
}

/**
 * 페이지네이션 응답 타입
 */
export interface PaginatedResponse<T> {
  /** 데이터 목록 */
  items: T[]
  /** 페이지네이션 정보 */
  pagination: PaginationMeta
}

/**
 * API 에러 코드 상수
 */
export const API_ERROR_CODES = {
  /** 인증 실패 (로그인 필요) */
  UNAUTHORIZED: 'UNAUTHORIZED',
  /** 권한 없음 */
  FORBIDDEN: 'FORBIDDEN',
  /** 리소스를 찾을 수 없음 */
  NOT_FOUND: 'NOT_FOUND',
  /** 유효성 검사 실패 */
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  /** Notion API 에러 */
  NOTION_API_ERROR: 'NOTION_API_ERROR',
  /** 서버 내부 에러 */
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  /** 잘못된 요청 */
  BAD_REQUEST: 'BAD_REQUEST',
  /** Rate Limit 초과 */
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const

/**
 * API 에러 코드 타입
 */
export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

/**
 * API 에러 생성 헬퍼 함수 타입
 */
export type CreateErrorResponse = (
  code: ApiErrorCode,
  message: string,
  details?: unknown
) => ErrorResponse

/**
 * API 성공 응답 생성 헬퍼 함수 타입
 */
export type CreateSuccessResponse = <T>(
  data: T,
  message?: string
) => SuccessResponse<T>
