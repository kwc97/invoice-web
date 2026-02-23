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
import { getCompanyConfig } from '@/lib/company'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Globe,
  Info,
  Link2,
  Pencil,
  Share2,
  Shield,
  Trash2,
  Undo2,
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
      '웹에서 직접 견적서를 작성하고 항목, 수량, 금액을 입력합니다. 작성된 데이터는 Notion에 자동 저장됩니다.',
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
 * 상태별 수정/삭제 권한 안내 데이터
 */
const STATUS_PERMISSIONS = [
  {
    statuses: ['작성중', '거부됨'],
    canEdit: true,
    canDelete: true,
    canRecall: false,
    description: '내용 수정 및 삭제가 자유롭게 가능합니다.',
  },
  {
    statuses: ['발송됨'],
    canEdit: false,
    canDelete: false,
    canRecall: true,
    description:
      '클라이언트에게 전달된 상태로, 회수하여 작성중으로 되돌릴 수 있습니다.',
  },
  {
    statuses: ['확인됨', '승인됨'],
    canEdit: false,
    canDelete: false,
    canRecall: false,
    description:
      '클라이언트가 확인 또는 승인한 상태로, 수정 및 삭제가 불가합니다.',
  },
  {
    statuses: ['만료됨'],
    canEdit: false,
    canDelete: true,
    canRecall: false,
    description: '유효기간이 지난 견적서로, 삭제만 가능합니다.',
  },
] as const

/**
 * 주요 기능 특징 데이터
 */
const FEATURES = [
  {
    icon: Zap,
    title: 'Notion 자동 저장',
    description:
      '웹에서 작성한 견적서가 Notion에 자동 저장되어 별도 DB 없이 관리합니다.',
  },
  {
    icon: Globe,
    title: '6개 언어 지원',
    description:
      '한국어, English, 中文, 日本語, Italiano, Español을 지원하여 해외 클라이언트에게도 견적서를 전달할 수 있습니다.',
  },
  {
    icon: Download,
    title: 'PDF 다운로드',
    description:
      '견적서를 PDF로 즉시 다운로드하여 인쇄하거나 보관할 수 있습니다.',
  },
  {
    icon: Link2,
    title: '공개 링크 공유',
    description:
      '로그인 없이 접근 가능한 고유 링크로 클라이언트와 간편하게 공유합니다.',
  },
  {
    icon: Shield,
    title: '안전한 관리',
    description:
      '관리자 인증으로 보호되어 권한이 있는 사용자만 견적서를 관리합니다.',
  },
] as const

export default function Home() {
  const companyInfo = getCompanyConfig('kprotek')

  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== 히어로 섹션 ===== */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-32">
        {/* 배경 그라디언트 장식 */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="from-background via-background to-muted/40 absolute inset-0 bg-gradient-to-b" />
          {/* 라이트 모드: 미세한 격자 패턴 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
          {/* 상단 우측 포인트 그라디언트 */}
          <div className="bg-primary/5 absolute -top-40 right-0 h-[600px] w-[600px] rounded-full blur-[100px]" />
          {/* 좌측 하단 포인트 그라디언트 */}
          <div className="bg-primary/5 absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full blur-[80px]" />
        </div>

        <Container size="md">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* 로고 - 라이트/다크 모드별 전환 */}
            <div className="mb-8">
              <div className="ring-border/50 inline-block rounded-xl bg-white px-5 py-3 shadow-sm ring-1 dark:bg-transparent dark:shadow-none dark:ring-0">
                <Image
                  src="/logo.png"
                  alt="케이프로텍"
                  width={240}
                  height={56}
                  className="block h-14 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.png"
                  alt="케이프로텍"
                  width={240}
                  height={56}
                  className="hidden h-16 w-auto dark:block"
                  priority
                />
              </div>
            </div>

            {/* 상단 배지 */}
            <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-sm">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />
              견적서 관리 시스템
            </Badge>

            {/* 메인 헤드라인 */}
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              견적서 관리부터
              <br />
              <span className="text-primary">클라이언트 승인</span>까지
            </h1>

            {/* 설명 문구 */}
            <p className="text-muted-foreground mb-10 max-w-xl text-base sm:text-lg">
              웹에서 견적서를 작성하고, 공유 링크로 클라이언트에게 전달하여
              빠르게 승인을 받으세요. 모든 데이터는 Notion에 자동 저장됩니다.
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
      <section className="bg-muted/30 border-t py-16 sm:py-24">
        <Container size="md">
          {/* 섹션 헤더 */}
          <div className="mb-12 text-center">
            <p className="text-primary mb-2 text-sm font-medium tracking-widest uppercase">
              How It Works
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              이렇게 사용하세요
            </h2>
            <p className="text-muted-foreground mt-3">
              세 단계로 견적서를 관리하고 클라이언트의 승인을 받을 수 있습니다.
            </p>
          </div>

          {/* 단계 카드 그리드 */}
          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* 단계 연결선 (데스크톱) */}
            <div
              className="from-border via-primary/30 to-border absolute top-9 right-1/3 left-1/3 hidden h-px bg-gradient-to-r sm:block"
              aria-hidden="true"
            />

            {WORKFLOW_STEPS.map(({ step, icon: Icon, title, description }) => (
              <Card
                key={step}
                className="relative transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <span className="text-muted-foreground/50 absolute top-4 right-4 text-xs font-bold tabular-nums">
                    {step}
                  </span>
                  {/* 아이콘 + 제목 한 줄 */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </div>
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

      {/* ===== 상태별 권한 안내 섹션 ===== */}
      <section className="border-t py-16 sm:py-24">
        <Container size="md">
          <div className="mb-12 text-center">
            <p className="text-primary mb-2 text-sm font-medium tracking-widest uppercase">
              Status Guide
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              상태별 수정/삭제 안내
            </h2>
            <p className="text-muted-foreground mt-3">
              견적서 상태에 따라 수정 및 삭제 가능 여부가 달라집니다.
            </p>
          </div>

          <div className="mx-auto max-w-2xl space-y-4">
            {STATUS_PERMISSIONS.map(
              ({ statuses, canEdit, canDelete, canRecall, description }) => (
                <Card key={statuses.join('-')}>
                  <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap gap-2">
                        {statuses.map(s => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${canEdit ? 'text-primary' : 'text-muted-foreground/50'}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        수정 {canEdit ? '가능' : '불가'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${canDelete ? 'text-primary' : 'text-muted-foreground/50'}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        삭제 {canDelete ? '가능' : '불가'}
                      </span>
                      {canRecall && (
                        <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                          <Undo2 className="h-3.5 w-3.5" />
                          회수 가능
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-4">
              <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-muted-foreground text-xs leading-relaxed">
                클라이언트에게 발송된 견적서는 데이터 무결성을 위해 수정 및
                삭제가 제한됩니다. 발송됨 상태에서는 회수하여 작성중으로 되돌릴
                수 있으며, 변경이 필요한 경우 회수 후 수정하거나 새 견적서를
                작성해 주세요.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 주요 기능 섹션 ===== */}
      <section className="py-16 sm:py-24">
        <Container size="md">
          {/* 섹션 헤더 */}
          <div className="mb-12 text-center">
            <p className="text-primary mb-2 text-sm font-medium tracking-widest uppercase">
              Features
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              주요 기능
            </h2>
          </div>

          {/* 기능 카드 그리드 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="bg-primary/10 text-primary mb-2 flex h-9 w-9 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {title}
                  </CardTitle>
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
      <footer className="bg-muted/20 border-t py-10">
        <Container size="md">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            {/* 회사 로고 및 이름 */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              <div className="inline-block rounded-lg bg-white px-3 py-1.5 dark:bg-transparent dark:px-0 dark:py-0">
                <Image
                  src="/logo.png"
                  alt="케이프로텍"
                  width={100}
                  height={24}
                  className="block h-6 w-auto dark:hidden"
                />
                <Image
                  src="/logo-dark.png"
                  alt="케이프로텍"
                  width={100}
                  height={24}
                  className="hidden h-6 w-auto dark:block"
                />
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">
                  {companyInfo.displayName}
                </p>
                <p className="text-muted-foreground text-xs">
                  KPROTEK Co., Ltd.
                </p>
              </div>
            </div>

            {/* 회사 연락처 정보 */}
            <div className="text-muted-foreground space-y-1 text-xs">
              <p>
                사업자등록번호: {companyInfo.businessNumber}
                {' · '}
                대표: {companyInfo.supplierValues.ko.representative}
              </p>
              <p>{companyInfo.supplierValues.ko.address}</p>
              <p>
                TEL: {companyInfo.supplierValues.ko.tel}
                {' · '}
                FAX: {companyInfo.supplierValues.ko.fax}
              </p>
            </div>
          </div>

          {/* 저작권 */}
          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} {companyInfo.displayName}. All
              rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
