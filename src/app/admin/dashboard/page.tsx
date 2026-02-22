import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { SearchFilterClient } from '@/components/dashboard/search-filter-client'
import { QuoteListTable } from '@/components/dashboard/quote-list-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getQuoteStats,
  getCachedQuotes,
  expireOverdueQuotesInDb,
} from '@/lib/notion'
import type { QuoteStatus } from '@/lib/constants'

export const metadata: Metadata = {
  title: '대시보드',
}

/**
 * 검색 파라미터 타입
 */
interface SearchParams {
  search?: string
  status?: QuoteStatus | 'all'
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

/**
 * 통계 카드 서버 컴포넌트
 */
async function StatsSection() {
  const stats = await getQuoteStats()
  return <StatsCards stats={stats} />
}

/**
 * 통계 카드 로딩 스켈레톤
 */
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  )
}

/**
 * 견적서 목록 서버 컴포넌트
 * 에러 발생 시 빈 목록 표시 (unstable_cache에 에러가 캐시되지 않음)
 */
async function QuoteListSection({
  search,
  status,
}: {
  search?: string
  status?: QuoteStatus
}) {
  try {
    const quotes = await getCachedQuotes(search, status)
    return <QuoteListTable quotes={quotes} />
  } catch (error) {
    console.error('Failed to load quotes:', error)
    return <QuoteListTable quotes={[]} />
  }
}

/**
 * 견적서 목록 로딩 스켈레톤
 */
function QuoteListSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <div className="space-y-3">
          {/* 테이블 헤더 스켈레톤 */}
          <div className="grid grid-cols-6 gap-4 border-b pb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
          {/* 테이블 행 스켈레톤 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 관리자 대시보드 페이지 (Server Component)
 *
 * 기능:
 * - 상태별 통계 카드 (서버에서 데이터 패칭)
 * - 견적서 검색 및 필터링 (URL 파라미터 기반)
 * - 견적서 목록 테이블 (서버에서 필터링)
 * - 견적서 클릭 시 상세 페이지 이동
 */
export default async function AdminDashboardPage({ searchParams }: PageProps) {
  // 만료 대상 견적서를 Notion DB에서 일괄 업데이트
  await expireOverdueQuotesInDb()

  const params = await searchParams

  const search = params.search || undefined
  const status =
    params.status && params.status !== 'all' ? params.status : undefined

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground">
              전체 견적서 현황을 한눈에 파악하고 관리할 수 있습니다.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/quote/new">
              <Plus className="mr-2 h-4 w-4" />새 견적서
            </Link>
          </Button>
        </div>

        {/* 통계 카드 - Suspense로 스트리밍 */}
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsSection />
        </Suspense>

        <div className="space-y-4">
          {/* 검색/필터 - useSearchParams 사용으로 Suspense 필수 */}
          <Suspense>
            <SearchFilterClient />
          </Suspense>

          {/* 견적서 목록 - Suspense로 스트리밍 */}
          <Suspense fallback={<QuoteListSkeleton />}>
            <QuoteListSection search={search} status={status} />
          </Suspense>
        </div>
      </div>
    </Container>
  )
}
