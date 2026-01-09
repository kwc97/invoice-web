# Notion 기반 견적서 관리 시스템

Notion 데이터베이스 기반으로 견적서를 관리하고, 클라이언트가 웹에서 견적서를 확인하고 PDF로 다운로드할 수 있는 시스템입니다.

## 🎯 프로젝트 개요

**목적**: Notion 데이터베이스 기반으로 견적서를 관리하고, 클라이언트가 웹에서 견적서를 확인하고 PDF로 다운로드할 수 있는 시스템

**사용자**:
- 비즈니스 오너/관리자 (Notion에서 견적서 관리)
- 클라이언트 (견적서 확인 및 PDF 다운로드)

**범위**: MVP (Minimum Viable Product) - 핵심 기능에 집중한 첫 번째 버전

## 📱 주요 페이지

### 1. 로그인 페이지
관리자 인증 전용 페이지입니다.
- 이메일과 비밀번호로 관리자 로그인
- React Hook Form + Zod 검증
- 비로그인 상태에서 관리자 페이지 접근 시 자동 리디렉션

### 2. 관리자 대시보드 페이지
전체 견적서 현황을 한눈에 파악하는 관리 허브입니다.
- Notion에서 동기화된 견적서 목록 표시
- 상태별 요약 카드 (발송됨, 확인됨, 승인됨, 거부됨)
- 견적서 검색 및 필터링 (상태별, 날짜별)
- 견적서 상세 페이지로 이동

### 3. 견적서 상세 페이지 (관리자용)
특정 견적서의 전체 정보를 확인하고 공개 링크를 관리합니다.
- Notion에서 가져온 견적서 전체 내용 표시
- 현재 상태 배지 표시
- 공개 링크 생성 기능
- 링크 복사 버튼

### 4. 견적서 상세 페이지 (공개)
클라이언트가 견적서를 확인하고 응답하는 공개 페이지입니다.
- 로그인 없이 고유 링크로 접근 가능
- 깔끔한 UI로 견적서 전체 내용 표시
- PDF 다운로드 기능
- 승인/거부 버튼 (Notion 상태 업데이트)

## ⚡ 핵심 기능

### MVP 핵심 기능
- **F001: Notion 견적서 조회** - Notion API로 견적서 데이터 실시간 동기화
- **F002: 공개 링크 생성** - 각 견적서에 고유한 공개 접근 링크 자동 생성
- **F003: 견적서 공개 조회** - 로그인 없이 고유 링크로 견적서 확인 가능
- **F004: PDF 다운로드** - 견적서를 인쇄 친화적 PDF로 변환하여 다운로드
- **F005: 견적서 상태 관리** - 클라이언트의 승인/거부를 Notion에 반영
- **F006: 대시보드 통계** - 견적서 상태별 요약 표시

### MVP 필수 지원 기능
- **F010: 기본 인증** - 관리자 로그인/로그아웃 (이메일+비밀번호)
- **F011: Notion 데이터 연동** - Quotes, Quote Items, Customers 데이터베이스 연동

### MVP 이후 기능 (제외)
- 웹에서 견적서 생성/수정 (Notion에서만 관리)
- 이메일 자동 발송 기능
- 복잡한 권한 관리
- 결제 연동
- 고급 분석/통계 대시보드

## 🛠️ 기술 스택

### 프론트엔드
- **Next.js 15.5.3** - React 풀스택 프레임워크 (App Router + Turbopack)
- **TypeScript 5** - 타입 안전성 보장
- **React 19.1.0** - UI 라이브러리

### 스타일링 & UI
- **TailwindCSS v4** - 유틸리티 CSS 프레임워크
- **shadcn/ui** (new-york style) - 고품질 React 컴포넌트 라이브러리
- **Lucide React** - 아이콘 라이브러리
- **Radix UI** - 접근성 높은 UI 프리미티브

### 폼 & 검증
- **React Hook Form 7.x** - 폼 상태 관리
- **Zod** - 스키마 검증 라이브러리

### 백엔드 & 데이터베이스
- **Notion API (@notionhq/client)** - 주요 데이터베이스 (견적서, 고객 관리)
- **Next.js Server Actions** - 서버 사이드 로직 처리

### PDF 생성
- **@react-pdf/renderer** - React 컴포넌트 방식 PDF 생성

### 인증
- **bcrypt** - 비밀번호 암호화
- **nanoid** - 고유 링크 ID 생성

### 배포
- **Vercel** - Next.js 최적화 배포 플랫폼

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env.local` 파일로 복사하고 실제 값을 입력하세요.

```bash
cp .env.example .env.local
```

필수 환경 변수:
- `NOTION_API_KEY`: Notion Integration Token
- `NOTION_DATABASE_QUOTES_ID`: 견적서 데이터베이스 ID
- `NOTION_DATABASE_QUOTE_ITEMS_ID`: 견적 항목 데이터베이스 ID
- `NOTION_DATABASE_CUSTOMERS_ID`: 고객 데이터베이스 ID
- `NEXTAUTH_URL`: 애플리케이션 URL
- `NEXTAUTH_SECRET`: NextAuth.js 시크릿 키
- `ADMIN_EMAIL`: 관리자 이메일
- `ADMIN_PASSWORD`: 관리자 비밀번호

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## 📋 개발 상태

- ✅ 기본 프로젝트 구조 설정
- ✅ Next.js 15.5.3 + React 19 + TypeScript 설정
- ✅ TailwindCSS v4 + shadcn/ui 통합
- ✅ 필수 패키지 설치 (Notion API, PDF 생성)
- ✅ 환경 변수 템플릿 생성
- ⏳ 로그인 페이지 구현 (예정)
- ⏳ 관리자 대시보드 페이지 구현 (예정)
- ⏳ 견적서 상세 페이지 구현 (예정)
- ⏳ Notion API 연동 (예정)
- ⏳ PDF 생성 기능 (예정)

## 📖 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항 및 기능 명세
- [개발 로드맵](./docs/ROADMAP.md) - 개발 계획 및 진행 상황
- [개발 가이드](./CLAUDE.md) - Claude Code 개발 지침

## 🗄️ Notion 데이터베이스 구조

### Quotes (견적서)
- quote_number: 견적서 번호
- customer_id: 고객 정보 (Relation to Customers)
- status: 견적서 상태 (작성중, 발송됨, 확인됨, 승인됨, 거부됨)
- issue_date: 발행일
- valid_until: 유효기간
- public_link_id: 공개 링크 고유 ID
- total_amount: 총 금액
- notes: 비고 및 조건

### Quote Items (견적 항목)
- quote_id: 소속 견적서 (Relation to Quotes)
- item_name: 품목명
- description: 상세 설명
- quantity: 수량
- unit_price: 단가
- amount: 금액 (quantity × unit_price)
- order: 표시 순서

### Customers (고객)
- customer_name: 고객명
- company_name: 회사명
- email: 이메일
- phone: 전화번호
- address: 주소

## 🔒 보안 고려사항

### Notion API 통합
- 환경 변수로 Notion Integration Token 보안 관리
- Notion API 호출 실패 시 적절한 폴백 메시지
- 데이터 동기화 시 캐싱 전략 고려

### 공개 링크 보안
- UUID 또는 nanoid 사용하여 고유 ID 생성
- 링크를 아는 사람만 접근 가능 (추가 인증 없음)
- 견적서 유효기간 이후 접근 제한 고려

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👨‍💻 개발자

개발 문의 또는 이슈가 있으시면 GitHub Issues를 통해 알려주세요.
