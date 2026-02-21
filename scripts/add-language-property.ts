/**
 * Notion Quotes 데이터베이스에 Language Select 속성을 추가하는 마이그레이션 스크립트
 *
 * 실행: npx tsx scripts/add-language-property.ts
 *
 * 이 스크립트는 한 번만 실행하면 됩니다.
 * 이미 Language 속성이 존재하면 옵션만 업데이트합니다.
 */

import { Client } from '@notionhq/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드 (Next.js 환경 변수)
config({ path: resolve(process.cwd(), '.env.local') })

const LANGUAGE_OPTIONS = [
  { name: 'ko', color: 'blue' as const, description: '한국어' },
  { name: 'en', color: 'green' as const, description: 'English' },
  { name: 'zh', color: 'red' as const, description: '中文' },
  { name: 'ja', color: 'purple' as const, description: '日本語' },
  { name: 'it', color: 'orange' as const, description: 'Italiano' },
  { name: 'es', color: 'yellow' as const, description: 'Español' },
]

async function main() {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_QUOTES_ID

  if (!apiKey || !databaseId) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.')
    console.error('   NOTION_API_KEY와 NOTION_DATABASE_QUOTES_ID를 확인하세요.')
    process.exit(1)
  }

  const notion = new Client({ auth: apiKey })

  console.log('📋 Quotes 데이터베이스 정보 조회 중...')

  // 현재 데이터베이스 속성 확인
  const db = await notion.databases.retrieve({ database_id: databaseId })
  const existingProps = db.properties

  if ('Language' in existingProps) {
    console.log('ℹ️  Language 속성이 이미 존재합니다. 옵션을 업데이트합니다.')
  } else {
    console.log('➕ Language Select 속성을 추가합니다.')
  }

  // Language Select 속성 추가/업데이트
  await notion.databases.update({
    database_id: databaseId,
    properties: {
      Language: {
        select: {
          options: LANGUAGE_OPTIONS.map(({ name, color }) => ({ name, color })),
        },
      },
    },
  })

  console.log('✅ Language 속성이 성공적으로 추가되었습니다!')
  console.log('')
  console.log('추가된 옵션:')
  LANGUAGE_OPTIONS.forEach((opt) => {
    console.log(`  - ${opt.name} (${opt.description}) [${opt.color}]`)
  })
  console.log('')
  console.log('💡 기존 견적서는 Language가 비어있지만, 코드에서 자동으로 "ko"로 처리됩니다.')
}

main().catch((error) => {
  console.error('❌ 스크립트 실행 중 오류 발생:', error.message)
  process.exit(1)
})
