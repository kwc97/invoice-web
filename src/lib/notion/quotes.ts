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
import type { QuoteStatus } from '@/lib/constants'

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
    // 필터 구성
    const filter: any = options?.status
      ? {
          property: 'Status',
          select: {
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
    let quotes = quotesWithRelations.filter((q: Quote | null): q is Quote => q !== null)

    // 클라이언트 사이드 검색 (Notion API 검색 제한으로 인해)
    if (options?.search) {
      const searchLower = options.search.toLowerCase()
      quotes = quotes.filter(
        (q: Quote) =>
          q.quoteNumber.toLowerCase().includes(searchLower) ||
          (q.customer?.name.toLowerCase().includes(searchLower) ?? false)
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
        select: {
          name: status,
        },
      },
    },
  })
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
  return unstable_cache(
    async () => getQuoteById(id),
    ['quote-detail', id],
    { revalidate: CACHE_REVALIDATE, tags: ['quotes'] }
  )()
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
