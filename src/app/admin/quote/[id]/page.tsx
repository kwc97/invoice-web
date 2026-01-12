import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { QuoteDetail } from '@/components/quote/quote-detail'
import { PublicLinkSection } from '@/components/quote/public-link-section'
import { getQuoteById } from '@/lib/dummy-data'

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * 견적서 상세 페이지 (관리자용)
 *
 * 기능:
 * - 견적서 전체 정보 표시
 * - 고객 정보 표시
 * - 견적 항목 테이블
 * - 공개 링크 생성 및 복사
 */
export default async function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = await params
  const quote = getQuoteById(id)

  if (!quote) {
    notFound()
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            대시보드로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <QuoteDetail quote={quote} />
        <PublicLinkSection initialPublicLinkId={quote.publicLinkId} />
      </div>
    </Container>
  )
}
