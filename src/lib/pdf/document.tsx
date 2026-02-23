/**
 * 견적서 PDF 문서 컴포넌트
 * 회사 공식 견적서 양식 기반 레이아웃 (다국어 + 다중 법인 지원)
 */

import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
import type { Dictionary } from '@/lib/i18n/types'
import { getCompanyConfig, type CompanyId } from '@/lib/company'
import {
  numberToKoreanCurrency,
  formatKoreanPhoneToInternational,
} from '@/lib/utils'
import { createStyles } from './styles'
import { AppendixTablePDF } from './appendix-table'

// 폰트 등록 (사이드이펙트)
import './fonts'
import { getFontFamily } from './fonts'

/** 통화 기호 */
const WON = '\u20A9'

/** 금액 포맷 (천 단위 콤마) */
function fmt(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

/** 포맷된 날짜를 ISO 형식(YYYY-MM-DD)으로 변환 */
function toISODate(formattedDate: string): string {
  // 한국어: "2026년 02월 20일"
  const koreanMatch = formattedDate.match(
    /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/
  )
  if (koreanMatch) {
    return `${koreanMatch[1]}-${koreanMatch[2].padStart(2, '0')}-${koreanMatch[3].padStart(2, '0')}`
  }
  // 기타 언어: Date 파싱
  const date = new Date(formattedDate)
  if (!isNaN(date.getTime())) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return formattedDate
}

interface QuoteDocumentProps {
  quote: Quote
  dictionary: Dictionary
  companyId?: CompanyId
}

/**
 * 견적서 PDF 문서 (다국어 + 다중 법인 지원)
 */
export function QuoteDocument({
  quote,
  dictionary: dict,
  companyId,
}: QuoteDocumentProps) {
  const total = quote.totalAmount
  const showKoreanAmount = dict.koreanAmount.prefix !== null
  const fontFamily = getFontFamily(quote.language ?? 'ko')
  const styles = createStyles(fontFamily)
  const company = getCompanyConfig(companyId ?? quote.company)

  return (
    <Document
      title={`${dict.quote.title} - ${quote.quoteNumber}`}
      author={company.displayNameEn}
      subject={`${dict.quote.title} ${quote.quoteNumber}`}
    >
      <Page size="A4" style={styles.page}>
        {/* 견적서 제목 */}
        <Text style={styles.title}>{dict.quote.title}</Text>

        {/* 상단: 좌측 견적정보 + 우측 공급자 */}
        <View style={styles.topSection}>
          {/* 좌측 */}
          <View style={styles.topLeft}>
            <Text style={styles.logoText}>{company.displayNameEn}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{dict.quote.no}</Text>
              <Text style={styles.infoValue}>: {quote.quoteNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{dict.quote.issueDate}</Text>
              <Text style={styles.infoValue}>: {quote.issueDate}</Text>
            </View>
            {quote.projectName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{dict.quote.projectName}</Text>
                <Text style={styles.infoValue}>: {quote.projectName}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{dict.quote.recipient}</Text>
              <Text style={styles.infoValue}>
                : {quote.recipient || quote.customer?.name || '-'}
              </Text>
            </View>

            {/* 견적 금액 */}
            <View style={styles.amountSection}>
              {showKoreanAmount ? (
                <Text style={styles.amountKorean}>
                  {dict.quote.quoteAmount}: ({dict.koreanAmount.prefix}
                  {numberToKoreanCurrency(total)}
                  {dict.koreanAmount.suffix})
                </Text>
              ) : (
                <Text style={styles.amountKorean}>
                  {dict.quote.quoteAmount}:
                </Text>
              )}
              <Text style={styles.amountNumber}>
                {'     '}
                {WON}
                {fmt(total)}{' '}
                <Text style={styles.amountVat}>
                  &lt;{dict.quote.vatExcluded}&gt;
                </Text>
              </Text>
            </View>
          </View>

          {/* 우측: 공급자 정보 */}
          <View style={styles.topRight}>
            {/* 도장 이미지 (있는 회사만 표시) */}
            {company.stamp && (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image
              <Image
                src={company.stamp}
                style={
                  company.stampPosition
                    ? {
                        ...styles.stampImage,
                        top: company.stampPosition.top,
                        right: company.stampPosition.right,
                        ...(company.stampPosition.width != null && {
                          width: company.stampPosition.width,
                        }),
                        ...(company.stampPosition.height != null && {
                          height: company.stampPosition.height,
                        }),
                      }
                    : styles.stampImage
                }
              />
            )}
            <View style={styles.supplierTable}>
              <View style={styles.supplierInner}>
                {/* 좌측: 공급자 세로 라벨 */}
                <View style={styles.supplierSideLabelMerged}>
                  {dict.supplier.label.split('').map((char, i) => (
                    <Text key={i}>{char}</Text>
                  ))}
                </View>
                {/* 우측: 정보 행들 */}
                <View style={styles.supplierContent}>
                  {/* 사업자번호 (전체 너비) */}
                  <SupplierInfoRow
                    header={dict.supplier.businessNumber}
                    value={company.businessNumber}
                    styles={styles}
                  />
                  {/* 상호 | 값 | 성명 | 값 (분할) */}
                  <SupplierSplitRow
                    header1={dict.supplier.companyName}
                    value1={dict.supplier.values.companyName}
                    header2={dict.supplier.representativeLabel}
                    value2={dict.supplier.values.representative}
                    styles={styles}
                  />
                  {/* 사업장소재지 (전체 너비) */}
                  <SupplierInfoRow
                    header={dict.supplier.address}
                    value={dict.supplier.values.address}
                    styles={styles}
                  />
                  {/* 업태 | 값 | 종목 | 값 (분할) */}
                  <SupplierSplitRow
                    header1={dict.supplier.businessTypeLabel}
                    value1={dict.supplier.values.businessType}
                    header2={dict.supplier.businessCategoryLabel}
                    value2={dict.supplier.values.businessCategory}
                    styles={styles}
                  />
                  {/* TEL | 값 | FAX | 값 (분할) */}
                  <SupplierSplitRow
                    header1={dict.supplier.telLabel}
                    value1={dict.supplier.values.tel}
                    header2={dict.supplier.faxLabel}
                    value2={dict.supplier.values.fax || '-'}
                    styles={styles}
                    isLast
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 견적담당자 바 */}
        {quote.contactPerson && (
          <View style={styles.contactBar}>
            <Text>
              {dict.quote.contactPerson}:{' '}
              {quote.language === 'ko'
                ? quote.contactPerson
                : formatKoreanPhoneToInternational(quote.contactPerson!)}
            </Text>
          </View>
        )}

        {/* 항목 테이블 (7컬럼) */}
        <View style={styles.table}>
          {/* 헤더 */}
          <View style={styles.tableHeader}>
            <View style={[styles.colPartNo, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>{dict.table.partNo}</Text>
            </View>
            <View style={[styles.colDesc, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>
                {dict.table.description}
              </Text>
            </View>
            <View style={[styles.colUnit, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>{dict.table.unit}</Text>
            </View>
            <View style={[styles.colQty, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>{dict.table.qty}</Text>
            </View>
            <View style={[styles.colUnitPrice, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>{dict.table.unitPrice}</Text>
            </View>
            <View style={[styles.colTotalPrice, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>
                {dict.table.totalPrice}
              </Text>
            </View>
            <View style={styles.colRemarks}>
              <Text style={styles.tableHeaderText}>{dict.table.remarks}</Text>
            </View>
          </View>

          {/* 항목 행 */}
          {quote.items?.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={[styles.colPartNo, styles.colBorder]}>
                <Text style={styles.cellTextCenter}>{index + 1}.</Text>
              </View>
              <View style={[styles.colDesc, styles.colBorder]}>
                <Text style={styles.cellText}>
                  {item.name}
                  {item.description ? ` (${item.description})` : ''}
                </Text>
              </View>
              <View style={[styles.colUnit, styles.colBorder]}>
                <Text style={styles.cellTextCenter}>{item.unit || '-'}</Text>
              </View>
              <View style={[styles.colQty, styles.colBorder]}>
                <Text style={styles.cellTextCenter}>{item.quantity}</Text>
              </View>
              <View style={[styles.colUnitPrice, styles.colBorder]}>
                <Text style={styles.cellTextRight}>{fmt(item.unitPrice)}</Text>
              </View>
              <View style={[styles.colTotalPrice, styles.colBorder]}>
                <Text style={styles.cellTextRight}>{fmt(item.amount)}</Text>
              </View>
              <View style={styles.colRemarks}>
                <Text style={styles.cellTextCenter}>{item.remarks || ''}</Text>
              </View>
            </View>
          ))}

          {/* Total 행 */}
          <View style={styles.tableTotalRow}>
            <View style={[styles.colPartNo, styles.colBorder]}>
              <Text style={styles.cellText} />
            </View>
            <View style={[styles.colDesc, styles.colBorder]}>
              <Text style={styles.cellTextBold}>
                {'          '}
                {dict.quote.total}
              </Text>
            </View>
            <View style={[styles.colUnit, styles.colBorder]}>
              <Text style={styles.cellText} />
            </View>
            <View style={[styles.colQty, styles.colBorder]}>
              <Text style={styles.cellText} />
            </View>
            <View style={[styles.colUnitPrice, styles.colBorder]}>
              <Text style={styles.cellText} />
            </View>
            <View style={[styles.colTotalPrice, styles.colBorder]}>
              <Text style={styles.cellTextRight}>
                {WON}
                {fmt(total)}
              </Text>
            </View>
            <View style={styles.colRemarks}>
              <Text style={styles.cellTextCenter}>
                &lt;{dict.quote.vatExcluded}&gt;
              </Text>
            </View>
          </View>
        </View>

        {/* 견적 조건 */}
        {quote.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>
              {dict.quote.termsAndConditions}
            </Text>
            {quote.notes.split('\n').map((line, i) => (
              <Text key={i} style={styles.notesText}>
                {line}
              </Text>
            ))}
          </View>
        )}

        {/* 푸터 — 일반 플로우 (absolute 제거) */}
        <View
          style={{
            marginTop: 'auto',
            borderTopWidth: 1,
            borderTopColor: '#cccccc',
            paddingTop: 6,
          }}
        >
          <Text style={{ fontSize: 7, color: '#555555', textAlign: 'center' }}>
            {company.displayNameEn}
          </Text>
        </View>
      </Page>

      {/* 부속 내역서 — 별도 Page (항상 가로 방향) */}
      {/* 부속 내역서 — translateQuoteContent()에서 이미 번역됨 */}
      {quote.appendixTables
        ?.filter(t => t.columns.length > 0 && t.rows.length > 0)
        .map((table, i) => (
          <Page
            key={`appendix-${i}`}
            size="A4"
            orientation="landscape"
            style={{
              paddingTop: 30,
              paddingRight: 30,
              paddingBottom: 20,
              paddingLeft: 30,
              fontSize: 9,
              fontFamily,
              color: '#1a1a1a',
              backgroundColor: '#ffffff',
            }}
          >
            <AppendixTablePDF
              table={table}
              fontFamily={fontFamily}
              orientation="landscape"
              footerLeft={toISODate(quote.issueDate)}
              footerRight={company.displayNameEn}
            />
          </Page>
        ))}
    </Document>
  )
}

/** 공급자 정보 행 (전체 너비) */
function SupplierInfoRow({
  header,
  value,
  styles,
  isLast,
}: {
  header: string
  value: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any
  isLast?: boolean
}) {
  return (
    <View style={isLast ? styles.supplierRowLast : styles.supplierRow}>
      <View style={styles.supplierHeader}>
        <Text>{header}</Text>
      </View>
      <View style={styles.supplierValue}>
        <Text>{value}</Text>
      </View>
    </View>
  )
}

/** 공급자 정보 분할 행 (4칸: 헤더1 | 값1 | 헤더2 | 값2) */
function SupplierSplitRow({
  header1,
  value1,
  header2,
  value2,
  styles,
  isLast,
}: {
  header1: string
  value1: string
  header2: string
  value2: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any
  isLast?: boolean
}) {
  return (
    <View style={isLast ? styles.supplierRowLast : styles.supplierRow}>
      <View style={styles.supplierHeader}>
        <Text>{header1}</Text>
      </View>
      <View style={styles.supplierValue}>
        <Text>{value1}</Text>
      </View>
      <View style={styles.supplierHeader2}>
        <Text>{header2}</Text>
      </View>
      <View style={styles.supplierValue}>
        <Text>{value2}</Text>
      </View>
    </View>
  )
}
