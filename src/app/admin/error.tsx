'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Container } from '@/components/layout/container'

/**
 * 관리자 영역 에러 페이지
 * admin/layout.tsx의 Header/Footer가 유지된 상태에서 main 영역의 에러를 처리
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅
    console.error('Admin error:', error)
  }, [error])

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-md text-center">
        <div className="space-y-6">
          {/* 에러 아이콘 */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>

          {/* 에러 메시지 */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              페이지를 불러올 수 없습니다
            </h1>
            <p className="text-muted-foreground">
              관리자 페이지를 처리하는 중 오류가 발생했습니다. 다시 시도하거나
              대시보드로 돌아가주세요.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-center gap-3">
            {/* 다시 시도 버튼 */}
            <button
              onClick={() => reset()}
              className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              다시 시도
            </button>

            {/* 대시보드로 돌아가기 링크 */}
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-lg border bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent"
            >
              대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
