/**
 * PDF 문서 스타일 정의
 * @react-pdf/renderer의 StyleSheet.create()로 A4 기준 스타일 설정
 */

import { StyleSheet } from '@react-pdf/renderer'

/** 브랜딩 색상 */
const COLORS = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',
  text: '#1a1a1a',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
  red: '#dc2626',
}

export const styles = StyleSheet.create({
  /** 페이지: A4 크기, 패딩 */
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'NanumGothic',
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },

  /** 헤더 영역: 회사 정보 + 견적서 번호 */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  quoteNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 4,
  },

  /** 견적서 정보: 발행일, 유효기간 */
  infoSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 11,
    color: COLORS.text,
  },
  infoValueRed: {
    fontSize: 11,
    color: COLORS.red,
    fontWeight: 'bold',
  },

  /** 고객 정보 섹션 */
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  customerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  customerItem: {
    width: '48%',
  },
  customerLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  customerValue: {
    fontSize: 10,
    color: COLORS.text,
  },

  /** 견적 항목 테이블 */
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeaderText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  /** 테이블 컬럼 너비 */
  colName: { width: '40%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '22%', textAlign: 'right' },
  colAmount: { width: '23%', textAlign: 'right' },
  cellText: {
    fontSize: 9,
    color: COLORS.text,
  },
  cellTextBold: {
    fontSize: 9,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  cellDescription: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  /** 합계 영역 */
  totalsContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalsBox: {
    width: 220,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalsLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  totalsValue: {
    fontSize: 10,
    color: COLORS.text,
  },
  totalsDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  /** 비고/안내사항 */
  notesContainer: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },

  /** 푸터 */
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: COLORS.textMuted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
})
