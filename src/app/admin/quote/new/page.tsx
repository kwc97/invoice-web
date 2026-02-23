import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { QuoteForm } from '@/components/quote/quote-form'
import { getCachedCustomers } from '@/lib/notion'

export const metadata: Metadata = {
  title: '새 견적서 작성',
}

/**
 * 새 견적서 작성 페이지
 */
export default async function NewQuotePage() {
  const customers = await getCachedCustomers()

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

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">새 견적서 작성</h1>
        <p className="text-muted-foreground mt-1">
          회사를 선택하면 견적서 번호가 자동으로 생성됩니다.
        </p>
      </div>

      <QuoteForm mode="create" customers={customers} />
    </Container>
  )
}
