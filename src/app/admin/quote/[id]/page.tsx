import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { QuoteDetail } from '@/components/quote/quote-detail'
import { PublicLinkSection } from '@/components/quote/public-link-section'
import { DeleteQuoteDialog } from '@/components/quote/delete-quote-dialog'
import { RecallQuoteDialog } from '@/components/quote/recall-quote-dialog'
import { getCachedQuoteById } from '@/lib/notion'
import { QUOTE_STATUS } from '@/lib/constants'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const quote = await getCachedQuoteById(id)
  return {
    title: quote ? `${quote.quoteNumber} 견적서` : '견적서 상세',
  }
}

/**
 * 견적서 상세 페이지 (관리자용)
 *
 * 기능:
 * - 견적서 전체 정보 표시 (Notion API에서 조회)
 * - 고객 정보 표시
 * - 견적 항목 테이블
 * - 공개 링크 생성 및 복사
 */
export default async function AdminQuoteDetailPage({ params }: PageProps) {
  const { id } = await params
  const quote = await getCachedQuoteById(id)

  if (!quote) {
    notFound()
  }

  const isEditable =
    quote.status === QUOTE_STATUS.DRAFT ||
    quote.status === QUOTE_STATUS.REJECTED

  const isDeletable = isEditable || quote.status === QUOTE_STATUS.EXPIRED

  const isRecallable =
    quote.status === QUOTE_STATUS.SENT ||
    quote.status === QUOTE_STATUS.CONFIRMED

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            대시보드로 돌아가기
          </Link>
        </Button>

        {(isEditable || isDeletable || isRecallable) && (
          <div className="flex items-center gap-2">
            {isRecallable && <RecallQuoteDialog quoteId={quote.id} />}
            {isEditable && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/quote/${quote.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </Link>
              </Button>
            )}
            {isDeletable && (
              <DeleteQuoteDialog
                quoteId={quote.id}
                quoteNumber={quote.quoteNumber}
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <QuoteDetail quote={quote} />
        <PublicLinkSection
          quoteId={quote.id}
          initialPublicLinkId={quote.publicLinkId}
          quoteStatus={quote.status}
        />
      </div>
    </Container>
  )
}
