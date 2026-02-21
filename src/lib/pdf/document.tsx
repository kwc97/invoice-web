/**
 * 견적서 PDF 문서 컴포넌트
 * 회사 공식 견적서 양식 기반 레이아웃 (다국어 지원)
 */

import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
import type { Dictionary } from '@/lib/i18n/types'
import { COMPANY_INFO } from '@/lib/constants'
import { numberToKoreanCurrency } from '@/lib/utils'
import { createStyles } from './styles'

// 폰트 등록 (사이드이펙트)
import './fonts'
import { getFontFamily } from './fonts'

/** 통화 기호 */
const WON = '\u20A9'

/** 금액 포맷 (천 단위 콤마) */
function fmt(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

interface QuoteDocumentProps {
  quote: Quote
  dictionary: Dictionary
}

/**
 * 견적서 PDF 문서 (다국어 지원)
 */
export function QuoteDocument({ quote, dictionary: dict }: QuoteDocumentProps) {
  const total = quote.totalAmount
  const showKoreanAmount = dict.koreanAmount.prefix !== null
  const fontFamily = getFontFamily(quote.language ?? 'ko')
  const styles = createStyles(fontFamily)

  return (
    <Document
      title={`${dict.quote.title} - ${quote.quoteNumber}`}
      author="KPROTEK Co.,Ltd."
      subject={`${dict.quote.title} ${quote.quoteNumber}`}
    >
      <Page size="A4" style={styles.page}>
        {/* 견적서 제목 */}
        <Text style={styles.title}>{dict.quote.title}</Text>

        {/* 상단: 좌측 견적정보 + 우측 공급자 */}
        <View style={styles.topSection}>
          {/* 좌측 */}
          <View style={styles.topLeft}>
            <Text style={styles.logoText}>KPROTEK</Text>

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
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image */}
            <Image src="/stamp.png" style={styles.stampImage} />
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
                  <SupplierInfoRow
                    header={dict.supplier.businessNumber}
                    value={COMPANY_INFO.businessNumber}
                    styles={styles}
                  />
                  <SupplierInfoRow
                    header={dict.supplier.companyName}
                    value={`${dict.supplier.values.companyName}  ${dict.supplier.representativeLabel}: ${dict.supplier.values.representative}`}
                    styles={styles}
                  />
                  <SupplierInfoRow
                    header={dict.supplier.address}
                    value={dict.supplier.values.address}
                    styles={styles}
                  />
                  <SupplierInfoRow
                    header={dict.supplier.businessType}
                    value={`${dict.supplier.values.businessType} / ${dict.supplier.values.businessCategory}`}
                    styles={styles}
                  />
                  <SupplierInfoRow
                    header={dict.supplier.telFax}
                    value={`${COMPANY_INFO.tel} / ${COMPANY_INFO.fax}`}
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
              {dict.quote.contactPerson}: {quote.contactPerson}
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

        {/* 푸터 */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `KPROTEK Co.,Ltd. | ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

/** 공급자 정보 행 */
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
