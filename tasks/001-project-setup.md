# Task 001: 프로젝트 환경 설정 및 초기 구조 구성

## 📋 작업 개요

**우선순위**: 최우선
**예상 소요 시간**: 1-2시간
**작업 유형**: 환경 설정
**관련 Phase**: Phase 1 - 애플리케이션 골격 구축

이 작업은 프로젝트의 기본 환경 설정을 완료하고 필요한 모든 패키지가 올바르게 설치되었는지 확인합니다.

## 🎯 목표

- Next.js 15.5.3 프로젝트 초기 설정 확인 및 보완
- NextAuth.js v5 설치 및 기본 설정
- 환경 변수 파일(.env.local) 생성
- Notion API 연동 기본 설정
- 모든 필수 패키지 설치 확인
- 개발 환경 검증

## 📦 관련 파일

| 파일 경로                  | 타입      | 설명                       |
| -------------------------- | --------- | -------------------------- |
| `package.json`             | TO_MODIFY | NextAuth.js v5 의존성 추가 |
| `.env.local`               | CREATE    | 환경 변수 파일 생성        |
| `.env.example`             | REFERENCE | 환경 변수 템플릿 참조      |
| `src/lib/auth.ts`          | CREATE    | NextAuth.js 설정 파일      |
| `src/lib/notion/client.ts` | CREATE    | Notion API 클라이언트      |
| `next.config.ts`           | REFERENCE | Next.js 설정 확인          |
| `tsconfig.json`            | REFERENCE | TypeScript 설정 확인       |

## ✅ 완료 조건

- [x] NextAuth.js v5 설치 완료
- [x] .env.local 파일 생성 및 필수 환경 변수 설정
- [x] Notion API 클라이언트 기본 설정 완료
- [x] NextAuth.js 기본 설정 파일 생성
- [x] `npm run check-all` 명령 성공 실행
- [x] `npm run dev` 개발 서버 정상 실행 확인
- [x] 모든 설정 파일 검증 완료

## 📝 상세 구현 내용

### 1. 현재 설치 상태 확인

**이미 설치된 패키지:**

- ✅ @notionhq/client@5.6.0
- ✅ @react-pdf/renderer@4.3.2
- ✅ React Hook Form@7.63.0
- ✅ Zod@4.1.11
- ✅ bcrypt@6.0.0
- ✅ nanoid@5.1.6
- ✅ shadcn/ui 컴포넌트들

**추가 필요 패키지:**

- ❌ next-auth (NextAuth.js v5)

### 2. NextAuth.js v5 설치

```bash
npm install next-auth@beta
npm install -D @types/next-auth
```

**설치 후 확인:**

- package.json에 next-auth 의존성 추가 확인
- 버전이 v5 beta인지 확인 (5.0.0-beta.x)

### 3. .env.local 파일 생성

`.env.example`을 참조하여 `.env.local` 파일 생성:

```env
# Notion API 설정
NOTION_API_KEY=your_notion_integration_token_here
NOTION_DATABASE_QUOTES_ID=your_quotes_database_id
NOTION_DATABASE_QUOTE_ITEMS_ID=your_quote_items_database_id
NOTION_DATABASE_CUSTOMERS_ID=your_customers_database_id

# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl

# 관리자 계정 (초기 설정용)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password

# 애플리케이션 설정
APP_URL=http://localhost:3000
NODE_ENV=development
```

**주의사항:**

- NEXTAUTH_SECRET은 `openssl rand -base64 32` 명령으로 생성
- 실제 Notion API 키와 데이터베이스 ID는 사용자가 직접 입력 필요
- 관리자 비밀번호는 반드시 변경 필요

### 4. Notion API 클라이언트 기본 설정

`src/lib/notion/client.ts` 파일 생성:

```typescript
import { Client } from '@notionhq/client'

const NOTION_API_KEY = process.env.NOTION_API_KEY

if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY 환경 변수가 설정되지 않았습니다.')
}

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: NOTION_API_KEY,
})

// 데이터베이스 ID들
export const DATABASE_IDS = {
  QUOTES: process.env.NOTION_DATABASE_QUOTES_ID || '',
  QUOTE_ITEMS: process.env.NOTION_DATABASE_QUOTE_ITEMS_ID || '',
  CUSTOMERS: process.env.NOTION_DATABASE_CUSTOMERS_ID || '',
}

// 데이터베이스 ID 검증
export function validateDatabaseIds() {
  const missing = Object.entries(DATABASE_IDS)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `다음 Notion 데이터베이스 ID가 설정되지 않았습니다: ${missing.join(', ')}`
    )
  }
}
```

**구현 요점:**

- 환경 변수 검증 로직 포함
- 에러 메시지는 명확하고 한국어로 작성
- 데이터베이스 ID들을 상수로 export

### 5. NextAuth.js 기본 설정

`src/lib/auth.ts` 파일 생성:

```typescript
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Task 013에서 실제 인증 로직 구현
        // 현재는 기본 구조만 설정
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // 관리자 페이지는 로그인 필요
      }

      return true
    },
  },
}
```

**구현 요점:**

- Credentials Provider 기본 설정
- 로그인 페이지 경로 지정
- 관리자 페이지 접근 제어 기본 로직
- 실제 인증 로직은 Task 013에서 구현 예정

### 6. 환경 변수 검증 함수 추가

`src/lib/env.ts` 파일 수정 또는 생성:

```typescript
// 필수 환경 변수 목록
const requiredEnvVars = [
  'NOTION_API_KEY',
  'NOTION_DATABASE_QUOTES_ID',
  'NOTION_DATABASE_QUOTE_ITEMS_ID',
  'NOTION_DATABASE_CUSTOMERS_ID',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const

// 개발 환경에서 환경 변수 검증
export function validateEnv() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missing.length > 0) {
    console.error('⚠️  다음 환경 변수가 설정되지 않았습니다:')
    missing.forEach(envVar => console.error(`   - ${envVar}`))
    console.error('\n📝 .env.local 파일을 확인해주세요.')

    if (process.env.NODE_ENV === 'production') {
      throw new Error('필수 환경 변수가 누락되었습니다.')
    }
  }
}
```

**구현 요점:**

- 필수 환경 변수 목록 정의
- 누락된 환경 변수 명확히 표시
- 프로덕션 환경에서는 에러 throw

### 7. 디렉토리 구조 생성

필요한 디렉토리들을 미리 생성:

```bash
mkdir -p src/lib/notion
mkdir -p src/lib/validations
mkdir -p src/types
mkdir -p src/app/admin/dashboard
mkdir -p src/app/admin/quote/[id]
mkdir -p src/app/quote/[publicId]
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/actions
```

**생성 이유:**

- Task 002, 003에서 사용할 디렉토리 미리 준비
- 프로젝트 구조 일관성 유지

## 🧪 테스트 체크리스트

### 환경 설정 검증

- [ ] **패키지 설치 확인**

  ```bash
  npm list next-auth
  npm list @notionhq/client
  npm list @react-pdf/renderer
  ```

- [ ] **TypeScript 타입 체크**

  ```bash
  npm run typecheck
  ```

  - 에러 없이 통과해야 함

- [ ] **Lint 검사**

  ```bash
  npm run lint
  ```

  - 경고 및 에러 없어야 함

- [ ] **코드 포맷 검사**

  ```bash
  npm run format:check
  ```

  - 포맷 문제 없어야 함

- [ ] **통합 검사**

  ```bash
  npm run check-all
  ```

  - 모든 검사 통과해야 함

- [ ] **개발 서버 실행**

  ```bash
  npm run dev
  ```

  - 에러 없이 실행되어야 함
  - http://localhost:3000 접속 가능해야 함

- [ ] **빌드 테스트**

  ```bash
  npm run build
  ```

  - 에러 없이 빌드 성공해야 함

### 환경 변수 검증

- [ ] `.env.local` 파일 존재 확인
- [ ] 모든 필수 환경 변수 설정 확인
- [ ] NEXTAUTH_SECRET 생성 및 설정 확인

### 파일 생성 확인

- [ ] `src/lib/auth.ts` 생성 확인
- [ ] `src/lib/notion/client.ts` 생성 확인
- [ ] 필요한 디렉토리들 생성 확인

## 📌 참고사항

### NextAuth.js v5 주요 변경사항

- v4에서 v5로 마이그레이션 시 주의사항
- 설정 방식 변경 (authOptions → authConfig)
- 미들웨어 패턴 변경

### Notion API 제약사항

- API 요청 속도 제한: 초당 3회
- 페이지네이션 기본값: 100개 항목
- 타임아웃: 60초

### 보안 고려사항

- .env.local 파일은 절대 git에 커밋하지 않음
- NEXTAUTH_SECRET은 충분히 복잡한 값 사용
- 관리자 비밀번호는 bcrypt로 해싱하여 저장

## 🔄 변경 사항 요약

### 설치된 패키지

- ✅ next-auth@5.0.0-beta.30

### 생성된 파일

1. **`.env.local`** - 환경 변수 파일
   - NEXTAUTH_SECRET: 안전한 랜덤 키 생성
   - Notion API 키 및 데이터베이스 ID 플레이스홀더
   - 관리자 계정 설정
2. **`src/lib/auth.ts`** - NextAuth.js 설정
   - Credentials Provider 기본 구조
   - 관리자 페이지 접근 제어 로직
3. **`src/lib/notion/client.ts`** - Notion API 클라이언트
   - Notion Client 초기화
   - 데이터베이스 ID 상수
   - ID 검증 함수
4. **`src/lib/env.ts`** - 환경 변수 검증 (수정)
   - 필수 환경 변수 스키마 추가
   - validateEnv() 함수 추가

### 생성된 디렉토리

- `src/lib/notion/`
- `src/lib/validations/`
- `src/types/`
- `src/app/admin/dashboard/`
- `src/app/admin/quote/[id]/`
- `src/app/quote/[publicId]/`
- `src/app/api/auth/[...nextauth]/`
- `src/app/actions/`

### 검증 결과

- ✅ TypeScript 컴파일: 통과
- ✅ ESLint 검사: 통과 (경고 수정 완료)
- ✅ Prettier 포맷: 통과
- ✅ 통합 검사 (check-all): 통과
- ✅ 개발 서버: 정상 실행 (http://localhost:3000)

### 주의사항

**사용자가 직접 설정해야 할 항목:**

1. `.env.local` 파일의 Notion API 키 입력
2. `.env.local` 파일의 Notion 데이터베이스 ID 입력
3. `.env.local` 파일의 관리자 비밀번호 변경

**완료 일시**: 2026-01-10

---

**다음 작업**: Task 002 - 라우트 구조 및 페이지 골격 생성
