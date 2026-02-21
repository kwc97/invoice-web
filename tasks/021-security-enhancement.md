# Task 021: 보안 강화

## 작업 개요

**우선순위**: 높음
**작업 유형**: 보안
**관련 Phase**: Phase 4 - 고급 기능 및 최적화
**선행 작업**: Task 019, Task 020 완료

현재 코드베이스 보안 분석 결과, 평문 비밀번호 비교, Server Action 인증 검증 부재, 보안 헤더 미흡, 테스트 계정 노출 등의 보안 취약점이 확인되었습니다. 본 작업에서 이를 개선합니다.

## 현재 상태 분석

| 항목 | 현황 | 심각도 |
| --- | --- | --- |
| 비밀번호 처리 | 평문 비교 (`password !== admin.password`) | CRITICAL |
| 테스트 계정 노출 | 로그인 폼에 `admin@example.com / password123` 표시 | CRITICAL |
| Server Action 인증 | `createPublicLink`에 인증 확인 없음 | HIGH |
| API Route 입력 검증 | PDF API에 quoteId 형식 검증 없음 | HIGH |
| 보안 헤더 | CSP, HSTS, Permissions-Policy 누락 | HIGH |
| 로그인 리다이렉트 | 인증된 사용자의 로그인 페이지 접근 미처리 | MEDIUM |
| 만료 견적서 서버 검증 | 유효기간 만료를 UI에서만 체크 | MEDIUM |
| 기존 보안 헤더 | X-Frame-Options, X-Content-Type-Options 등 설정됨 | 완료 |
| NextAuth.js CSRF | 자동 적용됨 | 완료 |
| poweredByHeader | `false` 설정됨 | 완료 |

## 목표

- bcryptjs를 사용한 비밀번호 해싱 (Edge Runtime 호환)
- 테스트 계정 정보를 로그인 폼에서 제거
- Server Action에 인증 검증 추가 (`createPublicLink`은 관리자만)
- API Route에 입력 검증 추가
- 보안 헤더 강화 (CSP, HSTS, Permissions-Policy)
- 인증된 사용자의 로그인 페이지 리다이렉트
- 만료 견적서 서버 사이드 검증
- 빌드 성공 및 check-all 통과

## 관련 파일

| 파일 경로 | 타입 | 설명 |
| --- | --- | --- |
| `src/auth.ts` | MODIFY | bcryptjs 비밀번호 비교, 로그인 리다이렉트 |
| `src/components/login-form.tsx` | MODIFY | 테스트 계정 정보 제거 |
| `src/app/actions/quote.ts` | MODIFY | 인증 검증 및 만료 검증 추가 |
| `src/app/api/pdf/[quoteId]/route.ts` | MODIFY | 입력 검증 추가 |
| `next.config.ts` | MODIFY | CSP, HSTS, Permissions-Policy 헤더 추가 |
| `package.json` | MODIFY | bcryptjs 패키지 추가 |

## 완료 조건

- [ ] bcryptjs 설치 및 비밀번호 해싱 적용
- [ ] 테스트 계정 정보 로그인 폼에서 제거
- [ ] `createPublicLink` Server Action에 관리자 인증 검증 추가
- [ ] `approveQuote`/`rejectQuote`에 만료 검증 추가
- [ ] PDF API Route에 quoteId 형식 검증 추가
- [ ] CSP, HSTS, Permissions-Policy 보안 헤더 추가
- [ ] 인증된 사용자의 로그인 페이지 → 대시보드 리다이렉트
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint/Prettier 통과
- [ ] 빌드 성공

## 상세 구현 내용

### 1단계: bcryptjs 비밀번호 해싱

**패키지 설치:**
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

`src/auth.ts` 수정:

```typescript
// pseudocode
import bcryptjs from 'bcryptjs'

// getAdminCredentials()에서 해시된 비밀번호를 반환
// .env.local의 ADMIN_PASSWORD는 해시값으로 변경
// 비밀번호 해시 생성: await bcryptjs.hash('원래비밀번호', 12)

async authorize(credentials) {
  // ...
  // 기존: if (password !== admin.password)
  // 변경: bcryptjs.compare()로 해시 비교
  const passwordMatch = await bcryptjs.compare(password, admin.password)
  if (!passwordMatch) {
    return null
  }
  // ...
}
```

**환경 변수 업데이트 (.env.local):**
- `ADMIN_PASSWORD`를 bcryptjs 해시값으로 변경
- 해시 생성 스크립트 또는 한 번만 실행

### 2단계: 테스트 계정 정보 제거 및 로그인 리다이렉트

`src/components/login-form.tsx` 수정:
- 143행의 테스트 계정 안내 텍스트 제거

`src/auth.ts` authorized 콜백 수정:
```typescript
// pseudocode
authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user
  const isOnAdmin = nextUrl.pathname.startsWith('/admin')
  const isOnLogin = nextUrl.pathname === '/login'

  // 이미 로그인한 사용자가 로그인 페이지 접근 시 대시보드로 리다이렉트
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/admin/dashboard', nextUrl))
  }

  // 관리자 페이지 접근 시 로그인 필요
  if (isOnAdmin && !isLoggedIn) {
    return false
  }

  return true
}
```

### 3단계: Server Action 보안 강화

`src/app/actions/quote.ts` 수정:

```typescript
// pseudocode
import { auth } from '@/auth'
import { getQuoteById } from '@/lib/notion/quotes'

// createPublicLink: 관리자만 호출 가능
export async function createPublicLink(quoteId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: '인증이 필요합니다' }
  }
  // ... 기존 로직
}

// approveQuote/rejectQuote: 만료 검증 추가
export async function approveQuote(quoteId: string) {
  // 견적서 조회 후 만료 확인
  const quote = await getQuoteById(quoteId)
  if (!quote) {
    return { success: false, error: '견적서를 찾을 수 없습니다' }
  }
  if (new Date(quote.validUntil) < new Date()) {
    return { success: false, error: '유효기간이 만료된 견적서입니다' }
  }
  // ... 기존 로직
}
```

### 4단계: API Route 입력 검증

`src/app/api/pdf/[quoteId]/route.ts` 수정:

```typescript
// pseudocode
// Notion 페이지 ID 형식 검증 (UUID v4 or 32-char hex)
const NOTION_ID_REGEX = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

export async function GET(_request: Request, context: RouteContext) {
  const { quoteId } = await context.params

  if (!NOTION_ID_REGEX.test(quoteId)) {
    return NextResponse.json({ error: '유효하지 않은 견적서 ID' }, { status: 400 })
  }
  // ... 기존 로직
}
```

### 5단계: 보안 헤더 강화 및 빌드 검증

`next.config.ts` 수정:

```typescript
// pseudocode
// 기존 헤더에 추가:
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
},
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=()'
},
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.notion.com"
}
```

**빌드 및 검증:**
```bash
npm run check-all   # typecheck, lint, format
npm run build       # 프로덕션 빌드
```

## 테스트 체크리스트

Playwright MCP를 활용한 E2E 테스트:

- [ ] **로그인 테스트**: bcryptjs 해싱 적용 후 정상 로그인 확인
- [ ] **인증된 사용자 리다이렉트**: 로그인 상태에서 /login 접근 시 대시보드로 이동
- [ ] **테스트 계정 제거 확인**: 로그인 폼에 테스트 계정 정보 미노출
- [ ] **공개 링크 생성 인증**: 비인증 상태에서 createPublicLink 호출 시 에러 반환
- [ ] **만료 견적서 승인 차단**: 만료된 견적서 승인/거부 시 에러 메시지 표시
- [ ] **보안 헤더 확인**: 응답 헤더에 CSP, HSTS, Permissions-Policy 포함 확인
- [ ] **PDF API 입력 검증**: 잘못된 형식의 quoteId로 요청 시 400 에러 반환
- [ ] **빌드 성공**: npm run build 통과

## 참고사항

- `bcryptjs`는 순수 JavaScript 구현으로 Edge Runtime 호환 (bcrypt와 다름)
- NextAuth.js v5의 `authorized` 콜백에서 `Response.redirect()` 사용
- CSP에서 `unsafe-inline`과 `unsafe-eval`은 Next.js 개발 모드에서 필요
- HSTS `preload` 플래그는 프로덕션 도메인에서만 의미 있음
- 공개 페이지의 `approveQuote`/`rejectQuote`는 인증 불필요 (공개 링크 자체가 접근 권한)
  단, 만료 검증은 서버에서 수행

## 변경 사항 요약

(작업 완료 후 작성)
