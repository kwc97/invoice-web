# Task 018: PDF 다운로드 기능 구현 (F004)

## 작업 개요

**우선순위**: 높음
**작업 유형**: 기능 구현 (비즈니스 로직)
**관련 Phase**: Phase 4 - 고급 기능 및 최적화
**선행 작업**: Task 015, Task 016 완료 필요

견적서 상세 페이지(공개)에서 클라이언트가 PDF 다운로드 버튼을 클릭하면, 인쇄 최적화된 견적서 PDF를 생성하여 다운로드하는 기능을 구현합니다.

## 목표

- `@react-pdf/renderer`를 사용하여 견적서 PDF 문서 컴포넌트 구현
- PDF 생성 API Route 구현 (Server-side PDF 렌더링)
- 견적서 상세 페이지(공개)의 PDF 다운로드 버튼 연동
- A4 인쇄 최적화 레이아웃 (여백, 폰트, 브랜딩)
- 한글 폰트 지원

## 관련 파일

| 파일 경로 | 타입 | 설명 |
| --- | --- | --- |
| `src/lib/pdf/document.tsx` | CREATE | PDF 문서 컴포넌트 (@react-pdf/renderer) |
| `src/lib/pdf/styles.ts` | CREATE | PDF 스타일 정의 |
| `src/app/api/pdf/[quoteId]/route.ts` | CREATE | PDF 생성 API Route |
| `src/components/quote/quote-actions.tsx` | MODIFY | PDF 다운로드 버튼 실제 연동 |
| `src/types/quote.ts` | REFERENCE | Quote, QuoteItem, Customer 타입 |
| `src/lib/notion/quotes.ts` | REFERENCE | getQuoteById() 함수 |
| `src/lib/constants.ts` | REFERENCE | CURRENCY, QUOTE_STATUS 상수 |
| `src/components/quote/public-quote-view.tsx` | REFERENCE | 공개 견적서 뷰 레이아웃 참고 |

## 완료 조건

- [ ] PDF 문서 컴포넌트 구현 (`@react-pdf/renderer`)
- [ ] PDF 스타일 정의 (A4, 여백, 폰트)
- [ ] PDF 생성 API Route 구현 (`/api/pdf/[quoteId]`)
- [ ] PDF 다운로드 버튼 실제 동작 연동
- [ ] PDF 내용에 견적서 전체 정보 포함
  - [ ] 회사 로고/정보 헤더
  - [ ] 고객 정보
  - [ ] 견적 항목 테이블
  - [ ] 합계 금액 (소계, 총액)
  - [ ] 유효기간 표시
  - [ ] 비고/안내사항
- [ ] 한글 텍스트 정상 렌더링
- [ ] PDF 다운로드 로딩 상태 표시
- [ ] 에러 발생 시 toast 알림
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint/Prettier 통과
- [ ] 빌드 성공

## 상세 구현 내용

### 1단계: PDF 스타일 정의

`src/lib/pdf/styles.ts`:

- `@react-pdf/renderer`의 `StyleSheet.create()` 사용
- A4 크기 기준 (210mm x 297mm)
- 여백: 상하좌우 적절한 여백 (약 20mm)
- 색상: 공개 견적서 뷰와 일관된 브랜딩 컬러
- 테이블 스타일: 헤더 배경, 행 구분선, 정렬

```typescript
// 주요 스타일 구조
- page: A4 크기, 패딩, 폰트패밀리
- header: 회사 정보 영역
- section: 정보 섹션 (고객 정보, 견적 내역 등)
- table: 견적 항목 테이블
- tableHeader / tableRow / tableCell: 테이블 세부 스타일
- totals: 합계 영역
- footer: 안내사항/비고 영역
```

### 2단계: PDF 문서 컴포넌트 구현

`src/lib/pdf/document.tsx`:

- `@react-pdf/renderer`의 `Document`, `Page`, `View`, `Text` 사용
- `Font.register()`로 한글 폰트 등록 (Google Fonts - Noto Sans KR)
- Props로 `Quote` 타입 데이터를 받아 PDF 렌더링

```
QuoteDocument 구조:
├── Page (A4)
│   ├── Header (회사 로고/정보, 견적서 번호)
│   ├── QuoteInfo (발행일, 유효기간)
│   ├── CustomerInfo (고객명, 회사명, 이메일, 전화번호)
│   ├── ItemsTable
│   │   ├── TableHeader (품목, 수량, 단가, 금액)
│   │   └── TableRows (각 항목별 행)
│   ├── Totals (소계, 총액)
│   └── Notes (비고/안내사항)
```

### 3단계: PDF 생성 API Route 구현

`src/app/api/pdf/[quoteId]/route.ts`:

- `GET` 핸들러 구현
- `quoteId` 파라미터로 Notion에서 견적서 데이터 조회 (`getQuoteById()`)
- `@react-pdf/renderer`의 `renderToBuffer()`로 PDF 생성
- 응답 헤더 설정:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="견적서-{quoteNumber}.pdf"`
- 에러 처리:
  - 견적서를 찾을 수 없는 경우 404 응답
  - PDF 생성 실패 시 500 응답

```typescript
// pseudocode
export async function GET(request, { params }) {
  const { quoteId } = await params

  // 견적서 데이터 조회 (고객, 항목 포함)
  const quote = await getQuoteById(quoteId, { includeCustomer: true, includeItems: true })

  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // PDF 생성
  const pdfBuffer = await renderToBuffer(<QuoteDocument quote={quote} />)

  // PDF 응답 반환
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`,
    },
  })
}
```

### 4단계: PDF 다운로드 버튼 연동

`src/components/quote/quote-actions.tsx` 수정:

- 기존 더미 `handlePdfDownload` 함수를 실제 API 호출로 교체
- `/api/pdf/{quoteId}`로 fetch 요청
- 응답 Blob을 URL로 변환하여 다운로드 트리거
- 로딩 상태 및 에러 처리

```typescript
// pseudocode
const handlePdfDownload = async () => {
  setIsLoading(true)
  try {
    const response = await fetch(`/api/pdf/${quoteId}`)
    if (!response.ok) throw new Error('PDF 생성 실패')

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `견적서.pdf`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('PDF 다운로드가 완료되었습니다')
  } catch {
    toast.error('PDF 다운로드에 실패했습니다')
  } finally {
    setIsLoading(false)
  }
}
```

## 테스트 체크리스트

Playwright MCP를 활용한 E2E 테스트:

- [ ] **PDF 다운로드 버튼 표시 확인**: 공개 견적서 페이지에 PDF 다운로드 버튼이 존재하는지 확인
- [ ] **PDF API Route 응답 확인**: `/api/pdf/{quoteId}`에 GET 요청 시 `application/pdf` Content-Type 응답 확인
- [ ] **존재하지 않는 견적서 PDF 요청 시 404**: 잘못된 quoteId로 API 요청 시 404 응답 확인
- [ ] **PDF 다운로드 로딩 상태**: 다운로드 버튼 클릭 시 로딩 상태 표시 확인
- [ ] **PDF 파일 생성 확인**: API 응답의 Content-Disposition 헤더에 파일명 포함 확인
- [ ] **승인/거부 상태에서도 PDF 다운로드 가능**: 이미 승인/거부된 견적서에서도 PDF 다운로드 버튼 동작 확인

## 참고사항

- `@react-pdf/renderer` v4.3.2가 이미 설치되어 있음 (package.json 확인)
- 한글 폰트는 Google Fonts CDN의 Noto Sans KR 사용 권장
- `@react-pdf/renderer`는 서버 사이드에서만 `renderToBuffer()` 사용 가능 → API Route에서 처리
- 공개 견적서 뷰(`public-quote-view.tsx`)의 레이아웃 구조를 참고하여 PDF 레이아웃 설계
- `QuoteActions` 컴포넌트에 현재 더미 `handlePdfDownload` 함수가 있으며, 이를 교체해야 함
- PDF 다운로드는 인증 없이 공개 페이지에서 동작해야 함

## 변경 사항 요약

(작업 완료 후 작성)
