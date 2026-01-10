import { Client } from '@notionhq/client'

const NOTION_API_KEY = process.env.NOTION_API_KEY

if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY 환경 변수가 설정되지 않았습니다.')
}

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: NOTION_API_KEY,
})

// 데이터베이스 ID들
export const DATABASE_IDS = {
  QUOTES: process.env.NOTION_DATABASE_QUOTES_ID || '',
  QUOTE_ITEMS: process.env.NOTION_DATABASE_QUOTE_ITEMS_ID || '',
  CUSTOMERS: process.env.NOTION_DATABASE_CUSTOMERS_ID || '',
}

// 데이터베이스 ID 검증
export function validateDatabaseIds() {
  const missing = Object.entries(DATABASE_IDS)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `다음 Notion 데이터베이스 ID가 설정되지 않았습니다: ${missing.join(', ')}`
    )
  }
}
