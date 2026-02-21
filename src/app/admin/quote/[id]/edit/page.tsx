import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { QuoteForm } from '@/components/quote/quote-form'
import {
  getCachedQuoteById,
  getCachedCustomers,
  koreanDateToISO,
} from '@/lib/notion'
import { QUOTE_STATUS } from '@/lib/constants'
import type { QuoteFormData } from '@/lib/validations/quote'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const quote = await getCachedQuoteById(id)
  return {
    title: quote ? `${quote.quoteNumber} 수정` : '견적서 수정',
  }
}

/** 수정 가능한 상태 */
const EDITABLE_STATUSES: string[] = [QUOTE_STATUS.DRAFT, QUOTE_STATUS.REJECTED]

/**
 * 견적서 수정 페이지
 */
export default async function EditQuotePage({ params }: PageProps) {
  const { id } = await params
  const [quote, customers] = await Promise.all([
    getCachedQuoteById(id),
    getCachedCustomers(),
  ])

  if (!quote) {
    notFound()
  }

  // 수정 불가 상태면 상세 페이지로
  if (!EDITABLE_STATUSES.includes(quote.status)) {
    notFound()
  }

  // 기존 데이터를 폼 기본값으로 변환
  const defaultValues: QuoteFormData = {
    customerId: quote.customerId,
    issueDate: koreanDateToISO(quote.issueDate),
    validUntil: koreanDateToISO(quote.validUntil),
    projectName: quote.projectName ?? '',
    recipient: quote.recipient ?? '',
    contactPerson: quote.contactPerson ?? '',
    notes: quote.notes ?? '',
    language: quote.language ?? 'ko',
    items: (quote.items ?? []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      unit: item.unit ?? '',
      remarks: item.remarks ?? '',
    })),
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/admin/quote/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            견적서로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {quote.quoteNumber} 수정
        </h1>
        {quote.status === QUOTE_STATUS.REJECTED && (
          <p className="text-muted-foreground mt-1">
            저장 시 상태가 &quot;작성중&quot;으로 변경됩니다.
          </p>
        )}
      </div>

      <QuoteForm
        mode="edit"
        customers={customers}
        defaultValues={defaultValues}
        quoteId={id}
      />
    </Container>
  )
}
