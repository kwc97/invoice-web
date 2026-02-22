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
  expired: number
  totalAmount: number
}

/**
 * 견적서 통계 계산
 * 에러 발생 시 빈 통계 반환 (캐시에 에러 결과 저장 방지를 위해 여기서 처리)
 */
export async function getQuoteStats(): Promise<QuoteStats> {
  try {
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
      rejected: allQuotes.filter(q => q.status === QUOTE_STATUS.REJECTED)
        .length,
      expired: allQuotes.filter(q => q.status === QUOTE_STATUS.EXPIRED).length,
      totalAmount,
    }
  } catch (error) {
    console.error('Failed to calculate quote stats:', error)
    return {
      total: 0,
      draft: 0,
      sent: 0,
      confirmed: 0,
      approved: 0,
      rejected: 0,
      expired: 0,
      totalAmount: 0,
    }
  }
}
