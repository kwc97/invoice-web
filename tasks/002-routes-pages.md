# Task 002: 라우트 구조 및 페이지 골격 생성

## 📋 작업 개요

**우선순위**: 높음
**예상 소요 시간**: 2-3시간
**작업 유형**: 구조 설계 및 페이지 생성
**관련 Phase**: Phase 1 - 애플리케이션 골격 구축
**선행 작업**: Task 001 완료 필요

이 작업은 Next.js App Router를 기반으로 전체 애플리케이션의 라우트 구조를 구성하고, 각 페이지의 기본 골격을 생성합니다.

## 🎯 목표

- Next.js App Router 기반 전체 라우트 구조 설계
- 모든 주요 페이지 파일 생성 (빈 골격 포함)
- 공통 레이아웃 컴포넌트 구현
- 각 페이지 메타데이터 설정
- 라우팅 동작 확인

## 📦 관련 파일

| 파일 경로                             | 타입      | 설명                      |
| ------------------------------------- | --------- | ------------------------- |
| `src/app/layout.tsx`                  | REFERENCE | 루트 레이아웃 (이미 존재) |
| `src/app/page.tsx`                    | TO_MODIFY | 홈페이지 수정             |
| `src/app/login/page.tsx`              | REFERENCE | 로그인 페이지 (이미 존재) |
| `src/app/admin/layout.tsx`            | CREATE    | 관리자 레이아웃           |
| `src/app/admin/dashboard/page.tsx`    | CREATE    | 관리자 대시보드           |
| `src/app/admin/quote/[id]/page.tsx`   | CREATE    | 견적서 상세 (관리자용)    |
| `src/app/quote/[publicId]/page.tsx`   | CREATE    | 견적서 상세 (공개)        |
| `src/app/not-found.tsx`               | CREATE    | 404 페이지                |
| `src/app/error.tsx`                   | CREATE    | 에러 페이지               |
| `src/components/layout/header.tsx`    | TO_MODIFY | 헤더 컴포넌트 수정        |
| `src/components/layout/footer.tsx`    | TO_MODIFY | 푸터 컴포넌트 수정        |
| `src/components/layout/admin-nav.tsx` | CREATE    | 관리자 네비게이션         |

## ✅ 완료 조건

- [ ] 모든 라우트 페이지 파일 생성 완료
- [ ] 관리자 레이아웃 컴포넌트 구현
- [ ] 각 페이지 메타데이터 설정 완료
- [ ] 페이지 간 네비게이션 동작 확인
- [ ] 404 및 에러 페이지 작동 확인
- [ ] 반응형 레이아웃 기본 구조 완성
- [ ] 모든 페이지 개발 서버에서 접근 가능

## 📝 상세 구현 내용

### 1. 라우트 구조 설계

```
src/app/
├── layout.tsx              # ✅ 루트 레이아웃 (이미 존재)
├── page.tsx                # 🔄 홈페이지 (수정 필요)
├── login/
│   └── page.tsx           # ✅ 로그인 페이지 (이미 존재)
├── admin/
│   ├── layout.tsx         # 🆕 관리자 전용 레이아웃
│   ├── dashboard/
│   │   └── page.tsx       # 🆕 대시보드
│   └── quote/
│       └── [id]/
│           └── page.tsx   # 🆕 견적서 상세 (관리자)
├── quote/
│   └── [publicId]/
│       └── page.tsx       # 🆕 견적서 상세 (공개)
├── not-found.tsx          # 🆕 404 페이지
└── error.tsx              # 🆕 에러 페이지
```

### 2. 홈페이지 수정

`src/app/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notion 견적서 관리 시스템',
  description: 'Notion 기반 견적서 관리 및 공유 시스템',
}

export default function HomePage() {
  // 홈페이지는 로그인 페이지로 리다이렉트
  redirect('/login')
}
```

**구현 요점:**

- 홈페이지 접속 시 자동으로 로그인 페이지로 이동
- 메타데이터 설정

### 3. 관리자 레이아웃 생성

`src/app/admin/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/layout/admin-nav'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: {
    template: '%s | 견적서 관리',
    default: '견적서 관리',
  },
  description: 'Notion 견적서 관리 시스템 - 관리자 페이지',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Task 013에서 실제 인증 체크 구현
  // 현재는 레이아웃만 설정

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  )
}
```

**구현 요점:**

- 관리자 전용 레이아웃 구조
- 사이드바 네비게이션 포함
- 메타데이터 템플릿 설정
- 인증 체크는 Task 013에서 구현 예정

### 4. 관리자 대시보드 페이지

`src/app/admin/dashboard/page.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          견적서 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* TODO: Task 007에서 UI 구현 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          대시보드 UI는 Task 007에서 구현됩니다
        </p>
      </div>
    </div>
  )
}
```

**구현 요점:**

- 기본 페이지 구조만 설정
- UI는 Phase 2에서 구현
- 명확한 TODO 주석

### 5. 견적서 상세 페이지 (관리자용)

`src/app/admin/quote/[id]/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `견적서 ${id}`,
  }
}

export default async function AdminQuoteDetailPage({ params }: Props) {
  const { id } = await params

  // TODO: Task 012에서 Notion API 연동
  // 현재는 기본 구조만

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          견적서 상세 (관리자)
        </h1>
        <p className="text-muted-foreground">견적서 ID: {id}</p>
      </div>

      {/* TODO: Task 008에서 UI 구현 */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          견적서 상세 UI는 Task 008에서 구현됩니다
        </p>
      </div>
    </div>
  )
}
```

**구현 요점:**

- 동적 라우트 파라미터 처리
- 메타데이터 동적 생성
- Next.js 15의 async params 패턴 사용

### 6. 견적서 상세 페이지 (공개)

`src/app/quote/[publicId]/page.tsx`:

```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'

type Props = {
  params: Promise<{ publicId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params

  // TODO: Task 015에서 실제 견적서 제목 가져오기
  return {
    title: '견적서',
    description: '견적서를 확인하고 다운로드하세요',
  }
}

export default async function PublicQuoteDetailPage({ params }: Props) {
  const { publicId } = await params

  // TODO: Task 015에서 Notion API 연동

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-12">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">견적서</h1>
            <p className="text-muted-foreground">공개 ID: {publicId}</p>
          </div>

          {/* TODO: Task 009에서 UI 구현 */}
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              공개 견적서 UI는 Task 009에서 구현됩니다
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
```

**구현 요점:**

- 공개 페이지이므로 인증 불필요
- 클라이언트 친화적 레이아웃
- Container 컴포넌트 사용

### 7. 404 페이지

`src/app/not-found.tsx`:

```typescript
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container>
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground">
              요청하신 페이지가 존재하지 않거나 이동되었습니다
            </p>
          </div>
          <Button asChild>
            <Link href="/login">로그인 페이지로 이동</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}
```

**구현 요점:**

- 사용자 친화적 메시지
- 로그인 페이지로 이동 버튼

### 8. 에러 페이지

`src/app/error.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (선택사항)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container>
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold">오류 발생</h1>
            <h2 className="text-2xl font-semibold">문제가 발생했습니다</h2>
            <p className="text-muted-foreground">
              일시적인 오류가 발생했습니다. 다시 시도해주세요.
            </p>
          </div>
          <Button onClick={reset}>다시 시도</Button>
        </div>
      </Container>
    </div>
  )
}
```

**구현 요점:**

- Client Component로 구현 ('use client')
- reset 함수로 재시도 기능

### 9. 관리자 네비게이션 컴포넌트

`src/components/layout/admin-nav.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FileText, LogOut } from 'lucide-react'

const navItems = [
  {
    title: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '견적서 목록',
    href: '/admin/dashboard',
    icon: FileText,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/10">
      <nav className="space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

**구현 요점:**

- Client Component (usePathname 사용)
- 현재 경로 하이라이트
- Lucide 아이콘 사용

### 10. 헤더 컴포넌트 수정

`src/components/layout/header.tsx` 수정:

```typescript
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold">견적서 관리</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* TODO: Task 013에서 로그아웃 버튼 추가 */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

**구현 요점:**

- 로고 클릭 시 대시보드로 이동
- 테마 토글 버튼 포함
- 로그아웃은 Task 013에서 구현

### 11. 푸터 컴포넌트 수정

`src/components/layout/footer.tsx` 수정:

```typescript
export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Notion 견적서 관리 시스템. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
```

**구현 요점:**

- 간단한 저작권 표시
- 현재 연도 자동 업데이트

## 🧪 테스트 체크리스트

### 페이지 접근 테스트

- [ ] **홈페이지 리다이렉트**
  - http://localhost:3000 접속
  - `/login`으로 자동 이동 확인

- [ ] **로그인 페이지**
  - http://localhost:3000/login 접속
  - 페이지 정상 렌더링 확인

- [ ] **관리자 대시보드**
  - http://localhost:3000/admin/dashboard 접속
  - 레이아웃 및 네비게이션 표시 확인

- [ ] **견적서 상세 (관리자)**
  - http://localhost:3000/admin/quote/test-id 접속
  - 페이지 정상 렌더링 및 ID 표시 확인

- [ ] **견적서 상세 (공개)**
  - http://localhost:3000/quote/test-public-id 접속
  - 페이지 정상 렌더링 확인

- [ ] **404 페이지**
  - http://localhost:3000/non-existent-page 접속
  - 404 페이지 표시 확인

### 네비게이션 테스트

- [ ] **관리자 네비게이션**
  - 대시보드에서 네비게이션 항목 클릭
  - 현재 페이지 하이라이트 확인

- [ ] **헤더 로고 클릭**
  - 헤더의 로고 클릭
  - 대시보드로 이동 확인

### 메타데이터 테스트

- [ ] **페이지 타이틀**
  - 각 페이지의 브라우저 탭 제목 확인
  - 관리자 페이지: "[페이지명] | 견적서 관리"

### 반응형 테스트

- [ ] **데스크톱 (1920x1080)**
  - 레이아웃 정상 표시 확인

- [ ] **태블릿 (768x1024)**
  - 레이아웃 적절히 조정 확인

- [ ] **모바일 (375x667)**
  - 사이드바 숨김 또는 햄버거 메뉴로 전환 확인
  - (현재는 기본 구조만, Phase 2에서 모바일 최적화)

## 📌 참고사항

### Next.js 15 App Router 규칙

- **page.tsx**: 라우트의 UI 정의
- **layout.tsx**: 여러 페이지 간 공유되는 UI
- **not-found.tsx**: 404 UI
- **error.tsx**: 에러 UI
- **loading.tsx**: 로딩 UI (필요시 추가)

### 동적 라우트

- `[id]`: 동적 세그먼트
- `[...slug]`: 모든 후속 세그먼트 캡처
- `[[...slug]]`: 선택적 모든 세그먼트 캡처

### 메타데이터 규칙

- 정적 메타데이터: `export const metadata`
- 동적 메타데이터: `export async function generateMetadata()`

### 레이아웃 중첩

- 레이아웃은 중첩됨
- 자식 레이아웃은 부모 레이아웃 안에 렌더링됨

## 🔄 변경 사항 요약

(작업 완료 후 작성)

---

**다음 작업**: Task 003 - TypeScript 타입 정의 및 인터페이스 설계
