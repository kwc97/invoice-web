'use client'

import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import type { Quote } from '@/types/quote'
import { CURRENCY } from '@/lib/constants'

interface QuoteListTableProps {
  quotes: Quote[]
}

/**
 * 견적서 목록 테이블 컴포넌트
 * 클릭 시 상세 페이지로 이동
 */
export function QuoteListTable({ quotes }: QuoteListTableProps) {
  const router = useRouter()

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="견적서가 없습니다"
        description="새로운 견적서를 Notion에서 작성해보세요"
      />
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>견적서 번호</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>발행일</TableHead>
            <TableHead>유효기간</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow
              key={quote.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/admin/quote/${quote.id}`)}
            >
              <TableCell className="font-medium">
                {quote.quoteNumber}
              </TableCell>
              <TableCell>{quote.customer?.name || '-'}</TableCell>
              <TableCell>{quote.issueDate}</TableCell>
              <TableCell>{quote.validUntil}</TableCell>
              <TableCell>
                <StatusBadge status={quote.status} />
              </TableCell>
              <TableCell className="text-right">
                {CURRENCY.SYMBOL}
                {quote.totalAmount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
