/**
 * 견적서 PDF 문서 컴포넌트
 * 회사 공식 견적서 양식 기반 레이아웃
 */

import { Document, Page, View, Text, Font, Image } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
import { COMPANY_INFO } from '@/lib/constants'
import { numberToKoreanCurrency } from '@/lib/utils'
import { styles } from './styles'

/**
 * 한글 폰트 등록 (Nanum Gothic - TTF)
 * @react-pdf/renderer는 TTF 포맷만 지원 (OTF/WOFF 미지원)
 */
Font.register({
  family: 'NanumGothic',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Bold.ttf',
      fontWeight: 700,
    },
  ],
})

/** 하이픈 콜백 비활성화 (한글은 하이픈 불필요) */
Font.registerHyphenationCallback(word => [word])

/** 통화 기호 */
const WON = '\u20A9'

/** 금액 포맷 (천 단위 콤마) */
function fmt(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

interface QuoteDocumentProps {
  quote: Quote
}

/**
 * 견적서 PDF 문서
 * 회사 공식 견적서 양식과 동일한 구조
 */
export function QuoteDocument({ quote }: QuoteDocumentProps) {
  const total = quote.totalAmount
  const koreanAmount = numberToKoreanCurrency(total)

  return (
    <Document
      title={`견적서 - ${quote.quoteNumber}`}
      author="KPROTEK Co.,Ltd."
      subject={`견적서 ${quote.quoteNumber}`}
    >
      <Page size="A4" style={styles.page}>
        {/* 견적서 제목 */}
        <Text style={styles.title}>견 적 서</Text>

        {/* 상단: 좌측 견적정보 + 우측 공급자 */}
        <View style={styles.topSection}>
          {/* 좌측 */}
          <View style={styles.topLeft}>
            <Text style={styles.logoText}>KPROTEK</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NO.</Text>
              <Text style={styles.infoValue}>: {quote.quoteNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>견적일자</Text>
              <Text style={styles.infoValue}>: {quote.issueDate}</Text>
            </View>
            {quote.projectName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Project명</Text>
                <Text style={styles.infoValue}>: {quote.projectName}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>수 신</Text>
              <Text style={styles.infoValue}>
                : {quote.recipient || quote.customer?.name || '-'}
              </Text>
            </View>

            {/* 견적 금액 */}
            <View style={styles.amountSection}>
              <Text style={styles.amountKorean}>
                견적 금액: (일금 {koreanAmount}원)
              </Text>
              <Text style={styles.amountNumber}>
                {'     '}
                {WON}
                {fmt(total)}{' '}
                <Text style={styles.amountVat}>&lt;부가세별도&gt;</Text>
              </Text>
            </View>
          </View>

          {/* 우측: 공급자 정보 */}
          <View style={styles.topRight}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image */}
            <Image src="/stamp.png" style={styles.stampImage} />
            <View style={styles.supplierTable}>
              <View style={styles.supplierInner}>
                {/* 좌측: 공급자 세로 라벨 (하나로 합침) */}
                <View style={styles.supplierSideLabelMerged}>
                  <Text>공</Text>
                  <Text>급</Text>
                  <Text>자</Text>
                </View>
                {/* 우측: 정보 행들 */}
                <View style={styles.supplierContent}>
                  <SupplierInfoRow
                    header="사업자번호"
                    value={COMPANY_INFO.businessNumber}
                  />
                  <SupplierInfoRow
                    header="상호"
                    value={`${COMPANY_INFO.name}  대표: ${COMPANY_INFO.representative}`}
                  />
                  <SupplierInfoRow
                    header="소재지"
                    value={COMPANY_INFO.address}
                  />
                  <SupplierInfoRow
                    header="업태 / 종목"
                    value={`${COMPANY_INFO.businessType} / ${COMPANY_INFO.businessCategory}`}
                  />
                  <SupplierInfoRow
                    header="TEL / FAX"
                    value={`${COMPANY_INFO.tel} / ${COMPANY_INFO.fax}`}
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
            <Text>견적담당자: {quote.contactPerson}</Text>
          </View>
        )}

        {/* 항목 테이블 (7컬럼) */}
        <View style={styles.table}>
          {/* 헤더 */}
          <View style={styles.tableHeader}>
            <View style={[styles.colPartNo, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Part No</Text>
            </View>
            <View style={[styles.colDesc, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Description</Text>
            </View>
            <View style={[styles.colUnit, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Unit</Text>
            </View>
            <View style={[styles.colQty, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Q&apos;ty</Text>
            </View>
            <View style={[styles.colUnitPrice, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Unit Price</Text>
            </View>
            <View style={[styles.colTotalPrice, styles.colBorder]}>
              <Text style={styles.tableHeaderText}>Total Price</Text>
            </View>
            <View style={styles.colRemarks}>
              <Text style={styles.tableHeaderText}>Remarks</Text>
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
              <Text style={styles.cellTextBold}>{'          Total'}</Text>
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
              <Text style={styles.cellTextCenter}>&lt;부가세별도&gt;</Text>
            </View>
          </View>
        </View>

        {/* 견적 조건 */}
        {quote.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>* 견적 조건</Text>
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

/** 공급자 정보 행 (사이드 라벨 없이 헤더+값만) */
function SupplierInfoRow({
  header,
  value,
  isLast,
}: {
  header: string
  value: string
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
