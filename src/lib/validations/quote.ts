/**
 * 견적서 관련 Zod 검증 스키마
 * 견적서 생성, 수정, 상태 업데이트 등의 유효성 검사
 */

import { z } from 'zod'
import { QUOTE_STATUS } from '@/lib/constants'

/**
 * 견적서 상태 업데이트 검증 스키마
 * 클라이언트가 공개 페이지에서 승인/거부 시 사용
 */
export const updateQuoteStatusSchema = z.object({
  /** 견적서 ID */
  quoteId: z
    .string({ message: '견적서 ID가 필요합니다' })
    .min(1, '견적서 ID가 필요합니다'),

  /** 견적서 상태 (승인됨 또는 거부됨만 허용) */
  status: z.union([
    z.literal(QUOTE_STATUS.APPROVED),
    z.literal(QUOTE_STATUS.REJECTED),
  ]),
})

/**
 * 견적서 상태 업데이트 데이터 타입 (Zod 스키마에서 추론)
 */
export type UpdateQuoteStatusData = z.infer<typeof updateQuoteStatusSchema>

/**
 * 공개 링크 생성 검증 스키마
 */
export const createPublicLinkSchema = z.object({
  /** 견적서 ID */
  quoteId: z
    .string({ message: '견적서 ID가 필요합니다' })
    .min(1, '견적서 ID가 필요합니다'),
})

/**
 * 공개 링크 생성 데이터 타입 (Zod 스키마에서 추론)
 */
export type CreatePublicLinkData = z.infer<typeof createPublicLinkSchema>

/**
 * 견적서 검색 필터 검증 스키마
 */
export const quoteFilterSchema = z.object({
  /** 상태 필터 (선택) */
  status: z
    .union([
      z.literal(QUOTE_STATUS.DRAFT),
      z.literal(QUOTE_STATUS.SENT),
      z.literal(QUOTE_STATUS.CONFIRMED),
      z.literal(QUOTE_STATUS.APPROVED),
      z.literal(QUOTE_STATUS.REJECTED),
    ])
    .optional(),

  /** 검색 키워드 (선택) */
  search: z.string().trim().optional(),

  /** 발행일 시작 (선택, ISO 형식) */
  issueDateFrom: z.string().optional(),

  /** 발행일 종료 (선택, ISO 형식) */
  issueDateTo: z.string().optional(),

  /** 페이지 번호 (선택, 기본값: 1) */
  page: z.number().int().positive().default(1),

  /** 페이지당 항목 수 (선택, 기본값: 20, 최대: 100) */
  pageSize: z.number().int().positive().max(100).default(20),
})

/**
 * 견적서 검색 필터 데이터 타입 (Zod 스키마에서 추론)
 */
export type QuoteFilterData = z.infer<typeof quoteFilterSchema>

/**
 * 견적서 생성 검증 스키마 (MVP 이후)
 */
export const createQuoteSchema = z.object({
  /** 견적서 번호 */
  quoteNumber: z
    .string({ message: '견적서 번호가 필요합니다' })
    .min(1, '견적서 번호가 필요합니다')
    .regex(
      /^Q-\d{4}-\d{3}$/,
      '견적서 번호 형식이 올바르지 않습니다 (예: Q-2026-001)'
    ),

  /** 고객 ID */
  customerId: z
    .string({ message: '고객 ID가 필요합니다' })
    .min(1, '고객 ID가 필요합니다'),

  /** 발행일 (ISO 형식) */
  issueDate: z
    .string({ message: '발행일이 필요합니다' })
    .min(1, '발행일이 필요합니다'),

  /** 유효기간 (ISO 형식) */
  validUntil: z
    .string({ message: '유효기간이 필요합니다' })
    .min(1, '유효기간이 필요합니다'),

  /** 비고 (선택) */
  notes: z.string().max(1000, '비고는 1000자를 초과할 수 없습니다').optional(),
})

/**
 * 견적서 생성 데이터 타입 (Zod 스키마에서 추론)
 */
export type CreateQuoteData = z.infer<typeof createQuoteSchema>
