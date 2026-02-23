/**
 * Notion API 응답 타입을 애플리케이션 타입으로 변환
 */

import type {
  NotionQuotePage,
  NotionQuoteItemPage,
  NotionCustomerPage,
} from '@/types/notion'
import type { Quote, QuoteItem, Customer } from '@/types/quote'
import type { QuoteStatus } from '@/lib/constants'
import type { SupportedLanguage } from '@/lib/i18n/types'
import { getCompanyIdByNotionValue, type CompanyId } from '@/lib/company'

/**
 * Notion Rich Text 추출
 * @param richText - Notion Rich Text 배열
 * @returns 텍스트 내용 (없으면 빈 문자열)
 */
function extractRichText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  if (!richText || richText.length === 0) return ''
  return richText[0].plain_text
}

/**
 * Notion Title 추출
 * @param title - Notion Title 배열
 * @returns 제목 텍스트
 */
function extractTitle(title: Array<{ plain_text: string }>): string {
  if (!title || title.length === 0) return ''
  return title[0].plain_text
}

/**
 * 통화 문자열을 숫자로 변환
 * "₩2,500,000" → 2500000
 */
export function parseCurrency(currencyStr: string): number {
  return parseInt(currencyStr.replace(/[₩,]/g, ''), 10) || 0
}

/**
 * ISO 날짜를 한글 형식으로 변환
 * "2026-01-11" → "2026년 01월 11일"
 */
function formatDateToKorean(isoDate: string): string {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 한글 날짜를 ISO 형식으로 변환
 * "2026년 01월 11일" → "2026-01-11"
 */
export function koreanDateToISO(koreanDate: string): string {
  if (!koreanDate) return ''
  const match = koreanDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (!match) return ''
  const [, year, month, day] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/**
 * Notion Customer 페이지를 Customer 타입으로 변환
 */
export function mapNotionCustomerToCustomer(
  page: NotionCustomerPage
): Customer {
  return {
    id: page.id,
    name: extractTitle(page.properties.Name?.title),
    company: extractRichText(page.properties.Company?.rich_text),
    email: page.properties.Email?.email || undefined,
    phone: page.properties.Phone?.phone_number || undefined,
    address: extractRichText(page.properties.Address?.rich_text),
  }
}

/**
 * Notion QuoteItem 페이지를 QuoteItem 타입으로 변환
 */
export function mapNotionQuoteItemToQuoteItem(
  page: NotionQuoteItemPage
): QuoteItem {
  const quoteRelation = page.properties.Quotes?.relation ?? []
  const quoteId = quoteRelation.length > 0 ? quoteRelation[0].id : ''

  const unit = extractRichText(page.properties.Unit?.rich_text)
  const remarks = extractRichText(page.properties.Remarks?.rich_text)

  return {
    id: page.id,
    name: extractTitle(page.properties.Name?.title),
    description: extractRichText(page.properties.Description?.rich_text),
    quantity: page.properties.Quantity?.number ?? 0,
    unitPrice: page.properties['Unit Price']?.number ?? 0,
    amount: page.properties.Amount?.formula?.number ?? 0,
    quoteId,
    ...(unit && { unit }),
    ...(remarks && { remarks }),
  }
}

/**
 * Notion Quote 페이지를 Quote 타입으로 변환
 */
export function mapNotionQuoteToQuote(
  page: NotionQuotePage,
  customer: Customer,
  items: QuoteItem[]
): Quote {
  const quoteNumber = extractTitle(page.properties.Name?.title)

  // Status는 Notion 'status' 타입 (select 타입과 구조가 다름)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusProp = page.properties.Status as any
  const status = (statusProp?.status?.name ??
    statusProp?.select?.name ??
    '작성중') as QuoteStatus

  // Issue Date와 Valid Until은 'date' 타입 (Rich Text가 아님)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issueDateProp = page.properties['Issue Date'] as any
  const issueDateRaw = issueDateProp?.date?.start ?? ''
  const issueDate = formatDateToKorean(issueDateRaw)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validUntilProp = page.properties['Valid Until'] as any
  const validUntilRaw = validUntilProp?.date?.start ?? ''
  const validUntil = formatDateToKorean(validUntilRaw)

  const notes = extractRichText(page.properties.Notes?.rich_text)
  const publicLinkId = extractRichText(
    page.properties['Public Link ID']?.rich_text
  )
  const projectName = extractRichText(
    page.properties['Project Name']?.rich_text
  )
  const recipient = extractRichText(page.properties.Recipient?.rich_text)
  const contactPerson = extractRichText(
    page.properties['Contact Person']?.rich_text
  )

  // Language Select에서 값 추출 (null이면 'ko' 기본값)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const languageProp = page.properties.Language as any
  const language = (languageProp?.select?.name ?? 'ko') as SupportedLanguage

  // Company Select에서 값 추출 (null이면 'kprotek' 기본값)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyProp = page.properties.Company as any
  const company: CompanyId = getCompanyIdByNotionValue(
    companyProp?.select?.name ?? null
  )

  // Total Amount는 'Total Amount ' (공백 포함!) + Rollup 타입
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalAmountProp = page.properties['Total Amount '] as any
  const totalAmount = totalAmountProp?.rollup?.number ?? 0

  return {
    id: page.id,
    quoteNumber,
    customerId: customer.id,
    customer,
    items,
    issueDate,
    validUntil,
    status,
    totalAmount,
    notes,
    publicLinkId: publicLinkId || null,
    ...(projectName && { projectName }),
    ...(recipient && { recipient }),
    ...(contactPerson && { contactPerson }),
    language,
    company,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  }
}
