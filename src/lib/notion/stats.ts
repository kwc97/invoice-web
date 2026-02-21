/**
 * 견적서 통계 계산 함수
 */

import { getCachedQuotes } from './quotes'
import { QUOTE_STATUS } from '@/lib/constants'

/**
 * 견적서 상태별 통계
 */
export interface QuoteStats {
  total: number
  draft: number
  sent: number
  confirmed: number
  approved: number
  rejected: number
  totalAmount: number
}

/**
 * 견적서 통계 계산
 */
export async function getQuoteStats(): Promise<QuoteStats> {
  const allQuotes = await getCachedQuotes()
  const approvedQuotes = allQuotes.filter(
    q => q.status === QUOTE_STATUS.APPROVED
  )
  const totalAmount = approvedQuotes.reduce(
    (sum, quote) => sum + quote.totalAmount,
    0
  )

  return {
    total: allQuotes.length,
    draft: allQuotes.filter(q => q.status === QUOTE_STATUS.DRAFT).length,
    sent: allQuotes.filter(q => q.status === QUOTE_STATUS.SENT).length,
    confirmed: allQuotes.filter(q => q.status === QUOTE_STATUS.CONFIRMED)
      .length,
    approved: approvedQuotes.length,
    rejected: allQuotes.filter(q => q.status === QUOTE_STATUS.REJECTED).length,
    totalAmount,
  }
}
