import { Container } from '@/components/layout/container'

/**
 * 공개 견적서 로딩 UI
 *
 * Suspense 기반 스트리밍을 위한 로딩 스켈레톤
 */
export default function PublicQuoteLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* 헤더 스켈레톤 */}
      <header className="border-b">
        <Container>
          <div className="flex h-16 items-center">
            <div className="bg-muted h-8 w-32 animate-pulse rounded-lg" />
          </div>
        </Container>
      </header>

      {/* 메인 컨텐츠 스켈레톤 */}
      <main className="py-8">
        <Container>
          <div className="mx-auto max-w-4xl space-y-6">
            {/* 헤더 스켈레톤 */}
            <div className="space-y-2 text-center">
              <div className="bg-muted mx-auto h-9 w-48 animate-pulse rounded-lg" />
              <div className="bg-muted mx-auto h-5 w-64 animate-pulse rounded-lg" />
            </div>

            {/* 버튼 스켈레톤 */}
            <div className="flex justify-center gap-3">
              <div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
              <div className="bg-muted h-10 w-20 animate-pulse rounded-lg" />
              <div className="bg-muted h-10 w-20 animate-pulse rounded-lg" />
            </div>

            {/* 견적서 컨텐츠 스켈레톤 */}
            <div className="bg-muted h-[600px] animate-pulse rounded-lg" />
          </div>
        </Container>
      </main>
    </div>
  )
}
