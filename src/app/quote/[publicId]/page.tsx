import { notFound } from 'next/navigation'
import { PublicQuoteView } from '@/components/quote/public-quote-view'
import { QuoteActions } from '@/components/quote/quote-actions'
import { getQuoteByPublicLinkId } from '@/lib/dummy-data'

interface PageProps {
  params: Promise<{ publicId: string }>
}

/**
 * 견적서 상세 페이지 (공개)
 *
 * 인증 없이 접근 가능한 공개 페이지
 * 기능: 견적서 확인, PDF 다운로드, 승인/거부
 */
export default async function PublicQuotePage({ params }: PageProps) {
  const { publicId } = await params
  const quote = getQuoteByPublicLinkId(publicId)

  if (!quote) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="space-y-6">
        <PublicQuoteView quote={quote} />
        <QuoteActions currentStatus={quote.status} />
      </div>
    </div>
  )
}
