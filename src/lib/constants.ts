/**
 * 애플리케이션 전역 상수 정의
 */

/**
 * 견적서 상태 상수
 * Notion 데이터베이스의 Status Select 필드 값과 일치
 */
export const QUOTE_STATUS = {
  DRAFT: '작성중',
  SENT: '발송됨',
  CONFIRMED: '확인됨',
  APPROVED: '승인됨',
  REJECTED: '거부됨',
  EXPIRED: '만료됨',
} as const

/**
 * 견적서 상태 타입
 * "작성중" | "발송됨" | "확인됨" | "승인됨" | "거부됨" | "만료됨"
 */
export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]

/**
 * 견적서 상태별 화면 표시용 라벨
 */
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  [QUOTE_STATUS.DRAFT]: '작성중',
  [QUOTE_STATUS.SENT]: '발송됨',
  [QUOTE_STATUS.CONFIRMED]: '확인됨',
  [QUOTE_STATUS.APPROVED]: '승인됨',
  [QUOTE_STATUS.REJECTED]: '거부됨',
  [QUOTE_STATUS.EXPIRED]: '만료됨',
}

/**
 * 견적서 상태별 UI 색상 (Tailwind CSS classes)
 */
export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  [QUOTE_STATUS.DRAFT]: 'gray',
  [QUOTE_STATUS.SENT]: 'blue',
  [QUOTE_STATUS.CONFIRMED]: 'yellow',
  [QUOTE_STATUS.APPROVED]: 'green',
  [QUOTE_STATUS.REJECTED]: 'red',
  [QUOTE_STATUS.EXPIRED]: 'orange',
}

/**
 * 날짜 포맷 상수
 */
export const DATE_FORMAT = {
  /** ISO 8601 형식: YYYY-MM-DD */
  ISO: 'YYYY-MM-DD',
  /** 한국어 형식: YYYY년 M월 D일 */
  KOREAN: 'YYYY년 M월 D일',
  /** 화면 표시용: YYYY.MM.DD */
  DISPLAY: 'YYYY.MM.DD',
} as const

/**
 * 통화 관련 상수
 */
export const CURRENCY = {
  /** 한국 원화 기호 */
  SYMBOL: '₩',
  /** 통화 코드 */
  CODE: 'KRW',
} as const

/**
 * 공급자(회사) 정보 상수
 * 견적서 양식의 공급자란에 표시
 */
export const COMPANY_INFO = {
  name: '(주)케이프로텍',
  representative: '신창군',
  businessNumber: '129-86-56148',
  address: '경기도 평택시 오성서로 5-67',
  businessType: '건설업,제조업,도소매',
  businessCategory: '기계설치,기계장치,기계설비',
  tel: '031-704-2989',
  fax: '031-704-2985',
  email: 'info@kprotek.com',
} as const
