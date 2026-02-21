/**
 * PDF 문서 스타일 정의
 * 회사 공식 견적서 양식 기반 레이아웃
 */

import { StyleSheet } from '@react-pdf/renderer'

/** 색상 */
const COLORS = {
  black: '#000000',
  text: '#1a1a1a',
  textMuted: '#555555',
  border: '#000000',
  headerBg: '#f0f0f0',
  totalBg: '#f5f5f5',
  white: '#ffffff',
}

/** 폰트 패밀리별 스타일 캐시 */
const stylesCache = new Map<string, ReturnType<typeof StyleSheet.create>>()

/** 폰트 패밀리에 맞는 스타일 생성 (캐싱 적용) */
export function createStyles(fontFamily: string) {
  const cached = stylesCache.get(fontFamily)
  if (cached) return cached

  const created = StyleSheet.create({
    /** 페이지 */
    page: {
      padding: 30,
      fontSize: 9,
      fontFamily,
      color: COLORS.text,
      backgroundColor: COLORS.white,
    },

    /** 견적서 제목 */
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 8,
      marginBottom: 15,
    },

    /** 상단 2컬럼 레이아웃 */
    topSection: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    topLeft: {
      width: '50%',
      paddingRight: 10,
    },
    topRight: {
      width: '50%',
      position: 'relative',
    },

    /** 도장 이미지 */
    stampImage: {
      position: 'absolute',
      top: -5,
      right: 5,
      width: 65,
      height: 65,
      zIndex: 10,
      opacity: 0.9,
    },

    /** 로고 텍스트 */
    logoText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: 8,
    },

    /** 견적 기본정보 행 */
    infoRow: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    infoLabel: {
      width: 65,
      fontSize: 9,
      fontWeight: 'bold',
    },
    infoValue: {
      flex: 1,
      fontSize: 9,
    },

    /** 견적 금액 영역 */
    amountSection: {
      marginTop: 6,
    },
    amountKorean: {
      fontSize: 9,
      marginBottom: 2,
    },
    amountNumber: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    amountVat: {
      fontSize: 8,
      fontWeight: 'normal',
    },

    /** 공급자 정보 테이블 */
    supplierTable: {
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    supplierInner: {
      flexDirection: 'row',
    },
    supplierSideLabelMerged: {
      width: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
      fontSize: 8,
      fontWeight: 'bold',
      gap: 2,
    },
    supplierContent: {
      flex: 1,
    },
    supplierRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    supplierRowLast: {
      flexDirection: 'row',
    },
    supplierHeader: {
      width: 65,
      justifyContent: 'center',
      paddingHorizontal: 4,
      paddingVertical: 3,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
      fontSize: 8,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    supplierValue: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 4,
      paddingVertical: 3,
      fontSize: 8,
    },

    /** 견적담당자 바 */
    contactBar: {
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.headerBg,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 8,
      fontSize: 9,
    },

    /** 항목 테이블 */
    table: {
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: COLORS.headerBg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    tableHeaderText: {
      fontSize: 8,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 5,
      paddingHorizontal: 2,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    tableRowLast: {
      flexDirection: 'row',
    },
    tableTotalRow: {
      flexDirection: 'row',
      backgroundColor: COLORS.totalBg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },

    /** 7컬럼 너비 */
    colPartNo: { width: '7%', textAlign: 'center' },
    colDesc: { width: '28%' },
    colUnit: { width: '8%', textAlign: 'center' },
    colQty: { width: '8%', textAlign: 'center' },
    colUnitPrice: { width: '17%', textAlign: 'right' },
    colTotalPrice: { width: '17%', textAlign: 'right' },
    colRemarks: { width: '15%', textAlign: 'center' },

    cellText: {
      fontSize: 8,
      paddingVertical: 4,
      paddingHorizontal: 3,
    },
    cellTextBold: {
      fontSize: 8,
      fontWeight: 'bold',
      paddingVertical: 4,
      paddingHorizontal: 3,
    },
    cellTextCenter: {
      fontSize: 8,
      paddingVertical: 4,
      paddingHorizontal: 3,
      textAlign: 'center',
    },
    cellTextRight: {
      fontSize: 8,
      paddingVertical: 4,
      paddingHorizontal: 3,
      textAlign: 'right',
    },

    /** 컬럼 구분선 */
    colBorder: {
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },

    /** 견적 조건 */
    notesContainer: {
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 10,
    },
    notesTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    notesText: {
      fontSize: 8,
      color: COLORS.textMuted,
      lineHeight: 1.6,
    },

    /** 푸터 */
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: 7,
      color: COLORS.textMuted,
      borderTopWidth: 1,
      borderTopColor: '#cccccc',
      paddingTop: 8,
    },
  })

  stylesCache.set(fontFamily, created)
  return created
}

/** 기본 스타일 (하위 호환용) */
export const styles = createStyles('NanumGothic')
