import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Quote } from '@/types/quote'
import { CURRENCY } from '@/lib/constants'

interface PublicQuoteViewProps {
  quote: Quote
  isExpired?: boolean
}

/**
 * 공개 견적서 뷰 컴포넌트
 * 클라이언트 친화적 레이아웃
 */
export function PublicQuoteView({ quote }: PublicQuoteViewProps) {
  const subtotal = quote.totalAmount
  const total = subtotal

  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="p-8">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="케이프로텍"
              width={220}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">견적서</h1>
          <p className="mt-2 text-muted-foreground">{quote.quoteNumber}</p>
        </div>

        <Separator className="my-6" />

        {/* 견적서 정보 */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">발행일</p>
            <p className="text-muted-foreground">{quote.issueDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium">유효기간</p>
            <p className="font-medium text-red-600">{quote.validUntil}</p>
          </div>
        </div>

        {/* 고객 정보 */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">고객 정보</h2>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">고객명</p>
                <p className="text-muted-foreground">{quote.customer?.name}</p>
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
            </div>
          </div>
        </div>

        {/* 견적 항목 */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">견적 내역</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    품목
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    수량
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    단가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody>
                {quote.items?.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      {CURRENCY.SYMBOL}
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {CURRENCY.SYMBOL}
                      {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 합계 */}
        <div className="mb-6 flex justify-end">
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">소계</span>
              <span className="font-medium">
                {CURRENCY.SYMBOL}
                {subtotal.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>총액</span>
              <span className="text-primary">
                {CURRENCY.SYMBOL}
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 비고 */}
        {quote.notes && (
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-2 font-semibold">안내사항</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {quote.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
