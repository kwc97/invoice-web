import Link from 'next/link'
import { Container } from './container'

/**
 * 공통 푸터 컴포넌트
 * 저작권 정보 및 링크 포함
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t">
      <Container>
        <div className="py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} KPROTEK Co.,Ltd. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                홈
              </Link>
              <Link
                href="/admin/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
