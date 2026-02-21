'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import '@/app/globals.css'

/**
 * 전역 에러 바운더리
 *
 * 루트 레이아웃에서 처리되지 않은 모든 에러를 캐치합니다.
 * html, body 태그를 직접 포함하여 루트 레이아웃을 완전히 대체합니다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // 에러 로깅
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="container">
            <div className="mx-auto max-w-md text-center">
              <div className="space-y-6">
                {/* 에러 아이콘 */}
                <div className="flex justify-center">
                  <div className="bg-destructive/10 flex h-24 w-24 items-center justify-center rounded-full">
                    <AlertTriangle className="text-destructive h-12 w-12" />
                  </div>
                </div>

                {/* 메시지 */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    예기치 않은 오류가 발생했습니다
                  </h1>
                  <p className="text-muted-foreground">
                    시스템에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
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
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="bg-background hover:bg-accent inline-flex items-center rounded-lg border px-6 py-2.5 text-sm font-medium"
                  >
                    홈으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
