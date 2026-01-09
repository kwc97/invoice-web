# Notion 기반 견적서 관리 시스템 개발 로드맵

Notion 데이터베이스 기반으로 견적서를 관리하고, 클라이언트가 웹에서 견적서를 확인하고 PDF로 다운로드할 수 있는 시스템

## 개요

**Notion 기반 견적서 관리 시스템**은 비즈니스 오너 및 관리자를 위한 견적서 관리 플랫폼으로 다음 기능을 제공합니다:

- **Notion API 연동**: Notion 데이터베이스(Quotes, Quote Items, Customers)와 실시간 동기화
- **공개 링크 생성**: 각 견적서에 고유한 공개 접근 링크를 자동 생성하여 클라이언트 공유
- **PDF 다운로드**: 견적서를 인쇄 친화적 PDF로 변환하여 다운로드 제공
- **상태 관리**: 클라이언트의 승인/거부를 Notion에 반영하여 진행 상태 추적
- **대시보드 통계**: 견적서 상태별 요약 및 전체 현황 모니터링
- **관리자 인증**: 이메일/비밀번호 기반 관리자 로그인 시스템

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 환경 설정 및 초기 구조 구성** - 우선순위
  - Next.js 15.5.3 프로젝트 초기 설정 완료 여부 확인
  - 필수 패키지 설치 (@notionhq/client, @react-pdf/renderer, NextAuth.js v5 등)
  - 환경 변수 설정 (.env.local 파일 구성)
  - ESLint, Prettier, Husky, lint-staged 설정 검증

- **Task 002: 라우트 구조 및 페이지 골격 생성**
  - Next.js App Router 기반 전체 라우트 구조 생성
    - `/app/login/page.tsx` (로그인 페이지)
    - `/app/admin/dashboard/page.tsx` (관리자 대시보드)
    - `/app/admin/quote/[id]/page.tsx` (견적서 상세 - 관리자용)
    - `/app/quote/[publicId]/page.tsx` (견적서 상세 - 공개)
  - 공통 레이아웃 컴포넌트 골격 구현
    - `/app/admin/layout.tsx` (관리자 전용 레이아웃)
    - `/components/layout/Header.tsx`
    - `/components/layout/Footer.tsx`
  - 각 페이지에 기본 메타데이터 및 타이틀 설정

- **Task 003: TypeScript 타입 정의 및 인터페이스 설계**
  - Notion 데이터베이스 스키마 기반 타입 정의
    - `/types/notion.ts` (Quotes, QuoteItems, Customers)
    - `/types/quote.ts` (Quote, QuoteItem, Customer, QuoteStatus)
    - `/types/auth.ts` (User, Session)
  - API 응답 타입 정의
    - `/types/api.ts` (APIResponse, ErrorResponse)
  - 컴포넌트 Props 타입 정의
    - `/types/components.ts` (공통 컴포넌트 Props)
  - Zod 스키마 정의 (폼 검증용)
    - `/lib/validations/auth.ts` (로그인 폼)
    - `/lib/validations/quote.ts` (견적서 상태 업데이트)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 004: shadcn/ui 컴포넌트 설치 및 공통 컴포넌트 구현**
  - shadcn/ui 필수 컴포넌트 설치
    - button, card, table, badge, input, form, select, dialog, toast
  - 공통 UI 컴포넌트 구현
    - `/components/ui/StatusBadge.tsx` (견적서 상태 배지)
    - `/components/ui/LoadingSpinner.tsx`
    - `/components/ui/EmptyState.tsx`
  - TailwindCSS v4 커스텀 설정
    - 회사 브랜딩 색상 정의
    - 타이포그래피 스타일 설정

- **Task 005: 더미 데이터 생성 유틸리티 작성**
  - 더미 데이터 파일 생성
    - `/lib/dummy-data/quotes.ts` (견적서 샘플 데이터)
    - `/lib/dummy-data/customers.ts` (고객 샘플 데이터)
    - `/lib/dummy-data/users.ts` (관리자 계정 샘플 데이터)
  - 더미 데이터 생성 함수 구현
    - `generateQuotes()`, `generateCustomers()`, `generateQuoteItems()`
  - 다양한 상태의 견적서 데이터 포함 (작성중, 발송됨, 확인됨, 승인됨, 거부됨)

- **Task 006: 로그인 페이지 UI 구현**
  - 로그인 폼 컴포넌트 구현 (더미 데이터 사용)
    - 이메일 입력 필드 (React Hook Form + Zod 검증)
    - 비밀번호 입력 필드
    - 로그인 버튼
    - 에러 메시지 표시 영역
  - 반응형 디자인 적용 (모바일, 태블릿, 데스크톱)
  - 로딩 상태 UI 구현
  - 더미 인증 함수 연결 (하드코딩된 성공/실패 시나리오)

- **Task 007: 관리자 대시보드 페이지 UI 구현**
  - 대시보드 레이아웃 구현
    - 상태별 요약 카드 (발송됨, 확인됨, 승인됨, 거부됨)
    - 견적서 목록 테이블 컴포넌트
  - 더미 데이터로 견적서 목록 표시
    - 견적서 번호, 고객명, 발행일, 유효기간, 상태, 금액
  - 검색 및 필터링 UI 구현
    - 검색 입력 필드
    - 상태별 필터 드롭다운
    - 날짜 범위 필터 (옵션)
  - 새로고침 버튼 UI
  - 견적서 클릭 시 상세 페이지 이동 (더미 라우팅)

- **Task 008: 견적서 상세 페이지 (관리자용) UI 구현**
  - 견적서 정보 표시 레이아웃
    - 헤더 영역 (견적서 번호, 상태 배지)
    - 고객 정보 섹션
    - 견적 항목 테이블 (품목, 수량, 단가, 금액)
    - 합계 금액 섹션 (소계, 부가세, 총액)
    - 비고 및 조건 영역
  - 공개 링크 생성 UI
    - "공개 링크 생성" 버튼
    - 생성된 링크 표시 영역
    - "링크 복사" 버튼 (클립보드 복사 기능)
  - 뒤로가기 버튼
  - 더미 데이터로 모든 정보 표시

- **Task 009: 견적서 상세 페이지 (공개) UI 구현**
  - 클라이언트 친화적 레이아웃 구현
    - 회사 로고 및 정보 헤더
    - 고객 정보 표시
    - 견적 항목 테이블 (깔끔한 디자인)
    - 합계 금액 강조 표시
    - 유효기간 강조 표시
    - 기타 조건 및 안내사항
  - 액션 버튼 UI
    - "PDF 다운로드" 버튼
    - "승인" 버튼
    - "거부" 버튼
  - 상태 변경 후 완료 메시지 UI
  - 반응형 디자인 (모바일 최적화)
  - 더미 데이터로 모든 정보 표시

- **Task 010: 네비게이션 및 레이아웃 완성**
  - 헤더 컴포넌트 완성
    - 로고 및 서비스명
    - 관리자 메뉴 (대시보드, 로그아웃)
    - 모바일 햄버거 메뉴
  - Footer 컴포넌트 구현
  - 관리자 레이아웃 미들웨어 (더미 인증 체크)
  - 페이지 전환 애니메이션 (선택사항)

### Phase 3: 핵심 기능 구현

- **Task 011: Notion API 연동 설정**
  - Notion API 클라이언트 설정
    - `/lib/notion/client.ts` (@notionhq/client 초기화)
    - 환경 변수에서 Notion Integration Token 로드
  - Notion 데이터베이스 연결 함수 구현
    - `getDatabase(databaseId: string)`
    - 연결 상태 확인 및 에러 핸들링
  - Playwright MCP를 활용한 Notion API 연결 테스트
    - Notion 데이터베이스 조회 성공 여부 확인
    - 에러 시나리오 테스트 (잘못된 토큰, 존재하지 않는 DB 등)

- **Task 012: 견적서 조회 API 구현 (F001)**
  - Notion API로 Quotes 데이터베이스 조회 함수 구현
    - `/lib/notion/quotes.ts` (`getQuotes()`, `getQuoteById()`)
    - Relation 필드를 통한 Customer 및 QuoteItems 조인 조회
  - Notion 응답 데이터를 TypeScript 타입으로 변환
    - Notion 속성 → Quote 타입 매핑 함수
  - 페이지네이션 및 필터링 로직 구현
  - Server Component에서 Notion 데이터 조회
    - 관리자 대시보드 페이지에서 실제 Notion 데이터 표시
    - 견적서 상세 페이지(관리자용)에서 실제 Notion 데이터 표시
  - Playwright MCP로 견적서 조회 E2E 테스트
    - 대시보드에서 견적서 목록 렌더링 확인
    - 견적서 상세 페이지 데이터 표시 확인
    - 빈 상태 및 에러 상태 테스트

- **Task 013: NextAuth.js v5 인증 시스템 구현 (F010)**
  - NextAuth.js v5 설정
    - `/app/api/auth/[...nextauth]/route.ts` 설정
    - Credentials Provider 구성
  - 로그인 Server Action 구현
    - `/app/actions/auth.ts` (`signIn()`, `signOut()`)
    - 이메일/비밀번호 검증 로직
    - 세션 생성 및 쿠키 설정
  - 관리자 계정 관리 (초기 계정 생성)
    - 환경 변수 또는 Supabase로 관리자 계정 저장
  - 인증 미들웨어 구현
    - `/middleware.ts` (관리자 페이지 접근 제어)
  - 로그인 페이지 실제 인증 연동
    - 더미 함수 → 실제 Server Action 교체
  - Playwright MCP로 인증 플로우 E2E 테스트
    - 로그인 성공 시나리오
    - 로그인 실패 시나리오 (잘못된 비밀번호, 존재하지 않는 계정)
    - 로그아웃 시나리오
    - 인증되지 않은 사용자의 관리자 페이지 접근 차단 확인

- **Task 014: 공개 링크 생성 기능 구현 (F002)**
  - 공개 링크 ID 생성 로직
    - `/lib/utils/link.ts` (`generatePublicLinkId()`)
    - nanoid 또는 UUID 사용
  - Notion API로 Quotes 데이터베이스 업데이트 함수
    - `/lib/notion/quotes.ts` (`updateQuotePublicLink()`)
    - `public_link_id` 필드 업데이트
  - 공개 링크 생성 Server Action 구현
    - `/app/actions/quote.ts` (`createPublicLink()`)
  - 견적서 상세 페이지(관리자용)에서 실제 링크 생성 연동
    - 더미 링크 생성 → 실제 Server Action 교체
  - 클립보드 복사 기능 구현
    - 클라이언트 컴포넌트로 navigator.clipboard API 사용
  - Playwright MCP로 공개 링크 생성 E2E 테스트
    - 링크 생성 버튼 클릭 시 고유 ID 생성 확인
    - 생성된 링크가 화면에 표시되는지 확인
    - 링크 복사 기능 동작 확인
    - Notion 데이터베이스에 `public_link_id`가 업데이트되는지 확인

- **Task 015: 견적서 공개 조회 기능 구현 (F003)**
  - 공개 링크로 견적서 조회 함수 구현
    - `/lib/notion/quotes.ts` (`getQuoteByPublicLink()`)
    - `public_link_id`로 Notion 데이터베이스 쿼리
  - 견적서 상세 페이지(공개) Server Component 구현
    - `/app/quote/[publicId]/page.tsx`
    - 공개 링크 ID로 견적서 조회
    - 존재하지 않는 링크에 대한 404 처리
    - 유효기간 만료 견적서 처리 (선택사항)
  - 더미 데이터 → 실제 Notion 데이터로 교체
  - Playwright MCP로 공개 조회 E2E 테스트
    - 유효한 공개 링크로 접근 시 견적서 표시 확인
    - 인증 없이 접근 가능한지 확인
    - 잘못된 링크 접근 시 404 페이지 표시 확인
    - 견적서 정보가 정확히 렌더링되는지 확인

- **Task 016: 견적서 상태 업데이트 기능 구현 (F005)**
  - Notion API로 견적서 상태 업데이트 함수 구현
    - `/lib/notion/quotes.ts` (`updateQuoteStatus()`)
    - Notion `status` 필드 업데이트 (승인됨, 거부됨)
  - 상태 업데이트 Server Action 구현
    - `/app/actions/quote.ts` (`approveQuote()`, `rejectQuote()`)
  - 견적서 상세 페이지(공개)에서 승인/거부 버튼 연동
    - 더미 함수 → 실제 Server Action 교체
    - 상태 변경 후 성공 메시지 표시
    - 중복 클릭 방지 (낙관적 업데이트)
  - Playwright MCP로 상태 업데이트 E2E 테스트
    - 승인 버튼 클릭 시 Notion 상태가 '승인됨'으로 변경되는지 확인
    - 거부 버튼 클릭 시 Notion 상태가 '거부됨'으로 변경되는지 확인
    - 성공 메시지가 화면에 표시되는지 확인
    - 관리자 대시보드에서 업데이트된 상태가 반영되는지 확인

- **Task 017: 대시보드 통계 기능 구현 (F006)**
  - 견적서 상태별 통계 계산 함수 구현
    - `/lib/notion/stats.ts` (`getQuoteStats()`)
    - Notion API로 전체 견적서 조회 후 상태별 카운트
  - 관리자 대시보드 통계 표시
    - Server Component에서 통계 데이터 조회
    - 상태별 요약 카드에 실제 카운트 표시
    - 더미 데이터 → 실제 통계 데이터로 교체
  - 검색 및 필터링 기능 구현
    - 클라이언트 컴포넌트로 검색/필터 상태 관리
    - Server Action으로 필터링된 견적서 조회
  - Playwright MCP로 대시보드 통계 E2E 테스트
    - 상태별 카운트가 정확히 표시되는지 확인
    - 검색 기능 동작 확인
    - 필터링 기능 동작 확인
    - 새로고침 버튼으로 Notion 데이터 재조회 확인

### Phase 4: 고급 기능 및 최적화

- **Task 018: PDF 다운로드 기능 구현 (F004)**
  - @react-pdf/renderer 설정
    - `/lib/pdf/document.tsx` (PDF 문서 컴포넌트)
    - 견적서 레이아웃을 PDF 형식으로 구현
  - PDF 생성 Server Action 구현
    - `/app/actions/pdf.ts` (`generateQuotePDF()`)
    - 견적서 데이터를 PDF로 변환
    - PDF 파일 Blob 반환
  - 견적서 상세 페이지(공개)에서 PDF 다운로드 버튼 연동
    - 더미 함수 → 실제 Server Action 교체
    - PDF 생성 로딩 상태 표시
    - 다운로드 완료 후 파일 저장 트리거
  - 인쇄 최적화 레이아웃 구현
    - A4 크기, 적절한 여백, 폰트 설정
    - 회사 로고 및 브랜딩 요소 포함
  - Playwright MCP로 PDF 생성 E2E 테스트
    - PDF 다운로드 버튼 클릭 시 파일 생성 확인
    - PDF 내용이 견적서 데이터와 일치하는지 검증
    - 다양한 견적서 항목 수에 대한 레이아웃 테스트

- **Task 019: 에러 핸들링 및 사용자 경험 개선**
  - 전역 에러 바운더리 구현
    - `/app/error.tsx`, `/app/global-error.tsx`
  - 404 페이지 커스터마이징
    - `/app/not-found.tsx`
  - 로딩 상태 개선
    - `/app/loading.tsx` (글로벌 로딩)
    - 각 페이지별 Suspense 경계 설정
  - Toast 알림 시스템 구현
    - shadcn/ui toast 컴포넌트 활용
    - 성공/에러 메시지 일관성 유지
  - Notion API 에러 핸들링
    - API 호출 실패 시 재시도 로직
    - 사용자 친화적 에러 메시지 표시
  - Playwright MCP로 에러 시나리오 E2E 테스트
    - Notion API 오류 시 에러 페이지 표시 확인
    - 존재하지 않는 페이지 접근 시 404 페이지 확인
    - 로딩 상태가 적절히 표시되는지 확인

- **Task 020: 성능 최적화 및 캐싱 전략**
  - Next.js 캐싱 전략 적용
    - Server Component에서 `revalidate` 설정
    - Notion API 응답 캐싱 (ISR 활용)
  - 이미지 최적화
    - Next.js Image 컴포넌트 사용
    - 회사 로고 및 아이콘 최적화
  - 번들 크기 최적화
    - 동적 임포트 활용 (PDF 생성 모듈 등)
    - Tree shaking 확인
  - Lighthouse 성능 점수 개선
    - 접근성, SEO, 성능 메트릭 최적화
  - Playwright MCP로 성능 테스트
    - 페이지 로딩 시간 측정
    - 캐싱 동작 확인

- **Task 021: 보안 강화**
  - 환경 변수 보안 검증
    - 클라이언트에 노출되지 않도록 검증
  - 공개 링크 보안 강화
    - Rate limiting 구현 (선택사항)
    - 무단 접근 로깅 (선택사항)
  - CSRF 보호 확인
    - NextAuth.js CSRF 토큰 활용
  - 콘텐츠 보안 정책(CSP) 설정
    - Next.js 헤더 설정
  - Playwright MCP로 보안 테스트
    - XSS 공격 시나리오 테스트
    - 인증되지 않은 접근 차단 확인

- **Task 022: 배포 준비 및 CI/CD 설정**
  - Vercel 배포 설정
    - 환경 변수 설정 (프로덕션, 스테이징)
    - 빌드 최적화 설정
  - 프로덕션 빌드 테스트
    - `npm run build` 성공 확인
    - 빌드 경고/에러 해결
  - 모니터링 설정
    - Vercel Analytics 통합
    - 에러 트래킹 (Sentry 등, 선택사항)
  - 문서화
    - README.md 업데이트
    - 환경 변수 설정 가이드 작성
    - Notion 데이터베이스 구조 문서화
  - Playwright MCP로 프로덕션 환경 E2E 테스트
    - 전체 사용자 플로우 최종 검증
    - 프로덕션 빌드에서 모든 기능 동작 확인

## 📊 진행 상황

- **Phase 1**: 0/3 완료 (0%)
- **Phase 2**: 0/7 완료 (0%)
- **Phase 3**: 0/7 완료 (0%)
- **Phase 4**: 0/5 완료 (0%)
- **전체**: 0/22 완료 (0%)

## 🎯 다음 우선순위 작업

1. **Task 001**: 프로젝트 환경 설정 및 초기 구조 구성
2. **Task 002**: 라우트 구조 및 페이지 골격 생성
3. **Task 003**: TypeScript 타입 정의 및 인터페이스 설계

---

**마지막 업데이트**: 2026-01-09
