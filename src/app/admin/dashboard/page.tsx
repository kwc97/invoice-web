'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/layout/container'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { SearchFilter } from '@/components/dashboard/search-filter'
import { QuoteListTable } from '@/components/dashboard/quote-list-table'
import { getQuoteStats, filterQuotes } from '@/lib/dummy-data'
import type { QuoteStatus } from '@/lib/constants'

/**
 * 관리자 대시보드 페이지
 *
 * 기능:
 * - 상태별 통계 카드
 * - 견적서 검색 및 필터링
 * - 견적서 목록 테이블
 * - 견적서 클릭 시 상세 페이지 이동
 */
export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')

  const stats = getQuoteStats()

  const filteredQuotes = useMemo(() => {
    return filterQuotes({
      search,
      status: statusFilter === 'all' ? undefined : statusFilter,
    })
  }, [search, statusFilter])

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground">
            전체 견적서 현황을 한눈에 파악하고 관리할 수 있습니다.
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="space-y-4">
          <SearchFilter
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />

          <QuoteListTable quotes={filteredQuotes} />
        </div>
      </div>
    </Container>
  )
}
