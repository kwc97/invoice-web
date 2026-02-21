/**
 * Notion 데이터베이스 설정
 * 환경 변수에서 데이터베이스 ID를 로드
 */

/**
 * Notion 데이터베이스 ID 설정
 * .env.local 파일에서 로드됨
 */
export const NOTION_DB_IDS = {
  /** 견적서 데이터베이스 ID */
  QUOTES: process.env.NOTION_DATABASE_QUOTES_ID!,
  /** 견적 항목 데이터베이스 ID */
  QUOTE_ITEMS: process.env.NOTION_DATABASE_QUOTE_ITEMS_ID!,
  /** 고객 데이터베이스 ID */
  CUSTOMERS: process.env.NOTION_DATABASE_CUSTOMERS_ID!,
} as const

/**
 * 환경 변수 검증
 * 필수 환경 변수가 설정되어 있는지 확인
 */
export function validateEnvironmentVariables(): {
  valid: boolean
  missing: string[]
} {
  const required = [
    'NOTION_API_KEY',
    'NOTION_DATABASE_QUOTES_ID',
    'NOTION_DATABASE_QUOTE_ITEMS_ID',
    'NOTION_DATABASE_CUSTOMERS_ID',
  ]

  const missing = required.filter((key) => !process.env[key])

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Notion API 키 존재 여부 확인
 */
export function hasNotionApiKey(): boolean {
  return !!process.env.NOTION_API_KEY
}
