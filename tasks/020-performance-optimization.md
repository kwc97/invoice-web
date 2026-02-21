# Task 020: 성능 최적화 및 캐싱 전략

## 작업 개요

**우선순위**: 중간
**작업 유형**: 성능 최적화
**관련 Phase**: Phase 4 - 고급 기능 및 최적화
**선행 작업**: Task 018, Task 019 완료 필요

현재 코드베이스 분석 결과, Notion API 호출에 대한 캐싱이 전혀 없고, 메타데이터가 미설정된 페이지들이 있으며, 동적 임포트 미활용 등의 최적화 기회가 확인되었습니다. 본 작업에서 이를 개선합니다.

## 현재 상태 분석

| 항목 | 현황 | 우선순위 |
| --- | --- | --- |
| Notion API 캐싱 | 미구현 - 매 요청마다 Notion API 호출 | 높음 |
| Root 메타데이터 | "NextJS Starter"로 남아있음 | 높음 |
| 동적 페이지 메타데이터 | generateMetadata() 미구현 | 중간 |
| 대시보드 중복 데이터 호출 | getQuoteStats()가 getQuotes()를 별도 호출 | 중간 |
| 동적 임포트 | 미사용 (PDF 모듈 등) | 낮음 |
| 이미지/폰트 최적화 | 이미 구현됨 (WebP/AVIF, Google Fonts 로컬) | 완료 |
| next.config.ts 최적화 | compress, optimizePackageImports 이미 설정 | 완료 |

## 목표

- React `cache()`를 활용한 Notion API 요청 중복 제거
- `unstable_cache()`를 활용한 시간 기반 Notion 응답 캐싱
- Root 메타데이터를 프로젝트에 맞게 업데이트
- 동적 페이지(견적서)에 `generateMetadata()` 적용
- 대시보드 데이터 호출 최적화 (중복 제거)
- 빌드 성공 및 check-all 통과

## 관련 파일

| 파일 경로 | 타입 | 설명 |
| --- | --- | --- |
| `src/lib/notion/quotes.ts` | MODIFY | React cache() 및 unstable_cache() 적용 |
| `src/lib/notion/stats.ts` | MODIFY | 캐싱 적용, 중복 호출 최적화 |
| `src/app/layout.tsx` | MODIFY | Root 메타데이터 업데이트 |
| `src/app/admin/dashboard/page.tsx` | MODIFY | 페이지 메타데이터 추가 |
| `src/app/admin/quote/[id]/page.tsx` | MODIFY | generateMetadata() 추가 |
| `src/app/quote/[publicId]/page.tsx` | MODIFY | generateMetadata() 추가 |
| `src/lib/notion/index.ts` | MODIFY | 새 export 추가 (필요시) |
| `next.config.ts` | REFERENCE | 현재 설정 확인 |

## 완료 조건

- [ ] Notion API 캐싱 적용 (unstable_cache)
- [ ] React cache()로 동일 요청 내 데이터 중복 제거
- [ ] Root 메타데이터 프로젝트에 맞게 업데이트
- [ ] 대시보드 페이지 메타데이터 추가
- [ ] 견적서 상세 페이지(관리자) generateMetadata() 구현
- [ ] 견적서 상세 페이지(공개) generateMetadata() 구현
- [ ] 대시보드 데이터 호출 최적화
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint/Prettier 통과
- [ ] 빌드 성공

## 상세 구현 내용

### 1단계: Notion API 캐싱 적용

`src/lib/notion/quotes.ts` 수정:

Next.js 15의 `unstable_cache()`를 활용하여 Notion API 응답을 캐싱합니다.

```typescript
// pseudocode
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

// React cache: 동일 렌더링 내 중복 호출 방지
export const getQuoteById = cache(async (id: string): Promise<Quote | null> => {
  // ... 기존 로직
})

// unstable_cache: 시간 기반 캐싱 (60초)
export const getCachedQuotes = unstable_cache(
  async (options) => getQuotes(options),
  ['quotes-list'],
  { revalidate: 60, tags: ['quotes'] }
)

export const getCachedQuoteById = unstable_cache(
  async (id) => getQuoteByIdInternal(id),
  ['quote-detail'],
  { revalidate: 60, tags: ['quotes'] }
)
```

**캐싱 전략:**
- `getQuotes()`: 60초 캐시, `quotes` 태그
- `getQuoteById()`: 60초 캐시, `quotes` 태그
- `getQuoteByPublicLink()`: 60초 캐시, `quotes` 태그
- 상태 업데이트(approve/reject) 시 `revalidateTag('quotes')` 호출
- 공개 링크 생성 시에도 `revalidateTag('quotes')` 호출

`src/lib/notion/stats.ts` 수정:

```typescript
// pseudocode
// 기존: getQuotes()를 매번 호출
// 개선: getCachedQuotes()를 사용하여 캐싱된 데이터 활용
export async function getQuoteStats(): Promise<QuoteStats> {
  const allQuotes = await getCachedQuotes()
  // ... 통계 계산
}
```

### 2단계: Server Action에 revalidateTag 추가

`src/app/actions/quote.ts` 수정:

```typescript
// pseudocode
import { revalidateTag } from 'next/cache'

// approveQuote, rejectQuote, createPublicLink 등에서
// 상태 변경 후 캐시 무효화
revalidateTag('quotes')
```

### 3단계: Root 메타데이터 업데이트

`src/app/layout.tsx` 수정:

```typescript
// 현재: "NextJS Starter - 모던 웹 스타터킷"
// 변경:
export const metadata: Metadata = {
  title: {
    template: '%s | 견적서 관리 시스템',
    default: '견적서 관리 시스템',
  },
  description: 'Notion 기반 견적서 관리 및 클라이언트 공유 시스템',
}
```

### 4단계: 페이지별 메타데이터 추가

**대시보드 페이지** (`src/app/admin/dashboard/page.tsx`):

```typescript
export const metadata: Metadata = {
  title: '대시보드',
}
```

**견적서 상세 - 관리자** (`src/app/admin/quote/[id]/page.tsx`):

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const quote = await getCachedQuoteById(id)
  return {
    title: quote ? `${quote.quoteNumber} 견적서` : '견적서 상세',
  }
}
```

**견적서 상세 - 공개** (`src/app/quote/[publicId]/page.tsx`):

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const quote = await getCachedQuoteByPublicLink(publicId)
  return {
    title: quote ? `견적서 - ${quote.quoteNumber}` : '견적서',
    description: quote
      ? `${quote.customer?.name}님께 보내는 견적서입니다.`
      : '견적서를 확인하세요.',
  }
}
```

### 5단계: 빌드 및 검증

```bash
npm run check-all   # typecheck, lint, format
npm run build       # 프로덕션 빌드
```

## 테스트 체크리스트

Playwright MCP를 활용한 E2E 테스트:

- [ ] **대시보드 페이지 로딩**: 캐싱 적용 후에도 데이터가 정상 표시되는지 확인
- [ ] **견적서 상세 페이지 로딩**: 캐싱 적용 후에도 견적서 상세 정보 정상 표시
- [ ] **상태 변경 후 캐시 무효화**: 승인/거부 후 대시보드에서 변경된 상태 반영 확인
- [ ] **공개 링크 생성 후 캐시 무효화**: 링크 생성 후 관리자 페이지에서 링크 ID 반영 확인
- [ ] **메타데이터 확인**: 각 페이지의 title 태그가 올바르게 설정되었는지 확인
- [ ] **빌드 성공**: npm run build 통과

## 참고사항

- `unstable_cache()`는 Next.js 15에서 안정적으로 사용 가능 (이름만 unstable)
- React `cache()`는 동일 서버 렌더링 내에서만 동작 (요청 간 공유 아님)
- `revalidateTag()`는 Server Action 또는 Route Handler에서만 호출 가능
- 캐시 시간(60초)은 Notion API의 실시간성과 성능 사이의 균형
- `generateMetadata()`에서 데이터를 fetch하면, 같은 페이지의 Server Component에서 동일 요청 시 React cache()로 중복 제거됨

## 변경 사항 요약

(작업 완료 후 작성)
