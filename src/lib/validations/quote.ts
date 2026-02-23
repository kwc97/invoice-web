/**
 * 견적서 관련 Zod 검증 스키마
 * 견적서 생성, 수정, 상태 업데이트 등의 유효성 검사
 */

import { z } from 'zod'
import { QUOTE_STATUS } from '@/lib/constants'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/types'
import { COMPANY_IDS } from '@/lib/company'

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
      z.literal(QUOTE_STATUS.EXPIRED),
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
 * 부속 내역서 컬럼 스키마
 */
export const appendixColumnSchema = z.object({
  key: z.string().min(1),
  /** 빈 라벨 허용 — 그룹 헤더가 있으면 그룹명이 실질적 라벨 역할 */
  label: z.string(),
  group: z.string().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  format: z.enum(['text', 'number', 'currency']).optional(),
})

/**
 * 부속 내역서 행 스키마
 */
export const appendixRowSchema = z.object({
  values: z.record(z.string(), z.union([z.string(), z.number()])),
  isTotal: z.boolean().optional(),
})

/**
 * 부속 내역서 테이블 스키마
 */
export const appendixTableSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요'),
  columns: z.array(appendixColumnSchema).min(1, '최소 1개 컬럼이 필요합니다'),
  rows: z.array(appendixRowSchema).min(1, '최소 1개 행이 필요합니다'),
})

/**
 * 견적 항목 스키마
 */
export const quoteItemSchema = z.object({
  /** 기존 항목 ID (수정 시) */
  id: z.string().optional(),
  /** 품목명 */
  name: z.string().min(1, '품목명을 입력하세요'),
  /** 설명 */
  description: z.string(),
  /** 수량 */
  quantity: z.number().min(1, '1 이상 입력하세요'),
  /** 단가 */
  unitPrice: z.number().min(0, '0 이상 입력하세요'),
  /** 단위 */
  unit: z.string(),
  /** 비고 */
  remarks: z.string(),
})

/**
 * 견적서 폼 스키마 (생성/수정 공통)
 */
export const quoteFormSchema = z.object({
  /** 회사 ID */
  company: z.enum(COMPANY_IDS as [string, ...string[]], {
    message: '회사를 선택하세요',
  }),
  /** 견적서 번호 */
  quoteNumber: z.string().min(1, '견적서 번호가 필요합니다'),
  /** 고객 ID */
  customerId: z.string().min(1, '고객을 선택하세요'),
  /** 발행일 (YYYY-MM-DD) */
  issueDate: z.string().min(1, '발행일을 입력하세요'),
  /** 유효기간 (YYYY-MM-DD) */
  validUntil: z.string().min(1, '유효기간을 입력하세요'),
  /** 프로젝트명 */
  projectName: z.string(),
  /** 수신처 */
  recipient: z.string(),
  /** 견적 담당자 */
  contactPerson: z.string(),
  /** 비고 */
  notes: z.string(),
  /** 견적서 언어 */
  language: z.enum(SUPPORTED_LANGUAGES),
  /** 견적 항목 목록 */
  items: z.array(quoteItemSchema).min(1, '최소 1개 항목을 추가하세요'),
  /** 부속 내역서 (선택, 최대 3개) */
  appendixTables: z.array(appendixTableSchema).max(3).optional(),
})

/** 견적서 폼 데이터 타입 */
export type QuoteFormData = z.infer<typeof quoteFormSchema>

/**
 * 새 고객 등록 검증 스키마
 */
export const createCustomerSchema = z.object({
  /** 고객명 (필수) */
  name: z.string().min(1, '고객명을 입력하세요'),
  /** 회사명 */
  company: z.string(),
  /** 이메일 */
  email: z.string().email('올바른 이메일 형식을 입력하세요').or(z.literal('')),
  /** 전화번호 */
  phone: z.string(),
  /** 주소 */
  address: z.string(),
})

/** 새 고객 등록 데이터 타입 */
export type CreateCustomerData = z.infer<typeof createCustomerSchema>

/** 견적 항목 폼 데이터 타입 */
export type QuoteItemFormData = z.infer<typeof quoteItemSchema>
