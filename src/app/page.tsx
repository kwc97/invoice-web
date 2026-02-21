import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { COMPANY_INFO } from '@/lib/constants'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Link2,
  Share2,
  Shield,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'

/**
 * 사용 흐름 단계 데이터
 */
const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: FileText,
    title: '견적서 작성',
    description:
      'Notion 데이터베이스에서 견적서를 작성하고 항목, 수량, 금액을 입력합니다.',
  },
  {
    step: '02',
    icon: Share2,
    title: '공유 링크 생성',
    description:
      '관리자 대시보드에서 공개 링크를 생성하여 클라이언트에게 전달합니다.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: '클라이언트 확인 및 승인',
    description:
      '클라이언트가 링크를 통해 견적서를 확인하고 승인 또는 거부 의사를 전달합니다.',
  },
] as const

/**
 * 주요 기능 특징 데이터
 */
const FEATURES = [
  {
    icon: Zap,
    title: 'Notion 연동',
    description: 'Notion 데이터베이스와 실시간으로 연동되어 별도 DB 없이 관리합니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description: '견적서를 PDF로 즉시 다운로드하여 인쇄하거나 보관할 수 있습니다.',
  },
  {
    icon: Link2,
    title: '공개 링크 공유',
    description: '로그인 없이 접근 가능한 고유 링크로 클라이언트와 간편하게 공유합니다.',
  },
  {
    icon: Shield,
    title: '안전한 관리',
    description: '관리자 인증으로 보호되어 권한이 있는 사용자만 견적서를 관리합니다.',
  },
] as const

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== 히어로 섹션 ===== */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-32">
        {/* 배경 그라디언트 장식 */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" />
          {/* 라이트 모드: 미세한 격자 패턴 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
          {/* 상단 우측 포인트 그라디언트 */}
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
          {/* 좌측 하단 포인트 그라디언트 */}
          <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        <Container size="md">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* 로고 - 다크모드에서 흰색 배경 패딩으로 가시성 확보 */}
            <div className="mb-8">
              <div className="inline-block rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-border/50 dark:bg-white dark:ring-white/20">
                <Image
                  src="/logo.png"
                  alt="케이프로텍"
                  width={240}
                  height={56}
                  className="h-14 w-auto"
                  priority
                />
              </div>
            </div>

            {/* 상단 배지 */}
            <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              견적서 관리 시스템
            </Badge>

            {/* 메인 헤드라인 */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              견적서 관리부터
              <br />
              <span className="text-primary">클라이언트 승인</span>까지
            </h1>

            {/* 설명 문구 */}
            <p className="mb-10 max-w-xl text-base text-muted-foreground sm:text-lg">
              Notion 데이터베이스 기반으로 견적서를 작성하고, 공유 링크로
              클라이언트에게 전달하여 빠르게 승인을 받으세요.
            </p>

            {/* CTA 버튼 그룹 */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <NextLink href="/login">
                  관리자 로그인
                  <ArrowRight className="ml-2 h-4 w-4" />
                </NextLink>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 사용 흐름 섹션 ===== */}
      <section className="border-t bg-muted/30 py-16 sm:py-24">
        <Container size="md">
          {/* 섹션 헤더 */}
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              How It Works
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              이렇게 사용하세요
            </h2>
            <p className="mt-3 text-muted-foreground">
              세 단계로 견적서를 관리하고 클라이언트의 승인을 받을 수 있습니다.
            </p>
          </div>

          {/* 단계 카드 그리드 */}
          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* 단계 연결선 (데스크톱) */}
            <div
              className="absolute left-1/3 right-1/3 top-10 hidden h-px bg-gradient-to-r from-border via-primary/30 to-border sm:block"
              aria-hidden="true"
            />

            {WORKFLOW_STEPS.map(({ step, icon: Icon, title, description }) => (
              <Card
                key={step}
                className="relative flex flex-col items-center text-center transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-0">
                  {/* 단계 번호 배지 */}
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="absolute right-4 top-4 text-xs font-bold tabular-nums text-muted-foreground/50">
                    {step}
                  </span>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== 주요 기능 섹션 ===== */}
      <section className="py-16 sm:py-24">
        <Container size="md">
          {/* 섹션 헤더 */}
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Features
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              주요 기능
            </h2>
          </div>

          {/* 기능 카드 그리드 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="border-t bg-muted/20 py-10">
        <Container size="md">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            {/* 회사 로고 및 이름 */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <div className="inline-block rounded-lg bg-white px-3 py-1.5 dark:bg-white">
                <Image
                  src="/logo.png"
                  alt="케이프로텍"
                  width={100}
                  height={24}
                  className="h-6 w-auto"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {COMPANY_INFO.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  KPROTEK Co., Ltd.
                </p>
              </div>
            </div>

            {/* 회사 연락처 정보 */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                사업자등록번호: {COMPANY_INFO.businessNumber}
                {' · '}
                대표: {COMPANY_INFO.representative}
              </p>
              <p>{COMPANY_INFO.address}</p>
              <p>
                TEL: {COMPANY_INFO.tel}
                {' · '}
                FAX: {COMPANY_INFO.fax}
              </p>
            </div>
          </div>

          {/* 저작권 */}
          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
