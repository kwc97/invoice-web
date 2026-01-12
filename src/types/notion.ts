/**
 * Notion API 응답 타입 정의
 * @notionhq/client 타입을 확장하여 프로젝트 특화 타입 정의
 */

/**
 * Notion 속성 기본 타입
 */

/** Notion Title 속성 */
export interface NotionTitle {
  id: string
  type: 'title'
  title: Array<{
    type: 'text'
    text: { content: string }
    plain_text: string
  }>
}

/** Notion Rich Text 속성 */
export interface NotionRichText {
  id: string
  type: 'rich_text'
  rich_text: Array<{
    type: 'text'
    text: { content: string }
    plain_text: string
  }>
}

/** Notion Number 속성 */
export interface NotionNumber {
  id: string
  type: 'number'
  number: number | null
}

/** Notion Date 속성 */
export interface NotionDate {
  id: string
  type: 'date'
  date: {
    start: string
    end: string | null
  } | null
}

/** Notion Select 속성 */
export interface NotionSelect {
  id: string
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
}

/** Notion Relation 속성 */
export interface NotionRelation {
  id: string
  type: 'relation'
  relation: Array<{ id: string }>
}

/**
 * Customers 데이터베이스 페이지 타입
 */
export interface NotionCustomerPage {
  id: string
  object: 'page'
  created_time: string
  last_edited_time: string
  archived: boolean
  url: string
  properties: {
    /** 고객명 (Title) */
    Name: NotionTitle
    /** 회사명 (Rich Text) */
    Company: NotionRichText
    /** 이메일 (Rich Text) */
    Email: NotionRichText
    /** 전화번호 (Rich Text) */
    Phone: NotionRichText
    /** 주소 (Rich Text) */
    Address: NotionRichText
  }
}

/**
 * Quote Items 데이터베이스 페이지 타입
 */
export interface NotionQuoteItemPage {
  id: string
  object: 'page'
  created_time: string
  last_edited_time: string
  archived: boolean
  url: string
  properties: {
    /** 항목명 (Title) */
    Name: NotionTitle
    /** 설명 (Rich Text) */
    Description: NotionRichText
    /** 수량 (Number) */
    Quantity: NotionNumber
    /** 단가 (Rich Text - 통화 문자열) */
    'Unit Price': NotionRichText
    /** 금액 (Rich Text - 통화 문자열) */
    Amount: NotionRichText
    /** 연결된 견적서 (Relation) */
    Quotes: NotionRelation
  }
}

/**
 * Quotes 데이터베이스 페이지 타입
 */
export interface NotionQuotePage {
  id: string
  object: 'page'
  created_time: string
  last_edited_time: string
  archived: boolean
  url: string
  properties: {
    /** 견적서 번호 (Title) */
    Name: NotionTitle
    /** 고객 (Relation) */
    Customer: NotionRelation
    /** 발행일 (Rich Text - 한글 날짜) */
    'Issue Date': NotionRichText
    /** 유효기간 (Rich Text - 한글 날짜) */
    'Valid Until': NotionRichText
    /** 상태 (Select) */
    Status: NotionSelect
    /** 총액 (Number) */
    'Total Amount': NotionNumber
    /** 비고 (Rich Text) */
    Notes: NotionRichText
    /** 공개 링크 ID (Rich Text) */
    'Public Link ID': NotionRichText
    /** 견적 항목들 (Relation) */
    'Quote Items': NotionRelation
  }
}

/**
 * Notion 데이터베이스 쿼리 응답 타입
 */
export interface NotionDatabaseQueryResponse<T> {
  object: 'list'
  results: T[]
  next_cursor: string | null
  has_more: boolean
}
