/**
 * 로그인 페이지 로딩 UI
 *
 * Suspense 기반 스트리밍을 위한 로딩 스켈레톤
 */
export default function LoginLoading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="animate-pulse space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="space-y-2 text-center">
            <div className="bg-muted mx-auto h-8 w-48 rounded-lg" />
            <div className="bg-muted mx-auto h-5 w-64 rounded-lg" />
          </div>

          {/* 폼 스켈레톤 */}
          <div className="space-y-4">
            <div className="bg-muted h-10 w-full rounded-lg" />
            <div className="bg-muted h-10 w-full rounded-lg" />
            <div className="bg-muted h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
