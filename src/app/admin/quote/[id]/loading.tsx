import { Container } from '@/components/layout/container'

/**
 * 견적서 상세 로딩 UI (관리자용)
 *
 * Suspense 기반 스트리밍을 위한 로딩 스켈레톤
 */
export default function AdminQuoteDetailLoading() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-9 w-64 animate-pulse rounded-lg" />
            <div className="bg-muted h-5 w-48 animate-pulse rounded-lg" />
          </div>
        </div>

        {/* 견적서 정보 스켈레톤 */}
        <div className="bg-muted h-48 animate-pulse rounded-lg" />

        {/* 공개 링크 관리 스켈레톤 */}
        <div className="bg-muted h-40 animate-pulse rounded-lg" />

        {/* 견적 항목 스켈레톤 */}
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
      </div>
    </Container>
  )
}
