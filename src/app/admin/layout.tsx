import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: {
    template: '%s | 견적서 관리',
    default: '관리자',
  },
  description: 'Notion 기반 견적서 관리 시스템 - 관리자 페이지',
}

/**
 * 관리자 영역 레이아웃
 *
 * 모든 관리자 페이지에 공통으로 적용되는 레이아웃입니다.
 * Header와 Footer를 포함하며, 중앙에 children을 렌더링합니다.
 *
 * 적용 범위:
 * - /admin/dashboard - 관리자 대시보드
 * - /admin/quote/[id] - 견적서 상세 (관리자용)
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
