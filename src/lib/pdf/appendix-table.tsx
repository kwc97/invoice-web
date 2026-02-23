/**
 * 부속 내역서 PDF 렌더링 컴포넌트
 * @react-pdf/renderer의 View/Text로 동적 테이블 렌더링
 * 가로/세로 방향에 따른 스타일 자동 분기
 */

import { View, Text, StyleSheet } from '@react-pdf/renderer'
import type { AppendixTable } from '@/types/appendix'
import { computeHeaderLayout, formatCellValue } from '@/lib/appendix/utils'

/** 색상 */
const COLORS = {
  border: '#000000',
  headerBg: '#dbeafe',
  totalBg: '#dbeafe',
  text: '#1a1a1a',
}

interface AppendixTablePDFProps {
  table: AppendixTable
  fontFamily: string
  /** 페이지 방향 (기본: portrait) */
  orientation?: 'portrait' | 'landscape'
  /** 푸터 좌측 텍스트 (날짜 등) */
  footerLeft?: string
  /** 푸터 우측 텍스트 (회사명 등) */
  footerRight?: string
}

/**
 * 부속 내역서 PDF 컴포넌트
 * 컬럼 수와 orientation에 따라 폰트 크기 자동 조절
 */
export function AppendixTablePDF({
  table,
  fontFamily,
  orientation = 'portrait',
  footerLeft,
  footerRight,
}: AppendixTablePDFProps) {
  const { hasGroups, groups } = computeHeaderLayout(table.columns)
  const colCount = table.columns.length
  const isLandscape = orientation === 'landscape'

  // 방향 + 컬럼 수에 따른 폰트 크기 조절
  // 가로 모드에서는 공간이 넓으므로 더 큰 폰트 사용 가능
  let fontSize: number
  let headerFontSize: number
  let titleFontSize: number

  if (isLandscape) {
    fontSize = colCount >= 15 ? 6 : colCount >= 12 ? 6.5 : 7
    headerFontSize = fontSize + 0.5
    titleFontSize = 10
  } else {
    fontSize = colCount >= 10 ? 5.5 : colCount >= 7 ? 6 : 7
    headerFontSize = fontSize + 0.5
    titleFontSize = 9
  }

  // 각 컬럼 균등 너비 (퍼센트)
  const colWidth = `${(100 / colCount).toFixed(2)}%`

  const styles = StyleSheet.create({
    container: {
      fontFamily,
      flex: 1,
    },
    title: {
      fontSize: titleFontSize,
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: isLandscape ? 'center' : 'left',
    },
    table: {
      // 컨테이너 border 제거 — 행 레벨 border로 변경 (빈 continuation 페이지 방지)
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      borderLeftWidth: 1,
      borderLeftColor: COLORS.border,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    headerRowFirst: {
      flexDirection: 'row',
      backgroundColor: COLORS.headerBg,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      borderLeftWidth: 1,
      borderLeftColor: COLORS.border,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: COLORS.headerBg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      borderLeftWidth: 1,
      borderLeftColor: COLORS.border,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    totalRow: {
      flexDirection: 'row',
      backgroundColor: COLORS.totalBg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      borderLeftWidth: 1,
      borderLeftColor: COLORS.border,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    cell: {
      width: colWidth,
      paddingVertical: 1.5,
      paddingHorizontal: 2,
      fontSize,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
      color: COLORS.text,
    },
    cellLast: {
      width: colWidth,
      paddingVertical: 1.5,
      paddingHorizontal: 2,
      fontSize,
      color: COLORS.text,
    },
    headerCell: {
      width: colWidth,
      paddingVertical: 2,
      paddingHorizontal: 2,
      fontSize: headerFontSize,
      fontWeight: 'bold',
      textAlign: 'center',
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    headerCellLast: {
      width: colWidth,
      paddingVertical: 2,
      paddingHorizontal: 2,
      fontSize: headerFontSize,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    groupCell: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      fontSize: headerFontSize,
      fontWeight: 'bold',
      textAlign: 'center',
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
    },
    groupCellLast: {
      paddingVertical: 2,
      paddingHorizontal: 2,
      fontSize: headerFontSize,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    boldText: {
      fontWeight: 'bold',
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{table.title}</Text>
      <View style={styles.table}>
        {/* 그룹 헤더 행 */}
        {hasGroups && (
          <View style={styles.headerRowFirst}>
            {groups.map((g, gi) => {
              const isLast = gi === groups.length - 1
              const groupWidth = `${((g.colSpan / colCount) * 100).toFixed(2)}%`
              return (
                <View
                  key={gi}
                  style={{
                    ...(isLast ? styles.groupCellLast : styles.groupCell),
                    width: groupWidth,
                  }}
                >
                  <Text>{g.label ?? ''}</Text>
                </View>
              )
            })}
          </View>
        )}

        {/* 컬럼 라벨 행 */}
        <View style={hasGroups ? styles.headerRow : styles.headerRowFirst}>
          {table.columns.map((col, ci) => {
            const isLast = ci === colCount - 1
            return (
              <View
                key={col.key}
                style={isLast ? styles.headerCellLast : styles.headerCell}
              >
                <Text>{col.label}</Text>
              </View>
            )
          })}
        </View>

        {/* 데이터 행 */}
        {table.rows.map((row, ri) => {
          const rowStyle = row.isTotal ? styles.totalRow : styles.row
          return (
            <View key={ri} style={rowStyle}>
              {table.columns.map((col, ci) => {
                const isLastCol = ci === colCount - 1
                const align =
                  col.align ??
                  (col.format === 'number' || col.format === 'currency'
                    ? 'right'
                    : 'left')
                return (
                  <View
                    key={col.key}
                    style={isLastCol ? styles.cellLast : styles.cell}
                  >
                    <Text
                      style={{
                        textAlign: align,
                        ...(row.isTotal ? styles.boldText : {}),
                      }}
                    >
                      {formatCellValue(row.values[col.key], col.format)}
                    </Text>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>

      {/* 페이지 하단 푸터 (컴포넌트 내부 렌더링) */}
      {(footerLeft || footerRight) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: 4,
            borderTopWidth: 0.5,
            borderTopColor: '#cccccc',
          }}
          wrap={false}
        >
          <Text style={{ fontSize: 7, fontFamily, color: '#555555' }}>
            {footerLeft ?? ''}
          </Text>
          <Text style={{ fontSize: 7, fontFamily, color: '#555555' }}>
            {footerRight ?? ''}
          </Text>
        </View>
      )}
    </View>
  )
}
