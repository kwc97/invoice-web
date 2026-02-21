'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { Quote } from '@/types/quote'
import type { QuoteSort } from '@/types/quote'
import { CURRENCY } from '@/lib/constants'

type SortableField = 'quoteNumber' | 'customer' | 'issueDate' | 'validUntil'

interface QuoteListTableProps {
  quotes: Quote[]
}

/** 견적서 번호를 파싱하여 다단계 비교용 객체로 변환 */
function parseQuoteNumber(qn: string) {
  const parts = qn.split('-')
  return {
    prefix: parts[0] || '',
    year: parseInt(parts[1] || '0', 10),
    number: parseInt(parts[2] || '0', 10),
  }
}

/** 두 견적서 번호를 비교 (오름차순 기준) */
function compareQuoteNumber(a: string, b: string): number {
  const pa = parseQuoteNumber(a)
  const pb = parseQuoteNumber(b)
  // 1순위: prefix 알파벳순
  const prefixCmp = pa.prefix.localeCompare(pb.prefix)
  if (prefixCmp !== 0) return prefixCmp
  // 2순위: year 숫자순
  if (pa.year !== pb.year) return pa.year - pb.year
  // 3순위: number 숫자순
  return pa.number - pb.number
}

/**
 * 견적서 목록 테이블 컴포넌트
 * 컬럼 헤더 클릭으로 정렬 (asc → desc → 해제)
 */
export function QuoteListTable({ quotes }: QuoteListTableProps) {
  const router = useRouter()
  const [sort, setSort] = useState<QuoteSort | null>(null)

  /** 컬럼 헤더 클릭 시 정렬 토글 */
  function handleSort(field: SortableField) {
    setSort(prev => {
      if (prev?.field !== field) return { field, direction: 'asc' }
      if (prev.direction === 'asc') return { field, direction: 'desc' }
      return null // desc → 해제
    })
  }

  /** 정렬 아이콘 렌더링 */
  function SortIcon({ field }: { field: SortableField }) {
    if (sort?.field !== field)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-30" />
    if (sort.direction === 'asc') return <ArrowUp className="ml-1 h-4 w-4" />
    return <ArrowDown className="ml-1 h-4 w-4" />
  }

  const sortedQuotes = useMemo(() => {
    if (!sort) return quotes

    return [...quotes].sort((a, b) => {
      let cmp = 0

      switch (sort.field) {
        case 'quoteNumber':
          cmp = compareQuoteNumber(a.quoteNumber, b.quoteNumber)
          break
        case 'customer': {
          const nameA = a.customer?.name || ''
          const nameB = b.customer?.name || ''
          cmp = nameA.localeCompare(nameB, 'ko')
          break
        }
        case 'issueDate':
          cmp = a.issueDate.localeCompare(b.issueDate)
          break
        case 'validUntil':
          cmp = a.validUntil.localeCompare(b.validUntil)
          break
      }

      return sort.direction === 'desc' ? -cmp : cmp
    })
  }, [quotes, sort])

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="견적서가 없습니다"
        description="새로운 견적서를 Notion에서 작성해보세요"
      />
    )
  }

  const sortableHeadClass = 'cursor-pointer select-none'

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className={sortableHeadClass}
              onClick={() => handleSort('quoteNumber')}
            >
              <div className="flex items-center">
                견적서 번호
                <SortIcon field="quoteNumber" />
              </div>
            </TableHead>
            <TableHead
              className={sortableHeadClass}
              onClick={() => handleSort('customer')}
            >
              <div className="flex items-center">
                고객명
                <SortIcon field="customer" />
              </div>
            </TableHead>
            <TableHead
              className={sortableHeadClass}
              onClick={() => handleSort('issueDate')}
            >
              <div className="flex items-center">
                발행일
                <SortIcon field="issueDate" />
              </div>
            </TableHead>
            <TableHead
              className={sortableHeadClass}
              onClick={() => handleSort('validUntil')}
            >
              <div className="flex items-center">
                유효기간
                <SortIcon field="validUntil" />
              </div>
            </TableHead>
            <TableHead>상태</TableHead>
            <TableHead className={cn('text-right')}>금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedQuotes.map(quote => (
            <TableRow
              key={quote.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => router.push(`/admin/quote/${quote.id}`)}
            >
              <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
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
