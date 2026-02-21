/**
 * Notion API 통합 모듈
 * 모든 Notion 관련 함수를 한 곳에서 export
 */

// 클라이언트 및 설정
export { notion, verifyDatabaseConnection, verifyAllDatabases } from './client'
export {
  NOTION_DB_IDS,
  validateEnvironmentVariables,
  hasNotionApiKey,
} from './config'

// 조회 함수
export {
  getCustomerById,
  getQuoteItemsByQuoteId,
  getQuotes,
  getQuoteById,
  getQuoteByPublicLink,
  updateQuotePublicLink,
  updateQuoteStatus,
  getCachedQuotes,
  getCachedQuoteById,
  getCachedQuoteByPublicLink,
} from './quotes'

// 통계 함수
export { getQuoteStats } from './stats'
export type { QuoteStats } from './stats'

// 타입 매퍼
export {
  mapNotionCustomerToCustomer,
  mapNotionQuoteItemToQuoteItem,
  mapNotionQuoteToQuote,
} from './mapper'

// filterQuotes는 getQuotes의 별칭
export { getQuotes as filterQuotes } from './quotes'
