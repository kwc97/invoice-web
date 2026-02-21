import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicQuoteView } from '@/components/quote/public-quote-view'
import { QuoteActions } from '@/components/quote/quote-actions'
import { getCachedQuoteByPublicLink } from '@/lib/notion'

interface PageProps {
  params: Promise<{ publicId: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const quote = await getCachedQuoteByPublicLink(publicId)
  return {
    title: quote ? `견적서 - ${quote.quoteNumber}` : '견적서',
    description: quote
      ? `${quote.customer?.name}님께 보내는 견적서입니다.`
      : '견적서를 확인하세요.',
  }
}

/**
 * 견적서 상세 페이지 (공개)
 *
 * 인증 없이 접근 가능한 공개 페이지
 * 기능: 견적서 확인, PDF 다운로드, 승인/거부
 */
export default async function PublicQuotePage({ params }: PageProps) {
  const { publicId } = await params
  const quote = await getCachedQuoteByPublicLink(publicId)

  if (!quote) {
    notFound()
  }

  // 유효기간 확인
  const isExpired = new Date(quote.validUntil) < new Date()

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-12">
      <div className="space-y-6">
        <PublicQuoteView quote={quote} isExpired={isExpired} />
        <QuoteActions
          quoteId={quote.id}
          currentStatus={quote.status}
          isExpired={isExpired}
        />
      </div>
    </div>
  )
}
