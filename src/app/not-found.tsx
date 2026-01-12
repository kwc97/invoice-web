import Link from 'next/link'
import { Container } from '@/components/layout/container'

/**
 * 404 Not Found 페이지
 *
 * 존재하지 않는 경로에 접근했을 때 표시되는 페이지입니다.
 */
export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <div className="space-y-6">
            {/* 404 아이콘 */}
            <div className="flex justify-center">
              <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full">
                <span className="text-muted-foreground text-4xl font-bold">
                  404
                </span>
              </div>
            </div>

            {/* 메시지 */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                페이지를 찾을 수 없습니다
              </h1>
              <p className="text-muted-foreground">
                요청하신 페이지가 존재하지 않거나 이동되었습니다.
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-3">
              <Link
                href="/"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-6 py-2.5 text-sm font-medium"
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
