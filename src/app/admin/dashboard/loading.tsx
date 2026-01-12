import { Container } from '@/components/layout/container'

/**
 * 대시보드 로딩 UI
 *
 * Suspense 기반 스트리밍을 위한 로딩 스켈레톤
 */
export default function DashboardLoading() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="space-y-2">
          <div className="bg-muted h-9 w-48 animate-pulse rounded-lg" />
          <div className="bg-muted h-5 w-96 animate-pulse rounded-lg" />
        </div>

        {/* 통계 카드 스켈레톤 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted h-28 animate-pulse rounded-lg" />
          ))}
        </div>

        {/* 목록 스켈레톤 */}
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    </Container>
  )
}
