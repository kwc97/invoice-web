/**
 * 공개 링크가 있는 "작성중" 견적서를 "발송됨"으로 일괄 변경하는 스크립트
 * 실행: npx tsx scripts/fix-draft-with-link.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from '@notionhq/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const notion = new Client({ auth: process.env.NOTION_API_KEY! })
const QUOTES_DB = process.env.NOTION_DATABASE_QUOTES_ID!

async function main() {
  console.log('공개 링크가 있는 "작성중" 견적서 검색 중...')

  // "작성중" 상태이면서 Public Link ID가 비어있지 않은 견적서 조회
  const response = await (notion.databases as any).query({
    database_id: QUOTES_DB,
    filter: {
      and: [
        {
          property: 'Status',
          status: {
            equals: '작성중',
          },
        },
        {
          property: 'Public Link ID',
          rich_text: {
            is_not_empty: true,
          },
        },
      ],
    },
  })

  const pages = response.results
  console.log(`발견된 견적서: ${pages.length}건`)

  if (pages.length === 0) {
    console.log('업데이트할 견적서가 없습니다.')
    return
  }

  for (const page of pages) {
    const title = (page as any).properties['Quote Number']?.title?.[0]
      ?.plain_text
    const linkId = (page as any).properties['Public Link ID']?.rich_text?.[0]
      ?.plain_text

    console.log(`  - ${title} (링크: ${linkId}) → "발송됨"으로 변경`)

    await notion.pages.update({
      page_id: page.id,
      properties: {
        Status: {
          status: {
            name: '발송됨',
          },
        },
      },
    })
  }

  console.log(`\n완료! ${pages.length}건의 견적서 상태를 "발송됨"으로 변경했습니다.`)
}

main().catch(console.error)
