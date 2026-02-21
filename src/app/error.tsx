'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Container } from '@/components/layout/container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // 에러 로깅
  useEffect(() => {
    console.error('Root error boundary caught:', error)
  }, [error])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <div className="space-y-6">
            {/* 에러 아이콘 */}
            <div className="flex justify-center">
              <div className="bg-destructive/10 flex h-24 w-24 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-12 w-12" />
              </div>
            </div>

            {/* 에러 메시지 */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">문제가 발생했습니다</h1>
              <p className="text-muted-foreground">
                요청을 처리하는 중 오류가 발생했습니다. 다시 시도하거나 다른 페이지로 이동해주세요.
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => reset()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-6 py-2.5 text-sm font-medium"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="bg-background hover:bg-accent inline-flex items-center rounded-lg border px-6 py-2.5 text-sm font-medium"
              >
                홈으로 돌아가기
              </Link>
              <Link
                href="/admin/dashboard"
                className="bg-background hover:bg-accent inline-flex items-center rounded-lg border px-6 py-2.5 text-sm font-medium"
              >
                대시보드로 이동
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
