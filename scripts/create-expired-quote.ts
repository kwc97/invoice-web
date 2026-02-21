/**
 * 만료된 견적서 더미 데이터 생성 스크립트
 * 실행: npx tsx scripts/create-expired-quote.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from '@notionhq/client'
import { config } from 'dotenv'
import { resolve } from 'path'
import { randomBytes } from 'crypto'

config({ path: resolve(process.cwd(), '.env.local') })

const notion = new Client({ auth: process.env.NOTION_API_KEY! })
const QUOTES_DB = process.env.NOTION_DATABASE_QUOTES_ID!
const ITEMS_DB = process.env.NOTION_DATABASE_QUOTE_ITEMS_ID!
const CUSTOMERS_DB = process.env.NOTION_DATABASE_CUSTOMERS_ID!

function richText(content: string) {
  return { rich_text: [{ text: { content } }] }
}

async function main() {
  console.log('📋 기존 고객 조회 중...')

  // 첫 번째 고객 가져오기
  const customers = await (notion.databases as any).query({
    database_id: CUSTOMERS_DB,
    page_size: 1,
  })

  if (customers.results.length === 0) {
    console.error('❌ 고객이 없습니다. 먼저 고객을 생성하세요.')
    process.exit(1)
  }

  const customerId = customers.results[0].id
  const customerName =
    customers.results[0].properties.Name?.title?.[0]?.plain_text ?? '고객'
  console.log(`✅ 고객: ${customerName} (${customerId})`)

  // 만료된 견적서 생성 (유효기간: 2025년 12월 31일)
  console.log('📝 만료된 견적서 생성 중...')
  const publicLinkId = randomBytes(8).toString('base64url')

  const quote = await notion.pages.create({
    parent: { database_id: QUOTES_DB },
    properties: {
      Name: { title: [{ text: { content: 'QFK-25-099' } }] },
      Customer: { relation: [{ id: customerId }] },
      'Issue Date': { date: { start: '2025-10-01' } } as any,
      'Valid Until': { date: { start: '2025-12-31' } } as any,
      Status: { status: { name: '발송됨' } } as any,
      Language: { select: { name: 'en' } } as any,
      'Project Name': richText('Expired Test Project'),
      Recipient: richText(`${customerName} 귀중`),
      'Contact Person': richText('영업관리부 박원준 과장 010-3307-9943'),
      'Public Link ID': richText(publicLinkId),
      Notes: richText(
        '1. 부가세 별도\n2. 견적 유효기간: 제출일로부터 30일\n3. 납품기간: 발주 후 4주 이내\n4. 결제조건: 납품 후 30일 이내 현금결제'
      ),
    } as any,
  })

  console.log(`✅ 견적서 생성: QFK-25-099 (${quote.id})`)

  // 견적 항목 생성
  console.log('📝 견적 항목 생성 중...')

  const items = [
    { name: '방폭 모터', unit: '대', qty: 2, price: 15000000, remarks: '22kW' },
    {
      name: '제어반 제작',
      unit: '식',
      qty: 1,
      price: 8500000,
      remarks: 'PLC 포함',
    },
    { name: '배선 작업', unit: '인', qty: 10, price: 450000, remarks: '' },
  ]

  for (const item of items) {
    await notion.pages.create({
      parent: { database_id: ITEMS_DB },
      properties: {
        Name: { title: [{ text: { content: item.name } }] },
        Quantity: { number: item.qty },
        'Unit Price': { number: item.price },
        Quotes: { relation: [{ id: quote.id }] },
        Unit: richText(item.unit),
        ...(item.remarks ? { Remarks: richText(item.remarks) } : {}),
      } as any,
    })
    console.log(
      `  ✅ ${item.name} (${item.qty} x ₩${item.price.toLocaleString()})`
    )
  }

  console.log('')
  console.log('🎉 만료된 견적서 생성 완료!')
  console.log(`  견적번호: QFK-25-099`)
  console.log(`  유효기간: 2025-12-31 (만료됨)`)
  console.log(`  언어: English`)
  console.log(`  공개 링크: http://localhost:3000/quote/${publicLinkId}`)
}

main().catch(error => {
  console.error('❌ 오류:', error.message)
  process.exit(1)
})
