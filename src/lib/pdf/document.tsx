/**
 * 견적서 PDF 문서 컴포넌트
 * @react-pdf/renderer를 사용하여 견적서를 PDF로 렌더링
 */

import { Document, Page, View, Text, Font } from '@react-pdf/renderer'
import type { Quote } from '@/types/quote'
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
const CURRENCY_SYMBOL = '\u20A9'

/** 금액 포맷 (천 단위 콤마) */
function formatCurrency(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('ko-KR')}`
}

interface QuoteDocumentProps {
  quote: Quote
}

/**
 * 견적서 PDF 문서
 * 공개 견적서 뷰(public-quote-view.tsx)와 동일한 구조로 PDF 렌더링
 */
export function QuoteDocument({ quote }: QuoteDocumentProps) {
  const subtotal = quote.totalAmount
  const total = subtotal

  return (
    <Document
      title={`견적서 - ${quote.quoteNumber}`}
      author="견적서 관리 시스템"
      subject={`견적서 ${quote.quoteNumber}`}
    >
      <Page size="A4" style={styles.page}>
        {/* 헤더: 회사 로고 + 견적서 제목 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>Q</Text>
            </View>
            <Text style={styles.headerTitle}>견적서</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
          </View>
        </View>

        {/* 견적서 정보: 발행일, 유효기간 */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>발행일</Text>
            <Text style={styles.infoValue}>{quote.issueDate}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>유효기간</Text>
            <Text style={styles.infoValueRed}>{quote.validUntil}</Text>
          </View>
        </View>

        {/* 고객 정보 */}
        <Text style={styles.sectionTitle}>고객 정보</Text>
        <View style={styles.customerGrid}>
          <View style={styles.customerItem}>
            <Text style={styles.customerLabel}>고객명</Text>
            <Text style={styles.customerValue}>
              {quote.customer?.name ?? '-'}
            </Text>
          </View>
          <View style={styles.customerItem}>
            <Text style={styles.customerLabel}>회사명</Text>
            <Text style={styles.customerValue}>
              {quote.customer?.company ?? '-'}
            </Text>
          </View>
          <View style={styles.customerItem}>
            <Text style={styles.customerLabel}>이메일</Text>
            <Text style={styles.customerValue}>
              {quote.customer?.email ?? '-'}
            </Text>
          </View>
          <View style={styles.customerItem}>
            <Text style={styles.customerLabel}>전화번호</Text>
            <Text style={styles.customerValue}>
              {quote.customer?.phone ?? '-'}
            </Text>
          </View>
        </View>

        {/* 견적 내역 테이블 */}
        <Text style={styles.sectionTitle}>견적 내역</Text>
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colName]}>품목</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>수량</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>단가</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>금액</Text>
          </View>

          {/* 테이블 행 */}
          {quote.items?.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
            >
              <View style={styles.colName}>
                <Text style={styles.cellTextBold}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.cellDescription}>{item.description}</Text>
                )}
              </View>
              <Text style={[styles.cellText, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cellText, styles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[styles.cellTextBold, styles.colAmount]}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* 합계 */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>소계</Text>
              <Text style={styles.totalsValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.totalsDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>총액</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* 비고/안내사항 */}
        {quote.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>안내사항</Text>
            <Text style={styles.notesText}>{quote.notes}</Text>
          </View>
        )}

        {/* 푸터 */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `본 견적서는 유효기간 내에 유효합니다. | ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}
