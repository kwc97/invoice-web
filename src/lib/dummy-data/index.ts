import { dummyCustomers } from './customers'
import { dummyQuoteItems } from './quote-items'
import { dummyQuotes } from './quotes'
import type { Quote, QuoteStats, QuoteFilter } from '@/types/quote'
import { QUOTE_STATUS } from '@/lib/constants'

/**
 * 더미 데이터 및 헬퍼 함수
 * Phase 3에서 Notion API로 교체 예정
 */

export * from './customers'
export * from './quote-items'
export * from './quotes'

/**
 * ID로 견적서 조회 (customer 및 items 조인)
 */
export function getQuoteById(id: string): Quote | undefined {
  const quote = dummyQuotes.find((q) => q.id === id)
  if (!quote) return undefined

  return {
    ...quote,
    customer: dummyCustomers.find((c) => c.id === quote.customerId),
    items: dummyQuoteItems.filter((item) => item.quoteId === quote.id),
  }
}

/**
 * 공개 링크 ID로 견적서 조회
 */
export function getQuoteByPublicLinkId(
  publicLinkId: string
): Quote | undefined {
  const quote = dummyQuotes.find((q) => q.publicLinkId === publicLinkId)
  return quote ? getQuoteById(quote.id) : undefined
}

/**
 * 견적서 통계 계산
 */
export function getQuoteStats(): QuoteStats {
  return {
    total: dummyQuotes.length,
    draft: dummyQuotes.filter((q) => q.status === QUOTE_STATUS.DRAFT).length,
    sent: dummyQuotes.filter((q) => q.status === QUOTE_STATUS.SENT).length,
    confirmed: dummyQuotes.filter((q) => q.status === QUOTE_STATUS.CONFIRMED)
      .length,
    approved: dummyQuotes.filter((q) => q.status === QUOTE_STATUS.APPROVED)
      .length,
    rejected: dummyQuotes.filter((q) => q.status === QUOTE_STATUS.REJECTED)
      .length,
    totalAmount: dummyQuotes
      .filter((q) => q.status === QUOTE_STATUS.APPROVED)
      .reduce((sum, q) => sum + q.totalAmount, 0),
  }
}

/**
 * 견적서 필터링 및 검색
 */
export function filterQuotes(filter?: QuoteFilter): Quote[] {
  let filtered = [...dummyQuotes]

  // 상태 필터링
  if (filter?.status) {
    filtered = filtered.filter((q) => q.status === filter.status)
  }

  // 검색어 필터링 (견적서 번호 또는 고객명)
  if (filter?.search) {
    const searchLower = filter.search.toLowerCase()
    filtered = filtered.filter((q) => {
      const customer = dummyCustomers.find((c) => c.id === q.customerId)
      return (
        q.quoteNumber.toLowerCase().includes(searchLower) ||
        customer?.name.toLowerCase().includes(searchLower) ||
        customer?.company?.toLowerCase().includes(searchLower)
      )
    })
  }

  // customer 조인하여 반환
  return filtered.map((quote) => ({
    ...quote,
    customer: dummyCustomers.find((c) => c.id === quote.customerId),
  }))
}

/**
 * 모든 견적서 조회 (customer 조인)
 */
export function getAllQuotes(): Quote[] {
  return dummyQuotes.map((quote) => ({
    ...quote,
    customer: dummyCustomers.find((c) => c.id === quote.customerId),
    items: dummyQuoteItems.filter((item) => item.quoteId === quote.id),
  }))
}
