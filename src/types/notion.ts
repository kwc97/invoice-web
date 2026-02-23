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

/** Notion Email 속성 */
export interface NotionEmail {
  id: string
  type: 'email'
  email: string | null
}

/** Notion Phone Number 속성 */
export interface NotionPhoneNumber {
  id: string
  type: 'phone_number'
  phone_number: string | null
}

/** Notion Formula 속성 */
export interface NotionFormula {
  id: string
  type: 'formula'
  formula: {
    type: 'number' | 'string' | 'boolean' | 'date'
    number?: number | null
    string?: string | null
    boolean?: boolean | null
    date?: { start: string } | null
  }
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
    /** 이메일 (Email) */
    Email: NotionEmail
    /** 전화번호 (Phone Number) */
    Phone: NotionPhoneNumber
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
    /** 단가 (Number - 통화 형식) */
    'Unit Price': NotionNumber
    /** 금액 (Formula - Unit Price * Quantity) */
    Amount: NotionFormula
    /** 연결된 견적서 (Relation) */
    Quotes: NotionRelation
    /** 단위 (Rich Text, 선택) */
    Unit?: NotionRichText
    /** 비고 (Rich Text, 선택) */
    Remarks?: NotionRichText
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
    /** 총액 (Number) - Notion DB 속성명에 뒤 공백 포함 */
    'Total Amount ': NotionNumber
    /** 비고 (Rich Text) */
    Notes: NotionRichText
    /** 공개 링크 ID (Rich Text) */
    'Public Link ID': NotionRichText
    /** 견적 항목들 (Relation) */
    'Quote Items': NotionRelation
    /** 프로젝트명 (Rich Text, 선택) */
    'Project Name'?: NotionRichText
    /** 수신처 (Rich Text, 선택) */
    Recipient?: NotionRichText
    /** 견적 담당자 (Rich Text, 선택) */
    'Contact Person'?: NotionRichText
    /** 견적서 언어 (Select, 선택) */
    Language?: NotionSelect
    /** 회사 (Select, 선택) */
    Company?: NotionSelect
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
