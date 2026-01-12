/**
 * 견적서 도메인 타입 정의
 * Notion API 응답을 애플리케이션에서 사용하기 쉬운 평탄화된 구조로 정의
 */

import type { QuoteStatus } from '@/lib/constants'

/**
 * 고객 (Customer) 타입
 */
export interface Customer {
  /** 고객 ID (Notion Page ID) */
  id: string
  /** 고객명 (필수) */
  name: string
  /** 회사명 (선택) */
  company?: string
  /** 이메일 (선택) */
  email?: string
  /** 전화번호 (선택) */
  phone?: string
  /** 주소 (선택) */
  address?: string
}

/**
 * 견적 항목 (Quote Item) 타입
 */
export interface QuoteItem {
  /** 견적 항목 ID (Notion Page ID) */
  id: string
  /** 항목명 */
  name: string
  /** 설명 */
  description: string
  /** 수량 */
  quantity: number
  /** 단가 (원 단위 숫자) */
  unitPrice: number
  /** 금액 (원 단위 숫자) */
  amount: number
  /** 연결된 견적서 ID */
  quoteId: string
}

/**
 * 견적서 (Quote) 타입
 */
export interface Quote {
  /** 견적서 ID (Notion Page ID) */
  id: string
  /** 견적서 번호 (예: Q-2026-001) */
  quoteNumber: string
  /** 고객 ID (Relation) */
  customerId: string
  /** 발행일 (ISO 형식: YYYY-MM-DD) */
  issueDate: string
  /** 유효기간 (ISO 형식: YYYY-MM-DD) */
  validUntil: string
  /** 견적서 상태 */
  status: QuoteStatus
  /** 총액 (원 단위 숫자) */
  totalAmount: number
  /** 비고 (선택) */
  notes?: string
  /** 공개 링크 ID (null이면 생성되지 않음) */
  publicLinkId: string | null

  // 조인된 데이터 (선택적)
  /** 고객 정보 (조인 시에만 포함) */
  customer?: Customer
  /** 견적 항목 목록 (조인 시에만 포함) */
  items?: QuoteItem[]

  // 메타데이터
  /** 생성일시 */
  createdTime: string
  /** 최종 수정일시 */
  lastEditedTime: string
}

/**
 * 견적서 통계 (Dashboard) 타입
 */
export interface QuoteStats {
  /** 총 견적서 수 */
  total: number
  /** 작성중 견적서 수 */
  draft: number
  /** 발송됨 견적서 수 */
  sent: number
  /** 확인됨 견적서 수 */
  confirmed: number
  /** 승인됨 견적서 수 */
  approved: number
  /** 거부됨 견적서 수 */
  rejected: number
  /** 총 견적 금액 (승인됨 기준) */
  totalAmount: number
}

/**
 * 견적서 검색 필터 타입
 */
export interface QuoteFilter {
  /** 상태별 필터 */
  status?: QuoteStatus | QuoteStatus[]
  /** 고객 ID 필터 */
  customerId?: string
  /** 검색 키워드 (견적서 번호, 고객명 등) */
  search?: string
  /** 발행일 시작 (ISO 형식) */
  issueDateFrom?: string
  /** 발행일 종료 (ISO 형식) */
  issueDateTo?: string
  /** 유효기간 시작 (ISO 형식) */
  validUntilFrom?: string
  /** 유효기간 종료 (ISO 형식) */
  validUntilTo?: string
}

/**
 * 견적서 정렬 옵션
 */
export interface QuoteSort {
  /** 정렬 기준 필드 */
  field: 'issueDate' | 'validUntil' | 'totalAmount' | 'status' | 'quoteNumber'
  /** 정렬 방향 */
  direction: 'asc' | 'desc'
}

/**
 * 견적서 목록 조회 옵션
 */
export interface QuoteListOptions {
  /** 필터 조건 */
  filter?: QuoteFilter
  /** 정렬 옵션 */
  sort?: QuoteSort
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지당 항목 수 */
  pageSize?: number
  /** 고객 정보 조인 여부 */
  includeCustomer?: boolean
  /** 견적 항목 조인 여부 */
  includeItems?: boolean
}

/**
 * 견적서 목록 응답 (페이지네이션)
 */
export interface QuoteListResponse {
  /** 견적서 목록 */
  quotes: Quote[]
  /** 전체 항목 수 */
  totalCount: number
  /** 현재 페이지 */
  page: number
  /** 페이지당 항목 수 */
  pageSize: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 다음 페이지 존재 여부 */
  hasMore: boolean
}

/**
 * 견적서 생성 데이터 (DTO)
 */
export interface CreateQuoteData {
  /** 견적서 번호 */
  quoteNumber: string
  /** 고객 ID */
  customerId: string
  /** 발행일 (ISO 형식) */
  issueDate: string
  /** 유효기간 (ISO 형식) */
  validUntil: string
  /** 총액 */
  totalAmount: number
  /** 비고 (선택) */
  notes?: string
  /** 견적 항목 목록 */
  items: Omit<QuoteItem, 'id' | 'quoteId'>[]
}

/**
 * 견적서 업데이트 데이터 (DTO)
 */
export interface UpdateQuoteData {
  /** 견적서 ID */
  quoteId: string
  /** 견적서 상태 (선택) */
  status?: QuoteStatus
  /** 공개 링크 ID (선택) */
  publicLinkId?: string | null
  /** 비고 (선택) */
  notes?: string
}

/**
 * 견적서 상태 업데이트 데이터 (클라이언트용)
 */
export interface UpdateQuoteStatusData {
  /** 견적서 ID */
  quoteId: string
  /** 새로운 상태 (승인됨 또는 거부됨만 가능) */
  status: Extract<QuoteStatus, '승인됨' | '거부됨'>
}
