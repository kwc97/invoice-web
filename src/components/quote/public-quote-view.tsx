import Image from 'next/image'
import type { Quote } from '@/types/quote'
import type { Dictionary } from '@/lib/i18n/types'
import { CURRENCY } from '@/lib/constants'
import { getCompanyConfig, type CompanyId } from '@/lib/company'
import {
  numberToKoreanCurrency,
  formatKoreanPhoneToInternational,
} from '@/lib/utils'
import { AppendixTableView } from '@/components/quote/appendix-table-view'
import { ensureTotalFlags } from '@/lib/appendix/utils'

interface PublicQuoteViewProps {
  quote: Quote
  dictionary: Dictionary
  companyId?: CompanyId
}

/**
 * 공개 견적서 뷰 컴포넌트
 * 회사 공식 견적서 양식 레이아웃 (다국어 + 다중 법인 지원)
 */
export function PublicQuoteView({
  quote,
  dictionary: dict,
  companyId,
}: PublicQuoteViewProps) {
  const total = quote.totalAmount
  const showKoreanAmount = dict.koreanAmount.prefix !== null
  const company = getCompanyConfig(companyId ?? quote.company)
  // 합계 행 자동 감지 (캐시된 데이터에 isTotal 없는 경우 대비)
  // translateQuoteContent()에서 Google Translate로 이미 번역됨
  const appendixTables = quote.appendixTables
    ? ensureTotalFlags(quote.appendixTables)
    : undefined

  return (
    <div className="bg-white text-black">
      {/* 메인 견적서 (세로 방향, max-w-4xl) */}
      <div className="mx-auto max-w-4xl print:max-w-none">
        <div className="p-8 print:p-6">
          {/* 견적서 제목 */}
          <h1 className="mb-6 text-center text-3xl font-bold tracking-[0.5em]">
            {dict.quote.title}
          </h1>

          {/* 상단: 좌측 견적정보 + 우측 공급자 정보 */}
          <div className="mb-4 grid grid-cols-2 gap-6">
            {/* 좌측: 로고 + 견적 기본정보 */}
            <div className="space-y-2">
              <div className="mb-3">
                <Image
                  src={company.logo}
                  alt={company.displayName}
                  width={200}
                  height={44}
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
              <InfoRow label={dict.quote.no} value={quote.quoteNumber} />
              <InfoRow label={dict.quote.issueDate} value={quote.issueDate} />
              {quote.projectName && (
                <InfoRow
                  label={dict.quote.projectName}
                  value={quote.projectName}
                />
              )}
              <InfoRow
                label={dict.quote.recipient}
                value={quote.recipient || quote.customer?.name || '-'}
              />
              <div className="mt-3 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {dict.quote.quoteAmount}:{' '}
                  </span>
                  {showKoreanAmount && (
                    <span>
                      ({dict.koreanAmount.prefix}
                      {numberToKoreanCurrency(total)}
                      {dict.koreanAmount.suffix})
                    </span>
                  )}
                </p>
                <p className="text-lg font-bold">
                  {'     '}
                  {CURRENCY.SYMBOL}
                  {total.toLocaleString()}{' '}
                  <span className="text-sm font-normal">
                    &lt;{dict.quote.vatExcluded}&gt;
                  </span>
                </p>
              </div>
            </div>

            {/* 우측: 공급자 정보 테이블 */}
            <div className="relative">
              {/* 도장 이미지 (있는 회사만 표시) */}
              {company.stamp && (
                <Image
                  src={company.stamp}
                  alt="직인"
                  width={90}
                  height={90}
                  className="absolute -top-8 right-0 z-10 h-[80px] w-[80px] opacity-80"
                />
              )}
              <table className="w-full border-collapse border border-black text-sm">
                <tbody>
                  <tr>
                    <td
                      rowSpan={5}
                      className="w-6 border border-black p-1 text-center text-xs font-bold"
                      style={{
                        writingMode: 'vertical-rl',
                        letterSpacing: '0.15em',
                      }}
                    >
                      {dict.supplier.label}
                    </td>
                    <td className="w-[70px] border border-black p-1 text-center text-xs font-medium whitespace-pre-line">
                      {dict.supplier.businessNumber}
                    </td>
                    <td colSpan={3} className="border border-black p-1 text-xs">
                      {company.businessNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[70px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.companyName}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.companyName}
                    </td>
                    <td className="w-[50px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.representativeLabel}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.representative}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[70px] border border-black p-1 text-center text-xs font-medium whitespace-pre-line">
                      {dict.supplier.address}
                    </td>
                    <td colSpan={3} className="border border-black p-1 text-xs">
                      {dict.supplier.values.address}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[70px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.businessTypeLabel}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.businessType}
                    </td>
                    <td className="w-[50px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.businessCategoryLabel}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.businessCategory}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-[70px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.telLabel}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.tel}
                    </td>
                    <td className="w-[50px] border border-black p-1 text-center text-xs font-medium">
                      {dict.supplier.faxLabel}
                    </td>
                    <td className="border border-black p-1 text-xs">
                      {dict.supplier.values.fax || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 견적 담당자 바 */}
          {quote.contactPerson && (
            <div className="mb-4 border border-black bg-gray-50 px-4 py-2 text-sm">
              <span className="font-medium">{dict.quote.contactPerson}: </span>
              {quote.language === 'ko'
                ? quote.contactPerson
                : formatKoreanPhoneToInternational(quote.contactPerson!)}
            </div>
          )}

          {/* 견적 항목 테이블 (7컬럼) */}
          <div className="mb-4 overflow-x-auto">
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-[7%] border border-black px-2 py-2 text-center">
                    {dict.table.partNo}
                  </th>
                  <th className="w-[28%] border border-black px-2 py-2 text-center">
                    {dict.table.description}
                  </th>
                  <th className="w-[8%] border border-black px-2 py-2 text-center">
                    {dict.table.unit}
                  </th>
                  <th className="w-[8%] border border-black px-2 py-2 text-center">
                    {dict.table.qty}
                  </th>
                  <th className="w-[17%] border border-black px-2 py-2 text-center">
                    {dict.table.unitPrice}
                  </th>
                  <th className="w-[17%] border border-black px-2 py-2 text-center">
                    {dict.table.totalPrice}
                  </th>
                  <th className="w-[15%] border border-black px-2 py-2 text-center">
                    {dict.table.remarks}
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
                    {dict.quote.total}
                  </td>
                  <td className="border border-black px-2 py-2" />
                  <td className="border border-black px-2 py-2" />
                  <td className="border border-black px-2 py-2" />
                  <td className="border border-black px-2 py-2 text-right">
                    {CURRENCY.SYMBOL}
                    {total.toLocaleString()}
                  </td>
                  <td className="border border-black px-2 py-2 text-center text-xs font-normal">
                    {dict.quote.vatExcluded}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 견적 조건 */}
          {quote.notes && (
            <div className="border border-black p-4 text-sm">
              <p className="mb-2 font-bold">{dict.quote.termsAndConditions}</p>
              <div className="space-y-1">
                {quote.notes.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 부속 내역서 — 가로 모드 (전체 폭 사용, 인쇄 시 가로 방향) */}
      {appendixTables?.map((table, i) => (
        <div
          key={i}
          className="print-landscape mx-auto max-w-7xl bg-white p-8 text-black print:max-w-none print:break-before-page print:p-6"
        >
          <AppendixTableView key={i} table={table} theme="print" />
        </div>
      ))}
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
