/**
 * Notion API를 사용한 견적서 조회 및 관리 함수
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { notion } from './client'
import { NOTION_DB_IDS } from './config'
import {
  mapNotionQuoteToQuote,
  mapNotionQuoteItemToQuoteItem,
  mapNotionCustomerToCustomer,
} from './mapper'
import type {
  NotionQuotePage,
  NotionQuoteItemPage,
  NotionCustomerPage,
} from '@/types/notion'
import type { Quote, QuoteItem, Customer } from '@/types/quote'
import { QUOTE_STATUS, type QuoteStatus } from '@/lib/constants'

/**
 * Customer ID로 고객 정보 조회
 */
export async function getCustomerById(
  customerId: string
): Promise<Customer | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: customerId })
    return mapNotionCustomerToCustomer(response as NotionCustomerPage)
  } catch (error) {
    console.error('Failed to fetch customer:', error)
    return null
  }
}

/**
 * Quote ID로 견적 항목 조회
 */
export async function getQuoteItemsByQuoteId(
  quoteId: string
): Promise<QuoteItem[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: NOTION_DB_IDS.QUOTE_ITEMS,
      filter: {
        property: 'Quotes',
        relation: {
          contains: quoteId,
        },
      },
    })

    return response.results.map((page: any) =>
      mapNotionQuoteItemToQuoteItem(page as NotionQuoteItemPage)
    )
  } catch (error) {
    console.error('Failed to fetch quote items:', error)
    return []
  }
}

/**
 * 견적서 목록 조회
 * @param options - 검색 및 필터 옵션
 */
export async function getQuotes(options?: {
  search?: string
  status?: QuoteStatus
  pageSize?: number
}): Promise<Quote[]> {
  try {
    // 필터 구성 (Status는 Notion 'status' 타입)
    const filter: any = options?.status
      ? {
          property: 'Status',
          status: {
            equals: options.status,
          },
        }
      : undefined

    const response = await (notion.databases as any).query({
      database_id: NOTION_DB_IDS.QUOTES,
      filter,
      sorts: [
        {
          property: 'Issue Date',
          direction: 'descending',
        },
      ],
      page_size: options?.pageSize || 100,
    })

    // Relation 데이터 병렬 조회
    const quotesWithRelations = await Promise.all(
      response.results.map(async (page: any) => {
        const quotePage = page as NotionQuotePage

        // Customer와 QuoteItems 병렬 조회
        const customerRelation = quotePage.properties.Customer.relation[0]
        if (!customerRelation) {
          console.warn('Quote has no customer relation:', quotePage.id)
          return null
        }

        const [customer, items] = await Promise.all([
          getCustomerById(customerRelation.id),
          getQuoteItemsByQuoteId(quotePage.id),
        ])

        if (!customer) {
          console.warn('Customer not found for quote:', quotePage.id)
          return null
        }

        return mapNotionQuoteToQuote(quotePage, customer, items)
      })
    )

    // null 제거 및 검색 필터 적용
    let quotes = quotesWithRelations.filter(
      (q: Quote | null): q is Quote => q !== null
    )

    // 클라이언트 사이드 검색 (Notion API 검색 제한으로 인해)
    if (options?.search) {
      const searchLower = options.search.toLowerCase()
      quotes = quotes.filter(
        (q: Quote) =>
          q.quoteNumber.toLowerCase().includes(searchLower) ||
          (q.customer?.name.toLowerCase().includes(searchLower) ?? false) ||
          (q.projectName?.toLowerCase().includes(searchLower) ?? false)
      )
    }

    return quotes
  } catch (error) {
    console.error('Failed to fetch quotes:', error)
    return []
  }
}

/**
 * ID로 단일 견적서 조회
 */
export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id })
    const quotePage = response as NotionQuotePage

    const customerRelation = quotePage.properties.Customer.relation[0]
    if (!customerRelation) {
      return null
    }

    const [customer, items] = await Promise.all([
      getCustomerById(customerRelation.id),
      getQuoteItemsByQuoteId(quotePage.id),
    ])

    if (!customer) {
      return null
    }

    return mapNotionQuoteToQuote(quotePage, customer, items)
  } catch (error) {
    console.error('Failed to fetch quote by ID:', error)
    return null
  }
}

/**
 * 공개 링크 ID로 견적서 조회
 */
export async function getQuoteByPublicLink(
  publicLinkId: string
): Promise<Quote | null> {
  try {
    const response = await (notion.databases as any).query({
      database_id: NOTION_DB_IDS.QUOTES,
      filter: {
        property: 'Public Link ID',
        rich_text: {
          equals: publicLinkId,
        },
      },
    })

    if (response.results.length === 0) {
      return null
    }

    const quotePage = response.results[0] as NotionQuotePage
    const customerRelation = quotePage.properties.Customer.relation[0]
    if (!customerRelation) {
      return null
    }

    const [customer, items] = await Promise.all([
      getCustomerById(customerRelation.id),
      getQuoteItemsByQuoteId(quotePage.id),
    ])

    if (!customer) {
      return null
    }

    return mapNotionQuoteToQuote(quotePage, customer, items)
  } catch (error) {
    console.error('Failed to fetch quote by public link:', error)
    return null
  }
}

/**
 * 견적서 공개 링크 업데이트
 */
export async function updateQuotePublicLink(
  quoteId: string,
  publicLinkId: string
): Promise<void> {
  await notion.pages.update({
    page_id: quoteId,
    properties: {
      'Public Link ID': {
        rich_text: [
          {
            text: {
              content: publicLinkId,
            },
          },
        ],
      },
    },
  })
}

/**
 * 견적서 상태 업데이트
 */
export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus
): Promise<void> {
  await notion.pages.update({
    page_id: quoteId,
    properties: {
      Status: {
        status: {
          name: status,
        },
      },
    },
  })
}

/**
 * 만료 대상 견적서 ID 목록 조회
 * 유효기간이 지난 발송됨/확인됨 상태의 견적서를 Notion DB에서 필터링
 */
export async function getExpiredQuoteIds(): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
  const response = await (notion.databases as any).query({
    database_id: NOTION_DB_IDS.QUOTES,
    filter: {
      and: [
        {
          or: [
            { property: 'Status', status: { equals: QUOTE_STATUS.SENT } },
            {
              property: 'Status',
              status: { equals: QUOTE_STATUS.CONFIRMED },
            },
          ],
        },
        { property: 'Valid Until', date: { before: today } },
      ],
    },
    page_size: 100,
  })
  return response.results.map((page: any) => page.id)
}

/**
 * 만료 대상 견적서를 Notion DB에서 일괄 업데이트 (순수 DB 작업)
 * revalidation 없이 DB만 업데이트하므로 페이지 렌더링 중 안전하게 호출 가능
 */
export async function expireOverdueQuotesInDb(): Promise<number> {
  try {
    const expiredIds = await getExpiredQuoteIds()
    if (expiredIds.length === 0) return 0

    await Promise.all(
      expiredIds.map(id => updateQuoteStatus(id, QUOTE_STATUS.EXPIRED))
    )
    return expiredIds.length
  } catch (error) {
    console.error('Failed to expire overdue quotes:', error)
    return 0
  }
}

/**
 * 새 고객 생성
 * @returns 생성된 Customer 객체
 */
export async function createCustomer(data: {
  name: string
  company?: string
  email?: string
  phone?: string
  address?: string
}): Promise<Customer> {
  const response = await notion.pages.create({
    parent: { database_id: NOTION_DB_IDS.CUSTOMERS },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      ...(data.company ? { Company: richText(data.company) } : {}),
      ...(data.email ? { Email: { email: data.email } as any } : {}),
      ...(data.phone ? { Phone: { phone_number: data.phone } as any } : {}),
      ...(data.address ? { Address: richText(data.address) } : {}),
    } as any,
  })

  return mapNotionCustomerToCustomer(response as NotionCustomerPage)
}

// ============================================================
// 고객 목록 조회
// ============================================================

/**
 * 전체 고객 목록 조회 (이름 오름차순)
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: NOTION_DB_IDS.CUSTOMERS,
      sorts: [{ property: 'Name', direction: 'ascending' }],
    })
    return response.results.map((page: any) =>
      mapNotionCustomerToCustomer(page as NotionCustomerPage)
    )
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return []
  }
}

// ============================================================
// 견적서 번호 생성
// ============================================================

/**
 * 다음 견적서 번호 자동 생성
 * 형식: QFK-YY-NNN (예: QFK-26-023)
 */
export async function generateQuoteNumber(): Promise<string> {
  const now = new Date()
  const yearPrefix = String(now.getFullYear()).slice(2) // "26"

  try {
    // 최근 견적서를 번호 내림차순으로 1건 조회
    const response = await (notion.databases as any).query({
      database_id: NOTION_DB_IDS.QUOTES,
      sorts: [{ property: 'Name', direction: 'descending' }],
      page_size: 1,
    })

    if (response.results.length > 0) {
      const page = response.results[0] as NotionQuotePage
      const lastName = page.properties.Name?.title?.[0]?.plain_text ?? ''
      // QFK-26-022 → year=26, seq=22
      const match = lastName.match(/QFK-(\d{2})-(\d{3})/)
      if (match) {
        const [, lastYear, lastSeq] = match
        if (lastYear === yearPrefix) {
          const nextSeq = String(Number(lastSeq) + 1).padStart(3, '0')
          return `QFK-${yearPrefix}-${nextSeq}`
        }
      }
    }

    // 해당 연도 첫 번째 견적서
    return `QFK-${yearPrefix}-001`
  } catch (error) {
    console.error('Failed to generate quote number:', error)
    return `QFK-${yearPrefix}-001`
  }
}

// ============================================================
// 견적서 CRUD
// ============================================================

/** Notion rich_text 속성 헬퍼 */
function richText(content: string) {
  return { rich_text: [{ text: { content } }] }
}

/**
 * 견적서 생성
 * @returns 생성된 페이지 ID
 */
export async function createQuote(data: {
  quoteNumber: string
  customerId: string
  issueDate: string // YYYY-MM-DD
  validUntil: string
  projectName?: string
  recipient?: string
  contactPerson?: string
  notes?: string
  language?: string
}): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: NOTION_DB_IDS.QUOTES },
    properties: {
      Name: { title: [{ text: { content: data.quoteNumber } }] },
      Customer: { relation: [{ id: data.customerId }] },
      'Issue Date': { date: { start: data.issueDate } } as any,
      'Valid Until': { date: { start: data.validUntil } } as any,
      Status: { status: { name: '작성중' } } as any,
      ...(data.notes ? { Notes: richText(data.notes) } : {}),
      ...(data.projectName
        ? { 'Project Name': richText(data.projectName) }
        : {}),
      ...(data.recipient ? { Recipient: richText(data.recipient) } : {}),
      ...(data.contactPerson
        ? { 'Contact Person': richText(data.contactPerson) }
        : {}),
      ...(data.language
        ? { Language: { select: { name: data.language } } }
        : {}),
    } as any,
  })
  return response.id
}

/**
 * 견적 항목 생성
 * @returns 생성된 페이지 ID
 */
export async function createQuoteItem(data: {
  name: string
  description?: string
  quantity: number
  unitPrice: number
  unit?: string
  remarks?: string
  quoteId: string
}): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: NOTION_DB_IDS.QUOTE_ITEMS },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Quantity: { number: data.quantity },
      'Unit Price': { number: data.unitPrice },
      Quotes: { relation: [{ id: data.quoteId }] },
      ...(data.description ? { Description: richText(data.description) } : {}),
      ...(data.unit ? { Unit: richText(data.unit) } : {}),
      ...(data.remarks ? { Remarks: richText(data.remarks) } : {}),
    } as any,
  })
  return response.id
}

/**
 * 견적서 수정
 */
export async function updateQuote(
  quoteId: string,
  data: {
    customerId?: string
    issueDate?: string
    validUntil?: string
    projectName?: string
    recipient?: string
    contactPerson?: string
    notes?: string
    status?: QuoteStatus
    language?: string
  }
): Promise<void> {
  const properties: any = {}

  if (data.customerId) {
    properties.Customer = { relation: [{ id: data.customerId }] }
  }
  if (data.issueDate) {
    properties['Issue Date'] = { date: { start: data.issueDate } }
  }
  if (data.validUntil) {
    properties['Valid Until'] = { date: { start: data.validUntil } }
  }
  if (data.status) {
    properties.Status = { status: { name: data.status } }
  }
  // 빈 문자열도 허용 (내용 지우기)
  if (data.notes !== undefined) {
    properties.Notes = richText(data.notes)
  }
  if (data.projectName !== undefined) {
    properties['Project Name'] = richText(data.projectName)
  }
  if (data.recipient !== undefined) {
    properties.Recipient = richText(data.recipient)
  }
  if (data.contactPerson !== undefined) {
    properties['Contact Person'] = richText(data.contactPerson)
  }
  if (data.language) {
    properties.Language = { select: { name: data.language } }
  }

  await notion.pages.update({ page_id: quoteId, properties })
}

/**
 * 견적 항목 수정
 */
export async function updateQuoteItem(
  itemId: string,
  data: {
    name?: string
    description?: string
    quantity?: number
    unitPrice?: number
    unit?: string
    remarks?: string
  }
): Promise<void> {
  const properties: any = {}

  if (data.name !== undefined) {
    properties.Name = { title: [{ text: { content: data.name } }] }
  }
  if (data.quantity !== undefined) {
    properties.Quantity = { number: data.quantity }
  }
  if (data.unitPrice !== undefined) {
    properties['Unit Price'] = { number: data.unitPrice }
  }
  if (data.description !== undefined) {
    properties.Description = richText(data.description)
  }
  if (data.unit !== undefined) {
    properties.Unit = richText(data.unit)
  }
  if (data.remarks !== undefined) {
    properties.Remarks = richText(data.remarks)
  }

  await notion.pages.update({ page_id: itemId, properties })
}

/**
 * 견적서 아카이브 (소프트 삭제)
 * 연결된 Quote Items도 함께 아카이브
 */
export async function archiveQuote(quoteId: string): Promise<void> {
  // 연결된 항목들 먼저 아카이브
  const items = await getQuoteItemsByQuoteId(quoteId)
  await Promise.all(items.map(item => archiveQuoteItem(item.id)))

  // 견적서 아카이브
  await notion.pages.update({ page_id: quoteId, archived: true })
}

/**
 * 견적 항목 아카이브 (소프트 삭제)
 */
export async function archiveQuoteItem(itemId: string): Promise<void> {
  await notion.pages.update({ page_id: itemId, archived: true })
}

// ============================================================
// 캐싱 함수 (unstable_cache + React cache)
// ============================================================

/** 캐시 재검증 시간 (초) */
const CACHE_REVALIDATE = 60

/**
 * 견적서 목록 조회 (캐싱 적용)
 * unstable_cache: 60초 시간 기반 캐싱
 */
export const getCachedQuotes = unstable_cache(
  async (search?: string, status?: QuoteStatus) => {
    return getQuotes({ search, status })
  },
  ['quotes-list'],
  { revalidate: CACHE_REVALIDATE, tags: ['quotes'] }
)

/**
 * ID로 단일 견적서 조회 (캐싱 적용)
 * React cache: 동일 서버 렌더링 내 중복 호출 방지
 * unstable_cache: 60초 시간 기반 캐싱
 */
export const getCachedQuoteById = cache((id: string) => {
  return unstable_cache(async () => getQuoteById(id), ['quote-detail', id], {
    revalidate: CACHE_REVALIDATE,
    tags: ['quotes'],
  })()
})

/**
 * 공개 링크 ID로 견적서 조회 (캐싱 적용)
 * React cache: 동일 서버 렌더링 내 중복 호출 방지
 * unstable_cache: 60초 시간 기반 캐싱
 */
export const getCachedQuoteByPublicLink = cache((publicLinkId: string) => {
  return unstable_cache(
    async () => getQuoteByPublicLink(publicLinkId),
    ['quote-public', publicLinkId],
    { revalidate: CACHE_REVALIDATE, tags: ['quotes'] }
  )()
})

/**
 * 고객 목록 조회 (캐싱 적용)
 */
export const getCachedCustomers = unstable_cache(
  async () => getCustomers(),
  ['customers-list'],
  { revalidate: CACHE_REVALIDATE, tags: ['customers'] }
)
