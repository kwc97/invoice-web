import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/ui/status-badge'
import { AppendixTableView } from '@/components/quote/appendix-table-view'
import type { Quote } from '@/types/quote'
import { CURRENCY } from '@/lib/constants'

interface QuoteDetailProps {
  quote: Quote
}

/**
 * 견적서 상세 정보 컴포넌트
 * 고객 정보, 견적 항목, 합계 금액 표시
 */
export function QuoteDetail({ quote }: QuoteDetailProps) {
  const subtotal = quote.totalAmount
  const total = subtotal

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{quote.quoteNumber}</h1>
          <p className="text-muted-foreground mt-1">
            발행일: {quote.issueDate} | 유효기간: {quote.validUntil}
          </p>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      {/* 견적서 추가 정보 */}
      {(quote.projectName || quote.recipient || quote.contactPerson) && (
        <Card>
          <CardHeader>
            <CardTitle>견적서 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {quote.projectName && (
              <div>
                <p className="text-sm font-medium">프로젝트명</p>
                <p className="text-muted-foreground">{quote.projectName}</p>
              </div>
            )}
            {quote.recipient && (
              <div>
                <p className="text-sm font-medium">수신처</p>
                <p className="text-muted-foreground">{quote.recipient}</p>
              </div>
            )}
            {quote.contactPerson && (
              <div>
                <p className="text-sm font-medium">견적 담당자</p>
                <p className="text-muted-foreground">{quote.contactPerson}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 고객 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">고객명</p>
            <p className="text-muted-foreground">
              {quote.customer?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">회사명</p>
            <p className="text-muted-foreground">
              {quote.customer?.company || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">이메일</p>
            <p className="text-muted-foreground">
              {quote.customer?.email || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">전화번호</p>
            <p className="text-muted-foreground">
              {quote.customer?.phone || '-'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 견적 항목 */}
      <Card>
        <CardHeader>
          <CardTitle>견적 항목</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">No.</TableHead>
                <TableHead>품목</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-16 text-center">단위</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead className="w-24">비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quote.items?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-center">
                    {item.unit || '-'}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {CURRENCY.SYMBOL}
                    {item.unitPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {CURRENCY.SYMBOL}
                    {item.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{item.remarks || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 합계 */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">소계</span>
              <span className="font-medium">
                {CURRENCY.SYMBOL}
                {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>총액</span>
              <span>
                {CURRENCY.SYMBOL}
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 부속 내역서 */}
      {quote.appendixTables && quote.appendixTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>부속 내역서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quote.appendixTables.map((table, i) => (
              <AppendixTableView key={i} table={table} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* 비고 */}
      {quote.notes && (
        <Card>
          <CardHeader>
            <CardTitle>비고</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {quote.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
