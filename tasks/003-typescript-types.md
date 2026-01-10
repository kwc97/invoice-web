# Task 003: TypeScript 타입 정의 및 인터페이스 설계

## 📋 작업 개요

**우선순위**: 높음
**예상 소요 시간**: 2-3시간
**작업 유형**: 타입 시스템 설계
**관련 Phase**: Phase 1 - 애플리케이션 골격 구축
**선행 작업**: Task 001, Task 002 완료 필요

이 작업은 프로젝트 전체에서 사용할 TypeScript 타입, 인터페이스, Zod 스키마를 정의합니다. Notion 데이터베이스 구조를 기반으로 타입 시스템을 구축합니다.

## 🎯 목표

- Notion 데이터베이스 스키마 기반 타입 정의
- API 응답 타입 정의
- 컴포넌트 Props 타입 정의
- Zod 스키마 정의 (폼 검증용)
- 타입 안전성 확보
- 재사용 가능한 타입 유틸리티 작성

## 📦 관련 파일

| 파일 경로                      | 타입   | 설명                     |
| ------------------------------ | ------ | ------------------------ |
| `src/types/notion.ts`          | CREATE | Notion 데이터베이스 타입 |
| `src/types/quote.ts`           | CREATE | 견적서 관련 타입         |
| `src/types/auth.ts`            | CREATE | 인증 관련 타입           |
| `src/types/api.ts`             | CREATE | API 응답 타입            |
| `src/types/components.ts`      | CREATE | 컴포넌트 Props 타입      |
| `src/lib/validations/auth.ts`  | CREATE | 로그인 폼 Zod 스키마     |
| `src/lib/validations/quote.ts` | CREATE | 견적서 Zod 스키마        |
| `src/lib/constants.ts`         | CREATE | 상수 정의                |

## ✅ 완료 조건

- [ ] Notion 데이터베이스 타입 정의 완료
- [ ] 견적서 도메인 타입 정의 완료
- [ ] 인증 관련 타입 정의 완료
- [ ] API 응답 타입 정의 완료
- [ ] Zod 스키마 정의 완료
- [ ] 상수 파일 작성 완료
- [ ] TypeScript 컴파일 에러 없음
- [ ] 모든 타입에 JSDoc 주석 추가

## 📝 상세 구현 내용

### 1. 상수 정의

`src/lib/constants.ts`:

```typescript
/**
 * 견적서 상태 정의
 */
export const QUOTE_STATUS = {
  DRAFT: 'draft', // 작성중
  SENT: 'sent', // 발송됨
  VIEWED: 'viewed', // 확인됨
  APPROVED: 'approved', // 승인됨
  REJECTED: 'rejected', // 거부됨
} as const

/**
 * 견적서 상태 라벨 (한국어)
 */
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: '작성중',
  sent: '발송됨',
  viewed: '확인됨',
  approved: '승인됨',
  rejected: '거부됨',
}

/**
 * 견적서 상태 색상 (Tailwind classes)
 */
export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

/**
 * 날짜 포맷
 */
export const DATE_FORMAT = {
  DISPLAY: 'yyyy년 MM월 dd일', // 화면 표시용
  ISO: 'yyyy-MM-dd', // API 전송용
  DATETIME: 'yyyy-MM-dd HH:mm:ss', // 상세 표시용
} as const

/**
 * 페이지네이션 기본값
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

/**
 * API 설정
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30초
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1초
} as const

// 타입 추출
export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS]
```

**구현 요점:**

- as const로 리터럴 타입 보장
- 상수와 타입을 함께 정의
- 재사용 가능한 구조

### 2. Notion 데이터베이스 타입

`src/types/notion.ts`:

```typescript
/**
 * Notion API 응답의 기본 속성 타입
 */
export interface NotionProperty {
  id: string
  type: string
}

/**
 * Notion 제목 속성
 */
export interface NotionTitle extends NotionProperty {
  type: 'title'
  title: Array<{
    type: 'text'
    text: { content: string }
    plain_text: string
  }>
}

/**
 * Notion 리치텍스트 속성
 */
export interface NotionRichText extends NotionProperty {
  type: 'rich_text'
  rich_text: Array<{
    type: 'text'
    text: { content: string }
    plain_text: string
  }>
}

/**
 * Notion 숫자 속성
 */
export interface NotionNumber extends NotionProperty {
  type: 'number'
  number: number | null
}

/**
 * Notion 날짜 속성
 */
export interface NotionDate extends NotionProperty {
  type: 'date'
  date: {
    start: string
    end?: string | null
  } | null
}

/**
 * Notion 선택 속성
 */
export interface NotionSelect extends NotionProperty {
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
}

/**
 * Notion 관계 속성
 */
export interface NotionRelation extends NotionProperty {
  type: 'relation'
  relation: Array<{
    id: string
  }>
}

/**
 * Notion 고유 ID 속성
 */
export interface NotionUniqueId extends NotionProperty {
  type: 'unique_id'
  unique_id: {
    prefix: string | null
    number: number
  }
}

/**
 * Notion Quotes 데이터베이스 페이지
 */
export interface NotionQuotePage {
  id: string
  created_time: string
  last_edited_time: string
  properties: {
    quote_number: NotionUniqueId
    customer: NotionRelation
    issue_date: NotionDate
    valid_until: NotionDate
    status: NotionSelect
    total_amount: NotionNumber
    notes: NotionRichText
    public_link_id: NotionRichText
  }
}

/**
 * Notion QuoteItems 데이터베이스 페이지
 */
export interface NotionQuoteItemPage {
  id: string
  properties: {
    item_name: NotionTitle
    quote: NotionRelation
    quantity: NotionNumber
    unit_price: NotionNumber
    amount: NotionNumber
    description: NotionRichText
  }
}

/**
 * Notion Customers 데이터베이스 페이지
 */
export interface NotionCustomerPage {
  id: string
  properties: {
    name: NotionTitle
    email: NotionRichText
    phone: NotionRichText
    company: NotionRichText
    address: NotionRichText
  }
}

/**
 * Notion 데이터베이스 쿼리 응답
 */
export interface NotionDatabaseQueryResponse<T> {
  object: 'list'
  results: T[]
  next_cursor: string | null
  has_more: boolean
}
```

**구현 요점:**

- Notion API 응답 구조 정확히 반영
- 각 속성 타입별로 인터페이스 정의
- 제네릭을 사용한 재사용성

### 3. 견적서 도메인 타입

`src/types/quote.ts`:

```typescript
import { QuoteStatus } from '@/lib/constants'

/**
 * 고객 정보
 */
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
}

/**
 * 견적 항목
 */
export interface QuoteItem {
  id: string
  quoteId: string
  itemName: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

/**
 * 견적서
 */
export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customer?: Customer // 조인된 고객 정보
  issueDate: string
  validUntil: string
  status: QuoteStatus
  totalAmount: number
  notes: string
  publicLinkId: string | null
  items?: QuoteItem[] // 조인된 견적 항목들
  createdAt: string
  updatedAt: string
}

/**
 * 견적서 생성 데이터
 */
export interface CreateQuoteData {
  customerId: string
  issueDate: string
  validUntil: string
  notes?: string
  items: Array<{
    itemName: string
    description?: string
    quantity: number
    unitPrice: number
  }>
}

/**
 * 견적서 업데이트 데이터
 */
export interface UpdateQuoteData {
  status?: QuoteStatus
  notes?: string
  validUntil?: string
}

/**
 * 견적서 통계
 */
export interface QuoteStats {
  total: number
  draft: number
  sent: number
  viewed: number
  approved: number
  rejected: number
}

/**
 * 견적서 목록 필터
 */
export interface QuoteFilter {
  status?: QuoteStatus | QuoteStatus[]
  customerId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

/**
 * 견적서 목록 정렬
 */
export interface QuoteSort {
  field: 'quoteNumber' | 'issueDate' | 'validUntil' | 'totalAmount' | 'status'
  order: 'asc' | 'desc'
}

/**
 * 견적서 목록 조회 옵션
 */
export interface QuoteListOptions {
  filter?: QuoteFilter
  sort?: QuoteSort
  page?: number
  pageSize?: number
}

/**
 * 견적서 목록 응답
 */
export interface QuoteListResponse {
  quotes: Quote[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
```

**구현 요점:**

- 도메인 모델과 Notion 타입 분리
- CRUD 작업을 위한 DTO 타입 정의
- 필터링, 정렬, 페이지네이션 지원

### 4. 인증 관련 타입

`src/types/auth.ts`:

```typescript
/**
 * 사용자 (관리자)
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'admin'
}

/**
 * 로그인 credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * 세션
 */
export interface Session {
  user: User
  expires: string
}

/**
 * 인증 상태
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'
```

**구현 요점:**

- NextAuth.js와 호환되는 타입 구조
- 간단한 role 기반 권한 (admin만)

### 5. API 응답 타입

`src/types/api.ts`:

```typescript
/**
 * 성공 응답
 */
export interface SuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

/**
 * 에러 응답
 */
export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * API 응답 (성공 또는 에러)
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasMore: boolean
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * API 에러 코드
 */
export const API_ERROR_CODES = {
  // 인증 관련
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // 데이터 관련
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',

  // 서버 관련
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOTION_API_ERROR: 'NOTION_API_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]
```

**구현 요점:**

- 일관된 API 응답 형식
- 타입 안전한 에러 코드
- 제네릭으로 유연한 데이터 타입

### 6. 컴포넌트 Props 타입

`src/types/components.ts`:

```typescript
import { ReactNode } from 'react'
import { QuoteStatus } from '@/lib/constants'

/**
 * 기본 컴포넌트 Props
 */
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

/**
 * 상태 배지 Props
 */
export interface StatusBadgeProps {
  status: QuoteStatus
  className?: string
}

/**
 * 로딩 스피너 Props
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * 빈 상태 Props
 */
export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * 견적서 카드 Props
 */
export interface QuoteCardProps {
  quote: Quote
  onClick?: (quoteId: string) => void
  className?: string
}

/**
 * 견적서 테이블 Props
 */
export interface QuoteTableProps {
  quotes: Quote[]
  onQuoteClick?: (quoteId: string) => void
  isLoading?: boolean
  className?: string
}
```

**구현 요점:**

- 재사용 가능한 컴포넌트 Props
- 명확한 prop 타입 정의
- 선택적 props는 ? 표시

### 7. 로그인 폼 Zod 스키마

`src/lib/validations/auth.ts`:

```typescript
import { z } from 'zod'

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
})

/**
 * 로그인 폼 타입 (스키마에서 추론)
 */
export type LoginFormData = z.infer<typeof loginSchema>

/**
 * 비밀번호 변경 스키마
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z
      .string()
      .min(8, '새 비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
```

**구현 요점:**

- 한국어 에러 메시지
- 이메일, 비밀번호 검증 규칙
- z.infer로 타입 자동 추론

### 8. 견적서 Zod 스키마

`src/lib/validations/quote.ts`:

```typescript
import { z } from 'zod'
import { QUOTE_STATUS } from '@/lib/constants'

/**
 * 견적서 상태 업데이트 스키마
 */
export const updateQuoteStatusSchema = z.object({
  status: z.enum([
    QUOTE_STATUS.DRAFT,
    QUOTE_STATUS.SENT,
    QUOTE_STATUS.VIEWED,
    QUOTE_STATUS.APPROVED,
    QUOTE_STATUS.REJECTED,
  ]),
})

export type UpdateQuoteStatusData = z.infer<typeof updateQuoteStatusSchema>

/**
 * 견적 항목 스키마
 */
export const quoteItemSchema = z.object({
  itemName: z.string().min(1, '항목명을 입력해주세요'),
  description: z.string().optional(),
  quantity: z.number().min(1, '수량은 1 이상이어야 합니다'),
  unitPrice: z.number().min(0, '단가는 0 이상이어야 합니다'),
})

/**
 * 견적서 생성 스키마
 */
export const createQuoteSchema = z.object({
  customerId: z.string().min(1, '고객을 선택해주세요'),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, '최소 1개 이상의 항목이 필요합니다'),
})

export type CreateQuoteFormData = z.infer<typeof createQuoteSchema>

/**
 * 견적서 검색 필터 스키마
 */
export const quoteFilterSchema = z.object({
  status: z
    .enum([
      QUOTE_STATUS.DRAFT,
      QUOTE_STATUS.SENT,
      QUOTE_STATUS.VIEWED,
      QUOTE_STATUS.APPROVED,
      QUOTE_STATUS.REJECTED,
    ])
    .optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type QuoteFilterFormData = z.infer<typeof quoteFilterSchema>
```

**구현 요점:**

- 폼 검증과 API 검증에 재사용
- 배열 검증 (견적 항목)
- 조건부 검증 (refine 사용 가능)

### 9. 타입 유틸리티

각 타입 파일 상단에 JSDoc 주석 추가 예시:

```typescript
/**
 * @fileoverview 견적서 관련 타입 정의
 * @module types/quote
 *
 * 이 파일은 견적서 도메인의 모든 타입을 정의합니다.
 * Notion 데이터베이스 구조를 TypeScript 타입으로 변환하여
 * 타입 안전성을 보장합니다.
 *
 * @see {@link https://www.notion.so/api} Notion API 문서
 */
```

## 🧪 테스트 체크리스트

### 타입 컴파일 검증

- [ ] **TypeScript 컴파일**

  ```bash
  npm run typecheck
  ```

  - 에러 없이 통과해야 함

- [ ] **타입 import 테스트**
  - 각 타입 파일을 다른 파일에서 import
  - IDE 자동완성 작동 확인

### Zod 스키마 검증

- [ ] **로그인 스키마 테스트**

  ```typescript
  // 테스트 코드 예시 (작성하지 않고 수동 확인)
  const validData = { email: 'test@example.com', password: 'password123' }
  const invalidData = { email: 'invalid', password: '123' }
  ```

- [ ] **견적서 스키마 테스트**
  - 유효한 데이터로 parse 성공 확인
  - 무효한 데이터로 에러 발생 확인

### 타입 안전성 검증

- [ ] **enum 타입 사용**

  ```typescript
  const status: QuoteStatus = QUOTE_STATUS.SENT // ✅
  const invalid: QuoteStatus = 'invalid' // ❌ 컴파일 에러
  ```

- [ ] **선택적 속성**
  ```typescript
  const quote: Quote = { ... } // customer와 items는 선택적
  ```

### JSDoc 주석 검증

- [ ] 모든 인터페이스에 설명 주석 추가
- [ ] 복잡한 타입에 사용 예시 추가
- [ ] IDE에서 hover 시 설명 표시 확인

## 📌 참고사항

### TypeScript 베스트 프랙티스

1. **Interface vs Type**
   - 확장 가능한 객체: interface 사용
   - Union, Tuple: type 사용

2. **타입 추론 활용**
   - Zod 스키마에서 타입 추론 (`z.infer`)
   - 상수에서 타입 추론 (`as const`)

3. **Utility Types 활용**
   - `Partial<T>`: 모든 속성을 선택적으로
   - `Pick<T, K>`: 특정 속성만 선택
   - `Omit<T, K>`: 특정 속성 제외

### Zod 스키마 팁

- 에러 메시지는 사용자 친화적으로 작성
- 서버/클라이언트 양쪽에서 재사용
- transform()으로 데이터 변환 가능

### Notion API 타입 주의사항

- Notion API 응답은 중첩 구조가 깊음
- null 값 처리 필수
- 속성 타입별로 접근 방법이 다름

## 🔄 변경 사항 요약

(작업 완료 후 작성)

---

**다음 작업**: Phase 2 - UI/UX 완성 (Task 004부터)
