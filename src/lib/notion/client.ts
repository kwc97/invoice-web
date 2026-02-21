/**
 * Notion API 클라이언트
 * @notionhq/client를 사용하여 Notion 데이터베이스와 통신
 */

import { Client } from '@notionhq/client'

/**
 * Notion 클라이언트 인스턴스
 * 환경 변수에서 API 키를 로드하여 초기화
 */
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 디버그: 클라이언트 초기화 확인
console.log('[Notion Client] Initialized:', {
  hasAuth: !!process.env.NOTION_API_KEY,
  hasDatabasesQuery: typeof notion?.databases?.query === 'function',
})

/**
 * 데이터베이스 연결 상태 확인
 * @param databaseId - 확인할 데이터베이스 ID
 * @returns 성공 여부 및 에러 정보
 */
export async function verifyDatabaseConnection(databaseId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    await notion.databases.retrieve({ database_id: databaseId })
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 모든 데이터베이스 연결 확인
 * 환경 변수에 설정된 모든 데이터베이스 연결 테스트
 */
export async function verifyAllDatabases(): Promise<{
  success: boolean
  results: Record<string, boolean>
  errors: Record<string, string>
}> {
  const databases = {
    quotes: process.env.NOTION_DATABASE_QUOTES_ID,
    quoteItems: process.env.NOTION_DATABASE_QUOTE_ITEMS_ID,
    customers: process.env.NOTION_DATABASE_CUSTOMERS_ID,
  }

  const results: Record<string, boolean> = {}
  const errors: Record<string, string> = {}

  for (const [name, id] of Object.entries(databases)) {
    if (!id) {
      results[name] = false
      errors[name] = 'Database ID not configured'
      continue
    }

    const result = await verifyDatabaseConnection(id)
    results[name] = result.success

    if (!result.success && result.error) {
      errors[name] = result.error
    }
  }

  const allSuccess = Object.values(results).every((r) => r === true)

  return {
    success: allSuccess,
    results,
    errors,
  }
}
