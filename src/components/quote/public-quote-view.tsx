import Image from 'next/image'
import type { Quote } from '@/types/quote'
import { CURRENCY, COMPANY_INFO } from '@/lib/constants'
import { numberToKoreanCurrency } from '@/lib/utils'

interface PublicQuoteViewProps {
  quote: Quote
  isExpired?: boolean
}

/**
 * 공개 견적서 뷰 컴포넌트
 * 회사 공식 견적서 양식 레이아웃
 */
export function PublicQuoteView({ quote }: PublicQuoteViewProps) {
  const total = quote.totalAmount
  const koreanAmount = numberToKoreanCurrency(total)

  return (
    <div className="mx-auto max-w-4xl bg-white text-black print:shadow-none">
      <div className="p-8">
        {/* 견적서 제목 */}
        <h1 className="mb-6 text-center text-3xl font-bold tracking-[0.5em]">
          견 적 서
        </h1>

        {/* 상단: 좌측 견적정보 + 우측 공급자 정보 */}
        <div className="mb-4 grid grid-cols-2 gap-6">
          {/* 좌측: 로고 + 견적 기본정보 */}
          <div className="space-y-2">
            <div className="mb-3">
              <Image
                src="/logo.png"
                alt="케이프로텍"
                width={200}
                height={44}
                className="h-11 w-auto"
                priority
              />
            </div>
            <InfoRow label="NO." value={quote.quoteNumber} />
            <InfoRow label="견적일자" value={quote.issueDate} />
            {quote.projectName && (
              <InfoRow label="Project명" value={quote.projectName} />
            )}
            <InfoRow
              label="수 신"
              value={quote.recipient || quote.customer?.name || '-'}
            />
            <div className="mt-3 space-y-1">
              <p className="text-sm">
                <span className="font-medium">견적 금액: </span>
                <span>(일금 {koreanAmount}원)</span>
              </p>
              <p className="text-lg font-bold">
                {'     '}
                {CURRENCY.SYMBOL}
                {total.toLocaleString()}{' '}
                <span className="text-sm font-normal">&lt;부가세별도&gt;</span>
              </p>
            </div>
          </div>

          {/* 우측: 공급자 정보 테이블 */}
          <div className="relative border border-black">
            {/* 도장 이미지 */}
            <Image
              src="/stamp.png"
              alt="직인"
              width={90}
              height={90}
              className="absolute -top-2 right-2 z-10 h-[90px] w-[90px] opacity-90"
            />
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td
                    rowSpan={5}
                    className="w-6 border border-black p-1 text-center text-xs font-bold"
                    style={{
                      writingMode: 'vertical-rl',
                      letterSpacing: '0.3em',
                    }}
                  >
                    공급자
                  </td>
                  <td className="w-24 border border-black p-1 text-center text-xs font-medium">
                    사업자번호
                  </td>
                  <td className="border border-black p-1 text-xs">
                    {COMPANY_INFO.businessNumber}
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black p-1 text-center text-xs font-medium">
                    상호
                  </td>
                  <td className="border border-black p-1 text-xs">
                    {COMPANY_INFO.name} 대표: {COMPANY_INFO.representative}
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black p-1 text-center text-xs font-medium">
                    소재지
                  </td>
                  <td className="border border-black p-1 text-xs">
                    {COMPANY_INFO.address}
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black p-1 text-center text-xs font-medium">
                    업태/종목
                  </td>
                  <td className="border border-black p-1 text-xs">
                    {COMPANY_INFO.businessType} /{' '}
                    {COMPANY_INFO.businessCategory}
                  </td>
                </tr>
                <tr>
                  <td className="w-24 border border-black p-1 text-center text-xs font-medium">
                    TEL / FAX
                  </td>
                  <td className="border border-black p-1 text-xs">
                    {COMPANY_INFO.tel} / {COMPANY_INFO.fax}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 견적 담당자 바 */}
        {quote.contactPerson && (
          <div className="mb-4 border border-black bg-gray-50 px-4 py-2 text-sm">
            <span className="font-medium">견적담당자: </span>
            {quote.contactPerson}
          </div>
        )}

        {/* 견적 항목 테이블 (7컬럼) */}
        <div className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-[7%] border border-black px-2 py-2 text-center">
                  Part No
                </th>
                <th className="w-[28%] border border-black px-2 py-2 text-center">
                  Description
                </th>
                <th className="w-[8%] border border-black px-2 py-2 text-center">
                  Unit
                </th>
                <th className="w-[8%] border border-black px-2 py-2 text-center">
                  Q&apos;ty
                </th>
                <th className="w-[17%] border border-black px-2 py-2 text-center">
                  Unit Price
                </th>
                <th className="w-[17%] border border-black px-2 py-2 text-center">
                  Total Price
                </th>
                <th className="w-[15%] border border-black px-2 py-2 text-center">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.items?.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-black px-2 py-1.5 text-center">
                    {index + 1}.
                  </td>
                  <td className="border border-black px-2 py-1.5">
                    {item.name}
                    {item.description && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({item.description})
                      </span>
                    )}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center">
                    {item.unit || '-'}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-right">
                    {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-right">
                    {item.amount.toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-1.5 text-center">
                    {item.remarks || ''}
                  </td>
                </tr>
              ))}
              {/* Total 행 */}
              <tr className="bg-gray-50 font-bold">
                <td className="border border-black px-2 py-2 text-center" />
                <td className="border border-black px-2 py-2 text-center">
                  Total
                </td>
                <td className="border border-black px-2 py-2" />
                <td className="border border-black px-2 py-2" />
                <td className="border border-black px-2 py-2" />
                <td className="border border-black px-2 py-2 text-right">
                  {CURRENCY.SYMBOL}
                  {total.toLocaleString()}
                </td>
                <td className="border border-black px-2 py-2 text-center text-xs font-normal">
                  부가세별도
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 견적 조건 */}
        {quote.notes && (
          <div className="border border-black p-4 text-sm">
            <p className="mb-2 font-bold">* 견적 조건</p>
            <div className="space-y-1">
              {quote.notes.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** 견적 기본정보 행 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="inline-block w-20 font-medium">{label}</span>
      <span>: {value}</span>
    </p>
  )
}
