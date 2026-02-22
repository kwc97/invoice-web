import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { PublicQuoteView } from '@/components/quote/public-quote-view'
import { QuoteActions } from '@/components/quote/quote-actions'
import { ConfirmViewTracker } from '@/components/quote/confirm-view-tracker'
import { AlertTriangle, FileX, Mail } from 'lucide-react'
import { getCachedQuoteByPublicLink } from '@/lib/notion'
import { getDictionary, translateQuoteContent } from '@/lib/i18n'
import { formatDateByLanguage } from '@/lib/i18n/format'
import { COMPANY_INFO, QUOTE_STATUS } from '@/lib/constants'

interface PageProps {
  params: Promise<{ publicId: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const quote = await getCachedQuoteByPublicLink(publicId)
  if (!quote) {
    return { title: '견적서', description: '견적서를 확인하세요.' }
  }

  const lang = quote.language ?? 'ko'
  const dict = getDictionary(lang)
  return {
    title: `${dict.quote.title} - ${quote.quoteNumber}`,
    description:
      lang === 'ko'
        ? `${quote.customer?.name}님께 보내는 견적서입니다.`
        : `Quotation ${quote.quoteNumber} for ${quote.customer?.name}`,
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

  // 외부 고객 열람 시 "발송됨" → "확인됨" 자동 전환
  const session = await auth()
  const isAdmin = !!session?.user

  const shouldTrackView = !isAdmin && quote.status === QUOTE_STATUS.SENT

  const lang = quote.language ?? 'ko'
  const dict = getDictionary(lang)

  // 동적 콘텐츠 번역 (한국어가 아닐 때만)
  const translatedQuote =
    lang !== 'ko' ? await translateQuoteContent(quote, lang) : quote

  // 날짜 포맷 변환
  const formattedQuote = {
    ...translatedQuote,
    issueDate: formatDateByLanguage(translatedQuote.issueDate, lang),
    validUntil: formatDateByLanguage(translatedQuote.validUntil, lang),
  }

  // 공개 가능 상태 확인
  const publicStatuses = [
    QUOTE_STATUS.SENT,
    QUOTE_STATUS.CONFIRMED,
    QUOTE_STATUS.APPROVED,
    QUOTE_STATUS.REJECTED,
  ] as const
  const isExpired = quote.status === QUOTE_STATUS.EXPIRED
  const isPublicAccessible =
    isExpired ||
    publicStatuses.includes(quote.status as (typeof publicStatuses)[number])

  // 비공개 상태 (DRAFT 등): 접근 차단 안내 화면
  if (!isPublicAccessible) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="bg-background rounded-lg border p-8 shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <FileX className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h1 className="mb-3 text-2xl font-bold">
              {dict.messages.unavailableTitle}
            </h1>
            <p className="text-muted-foreground mb-6">
              {dict.messages.unavailableDescription}
            </p>
            <a
              href={`mailto:${COMPANY_INFO.email ?? ''}?subject=${encodeURIComponent(dict.messages.expiredContact + ' - ' + quote.quoteNumber)}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              {dict.messages.expiredContact}
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 만료된 견적서: 전용 안내 화면
  if (isExpired) {
    return (
      <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="bg-background rounded-lg border p-8 shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="mb-3 text-2xl font-bold">
              {dict.messages.expiredTitle}
            </h1>
            <p className="text-muted-foreground mb-2 text-sm">
              {dict.quote.no} {quote.quoteNumber} &middot;{' '}
              {dict.quote.issueDate} {formattedQuote.issueDate}
            </p>
            <p className="text-muted-foreground mb-6">
              {dict.messages.expiredDescription}
            </p>
            <a
              href={`mailto:${COMPANY_INFO.email ?? ''}?subject=${encodeURIComponent(dict.messages.expiredContact + ' - ' + quote.quoteNumber)}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              {dict.messages.expiredContact}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-12 print:bg-white print:p-0">
      {shouldTrackView && <ConfirmViewTracker quoteId={quote.id} />}
      <div className="space-y-6 print:space-y-0">
        <PublicQuoteView quote={formattedQuote} dictionary={dict} />
        <div className="print:hidden">
          <QuoteActions
            quoteId={quote.id}
            currentStatus={quote.status}
            dictionary={dict}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  )
}
